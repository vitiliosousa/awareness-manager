"use client";

import { Idea01Icon } from "@hugeicons/core-free-icons";
import { Icone } from "@/components/icone";
import { CabecalhoPagina, Etiqueta } from "@/components/campos";
import { Cartao } from "@/components/blocos";
import { Barra, Tendencia } from "@/components/empresa-visual";
import { GraficoLinhas } from "@/components/graficos";
import { desafiosComResultados, porTema, proximoDesafio, temaAoLongo, nomeTema } from "@/lib/analise";
import { mesCurto, plural, soMes } from "@/lib/formatos";
import { useDados } from "@/lib/dados";

/** Em que temas a equipa acerta menos: é aí que vale a pena insistir. */
export default function Temas() {
  useDados();
  const temas = porTema();
  const fracos = temas.filter((t) => t.acerto < 60);
  const fortes = [...temas].reverse().slice(0, 3);

  return (
    <div className="mx-auto max-w-[1180px]">
      <CabecalhoPagina titulo="Temas" descricao="O acerto da equipa em cada tema, em todos os desafios. Do mais fraco para o mais forte." />

      <div className="mt-8 grid grid-cols-[minmax(0,1fr)] items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <Cartao titulo="Acerto por tema" nota="Abaixo de 60% quer dizer que a equipa ainda cai neste tipo de ataque.">
            <ul className="divide-y divide-linha">
              {temas.map((t, i) => (
                <li key={t.tema} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 gap-y-2 py-3.5 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_200px_70px_70px]">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 font-semibold">
                      {t.nome}
                      {i === 0 && <Etiqueta tom="amarelo">Mais fraco</Etiqueta>}
                    </p>
                    <p className="text-sm text-suave">
                      {plural(t.desafios, "desafio", "desafios")} · {plural(t.respostas, "resposta", "respostas")}
                    </p>
                  </div>
                  <div className="col-span-2 row-start-2 sm:col-span-1 sm:row-start-auto">
                    <Barra valor={t.acerto / 100} rotulo={`Acerto em ${t.nome}`} />
                  </div>
                  <div className="hidden sm:block">
                    <Tendencia valores={temaAoLongo(t.tema)} rotulo={`Acerto em ${t.nome}`} />
                  </div>
                  <p className={`col-start-2 row-start-1 text-right font-titulo text-lg font-bold tabular-nums sm:col-start-auto sm:row-start-auto ${t.acerto < 60 ? "text-risco" : ""}`}>{t.acerto}%</p>
                </li>
              ))}
            </ul>
          </Cartao>

          <Cartao titulo="Ao longo dos meses" nota="Os temas mais fracos, em cada desafio que os treinou.">
            <GraficoLinhas
              categorias={desafiosComResultados.map((d) => mesCurto(d.id))}
              series={temas.slice(0, 4).map((t) => ({ id: t.tema, nome: t.nome, valores: temaAoLongo(t.tema) }))}
              rotulo="Acerto nos temas mais fracos, desafio a desafio"
            />
          </Cartao>
        </div>

        <div className="space-y-6">
          <Cartao titulo="O que fazer">
            <div className="flex gap-3 rounded-[12px] bg-energia-claro p-4">
              <Icone icon={Idea01Icon} size={20} className="mt-0.5 shrink-0" />
              <p>
                {fracos.length > 0 ? (
                  <>
                    Partilha com a equipa um exemplo real de <span className="font-semibold">{fracos[0].nome.toLowerCase()}</span>: um email, uma mensagem ou uma chamada que tenham recebido. Falar de casos concretos ajuda mais do que regras.
                  </>
                ) : (
                  "A equipa está acima de 60% em todos os temas. Continua a lembrar quem falta em cada desafio."
                )}
              </p>
            </div>
            {proximoDesafio && (
              <p className="mt-4 text-sm text-suave">
                O desafio de {soMes(proximoDesafio.id).toLowerCase()} treina {proximoDesafio.temas.map((t) => nomeTema(t).toLowerCase()).join(" e ")}.
              </p>
            )}
          </Cartao>

          <Cartao titulo="Pontos fortes">
            <ul className="space-y-3">
              {fortes.map((t) => (
                <li key={t.tema} className="flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate">{t.nome}</span>
                  <span className="font-semibold tabular-nums">{t.acerto}%</span>
                </li>
              ))}
            </ul>
          </Cartao>
        </div>
      </div>
    </div>
  );
}
