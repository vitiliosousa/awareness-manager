"use client";

import Link from "next/link";
import { CabecalhoPagina, Vazio } from "@/components/campos";
import { botaoSecundario } from "@/components/ui";
import { proximoDesafio } from "@/lib/analise";
import { diaCurto } from "@/lib/formatos";

/** Para uma empresa que ainda não recebeu nenhum desafio: não há resultados para mostrar. */
export function SemDesafios({ titulo }: { titulo: string }) {
  return (
    <div className="mx-auto max-w-[1180px]">
      <CabecalhoPagina titulo={titulo} />
      <div className="mt-8">
        <Vazio
          titulo="Ainda não há resultados"
          texto={
            proximoDesafio
              ? `O primeiro desafio, «${proximoDesafio.titulo}», começa a ${diaCurto(proximoDesafio.inicio)}. Os números aparecem aqui quando a equipa começar.`
              : "Os números aparecem aqui quando a equipa receber o primeiro desafio. Entretanto, confirma que todos têm acesso à plataforma."
          }
          accao={
            <Link href="/colaboradores" className={botaoSecundario}>
              Ver colaboradores
            </Link>
          }
        />
      </div>
    </div>
  );
}
