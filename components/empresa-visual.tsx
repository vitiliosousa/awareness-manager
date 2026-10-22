"use client";

import { useEffect, useRef, useState } from "react";
import { Escolha } from "@/components/campos";
import type { PontoHistorico } from "@/lib/formatos";
import { mesCurto, nomeMes } from "@/lib/formatos";

/** As iniciais de um nome: "Cooperativa Mahlalela" -> "CM". */
export function iniciaisDe(nome: string) {
  const palavras = nome
    .replace(/[,.]/g, "")
    .split(/\s+/)
    .filter((p) => p.length > 2 || /^[A-Z]/.test(p));
  const ps = palavras.length ? palavras : nome.split(/\s+/);
  return (ps[0]?.[0] ?? "").toUpperCase() + (ps.length > 1 ? (ps[1]?.[0] ?? "").toUpperCase() : (ps[0]?.[1] ?? "").toUpperCase());
}

const tamanhos = {
  sm: "h-10 w-10 rounded-[10px] text-sm",
  md: "h-12 w-12 rounded-xl text-base",
  lg: "h-16 w-16 rounded-2xl text-xl",
};

// Um logótipo mantém a proporção: tem a altura do bloco e a largura que precisar, até um limite.
const logos = { sm: "h-10 max-w-[4.5rem]", md: "h-12 max-w-[5.5rem]", lg: "h-16 max-w-[8rem]" };

/** O logótipo de uma empresa, sem fundo nem margens; sem logótipo, as iniciais num bloco sóbrio. */
export function Monograma({ nome, logo, tamanho = "md" }: { nome: string; logo?: string; tamanho?: keyof typeof tamanhos }) {
  if (logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logo} alt="" aria-hidden="true" className={`${logos[tamanho]} w-auto shrink-0 rounded-lg object-contain`} />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`${tamanhos[tamanho]} grid shrink-0 place-items-center border border-linha bg-papel font-titulo font-extrabold tracking-tight text-tinta shadow-[inset_0_-2px_0_var(--linha)]`}
    >
      {iniciaisDe(nome)}
    </span>
  );
}

/** Uma barra fina de percentagem, sem rótulo, para dentro de tabelas. */
export function Barra({ valor, rotulo }: { valor: number; rotulo: string }) {
  const pct = Math.round(Math.max(0, Math.min(1, valor)) * 100);
  return (
    <div role="progressbar" aria-label={rotulo} aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} className="h-1.5 w-full overflow-hidden rounded-full bg-linha">
      <div className={`h-full rounded-full bg-energia`} style={{ width: `${pct}%` }} />
    </div>
  );
}

/** A tendência do acerto nos últimos meses, em pequeno. */
export function Tendencia({ valores, rotulo }: { valores: (number | null)[]; rotulo: string }) {
  const v = valores.filter((x): x is number => x !== null);
  if (v.length < 2) return <span className="text-sm text-suave">–</span>;
  const w = 64;
  const h = 22;
  const min = Math.min(...v, 40);
  const max = Math.max(...v, 100);
  const x = (i: number) => (i / (v.length - 1)) * (w - 6) + 3;
  const y = (n: number) => h - 3 - ((n - min) / (max - min || 1)) * (h - 6);
  const pontos = v.map((n, i) => `${x(i).toFixed(1)},${y(n).toFixed(1)}`).join(" ");
  const sobe = v[v.length - 1] >= v[0];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`${rotulo}: ${sobe ? "a subir" : "a descer"}, de ${v[0]}% para ${v[v.length - 1]}%`}>
      <polyline points={pontos} fill="none" stroke="var(--texto-suave)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={x(v.length - 1)} cy={y(v[v.length - 1])} r="2.6" fill="var(--energia)" stroke="var(--superficie)" strokeWidth="1.2" />
    </svg>
  );
}

/** Uma barra com três partes: quem concluiu (amarelo), quem está a meio (amarelo suave) e quem não começou (vazio). */
export function BarraEstados({ concluiram, emCurso, total, rotulo }: { concluiram: number; emCurso: number; total: number; rotulo: string }) {
  const pc = total ? (concluiram / total) * 100 : 0;
  const pe = total ? (emCurso / total) * 100 : 0;
  return (
    <div role="img" aria-label={`${rotulo}: ${concluiram} concluíram, ${emCurso} em curso, ${total - concluiram - emCurso} não começaram`} className="flex h-1.5 w-full overflow-hidden rounded-full bg-linha">
      <div className="h-full bg-energia" style={{ width: `${pc}%` }} />
      <div className="h-full bg-energia/40" style={{ width: `${pe}%` }} />
    </div>
  );
}

/** A cor da fatia i: a primeira em amarelo, as outras em tons do texto, do mais forte para o mais suave. */
export function corDaFatia(i: number) {
  return i === 0 ? "var(--energia)" : `color-mix(in srgb, var(--tinta) ${Math.max(14, 78 - (i - 1) * 14)}%, transparent)`;
}

/** Um gráfico circular. Passar o rato numa fatia (ou na sua linha da legenda) realça-a. */
export function Rosca({
  fatias,
  activa,
  aoActivar,
  centro,
  rotuloCentro,
}: {
  fatias: { id: string; rotulo: string; valor: number }[];
  activa: string | null;
  aoActivar: (id: string | null) => void;
  centro: string;
  rotuloCentro: string;
}) {
  const total = fatias.reduce((t, f) => t + f.valor, 0) || 1;
  const R = 62;
  const C = 2 * Math.PI * R;
  const folga = fatias.length > 1 ? 2.5 : 0;
  // Onde começa cada fatia: a soma das anteriores.
  const inicios = fatias.map((_, i) => fatias.slice(0, i).reduce((t, x) => t + (x.valor / total) * C, 0));
  const escolhida = fatias.find((f) => f.id === activa);

  return (
    <div className="relative mx-auto h-[200px] w-[200px] shrink-0" onMouseLeave={() => aoActivar(null)}>
      <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90" role="group" aria-label="Distribuição por departamento">
        <circle cx="80" cy="80" r={R} fill="none" stroke="var(--linha)" strokeWidth="22" opacity="0.5" />
        {fatias.map((f, i) => {
          const len = (f.valor / total) * C;
          return (
            <circle
              key={f.id}
              cx="80"
              cy="80"
              r={R}
              fill="none"
              stroke={corDaFatia(i)}
              strokeWidth={activa === f.id ? 26 : 22}
              strokeDasharray={`${Math.max(0, len - folga)} ${C - Math.max(0, len - folga)}`}
              strokeDashoffset={-inicios[i]}
              opacity={activa === null || activa === f.id ? 1 : 0.4}
              tabIndex={0}
              aria-label={`${f.rotulo}: ${f.valor}`}
              onMouseEnter={() => aoActivar(f.id)}
              onFocus={() => aoActivar(f.id)}
              onBlur={() => aoActivar(null)}
              className="cursor-pointer outline-none transition-[stroke-width,opacity] duration-150"
            />
          );
        })}
      </svg>
      <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
        <p className="font-titulo text-[2rem] font-extrabold leading-none tracking-tight">{escolhida ? escolhida.valor : centro}</p>
        <p className="mt-1 max-w-[110px] truncate text-sm text-suave">{escolhida ? escolhida.rotulo : rotuloCentro}</p>
      </div>
    </div>
  );
}

/**
 * A evolução de uma empresa mês a mês: as barras são a participação, a linha amarela é o acerto médio.
 * Passar o rato (ou focar com o teclado) numa coluna realça o mês e mostra os números num cartão.
 * Há uma tabela escondida para leitores de ecrã.
 */
export function GraficoEvolucao({ pontos: todos }: { pontos: PontoHistorico[] }) {
  const [activo, setActivo] = useState<number | null>(null);
  // Com muitos meses, mostram-se os mais recentes; o resto vê-se ao mudar o período.
  const [periodo, setPeriodo] = useState("6");
  const pontos = periodo === "todos" ? todos : todos.slice(-Number(periodo));
  const deslize = useRef<HTMLDivElement>(null);
  const LARGURA_MES = 52;
  const W = Math.max(560, 46 + 12 + pontos.length * LARGURA_MES);
  const larga = W > 560;
  // Em períodos compridos o gráfico desliza na horizontal, começando pelos meses mais recentes.
  useEffect(() => {
    if (deslize.current) deslize.current.scrollLeft = deslize.current.scrollWidth;
  }, [periodo, pontos.length]);
  const H = 258;
  const m = { t: 22, r: 12, b: 56, l: 46 };
  const iw = W - m.l - m.r;
  const ih = H - m.t - m.b;
  const n = pontos.length;
  const passo = iw / Math.max(n, 1);
  const larg = Math.min(46, passo * 0.5);
  const cx = (i: number) => m.l + passo * i + passo / 2;
  const y = (pct: number) => m.t + ih - (pct / 100) * ih;

  const linha = pontos.map((p, i) => (p.acerto === null ? null : { x: cx(i), y: y(p.acerto), p, i })).filter((q): q is { x: number; y: number; p: PontoHistorico; i: number } => q !== null);
  const p = activo === null ? null : pontos[activo];
  // O cartão fica à direita da coluna; nas últimas colunas passa para a esquerda.
  const esquerda = activo !== null && cx(activo) > W * 0.62;

  return (
    <figure>
      {todos.length > 6 && (
        <div className="mb-3 flex justify-end">
          <Escolha
            rotulo="Período"
            semRotulo
            valor={periodo}
            aoMudar={(v) => {
              setPeriodo(v);
              setActivo(null);
            }}
            opcoes={[
              { valor: "6", rotulo: "Últimos 6 meses" },
              { valor: "12", rotulo: "Últimos 12 meses" },
              { valor: "todos", rotulo: `Todos (${todos.length} meses)` },
            ]}
            className="w-52"
          />
        </div>
      )}
      <div ref={deslize} className={larga ? "overflow-x-auto" : ""}>
      <div className="relative" style={larga ? { width: W } : undefined} onMouseLeave={() => setActivo(null)}>
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="group" aria-label="Evolução da participação e do acerto, mês a mês">
          {[0, 50, 100].map((g) => (
            <g key={g}>
              <line x1={m.l} x2={W - m.r} y1={y(g)} y2={y(g)} stroke="var(--linha)" strokeDasharray={g === 0 ? undefined : "3 4"} />
              <text x={m.l - 8} y={y(g) + 4} textAnchor="end" fontSize="11" fill="var(--texto-suave)">
                {g}%
              </text>
            </g>
          ))}
          {activo !== null && <rect x={cx(activo) - passo / 2 + 2} y={m.t - 8} width={passo - 4} height={ih + 8 + 44} rx="8" fill="var(--tinta)" fillOpacity="0.06" />}
          {pontos.map((q, i) => (
            <g key={q.mes} opacity={activo === null || activo === i ? 1 : 0.45} style={{ transition: "opacity 150ms" }}>
              <rect x={cx(i) - larg / 2} y={y(q.conclusao * 100)} width={larg} height={Math.max(0, y(0) - y(q.conclusao * 100))} rx="5" fill="var(--tinta)" fillOpacity={q.desafio.estado === "enviado" ? (activo === i ? 0.7 : 0.55) : activo === i ? 0.3 : 0.16} />
              <text x={cx(i)} y={H - 32} textAnchor="middle" fontSize="12.5" fontWeight="600" fill="var(--tinta)">
                {mesCurto(q.mes)}{i === 0 || q.mes.endsWith("-01") ? ` ’${q.mes.slice(2, 4)}` : ""}
              </text>
              <text x={cx(i)} y={H - 14} textAnchor="middle" fontSize="11.5" fill="var(--texto-suave)">
                {Math.round(q.conclusao * 100)}%
              </text>
            </g>
          ))}
          {linha.length > 1 && <polyline points={linha.map((q) => `${q.x},${q.y}`).join(" ")} fill="none" stroke="var(--energia)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
          {linha.map((q) => (
            <g key={q.p.mes}>
              <circle cx={q.x} cy={q.y} r={activo === q.i ? 7 : 5} fill="var(--energia)" stroke="var(--superficie)" strokeWidth="2" style={{ transition: "r 150ms" }} />
              <text x={q.x} y={q.y - 12} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--tinta)">
                {q.p.acerto}%
              </text>
            </g>
          ))}
          {/* Zonas de contacto: uma por mês, focáveis com o teclado. */}
          {pontos.map((q, i) => (
            <rect
              key={q.mes}
              x={cx(i) - passo / 2}
              y={0}
              width={passo}
              height={H}
              fill="transparent"
              tabIndex={0}
              aria-label={`${nomeMes(q.mes)}: participação ${Math.round(q.conclusao * 100)}%, acerto ${q.acerto === null ? "sem resultados" : `${q.acerto}%`}`}
              onMouseEnter={() => setActivo(i)}
              onFocus={() => setActivo(i)}
              onBlur={() => setActivo(null)}
              className="cursor-pointer outline-none"
            />
          ))}
        </svg>
        {p && activo !== null && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-2 z-10 w-52 rounded-[10px] border border-linha bg-superficie p-3 text-sm shadow-[0_12px_32px_-12px_rgba(0,0,0,0.5)]"
            style={esquerda ? { right: `${((W - cx(activo) + passo / 2) / W) * 100}%` } : { left: `${((cx(activo) + passo / 2) / W) * 100}%` }}
          >
            <p className="font-semibold">{nomeMes(p.mes)}</p>
            <p className="truncate text-suave">{p.desafio.titulo}</p>
            {p.desafio.estado === "enviado" && <p className="mt-0.5 text-xs font-semibold">Em curso: ainda a decorrer</p>}
            <dl className="mt-2 space-y-1">
              <div className="flex items-center justify-between gap-3">
                <dt className="inline-flex items-center gap-2 text-suave">
                  <span className="h-2.5 w-2.5 rounded-[3px] bg-tinta/30" /> Participação
                </dt>
                <dd className="font-semibold tabular-nums">{Math.round(p.conclusao * 100)}%</dd>
              </div>
              <dd className="text-xs text-suave">
                {p.concluiram} de {p.total} colaboradores
              </dd>
              <div className="flex items-center justify-between gap-3 pt-1">
                <dt className="inline-flex items-center gap-2 text-suave">
                  <span className="h-1 w-2.5 rounded bg-energia" /> Acerto médio
                </dt>
                <dd className="font-semibold tabular-nums">{p.acerto === null ? "–" : `${p.acerto}%`}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>
      </div>
      <figcaption className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-suave">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-3 w-3 rounded-[3px] bg-tinta/20" /> Participação (valor por baixo do mês)
        </span>
        {pontos.some((q) => q.desafio.estado === "enviado") && (
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="h-3 w-3 rounded-[3px] bg-tinta/55" /> Mês em curso
          </span>
        )}
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-0.5 w-5 rounded bg-energia" /> Acerto médio
        </span>
      </figcaption>
      <div className="sr-only">
        <table>
          <caption>Participação e acerto médio por mês</caption>
          <thead>
            <tr>
              <th scope="col">Mês</th>
              <th scope="col">Participação</th>
              <th scope="col">Acerto médio</th>
            </tr>
          </thead>
          <tbody>
            {pontos.map((q) => (
              <tr key={q.mes}>
                <th scope="row">{nomeMes(q.mes)}</th>
                <td>{Math.round(q.conclusao * 100)}%</td>
                <td>{q.acerto === null ? "sem resultados" : `${q.acerto}%`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
