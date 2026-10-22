"use client";

import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Icone } from "@/components/icone";
import { paletas, type Amostras } from "@/lib/paletas";
import { definirPaleta, usePaleta, type IdPaleta } from "@/lib/preferencias";

/** Miniatura da app com as cores de uma paleta: barra lateral, cartão, botão e progresso. */
function Miniatura({ a, rotulo }: { a: Amostras; rotulo: string }) {
  return (
    <div className="flex h-24 flex-1 overflow-hidden" style={{ background: a.papel }} aria-hidden="true" title={rotulo}>
      <div className="w-5 shrink-0" style={{ background: a.noite }}>
        <div className="mx-auto mt-2 h-1 w-2.5 rounded-full" style={{ background: a.energia }} />
      </div>
      <div className="flex-1 p-2">
        <div className="h-1.5 w-10 rounded-full" style={{ background: a.tinta, opacity: 0.8 }} />
        <div className="mt-2 rounded-md p-1.5" style={{ background: a.superficie, border: `1px solid ${a.linha}` }}>
          <div className="h-1.5 w-full rounded-full" style={{ background: a.linha }}>
            <div className="h-full w-3/5 rounded-full" style={{ background: a.progresso }} />
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <div className="h-3.5 w-9 rounded" style={{ background: a.indigo }} />
            <div className="h-2.5 w-5 rounded-sm" style={{ background: a.energia }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Grelha das paletas de cores, cada uma com miniaturas clara e escura. Muda as cores da app no momento. */
export function EscolhaPaleta({ rotuloId, className = "", colunas = "sm:grid-cols-2 lg:grid-cols-3" }: { rotuloId: string; className?: string; colunas?: string }) {
  const actual = usePaleta();
  return (
    <div role="radiogroup" aria-labelledby={rotuloId} className={`grid gap-4 ${colunas} ${className}`}>
          {paletas.map((p) => {
            const activa = actual === p.id;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={activa}
                onClick={() => definirPaleta(p.id as IdPaleta)}
                className={`overflow-hidden rounded-[10px] border-2 bg-superficie text-left transition-colors ${
                  activa ? "border-indigo" : "border-linha hover:border-tinta/40"
                }`}
              >
                <div className="flex gap-px bg-linha">
                  <Miniatura a={p.claro} rotulo="Versão clara" />
                  <Miniatura a={p.escuro} rotulo="Versão escura" />
                </div>
                <div className="flex items-start gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{p.nome}</p>
                    <p className="mt-0.5 text-sm text-suave">{p.descricao}</p>
                  </div>
                  {activa && <Icone icon={CheckmarkCircle02Icon} size={22} className="shrink-0 text-indigo" aria-label="Seleccionada" />}
                </div>
              </button>
            );
          })}
        </div>
  );
}
