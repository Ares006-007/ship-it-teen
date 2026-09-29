"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Save, Link as LinkIcon, Loader2, Hash, Code, MessageSquare } from "lucide-react";

export function LinksManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [config, setConfig] = useState({
    applyFormUrl: "",
    twitterUrl: "",
    githubUrl: "",
    discordUrl: "",
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const docRef = doc(db, "config", "links");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setConfig(docSnap.data() as typeof config);
        } else {
          // Defaults
          setConfig({
            applyFormUrl: "https://2ydjdh3asn.zite.so",
            twitterUrl: "https://twitter.com",
            githubUrl: "https://github.com",
            discordUrl: "https://discord.com",
          });
        }
      } catch (err: any) {
        console.error("Error fetching links config:", err);
        setError("Could not fetch links configuration.");
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await setDoc(doc(db, "config", "links"), config);
      setSuccess("Links saved successfully!");
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to save links.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center gap-2 font-bold"><Loader2 className="animate-spin" /> Loading Configuration...</div>;
  }

  return (
    <div className="space-y-12">
      {error && (
        <div className="bg-[var(--color-shipit-red)] border-4 border-black text-black font-bold p-4 text-sm font-poppins shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          ERROR: {error}
        </div>
      )}
      
      {success && (
        <div className="bg-[var(--color-shipit-green)] border-4 border-black text-black font-bold p-4 text-sm font-poppins shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {success}
        </div>
      )}

      {/* Form */}
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 relative">
        <div className="absolute top-0 right-0 bg-black text-white px-4 py-1 font-bold uppercase text-xs border-b-4 border-l-4 border-black">
          Global Config
        </div>
        
        <h3 className="text-2xl font-sora font-black uppercase text-black mb-6 flex items-center gap-3">
          <div className="bg-[var(--color-shipit-yellow)] text-black p-2 border-2 border-black">
            <LinkIcon className="w-5 h-5" />
          </div>
          Navigation & Social Links
        </h3>
        
        <form onSubmit={handleSave} className="grid grid-cols-1 gap-6">
          
          <div className="bg-neutral-100 p-6 border-4 border-dashed border-black">
            <h4 className="font-poppins font-black uppercase text-lg mb-4 flex items-center gap-2">
              Primary Actions
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-poppins font-bold uppercase text-black mb-2">Apply / Join URL</label>
                <input 
                  type="url" 
                  value={config.applyFormUrl}
                  onChange={(e) => setConfig({...config, applyFormUrl: e.target.value})}
                  className="w-full bg-white border-4 border-black py-3 px-4 text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:translate-x-1 transition-all"
                />
                <p className="text-xs font-bold uppercase text-black/50 mt-2">Where the "Apply to Join" buttons in the navbar and hero point to.</p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-100 p-6 border-4 border-dashed border-black">
            <h4 className="font-poppins font-black uppercase text-lg mb-4 flex items-center gap-2">
              Social Media Footer
            </h4>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-poppins font-bold uppercase text-black mb-2 flex items-center gap-2">
                  <Hash className="w-4 h-4" /> Twitter / X URL
                </label>
                <input 
                  type="url" 
                  value={config.twitterUrl}
                  onChange={(e) => setConfig({...config, twitterUrl: e.target.value})}
                  className="w-full bg-white border-4 border-black py-3 px-4 text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:translate-x-1 transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-poppins font-bold uppercase text-black mb-2 flex items-center gap-2">
                  <Code className="w-4 h-4" /> GitHub URL
                </label>
                <input 
                  type="url" 
                  value={config.githubUrl}
                  onChange={(e) => setConfig({...config, githubUrl: e.target.value})}
                  className="w-full bg-white border-4 border-black py-3 px-4 text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:translate-x-1 transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-poppins font-bold uppercase text-black mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Discord URL
                </label>
                <input 
                  type="url" 
                  value={config.discordUrl}
                  onChange={(e) => setConfig({...config, discordUrl: e.target.value})}
                  className="w-full bg-white border-4 border-black py-3 px-4 text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:translate-x-1 transition-all"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t-4 border-black flex justify-end mt-2">
            <button 
              type="submit" 
              disabled={saving}
              className="bg-[var(--color-shipit-green)] hover:bg-black text-black hover:text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 font-sora font-black uppercase py-3 px-8 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <Save className="w-5 h-5" />
                  Save Links
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
