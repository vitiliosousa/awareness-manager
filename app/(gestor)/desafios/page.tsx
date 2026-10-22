import Link from "next/link";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Icone } from "@/components/icone";
import { CabecalhoPagina, Etiqueta } from "@/components/campos";
import { MesTile } from "@/components/blocos";
import { Barra } from "@/components/empresa-visual";
import { dados } from "@/lib/exemplo";
import { nomeTema, resumoDesafio, rotuloEstadoDesafio, tomEstadoDesafio } from "@/lib/analise";
import { diaCurto, nomeMes, percentagem } from "@/lib/formatos";

/** Todos os desafios que a empresa recebeu (e o próximo), do mais recente para o mais antigo. */
export default function Desafios() {
  const lista = [...dados.desafios].sort((a, b) => b.id.localeCompare(a.id));
  return (
    <div className="mx-auto max-w-[1180px]">
      <CabecalhoPagina titulo="Desafios" descricao="Todos os meses a equipa recebe um desafio curto. Vê quem participou e como correu cada um." />

      <ul className="mt-8 divide-y divide-linha rounded-[14px] border border-linha bg-superficie px-3">
        {lista.map((d) => {
          const r = resumoDesafio(d);
          return (
            <li key={d.id}>
              <Link href={`/desafios/${d.id}`} className="group -mx-1 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-lg px-3 py-4 transition-colors hover:bg-papel/70">
                <MesTile id={d.id} />
                <div className="min-w-0 flex-1 basis-60">
                  <p className="sr-only">{nomeMes(d.id)}</p>
                  <p className="font-semibold leading-tight">{d.titulo}</p>
                  <p className="mt-0.5 truncate text-sm text-suave">{d.temas.map(nomeTema).join(" · ")}</p>
                  <div className="mt-1.5">
                    <Etiqueta tom={tomEstadoDesafio[d.estado]}>{rotuloEstadoDesafio[d.estado]}</Etiqueta>
                  </div>
                </div>
                {d.estado === "agendado" ? (
                  <p className="text-sm text-suave">Começa a {diaCurto(d.inicio)}</p>
                ) : (
                  <div className="flex w-full items-center gap-5 sm:w-auto">
                    <div className="w-full sm:w-48">
                      <div className="flex items-baseline justify-between text-sm">
                        <span className="text-suave">Participação</span>
                        <span className="font-semibold tabular-nums">
                          {r.concluiram}/{r.total}
                        </span>
                      </div>
                      <div className="mt-1.5">
                        <Barra valor={r.conclusao} rotulo={`Participação em ${nomeMes(d.id)}`} />
                      </div>
                    </div>
                    <div className="w-16 text-right">
                      <p className="text-sm text-suave">Acerto</p>
                      <p className="font-titulo text-xl font-bold leading-tight tabular-nums">{percentagem(r.acerto)}</p>
                    </div>
                  </div>
                )}
                <Icone icon={ArrowRight01Icon} size={18} className="hidden text-suave transition-transform group-hover:translate-x-0.5 group-hover:text-tinta sm:block" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
