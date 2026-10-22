"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertCircleIcon, AnalyticsUpIcon, ArrowRight01Icon, Calendar03Icon, Mail01Icon, Tick02Icon, UserMultiple02Icon, UserWarning01Icon } from "@hugeicons/core-free-icons";
import { Icone } from "@/components/icone";
import { CabecalhoPagina, Etiqueta } from "@/components/campos";
import { Cartao, Indicadores, MesTile } from "@/components/blocos";
import { GraficoEvolucao } from "@/components/empresa-visual";
import { Anel, BarraPartes, BarrasHorizontais } from "@/components/graficos";
import { BotaoAsync } from "@/components/botao-async";
import { Avatar, botaoSecundario } from "@/components/ui";
import { dados, HOJE } from "@/lib/exemplo";
import { enviarLembrete } from "@/lib/accoes";
import { desafioActual, estadoNoDesafio, historico, participantesDe, porDepartamento, porTema, progressoDe, proximoDesafio, resumoDesafio, resumoPessoa, rotuloEstadoDesafio, tomEstadoDesafio } from "@/lib/analise";
import { diaCurto, diasEntre, formatarDia, iniciais, nomeMes, percentagem, plural, soMes } from "@/lib/formatos";
import { estadoAcesso } from "@/lib/tipos";

type Tarefa = { texto: string; href: string; rotulo: string; urgente?: boolean };

/** O primeiro ecrã do gestor: como vai o desafio do mês, quem falta e o que merece atenção. */
export default function Inicio() {
  const { colaboradores, gestor, empresa } = dados;
  const d = desafioActual!;
  const resumo = resumoDesafio(d);
  const evolucao = historico();
  const anterior = evolucao.at(-2);
  const aberto = d.estado === "enviado";
  const diasRestantes = aberto ? diasEntre(HOJE, d.fim) : 0;
  const faltam = participantesDe(d).filter((c) => estadoNoDesafio(d, c.id) === "nao-iniciou" || estadoNoDesafio(d, c.id) === "em-curso");
  const naoComecaram = faltam.filter((c) => estadoNoDesafio(d, c.id) === "nao-iniciou");
  const activos = colaboradores.filter((c) => estadoAcesso(c) === "activo").length;
  const semAcesso = colaboradores.filter((c) => estadoAcesso(c) !== "activo");
  const atencao = colaboradores.filter((c) => resumoPessoa(c).atencao);
  const temaFraco = porTema()[0];
  const ultimoRelatorio = dados.relatorios[0];
  const [lembrete, setLembrete] = useState<string | null>(null);

  const departamentos = porDepartamento(d)
    .map((l) => ({ id: l.departamento, rotulo: l.departamento, valor: Math.round(l.conclusao * 100) }))
    .sort((a, b) => b.valor - a.valor);

  // Quem mais se destacou no treino: pontos de experiência, de quem tem acesso.
  const destaques = colaboradores
    .map((c) => ({ c, p: progressoDe(c.id) }))
    .filter((x) => x.p && x.p.xp > 0)
    .sort((a, b) => b.p!.xp - a.p!.xp)
    .slice(0, 5);

  const tarefas: Tarefa[] = [];
  if (aberto && naoComecaram.length > 0) tarefas.push({ urgente: diasRestantes <= 10, texto: `${plural(naoComecaram.length, "pessoa ainda não começou", "pessoas ainda não começaram")} o desafio de ${soMes(d.id).toLowerCase()}. Faltam ${plural(diasRestantes, "dia", "dias")}.`, href: `/desafios/${d.id}?estado=nao-iniciou`, rotulo: "Ver quem" });
  if (atencao.length > 0) tarefas.push({ texto: `${plural(atencao.length, "colaborador precisa", "colaboradores precisam")} de acompanhamento.`, href: "/colaboradores?situacao=atencao", rotulo: "Ver quem" });
  if (semAcesso.length > 0) tarefas.push({ texto: `${plural(semAcesso.length, "colaborador ainda não entrou", "colaboradores ainda não entraram")} na plataforma.`, href: "/colaboradores?acesso=por-entrar", rotulo: "Enviar convites" });
  if (temaFraco) tarefas.push({ texto: `O tema mais fraco é «${temaFraco.nome}», com ${temaFraco.acerto}% de acerto.`, href: "/temas", rotulo: "Ver temas" });
  if (ultimoRelatorio) tarefas.push({ texto: `O relatório de ${soMes(ultimoRelatorio.desafioId).toLowerCase()} chegou a ${diaCurto(ultimoRelatorio.enviadoEm)}`, href: `/relatorios/${ultimoRelatorio.desafioId}`, rotulo: "Abrir relatório" });

  const variacao = (agora: number | null, antes: number | null | undefined) => (agora === null || antes === null || antes === undefined ? null : agora - antes);
  const varAcerto = variacao(resumo.acerto, anterior?.acerto);

  return (
    <div className="mx-auto max-w-[1180px]">
      <CabecalhoPagina titulo={`Olá, ${gestor.nome.split(" ")[0]}`} descricao={`Como está a ${empresa.nome} no treino de cibersegurança. Dados de ${formatarDia(HOJE)}.`} />

      <Indicadores
        className="mt-8"
        itens={[
          { rotulo: "Participação no desafio", valor: `${Math.round(resumo.conclusao * 100)}%`, nota: `${resumo.concluiram} de ${resumo.total} concluíram`, icone: Tick02Icon, href: `/desafios/${d.id}` },
          { rotulo: "Acerto médio", valor: percentagem(resumo.acerto), nota: varAcerto === null ? "respostas certas" : `${varAcerto >= 0 ? "+" : ""}${varAcerto} pontos face a ${soMes(anterior!.mes).toLowerCase()}`, icone: AnalyticsUpIcon, href: "/temas" },
          { rotulo: "Colaboradores activos", valor: String(activos), nota: `de ${colaboradores.length} já entraram`, icone: UserMultiple02Icon, href: "/colaboradores" },
          { rotulo: "Precisam de atenção", valor: String(atencao.length), nota: "deixaram de treinar ou acertam pouco", icone: UserWarning01Icon, href: "/colaboradores?situacao=atencao" },
        ]}
      />

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Cartao
            titulo={`Desafio de ${nomeMes(d.id)}`}
            nota={d.titulo}
            accao={
              <span className="flex items-center gap-3">
                <Etiqueta tom={tomEstadoDesafio[d.estado]}>{rotuloEstadoDesafio[d.estado]}</Etiqueta>
                <Link href={`/desafios/${d.id}`} className="text-sm font-semibold text-indigo hover:underline">
                  Ver desafio
                </Link>
              </span>
            }
          >
            <div className="grid items-center gap-6 sm:grid-cols-[150px_minmax(0,1fr)]">
              <Anel valor={resumo.conclusao} rotulo="concluíram" />
              <div>
                <p className="text-sm text-suave">
                  {aberto ? `Termina a ${diaCurto(d.fim)}, daqui a ${plural(diasRestantes, "dia", "dias")}` : `Fechou a ${diaCurto(d.fim)}`} · acerto médio {percentagem(resumo.acerto)}
                </p>
                <div className="mt-4">
                  <BarraPartes
                    rotulo="Situação dos colaboradores"
                    partes={[
                      { nome: "Concluíram", valor: resumo.concluiram },
                      { nome: "Em curso", valor: resumo.emCurso },
                      { nome: "Não começaram", valor: resumo.faltam },
                    ]}
                  />
                </div>
                {aberto && faltam.length > 0 && (
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <BotaoAsync
                      ocupado="A enviar…"
                      className={botaoSecundario}
                      aoClicar={async () => {
                        const n = await enviarLembrete(faltam.map((c) => c.id));
                        setLembrete(`Lembrete enviado a ${plural(n, "pessoa", "pessoas")}.`);
                      }}
                    >
                      <Icone icon={Mail01Icon} size={17} /> Lembrar quem falta ({faltam.length})
                    </BotaoAsync>
                    <p className="text-sm text-suave" aria-live="polite">
                      {lembrete ?? "Vai um email a quem ainda não concluiu."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Cartao>

          <Cartao titulo="Evolução" nota="Participação e acerto médio da empresa, desafio a desafio.">
            <GraficoEvolucao pontos={evolucao} />
          </Cartao>

          <Cartao
            titulo="Participação por departamento"
            nota={`Quem já concluiu o desafio de ${soMes(d.id).toLowerCase()}, em cada departamento.`}
            accao={
              <Link href="/departamentos" className="text-sm font-semibold text-indigo hover:underline">
                Comparar
              </Link>
            }
          >
            <BarrasHorizontais itens={departamentos} aviso={(v) => v < 40} />
          </Cartao>
        </div>

        <div className="space-y-6">
          <Cartao titulo="A tratar" nota={tarefas.length ? plural(tarefas.length, "coisa à espera", "coisas à espera") : undefined}>
            {tarefas.length === 0 ? (
              <p className="text-suave">Nada pendente.</p>
            ) : (
              <ul className="divide-y divide-linha">
                {tarefas.map((t) => (
                  <li key={t.texto} className="py-3 first:pt-0 last:pb-0">
                    <p className="flex items-start gap-2">
                      {t.urgente && <Icone icon={AlertCircleIcon} size={18} className="mt-0.5 shrink-0 text-risco" />}
                      {t.texto}
                    </p>
                    <Link href={t.href} className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-indigo hover:underline">
                      {t.rotulo} <Icone icon={ArrowRight01Icon} size={14} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Cartao>

          <Cartao titulo="Quem mais treina" nota="Pontos de experiência na app, desde o início.">
            <ol className="space-y-3">
              {destaques.map(({ c, p }, i) => (
                <li key={c.id} className="flex items-center gap-3">
                  <span className="w-4 text-right font-titulo font-bold tabular-nums text-suave">{i + 1}</span>
                  <Avatar iniciais={iniciais(c.nome)} destaque={i === 0} />
                  <div className="min-w-0 flex-1">
                    <Link href={`/colaboradores/${c.id}`} className="block truncate font-semibold leading-tight hover:underline">
                      {c.nome}
                    </Link>
                    <p className="truncate text-sm text-suave">{c.departamento}</p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{p!.xp.toLocaleString("pt-PT")} XP</span>
                </li>
              ))}
            </ol>
          </Cartao>

          {proximoDesafio && (
            <Cartao titulo="Próximo desafio">
              <div className="flex items-start gap-4">
                <MesTile id={proximoDesafio.id} />
                <div className="min-w-0">
                  <p className="font-semibold leading-tight">{proximoDesafio.titulo}</p>
                  <p className="mt-1 text-sm text-suave">{proximoDesafio.resumo}</p>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-suave">
                    <Icone icon={Calendar03Icon} size={15} /> Começa a {diaCurto(proximoDesafio.inicio)}
                  </p>
                </div>
              </div>
            </Cartao>
          )}
        </div>
      </div>
    </div>
  );
}
