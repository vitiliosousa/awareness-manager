"use client";

import { ComputerIcon, Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { Icone } from "@/components/icone";
import { definirTema, useTema, type Tema } from "@/lib/preferencias";

const opcoes: { valor: Tema; rotulo: string; icone: typeof Sun03Icon }[] = [
  { valor: "claro", rotulo: "Claro", icone: Sun03Icon },
  { valor: "escuro", rotulo: "Escuro", icone: Moon02Icon },
  { valor: "sistema", rotulo: "Sistema", icone: ComputerIcon },
];

/** Escolha entre tema claro, escuro ou o do sistema. */
export function SeletorTema({ className = "" }: { className?: string }) {
  const tema = useTema();

  return (
    <div role="radiogroup" aria-label="Aparência" className={`grid grid-cols-3 gap-1 rounded-md bg-papel p-1 ${className}`}>
      {opcoes.map((o) => {
        const activo = tema === o.valor;
        return (
          <button
            key={o.valor}
            type="button"
            role="radio"
            aria-checked={activo}
            onClick={() => definirTema(o.valor)}
            className={`flex items-center justify-center gap-1.5 rounded px-2 py-1.5 text-sm font-medium transition-colors ${
              activo ? "bg-superficie text-tinta shadow-[0_1px_2px_rgba(0,0,0,0.15)]" : "text-suave hover:text-tinta"
            }`}
          >
            <Icone icon={o.icone} size={15} />
            {o.rotulo}
          </button>
        );
      })}
    </div>
  );
}
