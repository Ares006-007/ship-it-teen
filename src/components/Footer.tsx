export function Footer() {
  return (
    <footer className="bg-black text-white py-12 border-t-4 border-black">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-3xl font-black uppercase tracking-tighter">
          SHIPIT TEENS
        </div>
        
        <div className="flex gap-8 font-bold uppercase tracking-widest text-sm text-white/60">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
          <a href="#" className="hover:text-white transition-colors">Discord</a>
        </div>

        <div className="font-bold uppercase tracking-widest text-sm text-white/40">
          © {new Date().getFullYear()} NO FLUFF. JUST BUILDING.
        </div>
      </div>
    </footer>
  );
}
