export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-red-600/20 px-4 py-2 text-sm font-bold text-red-500 border border-red-500/30">
          Nexa V2 — Fondation Technique
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Projet Initialisé avec Succès 🚀
        </h1>
        <p className="mt-4 text-slate-400">
          Base technique prête avec Next.js, TypeScript, Tailwind CSS et architecture préparée pour Supabase.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 text-left text-xs font-mono text-slate-400">
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
            <span className="font-bold text-emerald-400">✓ App Router</span>: src/app
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
            <span className="font-bold text-emerald-400">✓ TypeScript</span>: Config strict
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
            <span className="font-bold text-emerald-400">✓ Tailwind CSS</span>: Configuré
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
            <span className="font-bold text-emerald-400">✓ Supabase Ready</span>: src/lib/supabase
          </div>
        </div>
      </div>
    </main>
  );
}
