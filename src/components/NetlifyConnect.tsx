import React, { useState, useEffect } from "react";
import { Cloud, CheckCircle2, LogOut, ExternalLink, RefreshCw, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function NetlifyConnect() {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNetlifyData = async () => {
    setLoading(true);
    try {
      const [userRes, sitesRes] = await Promise.all([
        fetch("/api/netlify/user"),
        fetch("/api/netlify/sites")
      ]);

      if (userRes.ok && sitesRes.ok) {
        const userData = await userRes.json();
        const sitesData = await sitesRes.json();
        setUser(userData);
        setSites(sitesData);
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (err) {
      console.error("Failed to fetch Netlify data:", err);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetlifyData();

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data?.provider === 'netlify') {
        fetchNetlifyData();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleConnect = async () => {
    setError(null);
    try {
      const response = await fetch("/api/auth/netlify/url");
      if (!response.ok) throw new Error("Failed to get auth URL");
      const { url } = await response.json();
      
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      window.open(
        url,
        'netlify_oauth',
        `width=${width},height=${height},left=${left},top=${top}`
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/netlify/logout", { method: "POST" });
      setIsConnected(false);
      setUser(null);
      setSites([]);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <section className="mt-20 bg-white p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative group overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 rounded-full -mr-40 -mt-40 blur-[100px] opacity-30 pointer-events-none"></div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 relative z-10">
        <div className="flex items-center gap-6">
          <div className="p-5 bg-slate-900 text-white rounded-[2rem] shadow-2xl shadow-blue-100">
            <Cloud size={32} />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter font-display">เชื่อมต่อ Netlify</h2>
            <p className="text-slate-500 font-medium tracking-tighter mt-1">จัดการการ Deploy และเว็บไซต์ของคุณ</p>
          </div>
        </div>

        {!isConnected ? (
          <button
            onClick={handleConnect}
            disabled={loading}
            className="flex items-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-3xl font-black text-lg tracking-tighter hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="animate-spin" size={20} /> : <Cloud size={20} />}
            เชื่อมต่อบัญชี Netlify
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-6 py-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
              <CheckCircle2 size={20} />
              <span className="font-bold tracking-tighter">เชื่อมต่อแล้ว: {user?.full_name || user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
              title="ออกจากระบบ"
            >
              <LogOut size={24} />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isConnected ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sites.length > 0 ? (
                sites.map((site) => (
                  <div key={site.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-slate-300 hover:bg-white transition-all group/site">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                        <img src={site.screenshot_url || "https://picsum.photos/seed/netlify/100/100"} alt="" className="w-8 h-8 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <a 
                        href={site.admin_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-slate-900 transition-all"
                      >
                        <ExternalLink size={18} />
                      </a>
                    </div>
                    <h3 className="font-black text-slate-900 tracking-tighter text-lg mb-1 truncate">{site.name}</h3>
                    <p className="text-slate-500 text-sm font-medium tracking-tighter mb-4 truncate">{site.url}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100">
                        {site.build_settings?.repo_branch || 'Manual Deploy'}
                      </span>
                      <a 
                        href={site.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-slate-900 flex items-center gap-1 hover:underline"
                      >
                        ดูเว็บไซต์ <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold tracking-tighter italic">ไม่พบเว็บไซต์ในบัญชีของคุณ</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200"
          >
            <Cloud className="mx-auto text-slate-200 mb-6" size={64} />
            <p className="text-slate-400 font-bold tracking-tighter max-w-md mx-auto">
              เชื่อมต่อบัญชี Netlify ของคุณเพื่อจัดการเว็บไซต์และดูสถานะการ Deploy ได้โดยตรงจากที่นี่
            </p>
            {error && (
              <div className="mt-6 flex items-center justify-center gap-2 text-rose-500 font-bold tracking-tighter">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
