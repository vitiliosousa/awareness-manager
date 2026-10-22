"use client";

import { useState } from "react";

// Gráficos simples em SVG/HTML, para os relatórios, o início e a faturação. Cada um tem texto alternativo.

const CORES = ["var(--energia)", "var(--indigo)", "var(--mangal)", "var(--risco)", "color-mix(in srgb, var(--tinta) 55%, transparent)", "color-mix(in srgb, var(--tinta) 30%, transparent)"];
export const corDaSerie = (i: number) => CORES[i % CORES.length];

export type Serie = { id: string; nome: string; valores: (number | null)[] };

export function Legenda({ series }: { series: { nome: string }[] }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-suave">
      {series.map((s, i) => (
        <li key={s.nome} className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-3 w-3 rounded-[3px]" style={{ background: corDaSerie(i) }} />
          {s.nome}
        </li>
      ))}
    </ul>
  );
}

const W = 640;
const H = 260;
const M = { t: 16, r: 14, b: 34, l: 46 };

function Eixo({ max, formato, passos = 4 }: { max: number; formato: (n: number) => string; passos?: number }) {
  const ih = H - M.t - M.b;
  return (
    <>
      {Array.from({ length: passos + 1 }, (_, i) => (max / passos) * i).map((v) => {
        const y = M.t + ih - (v / max) * ih;
        return (
          <g key={v}>
            <line x1={M.l} x2={W - M.r} y1={y} y2={y} stroke="var(--linha)" strokeDasharray={v === 0 ? undefined : "3 4"} />
            <text x={M.l - 8} y={y + 4} textAnchor="end" fontSize="13.5" fill="var(--texto-suave)">
              {formato(v)}
            </text>
          </g>
        );
      })}
    </>
  );
}

/** Uma ou várias linhas ao longo de categorias (meses, desafios). */
export function GraficoLinhas({ categorias, series, max = 100, formato = (n) => `${n}%`, rotulo }: { categorias: string[]; series: Serie[]; max?: number; formato?: (n: number) => string; rotulo: string }) {
  const [activo, setActivo] = useState<number | null>(null);
  const iw = W - M.l - M.r;
  const ih = H - M.t - M.b;
  const passo = iw / Math.max(categorias.length - 1, 1);
  const x = (i: number) => (categorias.length === 1 ? M.l + iw / 2 : M.l + passo * i);
  const y = (v: number) => M.t + ih - (Math.min(v, max) / max) * ih;
  return (
    <figure>
      <div className="relative" onMouseLeave={() => setActivo(null)}>
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={rotulo}>
          <Eixo max={max} formato={formato} />
          {categorias.map((c, i) => (
            <text key={c + i} x={x(i)} y={H - 12} textAnchor="middle" fontSize="14" fill="var(--texto-suave)">
              {c}
            </text>
          ))}
          {activo !== null && <line x1={x(activo)} x2={x(activo)} y1={M.t} y2={M.t + ih} stroke="var(--tinta)" strokeOpacity="0.25" />}
          {series.map((s, si) => {
            const pts = s.valores.map((v, i) => (v === null ? null : { x: x(i), y: y(v), v })).filter((p): p is { x: number; y: number; v: number } => p !== null);
            return (
              <g key={s.id}>
                {pts.length > 1 && <polyline points={pts.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={corDaSerie(si)} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
                {pts.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="3.8" fill={corDaSerie(si)} stroke="var(--superficie)" strokeWidth="1.5" />
                ))}
              </g>
            );
          })}
          {categorias.map((c, i) => (
            <rect key={c + i} x={x(i) - Math.max(passo, 30) / 2} y={0} width={Math.max(passo, 30)} height={H} fill="transparent" onMouseEnter={() => setActivo(i)} onFocus={() => setActivo(i)} tabIndex={0} aria-label={`${c}: ${series.map((s) => `${s.nome} ${s.valores[i] === null ? "sem dados" : formato(s.valores[i]!)}`).join(", ")}`} className="outline-none" />
          ))}
        </svg>
        {activo !== null && (
          <div aria-hidden="true" className="pointer-events-none absolute top-1 z-10 min-w-40 rounded-[10px] border border-linha bg-superficie p-3 text-sm shadow-lg" style={{ left: `${Math.min(70, Math.max(0, (x(activo) / W) * 100 - 8))}%` }}>
            <p className="font-semibold">{categorias[activo]}</p>
            <ul className="mt-1.5 space-y-1">
              {series.map((s, si) => (
                <li key={s.id} className="flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 text-suave">
                    <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: corDaSerie(si) }} />
                    {s.nome}
                  </span>
                  <span className="font-semibold tabular-nums">{s.valores[activo] === null ? "–" : formato(s.valores[activo]!)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {series.length > 1 && <Legenda series={series} />}
    </figure>
  );
}

/** Barras verticais, agrupadas (uma barra por série) ou empilhadas. */
export function GraficoBarras({ categorias, series, max, formato = (n) => `${n}%`, empilhado = false, rotulo }: { categorias: string[]; series: Serie[]; max?: number; formato?: (n: number) => string; empilhado?: boolean; rotulo: string }) {
  const [activo, setActivo] = useState<number | null>(null);
  const topo = max ?? Math.max(1, ...(empilhado ? categorias.map((_, i) => series.reduce((t, s) => t + (s.valores[i] ?? 0), 0)) : series.flatMap((s) => s.valores.map((v) => v ?? 0))));
  const limite = max ?? niceMax(topo);
  const iw = W - M.l - M.r;
  const ih = H - M.t - M.b;
  const passo = iw / Math.max(categorias.length, 1);
  const grupo = Math.min(passo * 0.7, 72);
  const larg = empilhado ? grupo : grupo / series.length;
  const y = (v: number) => M.t + ih - (v / limite) * ih;
  return (
    <figure>
      <div className="relative" onMouseLeave={() => setActivo(null)}>
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={rotulo}>
          <Eixo max={limite} formato={formato} />
          {categorias.map((c, i) => {
            const cx = M.l + passo * i + passo / 2;
            let base = 0;
            return (
              <g key={c + i} opacity={activo === null || activo === i ? 1 : 0.5} style={{ transition: "opacity 150ms" }}>
                {series.map((s, si) => {
                  const v = s.valores[i] ?? 0;
                  const h = Math.max(0, (v / limite) * ih);
                  const xx = empilhado ? cx - larg / 2 : cx - grupo / 2 + larg * si + 1;
                  const yy = empilhado ? y(base + v) : y(v);
                  if (empilhado) base += v;
                  return <rect key={s.id} x={xx} y={yy} width={Math.max(2, larg - 2)} height={h} rx="3" fill={corDaSerie(si)} />;
                })}
                <text x={cx} y={H - 12} textAnchor="middle" fontSize="14" fill="var(--texto-suave)">
                  {c}
                </text>
                <rect x={cx - passo / 2} y={0} width={passo} height={H} fill="transparent" tabIndex={0} onMouseEnter={() => setActivo(i)} onFocus={() => setActivo(i)} aria-label={`${c}: ${series.map((s) => `${s.nome} ${formato(s.valores[i] ?? 0)}`).join(", ")}`} className="outline-none" />
              </g>
            );
          })}
        </svg>
        {activo !== null && (
          <div aria-hidden="true" className="pointer-events-none absolute top-1 z-10 min-w-40 rounded-[10px] border border-linha bg-superficie p-3 text-sm shadow-lg" style={{ left: `${Math.min(70, Math.max(0, ((M.l + passo * activo + passo / 2) / W) * 100 - 8))}%` }}>
            <p className="font-semibold">{categorias[activo]}</p>
            <ul className="mt-1.5 space-y-1">
              {series.map((s, si) => (
                <li key={s.id} className="flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 text-suave">
                    <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: corDaSerie(si) }} />
                    {s.nome}
                  </span>
                  <span className="font-semibold tabular-nums">{formato(s.valores[activo] ?? 0)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {series.length > 1 && <Legenda series={series} />}
    </figure>
  );
}

/** Um máximo que dá quatro intervalos redondos no eixo. */
function niceMax(v: number) {
  const quarto = v / 4;
  const p = 10 ** Math.floor(Math.log10(quarto));
  const f = quarto / p;
  return 4 * (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
}

/** Barras horizontais ordenadas: um rótulo, uma barra, um valor. */
export function BarrasHorizontais({ itens, max = 100, formato = (n) => `${n}%`, aviso }: { itens: { id: string; rotulo: string; valor: number; nota?: string }[]; max?: number; formato?: (n: number) => string; aviso?: (valor: number) => boolean }) {
  return (
    <ul className="space-y-3">
      {itens.map((i) => (
        <li key={i.id} className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)_3.5rem] items-center gap-x-3 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_4rem]">
          <p className="truncate text-sm font-medium" title={i.rotulo}>
            {i.rotulo}
          </p>
          <div role="progressbar" aria-label={i.rotulo} aria-valuenow={Math.round(i.valor)} aria-valuemin={0} aria-valuemax={max} className="h-3 overflow-hidden rounded-full bg-linha">
            <div className="h-full rounded-full" style={{ width: `${Math.max(0, Math.min(100, (i.valor / max) * 100))}%`, background: aviso?.(i.valor) ? "var(--risco)" : "var(--energia)" }} />
          </div>
          <p className="text-right text-sm font-semibold tabular-nums">{formato(i.valor)}</p>
        </li>
      ))}
    </ul>
  );
}

/** Uma grelha de cores: quanto mais forte, melhor o valor. Para cruzar empresas com temas, desafios ou competências. */
export function MapaCalor({ linhas, colunas, valores, rotulo }: { linhas: string[]; colunas: string[]; valores: (number | null)[][]; rotulo: string }) {
  const cor = (v: number | null) => (v === null ? "transparent" : v < 60 ? `color-mix(in srgb, var(--risco) ${Math.round(25 + (60 - v) * 1.2)}%, transparent)` : `color-mix(in srgb, var(--mangal) ${Math.round(12 + (v - 60) * 1.4)}%, transparent)`);
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-1 text-sm" aria-label={rotulo}>
        <thead>
          <tr>
            <th className="w-40" />
            {colunas.map((c) => (
              <th key={c} scope="col" className="px-1 pb-1 text-center text-xs font-semibold text-suave">
                <span className="block max-w-24 truncate" title={c}>
                  {c}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((l, i) => (
            <tr key={l}>
              <th scope="row" className="truncate pr-2 text-left text-sm font-medium">
                {l}
              </th>
              {colunas.map((c, j) => (
                <td key={c} className="h-10 rounded-md text-center font-semibold tabular-nums" style={{ background: cor(valores[i][j]) }} title={`${l}, ${c}: ${valores[i][j] === null ? "sem dados" : `${valores[i][j]}%`}`}>
                  {valores[i][j] === null ? <span className="text-suave">–</span> : `${valores[i][j]}%`}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 flex items-center gap-3 text-xs text-suave">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-[3px]" style={{ background: cor(40) }} /> abaixo de 60%
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-[3px]" style={{ background: cor(90) }} /> acima
        </span>
      </p>
    </div>
  );
}

/** Um anel com uma percentagem no meio. */
export function Anel({ valor, rotulo, texto }: { valor: number; rotulo: string; texto?: string }) {
  const R = 44;
  const C = 2 * Math.PI * R;
  const v = Math.max(0, Math.min(1, valor));
  return (
    <div className="relative mx-auto h-[130px] w-[130px]" role="img" aria-label={`${rotulo}: ${Math.round(v * 100)}%`}>
      <svg viewBox="0 0 110 110" className="h-full w-full -rotate-90">
        <circle cx="55" cy="55" r={R} fill="none" stroke="var(--linha)" strokeWidth="11" />
        <circle cx="55" cy="55" r={R} fill="none" stroke="var(--energia)" strokeWidth="11" strokeLinecap="round" strokeDasharray={`${C * v} ${C}`} />
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <p className="font-titulo text-2xl font-extrabold leading-none">{texto ?? `${Math.round(v * 100)}%`}</p>
        <p className="mt-1 text-xs text-suave">{rotulo}</p>
      </div>
    </div>
  );
}

/** Uma barra repartida em partes, com legenda (por exemplo, quem concluiu, está a meio ou não começou). */
export function BarraPartes({ partes, rotulo }: { partes: { nome: string; valor: number }[]; rotulo: string }) {
  const total = partes.reduce((t, p) => t + p.valor, 0) || 1;
  return (
    <div>
      <div role="img" aria-label={`${rotulo}: ${partes.map((p) => `${p.nome} ${p.valor}`).join(", ")}`} className="flex h-4 overflow-hidden rounded-full bg-linha">
        {partes.map((p, i) => (
          <div key={p.nome} className="h-full" style={{ width: `${(p.valor / total) * 100}%`, background: corDaSerie(i === 0 ? 0 : i === 1 ? 4 : 5) }} />
        ))}
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-suave">
        {partes.map((p, i) => (
          <li key={p.nome} className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-[3px]" style={{ background: corDaSerie(i === 0 ? 0 : i === 1 ? 4 : 5) }} />
            {p.nome} <span className="font-semibold text-tinta tabular-nums">{p.valor}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
