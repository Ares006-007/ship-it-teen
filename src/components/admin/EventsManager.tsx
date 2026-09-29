"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2, Plus, Calendar as CalendarIcon, Loader2, Image as ImageIcon, Edit2 } from "lucide-react";

type Event = {
  id: string;
  date: string;
  title: string;
  location: string;
  status: string;
  link: string;
  coverImage?: string;
  createdAt: any;
};

export function EventsManager() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [newEvent, setNewEvent] = useState({
    date: "",
    title: "",
    location: "",
    status: "OPEN",
    link: "",
    coverImage: "",
  });

  const fetchEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "events"));
      const fetchedEvents: Event[] = [];
      querySnapshot.forEach((doc) => {
        fetchedEvents.push({ id: doc.id, ...doc.data() } as Event);
      });
      
      // Sort events manually based on createdAt timestamp
      fetchedEvents.sort((a: any, b: any) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return a.createdAt.seconds - b.createdAt.seconds;
      });

      setEvents(fetchedEvents);
    } catch (err: any) {
      console.error("Error fetching events:", err);
      setError("Could not fetch events. Did you enable Firestore Database in the Firebase Console?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setError("");

    try {
      if (editingId) {
        await updateDoc(doc(db, "events", editingId), {
          ...newEvent,
        });
        setEditingId(null);
      } else {
        await addDoc(collection(db, "events"), {
          ...newEvent,
          createdAt: serverTimestamp(),
        });
      }
      setNewEvent({ date: "", title: "", location: "", status: "OPEN", link: "", coverImage: "" });
      fetchEvents();
    } catch (err) {
      console.error(err);
      setError(`Failed to ${editingId ? "update" : "add"} event. Make sure your Firestore rules allow writes.`);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event? No going back.")) return;
    try {
      await deleteDoc(doc(db, "events", id));
      fetchEvents();
    } catch (err) {
      console.error(err);
      setError("Failed to delete event.");
    }
  };

  return (
    <div className="space-y-12">
      {error && (
        <div className="bg-[var(--color-shipit-red)] border-4 border-black text-black font-bold p-4 text-sm font-poppins shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          ERROR: {error}
        </div>
      )}

      {/* Add Event Form */}
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 relative">
        <div className="absolute top-0 right-0 bg-[var(--color-shipit-blue)] text-white px-4 py-1 font-bold uppercase text-xs border-b-4 border-l-4 border-black">
          Action Area
        </div>
        
        <h3 className="text-2xl font-sora font-black uppercase text-black mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-black text-white p-2 border-2 border-black">
              {editingId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            {editingId ? "Edit Event" : "Add New Event"}
          </div>
          {editingId && (
            <button 
              type="button"
              onClick={() => {
                setEditingId(null);
                setNewEvent({ date: "", title: "", location: "", status: "OPEN", link: "", coverImage: "" });
              }}
              className="text-sm font-poppins underline hover:text-black/70"
            >
              Cancel Edit
            </button>
          )}
        </h3>
        
        <form onSubmit={handleAddEvent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-poppins font-bold uppercase text-black mb-2">Date (e.g. OCT 14)</label>
            <input 
              type="text" 
              required
              value={newEvent.date}
              onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
              className="w-full bg-white border-4 border-black py-3 px-4 text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:translate-x-1 transition-all font-poppins"
            />
          </div>
          <div>
            <label className="block text-sm font-poppins font-bold uppercase text-black mb-2">Title (e.g. SATURDAY BUILD JAM)</label>
            <input 
              type="text" 
              required
              value={newEvent.title}
              onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              className="w-full bg-white border-4 border-black py-3 px-4 text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:translate-x-1 transition-all font-poppins"
            />
          </div>
          <div>
            <label className="block text-sm font-poppins font-bold uppercase text-black mb-2">Location (e.g. GARAGE HQ)</label>
            <input 
              type="text" 
              required
              value={newEvent.location}
              onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
              className="w-full bg-white border-4 border-black py-3 px-4 text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:translate-x-1 transition-all font-poppins"
            />
          </div>
          <div>
            <label className="block text-sm font-poppins font-bold uppercase text-black mb-2">Status (OPEN, WAITLIST, RSVP YET TO OPEN)</label>
            <input 
              type="text" 
              required
              value={newEvent.status}
              onChange={(e) => setNewEvent({...newEvent, status: e.target.value})}
              className="w-full bg-white border-4 border-black py-3 px-4 text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:translate-x-1 transition-all font-poppins"
            />
          </div>
          <div>
            <label className="block text-sm font-poppins font-bold uppercase text-black mb-2">RSVP Link (URL)</label>
            <input 
              type="url" 
              value={newEvent.link}
              onChange={(e) => setNewEvent({...newEvent, link: e.target.value})}
              placeholder="https://..."
              className="w-full bg-white border-4 border-black py-3 px-4 text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:translate-x-1 transition-all font-poppins"
            />
          </div>
          <div>
            <label className="block text-sm font-poppins font-bold uppercase text-black mb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Cover Image (URL)
            </label>
            <input 
              type="url" 
              value={newEvent.coverImage}
              onChange={(e) => setNewEvent({...newEvent, coverImage: e.target.value})}
              placeholder="https://..."
              className="w-full bg-white border-4 border-black py-3 px-4 text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:translate-x-1 transition-all font-poppins"
            />
          </div>
          <div className="md:col-span-2 pt-4 border-t-4 border-black flex justify-end mt-2">
            <button 
              type="submit"
              disabled={adding}
              className="bg-[var(--color-shipit-green)] hover:bg-black text-black hover:text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 font-sora font-black uppercase py-3 px-8 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? "Update Event" : "Save Event")}
            </button>
          </div>
        </form>
      </div>

      {/* Events List */}
      <div>
        <h3 className="text-3xl font-sora font-black uppercase text-black mb-6 flex items-center gap-3">
          <CalendarIcon className="w-8 h-8" />
          Manage Events
        </h3>
        
        {loading ? (
          <div className="text-black font-poppins font-bold uppercase flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading data...
          </div>
        ) : events.length === 0 ? (
          <div className="bg-neutral-100 border-4 border-dashed border-black p-12 text-center">
             <p className="font-sora font-black uppercase text-xl">No Events Found</p>
             <p className="font-poppins font-bold text-black/60 mt-2">Add your first event to the timeline.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {events.map((event) => (
              <div key={event.id} className="bg-white border-4 border-black p-6 flex flex-col md:flex-row items-start md:items-center justify-between group hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all gap-4">
                <div className="flex gap-6 items-center w-full">
                  {event.coverImage && (
                    <div className="hidden sm:block shrink-0 w-24 h-24 border-2 border-black overflow-hidden bg-neutral-200">
                      <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="bg-[var(--color-shipit-yellow)] px-2 py-1 border-2 border-black font-bold uppercase text-xs">
                        {event.date}
                      </span>
                      <span className={`px-2 py-1 border-2 border-black font-bold uppercase text-xs ${
                        event.status.toUpperCase() === 'WAITLIST' || event.status.toUpperCase() === 'CLOSED' ? 'bg-[var(--color-shipit-red)]' : 
                        event.status.toUpperCase() === 'RSVP YET TO OPEN' ? 'bg-gray-300' : 'bg-[var(--color-shipit-green)]'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                    <h4 className="text-2xl font-sora font-black uppercase">{event.title}</h4>
                    <div className="text-base text-black/70 font-poppins font-bold uppercase mt-1">
                      {event.location}
                    </div>
                    {event.link && (
                      <a 
                        href={event.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-sm font-bold uppercase text-blue-600 hover:text-blue-800 underline underline-offset-4"
                      >
                        → Open RSVP Link
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button 
                    onClick={() => {
                      setNewEvent({
                        date: event.date,
                        title: event.title,
                        location: event.location,
                        status: event.status,
                        link: event.link || "",
                        coverImage: event.coverImage || "",
                      });
                      setEditingId(event.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-white hover:bg-black hover:text-white border-4 border-black p-3 text-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
                    title="Edit Event"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(event.id)}
                    className="bg-white hover:bg-[var(--color-shipit-red)] border-4 border-black p-3 text-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
                    title="Delete Event"
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
