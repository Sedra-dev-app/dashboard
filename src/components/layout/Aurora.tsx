/** Fond aurora : blobs indigo / violet / cyan très flous + grille + grain. */
export function Aurora() {
  return (
    <div
      aria-hidden
      className="noise pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black transition-colors duration-500 light:bg-slate-50"
    >
      <div className="grid-bg absolute inset-0" />
      <div className="absolute -left-40 -top-40 h-[600px] w-[600px] animate-aurora rounded-full bg-indigo-600/25 blur-[140px] will-change-transform light:bg-indigo-400/20" />
      <div className="absolute right-[-10rem] top-1/3 h-[500px] w-[500px] animate-aurora-slow rounded-full bg-purple-600/20 blur-[140px] will-change-transform light:bg-purple-400/15" />
      <div className="absolute bottom-[-12rem] left-1/3 h-[500px] w-[700px] animate-aurora rounded-full bg-cyan-500/10 blur-[140px] will-change-transform light:bg-sky-400/15" />
    </div>
  )
}
