"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2, Plus, Image as ImageIcon, Loader2, Sparkles, Edit2 } from "lucide-react";

type Experience = {
  id: string;
  name: string;
  desc: string;
  coverImage: string;
  bgColor: string;
  createdAt: any;
};

const COLORS = [
  { label: "Light Blue", value: "bg-blue-100" },
  { label: "Light Red", value: "bg-red-100" },
  { label: "Light Yellow", value: "bg-yellow-100" },
  { label: "Light Green", value: "bg-green-100" },
  { label: "Light Purple", value: "bg-purple-100" },
  { label: "Light Pink", value: "bg-pink-100" },
];

export function ExperiencesManager() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [newExp, setNewExp] = useState({
    name: "",
    desc: "",
    coverImage: "",
    bgColor: "bg-blue-100",
  });

  const fetchExperiences = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "experiences"));
      const fetched: Experience[] = [];
      querySnapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as Experience);
      });
      
      fetched.sort((a: any, b: any) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return a.createdAt.seconds - b.createdAt.seconds;
      });

      setExperiences(fetched);
    } catch (err: any) {
      console.error("Error fetching experiences:", err);
      setError("Could not fetch experiences. Did you enable Firestore?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleAddExp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setError("");

    try {
      if (editingId) {
        await updateDoc(doc(db, "experiences", editingId), {
          ...newExp,
        });
        setEditingId(null);
      } else {
        await addDoc(collection(db, "experiences"), {
          ...newExp,
          createdAt: serverTimestamp(),
        });
      }
      setNewExp({ name: "", desc: "", coverImage: "", bgColor: "bg-blue-100" });
      fetchExperiences();
    } catch (err) {
      console.error(err);
      setError(`Failed to ${editingId ? "update" : "add"} experience.`);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    try {
      await deleteDoc(doc(db, "experiences", id));
      fetchExperiences();
    } catch (err) {
      console.error(err);
      setError("Failed to delete experience.");
    }
  };

  return (
    <div className="space-y-12">
      {error && (
        <div className="bg-[var(--color-shipit-red)] border-4 border-black text-black font-bold p-4 text-sm font-poppins shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          ERROR: {error}
        </div>
      )}

      {/* Add Form */}
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 relative">
        <div className="absolute top-0 right-0 bg-black text-white px-4 py-1 font-bold uppercase text-xs border-b-4 border-l-4 border-black">
          Action Area
        </div>
        
        <h3 className="text-2xl font-sora font-black uppercase text-black mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-black text-white p-2 border-2 border-black">
              {editingId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            {editingId ? "Edit Experience" : "Add New Experience"}
          </div>
          {editingId && (
            <button 
              type="button"
              onClick={() => {
                setEditingId(null);
                setNewExp({ name: "", desc: "", coverImage: "", bgColor: "bg-blue-100" });
              }}
              className="text-sm font-poppins underline hover:text-black/70"
            >
              Cancel Edit
            </button>
          )}
        </h3>
        
        <form onSubmit={handleAddExp} className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-poppins font-bold uppercase text-black mb-2">Experience Name</label>
              <input 
                type="text" 
                required
                value={newExp.name}
                onChange={(e) => setNewExp({...newExp, name: e.target.value})}
                placeholder="e.g. SUNBEAM"
                className="w-full bg-white border-4 border-black py-3 px-4 text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:translate-x-1 transition-all font-poppins"
              />
            </div>
            <div>
              <label className="block text-sm font-poppins font-bold uppercase text-black mb-2">Background Theme Color</label>
              <select 
                value={newExp.bgColor}
                onChange={(e) => setNewExp({...newExp, bgColor: e.target.value})}
                className="w-full bg-white border-4 border-black py-3 px-4 text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:translate-x-1 transition-all font-poppins appearance-none cursor-pointer"
              >
                {COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-poppins font-bold uppercase text-black mb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Cover Image (URL)
            </label>
            <input 
              type="url" 
              required
              value={newExp.coverImage}
              onChange={(e) => setNewExp({...newExp, coverImage: e.target.value})}
              placeholder="https://..."
              className="w-full bg-white border-4 border-black py-3 px-4 text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:translate-x-1 transition-all font-poppins"
            />
          </div>

          <div>
            <label className="block text-sm font-poppins font-bold uppercase text-black mb-2">Short Description</label>
            <textarea 
              required
              value={newExp.desc}
              onChange={(e) => setNewExp({...newExp, desc: e.target.value})}
              placeholder="e.g. SUMMER BUILDER ACCELERATOR. 4 WEEKS. 100% SHIPPING."
              className="w-full bg-white border-4 border-black py-3 px-4 text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:translate-x-1 transition-all font-poppins h-24 resize-none"
            />
          </div>
          
          <div className="pt-4 border-t-4 border-black flex justify-end mt-2">
            <button 
              type="submit"
              disabled={adding}
              className="bg-black hover:bg-[var(--color-shipit-yellow)] text-white hover:text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 font-sora font-black uppercase py-3 px-8 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? "Update Experience" : "Save Experience")}
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div>
        <h3 className="text-3xl font-sora font-black uppercase text-black mb-6 flex items-center gap-3">
          <Sparkles className="w-8 h-8" />
          Manage Experiences
        </h3>
        
        {loading ? (
          <div className="text-black font-poppins font-bold uppercase flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading data...
          </div>
        ) : experiences.length === 0 ? (
          <div className="bg-neutral-100 border-4 border-dashed border-black p-12 text-center">
             <p className="font-sora font-black uppercase text-xl">No Experiences Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="bg-white border-4 border-black p-6 flex flex-col md:flex-row items-start md:items-center justify-between group hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all gap-6">
                <div className="flex gap-6 items-center w-full">
                  <div className={`w-32 h-24 border-2 border-black shrink-0 overflow-hidden ${exp.bgColor}`}>
                    {exp.coverImage && (
                      <img src={exp.coverImage} alt={exp.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300 mix-blend-multiply opacity-80" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-3xl font-sora font-black uppercase tracking-tighter mb-1">{exp.name}</h4>
                    <div className="text-sm text-black/70 font-poppins font-bold uppercase">
                      {exp.desc}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button 
                    onClick={() => {
                      setNewExp({
                        name: exp.name,
                        desc: exp.desc,
                        coverImage: exp.coverImage || "",
                        bgColor: exp.bgColor || "bg-blue-100",
                      });
                      setEditingId(exp.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-white hover:bg-black hover:text-white border-4 border-black p-3 text-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
                    title="Edit Experience"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(exp.id)}
                    className="bg-white hover:bg-[var(--color-shipit-red)] border-4 border-black p-3 text-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
                    title="Delete Experience"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
