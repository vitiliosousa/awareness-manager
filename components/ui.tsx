export function Logo({ claro = false, grande = false }: { claro?: boolean; grande?: boolean }) {
  const lado = grande ? 44 : 28;
  return (
    <span className={`flex items-center ${grande ? "gap-3.5" : "gap-2.5"}`}>
      <svg width={lado} height={lado} viewBox="0 0 28 28" aria-hidden="true">
        <rect width="28" height="28" rx="7" fill={claro ? "#ffffff" : "var(--noite)"} />
        <path d="M5 16.5 L23 11" stroke="var(--marcador)" strokeWidth="6" strokeLinecap="round" />
        <path d="M8 8 L14 20 L20 8" fill="none" stroke={claro ? "var(--noite)" : "#ffffff"} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <span className={`font-titulo ${grande ? "text-[2.5rem]" : "text-xl"} font-bold tracking-tight ${claro ? "text-white" : "text-tinta"}`}>Vigia</span>
    </span>
  );
}

export function BarraProgresso({
  valor,
  cor = "progresso",
  altura = "h-2",
  rotulo,
}: {
  valor: number;
  cor?: "progresso" | "mangal" | "indigo" | "energia" | "marcador";
  altura?: string;
  rotulo: string;
}) {
  const fundo = { progresso: "bg-progresso", mangal: "bg-mangal", indigo: "bg-indigo", energia: "bg-energia", marcador: "bg-marcador" }[cor];
  const pct = Math.round(Math.max(0, Math.min(1, valor)) * 100);
  return (
    <div
      role="progressbar"
      aria-label={rotulo}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`${altura} w-full overflow-hidden rounded-full bg-linha`}
    >
      <div className={`${fundo} h-full rounded-full transition-[width] duration-500`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Avatar({ iniciais, destaque = false, tamanho = "h-9 w-9 text-sm" }: { iniciais: string; destaque?: boolean; tamanho?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`${tamanho} grid shrink-0 place-items-center rounded-full font-semibold ${
        destaque ? "bg-indigo text-sobre-cor" : "bg-indigo-claro text-indigo-escuro"
      }`}
    >
      {iniciais}
    </span>
  );
}

export function Xp({ valor, className = "" }: { valor: number; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-md bg-energia-claro px-2 py-0.5 text-sm font-semibold text-tinta ${className}`}>
      +{valor} XP
    </span>
  );
}

export function Painel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-[14px] border border-linha bg-superficie ${className}`}>{children}</section>;
}

export const botaoPrimario =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap h-[46px] rounded-md bg-indigo px-5 font-semibold text-sobre-cor transition-colors hover:bg-indigo-escuro disabled:cursor-not-allowed disabled:opacity-40";

export const botaoSecundario =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap h-[46px] rounded-md border border-linha bg-superficie px-5 font-semibold text-tinta transition-colors hover:border-tinta/40";

/** Um círculo a rodar, para mostrar que algo está a ser feito. Herda a cor do texto. */
export function Spinner({ tamanho = 16 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 animate-spin">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
