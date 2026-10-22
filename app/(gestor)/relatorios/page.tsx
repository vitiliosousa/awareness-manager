import Link from "next/link";
import { ArrowRight01Icon, File02Icon } from "@hugeicons/core-free-icons";
import { Icone } from "@/components/icone";
import { CabecalhoPagina } from "@/components/campos";
import { MesTile } from "@/components/blocos";
import { dados } from "@/lib/exemplo";
import { desafio, proximoDesafio, resumoDesafio, desafioActual } from "@/lib/analise";
import { diaCurto, nomeMes, percentagem, soMes } from "@/lib/formatos";

/** Os relatórios mensais que a MozCyber envia quando cada desafio fecha. */
export default function Relatorios() {
  const aDecorrer = desafioActual?.estado === "enviado" ? desafioActual : proximoDesafio;
  return (
    <div className="mx-auto max-w-[1180px]">
      <CabecalhoPagina titulo="Relatórios" descricao={`Quando um desafio fecha, o relatório chega por email a ${dados.gestor.email}. Ficam todos aqui.`} />

      <ul className="mt-8 divide-y divide-linha rounded-[14px] border border-linha bg-superficie px-3">
        {dados.relatorios.map((r) => {
          const d = desafio(r.desafioId)!;
          const resumo = resumoDesafio(d);
          return (
            <li key={r.desafioId}>
              <Link href={`/relatorios/${r.desafioId}`} className="group -mx-1 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg px-3 py-4 transition-colors hover:bg-papel/70">
                <MesTile id={d.id} />
                <div className="min-w-0 flex-1 basis-56">
                  <p className="font-semibold leading-tight">Relatório de {nomeMes(d.id)}</p>
                  <p className="mt-0.5 text-sm text-suave">
                    {d.titulo} · enviado a {diaCurto(r.enviadoEm)}
                  </p>
                </div>
                <p className="text-sm text-suave">
                  Participação <span className="font-semibold text-tinta tabular-nums">{Math.round(resumo.conclusao * 100)}%</span> · acerto <span className="font-semibold text-tinta tabular-nums">{percentagem(resumo.acerto)}</span>
                </p>
                <Icone icon={ArrowRight01Icon} size={18} className="hidden text-suave transition-transform group-hover:translate-x-0.5 group-hover:text-tinta sm:block" />
              </Link>
            </li>
          );
        })}
      </ul>

      {aDecorrer && (
        <p className="mt-4 flex items-center gap-2 text-sm text-suave">
          <Icone icon={File02Icon} size={16} /> O relatório de {soMes(aDecorrer.id).toLowerCase()} chega depois de o desafio fechar, a {diaCurto(aDecorrer.fim)}.
        </p>
      )}
    </div>
  );
}
