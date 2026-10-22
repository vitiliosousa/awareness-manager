"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/campos";
import { botaoPrimario, botaoSecundario } from "@/components/ui";

// Uma caixa de confirmação no estilo da plataforma, no lugar da do browser (que não muda de cor com o tema).

type Pedido = { titulo: string; texto?: string; confirmar?: string; perigo?: boolean; resolver: (v: boolean) => void };

let ouvinte: ((p: Pedido) => void) | null = null;

/** Pergunta e espera pela resposta: `if (await confirmar({...})) apagar()`. */
export function confirmar(p: { titulo: string; texto?: string; confirmar?: string; perigo?: boolean }): Promise<boolean> {
  return new Promise((resolver) => {
    if (!ouvinte) return resolver(false);
    ouvinte({ ...p, resolver });
  });
}

/** Mostra as confirmações pedidas. Está uma vez no layout. */
export function ConfirmarHost() {
  const [pedido, setPedido] = useState<Pedido | null>(null);

  useEffect(() => {
    ouvinte = setPedido;
    return () => {
      ouvinte = null;
    };
  }, []);

  if (!pedido) return null;
  const responder = (v: boolean) => {
    pedido.resolver(v);
    setPedido(null);
  };

  return (
    <Modal titulo={pedido.titulo} aoFechar={() => responder(false)} largura="max-w-md">
      {pedido.texto && <p className="text-suave">{pedido.texto}</p>}
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button type="button" onClick={() => responder(false)} className={botaoSecundario}>
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => responder(true)}
          autoFocus
          className={pedido.perigo ? "inline-flex items-center justify-center h-[46px] rounded-md bg-risco px-5 font-semibold text-white transition-opacity hover:opacity-90" : botaoPrimario}
        >
          {pedido.confirmar ?? "Confirmar"}
        </button>
      </div>
    </Modal>
  );
}
