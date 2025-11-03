// src/pages/MainPage.tsx
import  { useEffect, useState } from 'react';
import Navbar from '../components/layout/NavBar';
import { supabase } from '../lib/SupabaseClient';
import { motion } from 'motion/react';

type Crosshair = {
  id: string;
  created_at: string;
  crosshair_name: string;
  crosshair_code: string;
  image_path?: string | null;
};

export default function MainPage() {
  const [list, setList] = useState<Crosshair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('crosshairs')
          .select('*')
          .order('created_at', { ascending: false });

        if (!mounted) return;
        if (error) {
          setError(error.message);
          setList([]);
        } else {
          setList(data ?? []);
        }
      } catch (err: any) {
        setError(err.message ?? String(err));
        setList([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();

    // optional: realtime subscribe if you want live updates
    const channel = supabase
      .channel('public:crosshairs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'crosshairs' }, () => fetch())
      .subscribe();

    return () => {
      mounted = false;
      channel.unsubscribe();
    };
  }, []);

  const handleCopy = async (c: Crosshair) => {
    try {
      await navigator.clipboard.writeText(c.crosshair_code);
      setCopiedId(c.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = c.crosshair_code;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopiedId(c.id);
      setTimeout(() => setCopiedId(null), 1500);
    }
  };
  

  return (
    <div>
      <Navbar />
      <section className="min-h-screen flex flex-col bg-white/5  text-gray-900 px-6 py-6 pt-25">
        <motion.div 

          className="max-w-6xl mx-auto w-full ">
          {/* <h1 className="text-2xl font-semibold mb-6">Crosshair Gallery</h1> */}

          {loading ? (
            <div className="text-gray-500">Loading…</div>
          ) : error ? (
            <div className="text-red-500">Error: {error}</div>
          ) : list.length === 0 ? (
            <div className="text-gray-500">No crosshairs yet.</div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-5 gap-4">
              {list.map((c) => (
                <div key={c.id} className="card bg-base-100 drop-shadow-xl rounded-lg overflow-hidden p-4 ">
                  <div className="h-40 bg-[url(./assets/images/default.webp)] flex items-center justify-center overflow-hidden ">
                    {c.image_path ? (
                      // if image_path is a path (not full URL) and bucket is private,
                      // you'd need to call supabase.storage.from(bucket).createSignedUrl(path, seconds)
                      <img src={c.image_path} alt={c.crosshair_name} className="w-full h-full object-cover " />
                    ) : (
                      <div className="text-gray-400">No image</div>
                    )}
                  </div>

                  <div className="p-0.5">
                    <div className="flex flex-col  justify-between  w-full ">
                      <div>
                        <h3 className="font-medium text-gray-800 truncate mb-1">{c.crosshair_name}</h3>
                        <pre className="text-xs p-2 bg-gray-50 rounded text-gray-700 break-all overflow-x-auto mb-1">{c.crosshair_code}</pre>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCopy(c)}
                          className={`btn btn-block  ${copiedId === c.id ? 'btn-ghost' : 'btn-primary'}`}
                        >
                          {copiedId === c.id ? 'Copied' : 'Copy'}
                        </motion.button>
                      </div>
                      

                      {/* <div className="flex flex-col items-end gap-2"> */}

                        {/* optional: small timestamp */}
                        {/* <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString()}</span> */}
                      {/* </div> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
}
