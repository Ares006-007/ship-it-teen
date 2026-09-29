"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2, Plus, Image as ImageIcon, Loader2 } from "lucide-react";

type Project = {
  id: string;
  title: string;
  author: string;
  description: string;
  link: string;
  createdAt: any;
};

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const [newProject, setNewProject] = useState({
    title: "",
    author: "",
    description: "",
    link: "",
  });

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "projects"));
      const fetchedProjects: Project[] = [];
      querySnapshot.forEach((doc) => {
        fetchedProjects.push({ id: doc.id, ...doc.data() } as Project);
      });
      
      fetchedProjects.sort((a: any, b: any) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.seconds - a.createdAt.seconds; // Newest first
      });

      setProjects(fetchedProjects);
    } catch (err: any) {
      console.error("Error fetching projects:", err);
      setError("Could not fetch projects. Did you enable Firestore?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setError("");

    try {
      await addDoc(collection(db, "projects"), {
        ...newProject,
        createdAt: serverTimestamp(),
      });
      setNewProject({ title: "", author: "", description: "", link: "" });
      fetchProjects();
    } catch (err) {
      console.error(err);
      setError("Failed to add project.");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      await deleteDoc(doc(db, "projects", id));
      fetchProjects();
    } catch (err) {
      console.error(err);
      setError("Failed to delete project.");
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
        
        <h3 className="text-2xl font-sora font-black uppercase text-black mb-6 flex items-center gap-3">
          <div className="bg-black text-white p-2 border-2 border-black">
            <Plus className="w-5 h-5" />
          </div>
          Add Showcase Project
        </h3>
        
        <form onSubmit={handleAddProject} className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-poppins font-bold uppercase text-black mb-2">Project Title</label>
              <input 
                type="text" required value={newProject.title}
                onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                className="w-full bg-white border-4 border-black py-3 px-4 text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:translate-x-1 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-poppins font-bold uppercase text-black mb-2">Builder/Author</label>
              <input 
                type="text" required value={newProject.author}
                onChange={(e) => setNewProject({...newProject, author: e.target.value})}
                className="w-full bg-white border-4 border-black py-3 px-4 text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:translate-x-1 transition-all"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-poppins font-bold uppercase text-black mb-2">Live Demo / Repo Link</label>
            <input 
              type="url" required value={newProject.link}
              onChange={(e) => setNewProject({...newProject, link: e.target.value})}
              className="w-full bg-white border-4 border-black py-3 px-4 text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:translate-x-1 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-poppins font-bold uppercase text-black mb-2">Short Description</label>
            <textarea 
              required value={newProject.description}
              onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              className="w-full bg-white border-4 border-black py-3 px-4 text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:translate-x-1 transition-all h-24 resize-none"
            />
          </div>
          
          <div className="pt-4 border-t-4 border-black flex justify-end mt-2">
            <button 
              type="submit" disabled={adding}
              className="bg-[var(--color-shipit-yellow)] hover:bg-black text-black hover:text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 font-sora font-black uppercase py-3 px-8 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Project"}
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div>
        <h3 className="text-3xl font-sora font-black uppercase text-black mb-6 flex items-center gap-3">
          <ImageIcon className="w-8 h-8" />
          Manage Projects
        </h3>
        
        {loading ? (
          <div className="flex items-center gap-2"><Loader2 className="animate-spin" /> Loading...</div>
        ) : projects.length === 0 ? (
          <div className="bg-neutral-100 border-4 border-dashed border-black p-12 text-center">
             <p className="font-sora font-black uppercase text-xl">No Projects</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-white border-4 border-black p-6 flex justify-between items-center group hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                <div>
                  <h4 className="text-2xl font-sora font-black uppercase">{project.title}</h4>
                  <p className="text-sm font-bold mt-1 text-black/60">By {project.author}</p>
                </div>
                <button onClick={() => handleDelete(project.id)} className="border-4 border-black p-3 hover:bg-[var(--color-shipit-red)]">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
