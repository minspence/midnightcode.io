// CSS-only typing animation (see .terminal-* in globals.css); no client JS.
export function TerminalIntro() {
  return (
    <div
      className="mx-auto w-fit max-w-full rounded-lg border border-white/10 bg-black/50 px-5 py-4 text-left font-mono text-sm"
      aria-label="whoami: Minuit Spence, full-stack developer"
    >
      <p className="text-gray-200">
        <span className="text-magenta-200">$</span> whoami
      </p>
      <p className="text-blue-200">
        <span className="terminal-type">minuit-spence // full-stack developer</span>
        <span className="terminal-cursor" aria-hidden="true" />
      </p>
    </div>
  );
}
