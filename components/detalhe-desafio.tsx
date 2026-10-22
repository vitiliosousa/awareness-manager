"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnalyticsUpIcon, Calendar03Icon, Download04Icon, Mail01Icon, Tick02Icon, Time04Icon, UserRemove01Icon } from "@hugeicons/core-free-icons";
import { Icone } from "@/components/icone";
import { CabecalhoDetalhe, CaixaLista, Cartao, Indicadores, LinkVoltar, MesTile } from "@/components/blocos";
import { Etiqueta, Pesquisa, Vazio } from "@/components/campos";
import { BotaoFiltros, FiltrosActivos, type Filtro } from "@/components/filtros";
import { Separadores } from "@/components/separadores";
import { BarrasHorizontais } from "@/components/graficos";
import { BarraEstados } from "@/components/empresa-visual";
import { BotaoAsync } from "@/components/botao-async";
import { EtiquetaEstado, PessoaNaLinha } from "@/components/pessoas";
import { botaoPrimario, botaoSecundario } from "@/components/ui";
import { HOJE } from "@/lib/exemplo";
import { descarregarCsv, enviarLembrete } from "@/lib/accoes";
import { acertoDe, departamentos, desafio as desafioPorId, estadoNoDesafio, nomeTema, participantesDe, porDepartamento, porTema, resultadoDe, resumoDesafio, rotuloEstado, rotuloEstadoDesafio, tomEstadoDesafio, type EstadoNoDesafio } from "@/lib/analise";
import { diaCurto, diasEntre, nomeMes, percentagem, plural } from "@/lib/formatos";
import type { Desafio } from "@/lib/tipos";

type Separador = "pessoas" | "departamentos" | "temas";

const grelha = "md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,1fr)_80px_90px] md:gap-x-5";

export function DetalheDesafio({ id }: { id: string }) {
  const d = desafioPorId(id);
  const [separador, setSeparador] = useState<Separador>("pessoas");

  if (!d) {
    return (
      <div className="mx-auto max-w-[1180px]">
        <Vazio
          titulo="Desafio não encontrado"
          accao={
            <Link href="/desafios" className={botaoPrimario}>
              Ver desafios
            </Link>
          }
        />
      </div>
    );
  }

  const r = resumoDesafio(d);
  const aberto = d.estado === "enviado";

  return (
    <div className="mx-auto max-w-[1180px]">
      <LinkVoltar href="/desafios" rotulo="Desafios" />

      <CabecalhoDetalhe
        rotulo="Resumo do desafio"
        visual={<MesTile id={d.id} grande />}
        etiquetas={
          <>
            <Etiqueta tom={tomEstadoDesafio[d.estado]}>{rotuloEstadoDesafio[d.estado]}</Etiqueta>
            <span className="text-sm text-suave">{nomeMes(d.id)}</span>
          </>
        }
        titulo={d.titulo}
        subtitulo={
          <>
            {diaCurto(d.inicio)} a {diaCurto(d.fim)} · {plural(d.exercicios, "exercício", "exercícios")} · {d.temas.map(nomeTema).join(", ")}
          </>
        }
        nota={d.estado === "agendado" ? undefined : aberto ? `Ainda a decorrer: faltam ${plural(diasEntre(HOJE, d.fim), "dia", "dias")}. Os números mudam à medida que a equipa conclui.` : "Fechado. Os números já não mudam."}
      />

      {d.estado === "agendado" ? (
        <div className="mt-6">
          <Vazio titulo={`Começa a ${diaCurto(d.inicio)}`} texto={`${d.resumo} Quando sair, cada colaborador recebe um email com o link, e os resultados aparecem aqui.`} />
        </div>
      ) : (
        <>
          <Indicadores
            className="mt-4"
            itens={[
              { icone: Tick02Icon, rotulo: "Participação", valor: `${Math.round(r.conclusao * 100)}%`, nota: `${r.concluiram} de ${r.total} concluíram` },
              { icone: AnalyticsUpIcon, rotulo: "Acerto médio", valor: percentagem(r.acerto), nota: "de quem concluiu" },
              { icone: Time04Icon, rotulo: "Em curso", valor: String(r.emCurso), nota: aberto ? "começaram e não acabaram" : "o desafio já fechou" },
              { icone: UserRemove01Icon, rotulo: aberto ? "Não começaram" : "Não fizeram", valor: String(aberto ? r.faltam : r.total - r.concluiram), nota: aberto ? "ainda vão a tempo" : "não concluíram a tempo" },
            ]}
          />

          <div className="mt-8">
            <Separadores
              idBase="desafio"
              rotulo="Secções do desafio"
              valor={separador}
              aoMudar={setSeparador}
              itens={[
                { id: "pessoas", rotulo: "Colaboradores", contagem: r.total },
                { id: "departamentos", rotulo: "Por departamento" },
                { id: "temas", rotulo: "Por tema", contagem: d.temas.length },
              ]}
            />
          </div>

          <div id="desafio-painel" role="tabpanel" aria-labelledby={`desafio-${separador}`} className="mt-6">
            {separador === "pessoas" && <PainelPessoas d={d} />}
            {separador === "departamentos" && <PainelDepartamentos d={d} />}
            {separador === "temas" && (
              <Cartao titulo="Por tema" nota="O acerto de quem concluiu, em cada tema do desafio. Abaixo de 60% merece reforço.">
                <BarrasHorizontais itens={porTema([d]).map((t) => ({ id: t.tema, rotulo: t.nome, valor: t.acerto }))} aviso={(v) => v < 60} />
              </Cartao>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- Colaboradores ---------- */

function PainelPessoas({ d }: { d: Desafio }) {
  const params = useSearchParams();
  const aberto = d.estado === "enviado";
  const estadosPossiveis: EstadoNoDesafio[] = aberto ? ["concluido", "em-curso", "nao-iniciou"] : ["concluido", "nao-fez"];
  const inicial = params.get("estado") ?? "todos";
  const [estado, setEstado] = useState(estadosPossiveis.includes(inicial as EstadoNoDesafio) ? inicial : "todos");
  const [departamento, setDepartamento] = useState("todos");
  const [busca, setBusca] = useState("");
  const [lembrete, setLembrete] = useState<string | null>(null);

  const linhas = participantesDe(d)
    .map((c) => {
      const res = resultadoDe(d, c.id);
      return { c, estado: estadoNoDesafio(d, c.id), acerto: res?.concluido ? acertoDe(res) : null, concluido: res?.concluido ?? null };
    })
    .sort((a, b) => a.c.nome.localeCompare(b.c.nome, "pt"));
  const termo = busca.trim().toLowerCase();
  const visiveis = linhas.filter((l) => (estado === "todos" || l.estado === estado) && (departamento === "todos" || l.c.departamento === departamento) && (!termo || `${l.c.nome} ${l.c.email} ${l.c.cargo}`.toLowerCase().includes(termo)));
  const faltam = linhas.filter((l) => l.estado === "em-curso" || l.estado === "nao-iniciou");

  const filtros: Filtro[] = [
    { id: "estado", rotulo: "Situação", valor: estado, padrao: "todos", aoMudar: setEstado, opcoes: [{ valor: "todos", rotulo: "Todas" }, ...estadosPossiveis.map((e) => ({ valor: e, rotulo: rotuloEstado[e] }))] },
    { id: "departamento", rotulo: "Departamento", valor: departamento, padrao: "todos", aoMudar: setDepartamento, opcoes: [{ valor: "todos", rotulo: "Todos" }, ...departamentos.map((x) => ({ valor: x, rotulo: x }))] },
  ];

  return (
    <Cartao
      titulo="Colaboradores"
      nota={aberto ? "Quem já concluiu, quem está a meio e quem ainda não começou." : "Quem concluiu o desafio e quem não o fez."}
      accao={
        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            className={botaoSecundario}
            onClick={() =>
              descarregarCsv(`desafio-${d.id}.csv`, [
                ["Nome", "Email", "Departamento", "Cargo", "Situação", "Acerto (%)", "Concluído em"],
                ...linhas.map((l) => [l.c.nome, l.c.email, l.c.departamento, l.c.cargo, rotuloEstado[l.estado], l.acerto, l.concluido]),
              ])
            }
          >
            <Icone icon={Download04Icon} size={17} /> Exportar
          </button>
          {aberto && faltam.length > 0 && (
            <BotaoAsync
              ocupado="A enviar…"
              className={botaoPrimario}
              aoClicar={async () => {
                const n = await enviarLembrete(faltam.map((l) => l.c.id));
                setLembrete(`Lembrete enviado a ${plural(n, "pessoa", "pessoas")}.`);
              }}
            >
              <Icone icon={Mail01Icon} size={17} /> Lembrar quem falta ({faltam.length})
            </BotaoAsync>
          )}
        </div>
      }
    >
      {lembrete && (
        <p role="status" className="mb-4 rounded-[10px] bg-mangal-claro px-4 py-3 text-sm font-medium text-mangal">
          {lembrete}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Pesquisa rotulo="Procurar colaborador" valor={busca} aoMudar={setBusca} placeholder="Procurar por nome, email ou cargo" className="min-w-0 flex-1 basis-64" />
        <BotaoFiltros filtros={filtros} />
      </div>
      <FiltrosActivos filtros={filtros} />

      <div className="mt-4">
        {visiveis.length === 0 ? (
          <p className="rounded-[14px] border border-linha px-4 py-8 text-center text-suave">Ninguém corresponde.</p>
        ) : (
          <CaixaLista colunas={["Colaborador", "Departamento", "Situação", "Acerto", "Concluiu"]} grelha={grelha} cabecalhoClasse="hidden md:grid">
            {visiveis.map((l) => (
              <li key={l.c.id} className={`relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 border-b border-linha px-5 py-3 transition-colors last:border-b-0 hover:bg-papel/70 ${grelha}`}>
                <PessoaNaLinha c={l.c} />
                <p className="col-start-1 truncate text-sm text-suave md:col-start-auto md:text-base md:text-tinta">{l.c.departamento}</p>
                <div className="col-start-2 row-start-1 md:col-start-auto md:row-start-auto">
                  <EtiquetaEstado estado={l.estado} />
                </div>
                <p className="hidden font-semibold tabular-nums md:block">{percentagem(l.acerto)}</p>
                <p className="hidden text-sm text-suave md:block">{l.concluido ? diaCurto(l.concluido) : "–"}</p>
              </li>
            ))}
          </CaixaLista>
        )}
      </div>
    </Cartao>
  );
}

/* ---------- Departamentos ---------- */

function PainelDepartamentos({ d }: { d: Desafio }) {
  const linhas = porDepartamento(d).sort((a, b) => b.conclusao - a.conclusao);
  return (
    <Cartao titulo="Por departamento" nota="A participação e o acerto de cada departamento neste desafio.">
      <ul className="divide-y divide-linha">
        {linhas.map((l) => (
          <li key={l.departamento} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_5rem]">
            <div className="min-w-0">
              <p className="truncate font-semibold">{l.departamento}</p>
              <p className="text-sm text-suave">
                {l.concluiram} de {l.total} concluíram{l.emCurso > 0 && ` · ${l.emCurso} em curso`}
              </p>
            </div>
            <div className="col-span-2 row-start-2 sm:col-span-1 sm:row-start-auto">
              <BarraEstados concluiram={l.concluiram} emCurso={l.emCurso} total={l.total} rotulo={`Participação em ${l.departamento}`} />
            </div>
            <p className="text-right">
              <span className="block font-titulo text-lg font-bold leading-tight tabular-nums">{percentagem(l.acerto)}</span>
              <span className="text-sm text-suave">acerto</span>
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-5 flex flex-wrap gap-x-5 gap-y-1 border-t border-linha pt-4 text-sm text-suave">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-3 w-3 rounded-[3px] bg-energia" /> Concluíram
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-3 w-3 rounded-[3px] bg-energia/40" /> Em curso
        </span>
        <span className="inline-flex items-center gap-2">
          <Icone icon={Calendar03Icon} size={14} /> {d.estado === "enviado" ? `Até ${diaCurto(d.fim)}` : `Fechou a ${diaCurto(d.fim)}`}
        </span>
      </p>
    </Cartao>
  );
}
