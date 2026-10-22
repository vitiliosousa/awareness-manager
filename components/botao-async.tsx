"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui";

/**
 * Um botão para uma acção que demora (enviar, gerar, guardar…). Enquanto a acção corre mostra um círculo a rodar,
 * muda o texto para `ocupado` e fica desactivado, para a pessoa saber que está a acontecer e não carregar duas vezes.
 * `aoClicar` pode devolver uma promessa; o botão espera por ela.
 */
export function BotaoAsync({
  aoClicar,
  ocupado,
  className,
  desactivado = false,
  children,
  ...resto
}: {
  aoClicar: () => void | Promise<unknown>;
  /** O texto enquanto corre, por exemplo "A enviar…". */
  ocupado: string;
  className: string;
  desactivado?: boolean;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "disabled" | "className" | "children">) {
  const [aCorrer, setACorrer] = useState(false);
  return (
    <button
      type="button"
      {...resto}
      disabled={desactivado || aCorrer}
      aria-busy={aCorrer || undefined}
      onClick={async () => {
        if (aCorrer) return;
        setACorrer(true);
        try {
          await aoClicar();
        } finally {
          setACorrer(false);
        }
      }}
      className={`${className} ${aCorrer ? "!opacity-100" : ""}`}
    >
      {aCorrer ? (
        <>
          <Spinner /> {ocupado}
        </>
      ) : (
        children
      )}
    </button>
  );
}
