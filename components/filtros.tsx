"use client";

import { useEffect, useRef, useState } from "react";
import { Cancel01Icon, FilterHorizontalIcon } from "@hugeicons/core-free-icons";
import { Icone } from "@/components/icone";
import { Escolha } from "@/components/campos";
import { botaoSecundario } from "@/components/ui";

/** Um filtro de uma lista: uma escolha cujo valor por omissão (`padrao`) quer dizer "sem filtro". */
export type Filtro = {
  id: string;
  rotulo: string;
  valor: string;
  padrao: string;
  opcoes: { valor: string; rotulo: string }[];
  aoMudar: (v: string) => void;
};

const activo = (f: Filtro) => f.valor !== f.padrao;

/**
 * O botão "Filtros" que abre um painel com todos os filtros de uma lista, para não ocuparem uma linha inteira.
 * Mostra quantos estão activos. Põe-se na linha de pesquisa; os filtros activos aparecem em `FiltrosActivos`.
 */
export function BotaoFiltros({ filtros }: { filtros: Filtro[] }) {
  const [aberto, setAberto] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const n = filtros.filter(activo).length;

  useEffect(() => {
    if (!aberto) return;
    const fora = (ev: MouseEvent) => {
      if (raiz.current && !raiz.current.contains(ev.target as Node)) setAberto(false);
    };
    const tecla = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") setAberto(false);
    };
    document.addEventListener("mousedown", fora);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("mousedown", fora);
      document.removeEventListener("keydown", tecla);
    };
  }, [aberto]);

  return (
    <div ref={raiz} className="relative">
      <button type="button" aria-expanded={aberto} aria-haspopup="dialog" onClick={() => setAberto((v) => !v)} className={botaoSecundario}>
        <Icone icon={FilterHorizontalIcon} size={18} />
        Filtros
        {n > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-energia px-1.5 text-xs font-bold text-noite">{n}</span>}
      </button>

      {aberto && (
        <div role="dialog" aria-label="Filtros" className="absolute right-0 top-full z-40 mt-2 w-[min(360px,90vw)] rounded-[14px] border border-linha bg-superficie p-4 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.4)]">
          <div className="space-y-4">
            {filtros.map((f) => (
              <Escolha key={f.id} rotulo={f.rotulo} valor={f.valor} aoMudar={f.aoMudar} opcoes={f.opcoes} />
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-linha pt-3">
            <button
              type="button"
              disabled={n === 0}
              onClick={() => filtros.forEach((f) => f.aoMudar(f.padrao))}
              className="text-sm font-semibold underline underline-offset-2 hover:no-underline disabled:no-underline disabled:opacity-40"
            >
              Limpar filtros
            </button>
            <button type="button" onClick={() => setAberto(false)} className="text-sm font-semibold underline underline-offset-2 hover:no-underline">
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Os filtros que estão aplicados, como etiquetas que se podem tirar uma a uma. Não mostra nada se não houver nenhum. */
export function FiltrosActivos({ filtros }: { filtros: Filtro[] }) {
  const lista = filtros.filter(activo);
  if (lista.length === 0) return null;
  return (
    <ul className="mt-3 flex flex-wrap items-center gap-2" aria-label="Filtros aplicados">
      {lista.map((f) => (
        <li key={f.id}>
          <button
            type="button"
            onClick={() => f.aoMudar(f.padrao)}
            aria-label={`Tirar o filtro ${f.rotulo}: ${f.opcoes.find((o) => o.valor === f.valor)?.rotulo ?? f.valor}`}
            className="inline-flex h-8 items-center gap-2 rounded-full border border-linha bg-superficie pl-3 pr-2 text-sm transition-colors hover:border-tinta/40"
          >
            <span className="text-suave">{f.rotulo}:</span>
            <span className="font-semibold">{f.opcoes.find((o) => o.valor === f.valor)?.rotulo ?? f.valor}</span>
            <Icone icon={Cancel01Icon} size={14} className="text-suave" />
          </button>
        </li>
      ))}
      <li>
        <button type="button" onClick={() => lista.forEach((f) => f.aoMudar(f.padrao))} className="text-sm font-semibold underline underline-offset-2 hover:no-underline">
          Limpar tudo
        </button>
      </li>
    </ul>
  );
}
