import Link from "next/link";
import { Etiqueta } from "@/components/campos";
import { Avatar } from "@/components/ui";
import { iniciais } from "@/lib/formatos";
import { rotuloEstado, tomEstado, type EstadoNoDesafio } from "@/lib/analise";
import { estadoAcesso, type Colaborador } from "@/lib/tipos";

const rotulosAcesso = { activo: "Activo", convite: "Convite por abrir", "sem-convite": "Sem convite" } as const;
const tonsAcesso = { activo: "verde", convite: "azul", "sem-convite": "amarelo" } as const;

/** O estado de acesso de um colaborador, numa etiqueta. */
export function EtiquetaAcesso({ c }: { c: Colaborador }) {
  const e = estadoAcesso(c);
  return <Etiqueta tom={tonsAcesso[e]}>{rotulosAcesso[e]}</Etiqueta>;
}

/** O que a pessoa fez num desafio, numa etiqueta. */
export function EtiquetaEstado({ estado }: { estado: EstadoNoDesafio }) {
  return <Etiqueta tom={tomEstado[estado]}>{rotuloEstado[estado]}</Etiqueta>;
}

/**
 * Avatar, nome (ligação para a ficha) e email. Numa linha de lista, a ligação cobre a linha toda;
 * os botões da linha precisam de `relative z-10` para ficarem por cima.
 */
export function PessoaNaLinha({ c, detalhe }: { c: Colaborador; detalhe?: React.ReactNode }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar iniciais={iniciais(c.nome)} />
      <div className="min-w-0">
        <Link href={`/colaboradores/${c.id}`} className="block truncate font-semibold leading-tight after:absolute after:inset-0 hover:underline">
          {c.nome}
        </Link>
        <p className="truncate text-sm text-suave">{detalhe ?? c.email}</p>
      </div>
    </div>
  );
}
