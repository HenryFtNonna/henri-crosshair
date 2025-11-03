// src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/NavBar';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark, faTrash } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../lib/SupabaseClient'; 

type Crosshair = {
  id: string;
  created_at: string;
  crosshair_name: string;
  crosshair_code: string;
  image_path?: string | null;
};

export default function AdminDashboard() {
  const [showModal, setShowModal] = useState(false);

  // form state
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // list state
  const [list, setList] = useState<Crosshair[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // configuration
  const BUCKET = 'crosshair-images'; // ganti kalau nama bucket lo beda
  const USE_SIGNED_URL_FOR_PRIVATE_BUCKETS = true; // kalau bucket private, signed URL akan dibuat

  useEffect(() => {
    fetchCrosshairs();

    // subscribe to changes (optional, helpful during dev)
    const channel = supabase
      .channel('public:crosshairs')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'crosshairs' },
        () => {
          // console.log('Realtime payload:', payload);
          fetchCrosshairs();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
    
  }, []);

  async function fetchCrosshairs() {
    setLoadingList(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase
        .from('crosshairs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('fetchCrosshairs error', error);
        setErrorMsg(error.message);
        setList([]);
      } else {
        setList(data ?? []);
      }
    } catch (err: any) {
      console.error('fetchCrosshairs unexpected', err);
      setErrorMsg(err?.message ?? String(err));
    } finally {
      setLoadingList(false);
    }
  }

  // const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    // reset form
    setName('');
    setCode('');
    setFile(null);
    setPreview(null);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  // Upload file to storage and return url (public or signed based on bucket visibility)
  const uploadImage = async (file: File) => {
    // generate unique filename
    const ext = file.name.split('.').pop() ?? 'bin';
    const filePath = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    // console.log('Uploading file:', { name: file.name, size: file.size, type: file.type, filePath });

    const {  error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      console.error('storage.upload error', uploadError);
      throw uploadError;
    }

    // console.log('storage.upload success', uploadData);

    // Try to get public URL first
    const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
    // if (publicUrlError) {
    //   console.warn('getPublicUrl error', publicUrlError);
    // } else {
      // If the bucket is public, this publicUrl will be usable immediately
      const publicUrl = publicUrlData.publicUrl;
      // console.log('getPublicUrl', publicUrl);
      // Some setups might return a URL even if bucket private — might not be accessible without signed url.
      if (publicUrl && !publicUrl.includes('null')) {
        return publicUrl;
      }
    

    // If bucket private or publicUrl not usable, try createSignedUrl (if allowed)
    if (USE_SIGNED_URL_FOR_PRIVATE_BUCKETS) {
      const expireSeconds = 60 * 60; // 1 hour signed URL
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(filePath, expireSeconds);

      if (signedUrlError) {
        console.error('createSignedUrl error', signedUrlError);
        // fallback: return path (not usable directly), or throw
        throw signedUrlError;
      }

      // console.log('createSignedUrl', signedUrlData);
      return signedUrlData.signedUrl;
    }

    // fallback
    throw new Error('Unable to obtain file URL after upload. Check bucket permissions.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    if (!name.trim() || !code.trim()) {
      setErrorMsg('Name and code are required.');
      setSubmitting(false);
      return;
    }

    try {
      let imageUrl: string | null = null;

      if (file) {
        try {
          imageUrl = await uploadImage(file);
        } catch (err: any) {
          console.error('uploadImage failed', err);
          setErrorMsg('Image upload failed: ' + (err?.message ?? String(err)));
          setSubmitting(false);
          return;
        }
      }

      // console.log('Inserting crosshair', { name, code, imageUrl });

      const { error: insertError } = await supabase
        .from('crosshairs')
        .insert({ crosshair_name: name, crosshair_code: code, image_path: imageUrl })
        .select()
        .single();

      if (insertError) {
        console.error('Insert error', insertError);
        // Common cause: RLS policy denies insert — check console.message and Supabase policies
        setErrorMsg(insertError.message);
        setSubmitting(false);
        return;
      }

      // console.log('Insert success', insertData);
      await fetchCrosshairs();
      closeModal();
    } catch (err: any) {
      console.error('Unexpected submit error', err);
      setErrorMsg(err?.message ?? String(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this crosshair?')) return;
    try {
      const { error } = await supabase.from('crosshairs').delete().eq('id', id);
      if (error) {
        console.error('Delete error', error);
        alert('Delete failed: ' + error.message);
        return;
      }
      await fetchCrosshairs();
    } catch (err) {
      console.error('Unexpected delete error', err);
      alert('Delete failed: ' + String(err));
    }
  };

  return (
    <div>
      <Navbar />

      <section className="min-h-screen flex flex-col text-gray-900 pt-20">
        <div className="max-w-6xl mx-auto px-6 py-8 w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
            <p className="text-sm text-gray-500">Manage crosshairs</p>
          </div>

          {loadingList ? (
            <div className="text-gray-500">Loading...</div>
          ) : errorMsg ? (
            <div className="text-red-500">{errorMsg}</div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-5 gap-4">
              {list.map((c) => (
                <div key={c.id} className="border rounded p-3 flex flex-col bg-gray-300">
                  <div className="h-36 mb-3 bg-[url(./assets/images/default.webp)] rounded overflow-hidden flex items-center justify-center">
                    {c.image_path ? (
                      <img src={c.image_path} alt={c.crosshair_name} className="object-cover w-full h-full" />
                    ) : (
                      <div className="text-gray-400">No image</div>
                    )}
                  </div>
                  <h3 className="font-medium">{c.crosshair_name}</h3>
                  <pre className="text-xs mt-2 p-2 bg-gray-50 rounded text-gray-700 break-all overflow-x-auto">{c.crosshair_code}</pre>
                  <div className="mt-3 flex justify-end gap-2">
                    <button className="btn btn-ghost btn-sm" onClick={() => {
                      setName(c.crosshair_name); setCode(c.crosshair_code); setShowModal(true);
                    }}>
                      Edit
                    </button>
                    <button className="btn btn-error btn-sm" onClick={() => handleDelete(c.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Floating button */}
        <div className="fixed bottom-6 w-full flex justify-end px-8 pointer-events-none">
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="pointer-events-auto btn btn-circle btn-lg bg-blue-600 border-0 shadow-lg"
            aria-label="Add crosshair"
          >
            <FontAwesomeIcon icon={faPlus} className="text-[20px] text-white" />
          </motion.button>
        </div>
      </section>

      {/* Modal */}
      <div
        className={`modal ${showModal ? 'modal-open' : ''}`}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) setShowModal(false);
        }}
      >
        <div className="modal-box max-w-3xl p-0 overflow-hidden">
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="p-6 bg-white"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{name ? 'Edit Crosshair' : 'Create Crosshair'}</h3>
              <button onClick={() => setShowModal(false)} className="btn btn-ghost btn-sm" aria-label="Close">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="input input-bordered w-full" placeholder="e.g. Phoenix-Pro" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crosshair code</label>
                <textarea value={code} onChange={(e) => setCode(e.target.value)} className="textarea textarea-bordered w-full" rows={3} placeholder="crosshair code..." required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image (optional)</label>
                <input type="file" accept="image/*" onChange={onFileChange} className="file-input file-input-bordered w-full" />
                {preview && (
                  <div className="mt-3">
                    <img src={preview} alt="preview" className="w-40 h-40 object-cover rounded-md border" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className={`btn btn-primary ${submitting ? 'loading' : ''}`}>
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
