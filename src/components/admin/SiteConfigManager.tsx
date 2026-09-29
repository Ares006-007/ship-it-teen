"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Save, Play, Loader2 } from "lucide-react";

export function SiteConfigManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [config, setConfig] = useState({
    ytLink1: "",
    ytLink2: "",
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const docRef = doc(db, "config", "hero");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setConfig(docSnap.data() as { ytLink1: string, ytLink2: string });
        } else {
          // Defaults if not set
          setConfig({
            ytLink1: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            ytLink2: "https://www.youtube.com/embed/jfKfPfyJRdk",
          });
        }
      } catch (err: any) {
        console.error("Error fetching site config:", err);
        setError("Could not fetch site configuration.");
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
      await setDoc(doc(db, "config", "hero"), config);
      setSuccess("Configuration saved successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to save configuration.");
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

      {/* Hero Configuration */}
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 relative">
        <div className="absolute top-0 right-0 bg-black text-white px-4 py-1 font-bold uppercase text-xs border-b-4 border-l-4 border-black">
          Global Config
        </div>
        
        <h3 className="text-2xl font-sora font-black uppercase text-black mb-6 flex items-center gap-3">
          <div className="bg-[var(--color-shipit-red)] text-black p-2 border-2 border-black">
            <Play className="w-5 h-5" />
          </div>
          Hero Video Frames
        </h3>
        
        <form onSubmit={handleSave} className="grid grid-cols-1 gap-6">
          <div className="bg-neutral-100 p-6 border-4 border-dashed border-black">
            <p className="font-poppins font-bold text-sm mb-4 uppercase text-black/60">
              Note: Use embed links (e.g., https://www.youtube.com/embed/VIDEO_ID)
            </p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-poppins font-bold uppercase text-black mb-2">Primary Video (Top Frame)</label>
                <input 
                  type="url" 
                  required 
                  value={config.ytLink1}
                  onChange={(e) => setConfig({...config, ytLink1: e.target.value})}
                  className="w-full bg-white border-4 border-black py-3 px-4 text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:translate-x-1 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-poppins font-bold uppercase text-black mb-2">Secondary Video (Bottom Frame)</label>
                <input 
                  type="url" 
                  required 
                  value={config.ytLink2}
                  onChange={(e) => setConfig({...config, ytLink2: e.target.value})}
                  className="w-full bg-white border-4 border-black py-3 px-4 text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:translate-x-1 transition-all"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t-4 border-black flex justify-end mt-2">
            <button 
              type="submit" 
              disabled={saving}
              className="bg-[var(--color-shipit-blue)] hover:bg-black text-black hover:text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 font-sora font-black uppercase py-3 px-8 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <Save className="w-5 h-5" />
                  Save Configuration
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
