"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertCircleIcon, AnalyticsUpIcon, ArrowRight01Icon, FireIcon, Mail01Icon, Medal01Icon, Target02Icon } from "@hugeicons/core-free-icons";
import { Icone } from "@/components/icone";
import { CabecalhoDetalhe, Cartao, Indicadores, LinkVoltar, MesTile } from "@/components/blocos";
import { Etiqueta, Vazio } from "@/components/campos";
import { Barra } from "@/components/empresa-visual";
import { BotaoAsync } from "@/components/botao-async";
import { EtiquetaAcesso, EtiquetaEstado } from "@/components/pessoas";
import { Avatar, botaoPrimario, botaoSecundario } from "@/components/ui";
import { enviarConvite } from "@/lib/accoes";
import { useDados, useRecarregar } from "@/lib/dados";
import { acertoDe, colaborador, desafiosComResultados, estadoNoDesafio, porTema, progressoDe, resultadoDe, resumoPessoa } from "@/lib/analise";
import { diaCurto, formatarDia, iniciais, percentagem, plural } from "@/lib/formatos";
import { estadoAcesso } from "@/lib/tipos";

/** A ficha de um colaborador: o que fez em cada desafio, onde acerta menos e o acesso à plataforma. */
export function DetalhePessoa({ id }: { id: string }) {
  useDados();
  const recarregar = useRecarregar();
  const c = colaborador(id);
  const [enviado, setEnviado] = useState<string | null>(null);

  if (!c) {
    return (
      <div className="mx-auto max-w-[1180px]">
        <Vazio
          titulo="Colaborador não encontrado"
          accao={
            <Link href="/colaboradores" className={botaoPrimario}>
              Ver colaboradores
            </Link>
          }
        />
      </div>
    );
  }

  const resumo = resumoPessoa(c);
  const p = progressoDe(c.id);
  const recebidos = desafiosComResultados.filter((d) => c.entrouEm <= d.fim).reverse();
  const temas = porTema(undefined, [c]);
  const acesso = estadoAcesso(c);

  return (
    <div className="mx-auto max-w-[1180px]">
      <LinkVoltar href="/colaboradores" rotulo="Colaboradores" />

      <CabecalhoDetalhe
        rotulo="Resumo do colaborador"
        visual={<Avatar iniciais={iniciais(c.nome)} destaque tamanho="h-16 w-16 text-xl" />}
        etiquetas={
          <>
            <EtiquetaAcesso c={c} />
            {resumo.atencao && <Etiqueta tom="vermelho">{resumo.atencao}</Etiqueta>}
          </>
        }
        titulo={c.nome}
        subtitulo={
          <>
            {c.cargo} · {c.departamento}
          </>
        }
        lateral={
          p && p.xp > 0 ? (
            <div className="rounded-[12px] border border-linha bg-papel px-4 py-2.5 text-center">
              <p className="text-sm text-suave">Nível</p>
              <p className="font-titulo text-2xl font-extrabold leading-none">{p.nivel}</p>
            </div>
          ) : undefined
        }
      />

      <Indicadores
        className="mt-4"
        itens={[
          { icone: Target02Icon, rotulo: "Desafios feitos", valor: `${resumo.feitos}/${resumo.recebidos}`, nota: resumo.recebidos ? `${Math.round((resumo.feitos / resumo.recebidos) * 100)}% dos que recebeu` : "ainda não recebeu nenhum" },
          { icone: AnalyticsUpIcon, rotulo: "Acerto médio", valor: percentagem(resumo.acerto), nota: "nos desafios que fez" },
          { icone: Medal01Icon, rotulo: "Experiência", valor: `${(p?.xp ?? 0).toLocaleString("pt-PT")} XP`, nota: `${plural(p?.licoes ?? 0, "lição", "lições")} · ${plural(p?.distintivos ?? 0, "distintivo", "distintivos")}` },
          { icone: FireIcon, rotulo: "Sequência", valor: String(p?.sequencia ?? 0), nota: "dias seguidos a treinar" },
        ]}
      />

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <Cartao titulo="Desafios" nota="Do mais recente para o mais antigo.">
            {recebidos.length === 0 ? (
              <p className="text-suave">Ainda não recebeu nenhum desafio.</p>
            ) : (
              <ul className="-mx-2 divide-y divide-linha">
                {recebidos.map((d) => {
                  const r = resultadoDe(d, c.id);
                  const estado = estadoNoDesafio(d, c.id);
                  const acerto = r?.concluido ? acertoDe(r) : null;
                  return (
                    <li key={d.id}>
                      <Link href={`/desafios/${d.id}`} className="group flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg px-2 py-3.5 transition-colors hover:bg-papel/70">
                        <MesTile id={d.id} />
                        <div className="min-w-0 flex-1 basis-48">
                          <p className="font-semibold leading-tight">{d.titulo}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <EtiquetaEstado estado={estado} />
                            {r?.concluido && <span className="text-sm text-suave">a {diaCurto(r.concluido)}</span>}
                          </div>
                        </div>
                        <div className="w-16 text-right">
                          <p className="text-sm text-suave">Acerto</p>
                          <p className="font-titulo text-xl font-bold leading-tight tabular-nums">{percentagem(acerto)}</p>
                        </div>
                        <Icone icon={ArrowRight01Icon} size={18} className="hidden text-suave transition-transform group-hover:translate-x-0.5 group-hover:text-tinta sm:block" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Cartao>

          <Cartao titulo="Por tema" nota="Onde acerta mais e onde acerta menos, em todos os desafios que fez.">
            {temas.length === 0 ? (
              <p className="text-suave">Aparece depois do primeiro desafio concluído.</p>
            ) : (
              <ul className="space-y-3.5">
                {temas.map((t, i) => (
                  <li key={t.tema} className="grid grid-cols-[minmax(0,1fr)_minmax(0,160px)_80px] items-center gap-x-4 sm:grid-cols-[minmax(0,1fr)_220px_110px]">
                    <p className="truncate font-medium">{t.nome}</p>
                    <Barra valor={t.acerto / 100} rotulo={`Acerto em ${t.nome}`} />
                    <p className="flex items-center justify-end gap-2 font-semibold tabular-nums">
                      {i === 0 && temas.length > 1 && t.acerto < 70 && <Etiqueta tom="amarelo">Reforçar</Etiqueta>}
                      {t.acerto}%
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Cartao>
        </div>

        <div className="space-y-6">
          <Cartao titulo="Acesso">
            <div className="flex items-center justify-between gap-3">
              <EtiquetaAcesso c={c} />
              {c.ultimoAcesso && <span className="text-sm text-suave">Último acesso a {diaCurto(c.ultimoAcesso)}</span>}
            </div>
            <p className="mt-3 text-sm text-suave">
              {acesso === "sem-convite" && "Ainda não recebeu o link de acesso."}
              {acesso === "convite" && c.convite && `Link enviado a ${diaCurto(c.convite.enviadoEm)}${c.convite.vezes > 1 ? ` (${c.convite.vezes} vezes)` : ""}. Ainda não o abriu.`}
              {acesso === "activo" && `Na plataforma desde ${formatarDia(c.entrouEm)}.`}
            </p>
            <BotaoAsync
              ocupado="A enviar…"
              className={`mt-4 w-full ${acesso === "activo" ? botaoSecundario : botaoPrimario}`}
              aoClicar={async () => {
                setEnviado(await enviarConvite([c.id]));
                await recarregar();
              }}
            >
              <Icone icon={Mail01Icon} size={17} />
              {acesso === "sem-convite" ? "Enviar convite" : acesso === "convite" ? "Reenviar convite" : "Enviar novo link"}
            </BotaoAsync>
            <p className="mt-2 text-sm text-suave" aria-live="polite">
              {enviado ?? "Entra-se por um link pessoal, sem palavra-passe."}
            </p>
          </Cartao>

          <Cartao titulo="Contacto">
            <a href={`mailto:${c.email}`} className="flex items-center gap-2.5 rounded-[10px] border border-linha px-3.5 py-2.5 text-sm font-medium transition-colors hover:border-tinta/40">
              <Icone icon={Mail01Icon} size={17} className="shrink-0 text-suave" />
              <span className="min-w-0 break-all">{c.email}</span>
            </a>
          </Cartao>

          {resumo.atencao && (
            <Cartao titulo="A ter em conta">
              <p className="flex gap-3">
                <Icone icon={AlertCircleIcon} size={20} className="mt-0.5 shrink-0 text-marcador" />
                <span>
                  {resumo.atencao === "Acerta pouco"
                    ? `Acerta em média ${resumo.acerto}% das respostas. Uma conversa curta sobre os temas mais fracos costuma ajudar.`
                    : `Não fez os dois últimos desafios${c.ultimoAcesso ? ` e não entra desde ${diaCurto(c.ultimoAcesso)}` : ""}. Vale a pena perceber se precisa de ajuda ou de tempo.`}
                </span>
              </p>
            </Cartao>
          )}
        </div>
      </div>
    </div>
  );
}
