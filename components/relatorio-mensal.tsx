"use client";

import Link from "next/link";
import { PrinterIcon } from "@hugeicons/core-free-icons";
import { Icone } from "@/components/icone";
import { LinkVoltar } from "@/components/blocos";
import { Vazio } from "@/components/campos";
import { Anel, BarrasHorizontais } from "@/components/graficos";
import { Logo, botaoPrimario } from "@/components/ui";
import { dados } from "@/lib/exemplo";
import { desafio as desafioPorId, estadoNoDesafio, historico, participantesDe, porDepartamento, porTema, resumoDesafio } from "@/lib/analise";
import { diaCurto, formatarDia, nomeMes, percentagem, plural } from "@/lib/formatos";

/** O relatório de um mês, numa folha que se imprime (ou guarda em PDF) tal como chegou por email. */
export function RelatorioMensal({ id }: { id: string }) {
  const relatorio = dados.relatorios.find((r) => r.desafioId === id);
  const d = desafioPorId(id);
  if (!relatorio || !d) {
    return (
      <div className="mx-auto max-w-[1180px]">
        <Vazio
          titulo="Relatório não encontrado"
          accao={
            <Link href="/relatorios" className={botaoPrimario}>
              Ver relatórios
            </Link>
          }
        />
      </div>
    );
  }

  const r = resumoDesafio(d);
  const pontos = historico();
  const i = pontos.findIndex((p) => p.mes === d.id);
  const anterior = i > 0 ? pontos[i - 1] : null;
  const naoFizeram = participantesDe(d).filter((c) => estadoNoDesafio(d, c.id) === "nao-fez");
  const deps = porDepartamento(d).sort((a, b) => b.conclusao - a.conclusao);
  const temas = porTema([d]);
  const delta = (a: number | null, b: number | null | undefined) => (a === null || b === null || b === undefined ? null : a - b);
  const dParticipacao = anterior ? Math.round((r.conclusao - anterior.conclusao) * 100) : null;
  const dAcerto = delta(r.acerto, anterior?.acerto);
  const sinal = (n: number | null) => (n === null ? "" : `${n >= 0 ? "+" : ""}${n} pontos face ao mês anterior`);

  return (
    <div className="mx-auto max-w-[860px]">
      <div className="nao-imprimir flex flex-wrap items-center justify-between gap-3">
        <LinkVoltar href="/relatorios" rotulo="Relatórios" />
        <button type="button" onClick={() => window.print()} className={botaoPrimario}>
          <Icone icon={PrinterIcon} size={17} /> Imprimir ou guardar PDF
        </button>
      </div>

      <article className="mt-4 rounded-[18px] border border-linha bg-superficie p-6 sm:p-10 print:border-0 print:p-0">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-linha pb-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-suave">Relatório mensal</p>
            <h1 className="mt-1 text-3xl font-extrabold">{nomeMes(d.id)}</h1>
            <p className="mt-1 text-suave">
              {dados.empresa.nome} · desafio «{d.titulo}», de {diaCurto(d.inicio)} a {diaCurto(d.fim)}
            </p>
          </div>
          <Logo />
        </header>

        <section className="grid items-center gap-6 border-b border-linha py-6 sm:grid-cols-[150px_minmax(0,1fr)]">
          <Anel valor={r.conclusao} rotulo="participação" />
          <div>
            <p className="text-lg">
              <span className="font-semibold">
                {r.concluiram} de {r.total}
              </span>{" "}
              colaboradores concluíram o desafio, com <span className="font-semibold">{percentagem(r.acerto)}</span> de respostas certas.
            </p>
            <ul className="mt-3 space-y-1 text-sm text-suave">
              {dParticipacao !== null && <li>Participação: {sinal(dParticipacao)}.</li>}
              {dAcerto !== null && <li>Acerto: {sinal(dAcerto)}.</li>}
            </ul>
          </div>
        </section>

        <section className="border-b border-linha py-6">
          <h2 className="text-lg font-bold">Por departamento</h2>
          <p className="mb-4 text-sm text-suave">Percentagem de cada departamento que concluiu.</p>
          <BarrasHorizontais itens={deps.map((l) => ({ id: l.departamento, rotulo: l.departamento, valor: Math.round(l.conclusao * 100) }))} aviso={(v) => v < 40} />
        </section>

        <section className="border-b border-linha py-6">
          <h2 className="text-lg font-bold">Por tema</h2>
          <p className="mb-4 text-sm text-suave">Acerto de quem concluiu. Abaixo de 60% merece reforço.</p>
          <BarrasHorizontais itens={temas.map((t) => ({ id: t.tema, rotulo: t.nome, valor: t.acerto }))} aviso={(v) => v < 60} />
        </section>

        <section className="py-6">
          <h2 className="text-lg font-bold">Não fizeram o desafio</h2>
          {naoFizeram.length === 0 ? (
            <p className="mt-2 text-suave">Toda a equipa concluiu. Parabéns!</p>
          ) : (
            <>
              <p className="mb-3 text-sm text-suave">{plural(naoFizeram.length, "pessoa", "pessoas")}.</p>
              <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                {naoFizeram.map((c) => (
                  <li key={c.id} className="flex justify-between gap-3 border-b border-linha/70 py-1.5 text-sm">
                    <span className="font-medium">{c.nome}</span>
                    <span className="text-suave">{c.departamento}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <footer className="border-t border-linha pt-4 text-sm text-suave">
          Enviado a {formatarDia(relatorio.enviadoEm)} para {relatorio.para} · Vigia, treino de cibersegurança da MozCyber
        </footer>
      </article>
    </div>
  );
}
