"use client";

import { useRef } from "react";

/** Separadores acessíveis: setas para mudar, e cada um com o seu painel. */
export function Separadores<T extends string>({
  rotulo,
  itens,
  valor,
  aoMudar,
  idBase,
}: {
  rotulo: string;
  itens: { id: T; rotulo: string; contagem?: number }[];
  valor: T;
  aoMudar: (id: T) => void;
  idBase: string;
}) {
  const lista = useRef<HTMLDivElement>(null);

  function aoTeclar(e: React.KeyboardEvent, i: number) {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const prox = itens[(i + delta + itens.length) % itens.length];
    aoMudar(prox.id);
    lista.current?.querySelector<HTMLButtonElement>(`#${idBase}-${prox.id}`)?.focus();
  }

  return (
    <div ref={lista} role="tablist" aria-label={rotulo} className="flex gap-1 overflow-x-auto border-b border-linha">
      {itens.map((it, i) => {
        const activo = it.id === valor;
        return (
          <button
            key={it.id}
            id={`${idBase}-${it.id}`}
            role="tab"
            type="button"
            aria-selected={activo}
            aria-controls={`${idBase}-painel`}
            tabIndex={activo ? 0 : -1}
            onClick={() => aoMudar(it.id)}
            onKeyDown={(e) => aoTeclar(e, i)}
            className={`relative shrink-0 whitespace-nowrap px-4 py-3 text-[15px] font-semibold transition-colors ${activo ? "text-tinta" : "text-suave hover:text-tinta"}`}
          >
            {it.rotulo}
            {it.contagem !== undefined && <span className="ml-1.5 rounded-full bg-papel px-2 py-0.5 text-xs tabular-nums text-suave">{it.contagem}</span>}
            {activo && <span aria-hidden="true" className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-energia" />}
          </button>
        );
      })}
    </div>
  );
}
