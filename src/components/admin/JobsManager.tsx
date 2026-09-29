"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2, Plus, Briefcase, Loader2 } from "lucide-react";

type Job = {
  id: string;
  title: string;
  tags: string;
  description: string;
  link?: string;
  createdAt: any;
};

export function JobsManager() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const [newJob, setNewJob] = useState({
    title: "",
    tags: "",
    description: "",
    link: "",
  });

  const fetchJobs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "jobs"));
      const fetchedJobs: Job[] = [];
      querySnapshot.forEach((doc) => {
        fetchedJobs.push({ id: doc.id, ...doc.data() } as Job);
      });
      
      // Sort jobs manually based on createdAt timestamp
      fetchedJobs.sort((a: any, b: any) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return a.createdAt.seconds - b.createdAt.seconds;
      });

      setJobs(fetchedJobs);
    } catch (err: any) {
      console.error("Error fetching jobs:", err);
      setError("Could not fetch jobs. Did you enable Firestore Database in the Firebase Console?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setError("");

    try {
      await addDoc(collection(db, "jobs"), {
        ...newJob,
        createdAt: serverTimestamp(),
      });
      setNewJob({ title: "", tags: "", description: "", link: "" });
      fetchJobs();
    } catch (err) {
      console.error(err);
      setError("Failed to add job. Make sure your Firestore rules allow writes.");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job posting? No going back.")) return;
    try {
      await deleteDoc(doc(db, "jobs", id));
      fetchJobs();
    } catch (err) {
      console.error(err);
      setError("Failed to delete job.");
    }
  };

  return (
    <div className="space-y-12">
      {error && (
        <div className="bg-[var(--color-shipit-red)] border-4 border-black text-black font-bold p-4 text-sm font-poppins shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          ERROR: {error}
        </div>
      )}

      {/* Add Job Form */}
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 relative">
        <div className="absolute top-0 right-0 bg-[var(--color-shipit-purple)] text-white px-4 py-1 font-bold uppercase text-xs border-b-4 border-l-4 border-black">
          Action Area
        </div>
        
        <h3 className="text-2xl font-sora font-black uppercase text-black mb-6 flex items-center gap-3">
          <div className="bg-black text-white p-2 border-2 border-black">
            <Plus className="w-5 h-5" />
          </div>
          Add New Job Posting
        </h3>
        
        <form onSubmit={handleAddJob} className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-poppins font-bold uppercase text-black mb-2">Job Title</label>
              <input 
                type="text" 
                required
                value={newJob.title}
                onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                placeholder="e.g. Frontend Hacker"
                className="w-full bg-white border-4 border-black py-3 px-4 text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:translate-x-1 transition-all font-poppins"
              />
            </div>
            <div>
              <label className="block text-sm font-poppins font-bold uppercase text-black mb-2">Tags (comma separated)</label>
              <input 
                type="text" 
                required
                value={newJob.tags}
                onChange={(e) => setNewJob({...newJob, tags: e.target.value})}
                placeholder="e.g. React, Next.js, Tailwind"
                className="w-full bg-white border-4 border-black py-3 px-4 text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:translate-x-1 transition-all font-poppins"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-poppins font-bold uppercase text-black mb-2">Application Link (URL)</label>
            <input 
              type="url" 
              value={newJob.link}
              onChange={(e) => setNewJob({...newJob, link: e.target.value})}
              placeholder="https://..."
              className="w-full bg-white border-4 border-black py-3 px-4 text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:translate-x-1 transition-all font-poppins"
            />
          </div>

          <div>
            <label className="block text-sm font-poppins font-bold uppercase text-black mb-2">Job Description</label>
            <textarea 
              required
              value={newJob.description}
              onChange={(e) => setNewJob({...newJob, description: e.target.value})}
              placeholder="e.g. You live in the browser. You care about brutalist aesthetics..."
              className="w-full bg-white border-4 border-black py-3 px-4 text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:translate-x-1 transition-all font-poppins h-32 resize-none"
            />
          </div>
          
          <div className="pt-4 border-t-4 border-black flex justify-end mt-2">
            <button 
              type="submit"
              disabled={adding}
              className="bg-[var(--color-shipit-purple)] hover:bg-black text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 font-sora font-black uppercase py-3 px-8 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Job Posting"}
            </button>
          </div>
        </form>
      </div>

      {/* Jobs List */}
      <div>
        <h3 className="text-3xl font-sora font-black uppercase text-black mb-6 flex items-center gap-3">
          <Briefcase className="w-8 h-8" />
          Manage Open Roles
        </h3>
        
        {loading ? (
          <div className="text-black font-poppins font-bold uppercase flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading data...
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-neutral-100 border-4 border-dashed border-black p-12 text-center">
             <p className="font-sora font-black uppercase text-xl">No Roles Found</p>
             <p className="font-poppins font-bold text-black/60 mt-2">Add your first job posting to start hiring.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white border-4 border-black p-6 flex flex-col md:flex-row items-start md:items-center justify-between group hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
                <div className="mb-4 md:mb-0 max-w-2xl">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {job.tags.split(',').map((tag, i) => (
                      <span key={i} className="bg-black text-white px-2 py-1 border-2 border-black font-bold uppercase text-xs">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                  <h4 className="text-2xl font-sora font-black uppercase">{job.title}</h4>
                  <p className="text-sm text-black/70 font-poppins mt-2">
                    {job.description}
                  </p>
                  {job.link && (
                    <a 
                      href={job.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-sm font-bold uppercase text-[var(--color-shipit-purple)] hover:text-black underline underline-offset-4"
                    >
                      → Open Application Link
                    </a>
                  )}
                </div>
                <button 
                  onClick={() => handleDelete(job.id)}
                  className="bg-white hover:bg-[var(--color-shipit-red)] border-4 border-black p-3 text-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 shrink-0"
                  title="Delete Job"
                >
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
