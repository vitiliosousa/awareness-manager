"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Download04Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { Icone } from "@/components/icone";
import { BarraFiltros, CaixaLista } from "@/components/blocos";
import { CabecalhoPagina, Etiqueta, Pesquisa } from "@/components/campos";
import { BotaoFiltros, FiltrosActivos, type Filtro } from "@/components/filtros";
import { BotaoAsync } from "@/components/botao-async";
import { EtiquetaAcesso, EtiquetaEstado, PessoaNaLinha } from "@/components/pessoas";
import { botaoPrimario, botaoSecundario } from "@/components/ui";
import { dados } from "@/lib/exemplo";
import { descarregarCsv, enviarConvite } from "@/lib/accoes";
import { departamentos, desafioActual, estadoNoDesafio, participantesDe, resumoPessoa, rotuloEstado } from "@/lib/analise";
import { percentagem, plural, soMes } from "@/lib/formatos";
import { estadoAcesso } from "@/lib/tipos";

const grelha = "md:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)_minmax(0,1.2fr)_90px_90px] md:gap-x-5";

/** A equipa toda: quem entrou, quem fez o desafio do mês, quem precisa de acompanhamento. */
export function ListaColaboradores() {
  const params = useSearchParams();
  const d = desafioActual!;
  const [busca, setBusca] = useState("");
  const [departamento, setDepartamento] = useState("todos");
  const [situacao, setSituacao] = useState(params.get("situacao") === "atencao" ? "atencao" : "todas");
  const [acesso, setAcesso] = useState(params.get("acesso") === "por-entrar" ? "por-entrar" : "todos");
  const [convites, setConvites] = useState<string | null>(null);

  const linhas = dados.colaboradores
    .map((c) => ({ c, resumo: resumoPessoa(c), estado: participantesDe(d, [c]).length ? estadoNoDesafio(d, c.id) : null }))
    .sort((a, b) => a.c.nome.localeCompare(b.c.nome, "pt"));
  const termo = busca.trim().toLowerCase();
  const visiveis = linhas.filter(
    (l) =>
      (departamento === "todos" || l.c.departamento === departamento) &&
      (situacao === "todas" || (situacao === "atencao" ? !!l.resumo.atencao : l.estado === situacao)) &&
      (acesso === "todos" || (acesso === "por-entrar" ? estadoAcesso(l.c) !== "activo" : estadoAcesso(l.c) === "activo")) &&
      (!termo || `${l.c.nome} ${l.c.email} ${l.c.cargo}`.toLowerCase().includes(termo)),
  );
  const porEntrar = dados.colaboradores.filter((c) => estadoAcesso(c) !== "activo");
  const mes = soMes(d.id).toLowerCase();

  const filtros: Filtro[] = [
    { id: "departamento", rotulo: "Departamento", valor: departamento, padrao: "todos", aoMudar: setDepartamento, opcoes: [{ valor: "todos", rotulo: "Todos" }, ...departamentos.map((x) => ({ valor: x, rotulo: x }))] },
    {
      id: "situacao",
      rotulo: "Situação",
      valor: situacao,
      padrao: "todas",
      aoMudar: setSituacao,
      opcoes: [
        { valor: "todas", rotulo: "Todas" },
        { valor: "atencao", rotulo: "Precisam de atenção" },
        ...(["concluido", "em-curso", "nao-iniciou"] as const).map((e) => ({ valor: e, rotulo: `${rotuloEstado[e]} (${mes})` })),
      ],
    },
    {
      id: "acesso",
      rotulo: "Acesso",
      valor: acesso,
      padrao: "todos",
      aoMudar: setAcesso,
      opcoes: [
        { valor: "todos", rotulo: "Todos" },
        { valor: "activo", rotulo: "Já entraram" },
        { valor: "por-entrar", rotulo: "Ainda não entraram" },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-[1180px]">
      <CabecalhoPagina
        titulo="Colaboradores"
        descricao={`${plural(dados.colaboradores.length, "pessoa", "pessoas")} da ${dados.empresa.nome} no treino. Para acrescentar ou retirar alguém, fale com a equipa do Vigia.`}
        accoes={
          <>
            <button
              type="button"
              className={botaoSecundario}
              onClick={() =>
                descarregarCsv("colaboradores.csv", [
                  ["Nome", "Email", "Departamento", "Cargo", "Acesso", `Desafio de ${mes}`, "Desafios feitos", "Desafios recebidos", "Acerto médio (%)", "Atenção"],
                  ...linhas.map((l) => [l.c.nome, l.c.email, l.c.departamento, l.c.cargo, estadoAcesso(l.c), l.estado ? rotuloEstado[l.estado] : "", l.resumo.feitos, l.resumo.recebidos, l.resumo.acerto, l.resumo.atencao]),
                ])
              }
            >
              <Icone icon={Download04Icon} size={17} /> Exportar
            </button>
            {porEntrar.length > 0 && (
              <BotaoAsync
                ocupado="A enviar…"
                className={botaoPrimario}
                aoClicar={async () => {
                  const n = await enviarConvite(porEntrar.map((c) => c.id));
                  setConvites(`Link de acesso reenviado a ${plural(n, "pessoa", "pessoas")}.`);
                }}
              >
                <Icone icon={Mail01Icon} size={17} /> Reenviar convites ({porEntrar.length})
              </BotaoAsync>
            )}
          </>
        }
      />

      {convites && (
        <p role="status" className="mt-6 rounded-[10px] bg-mangal-claro px-4 py-3 text-sm font-medium text-mangal">
          {convites}
        </p>
      )}

      <BarraFiltros>
        <Pesquisa rotulo="Procurar colaborador" valor={busca} aoMudar={setBusca} placeholder="Procurar por nome, email ou cargo" className="min-w-0 flex-1 basis-64" />
        <BotaoFiltros filtros={filtros} />
      </BarraFiltros>
      <FiltrosActivos filtros={filtros} />

      <div className="mt-4">
        {visiveis.length === 0 ? (
          <p className="rounded-[14px] border border-linha bg-superficie px-4 py-8 text-center text-suave">Nenhum colaborador corresponde.</p>
        ) : (
          <CaixaLista colunas={["Colaborador", "Departamento", `Desafio de ${mes}`, "Desafios", "Acerto"]} grelha={grelha} cabecalhoClasse="hidden md:grid">
            {visiveis.map(({ c, resumo, estado }) => (
              <li key={c.id} className={`relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 border-b border-linha px-5 py-3 transition-colors last:border-b-0 hover:bg-papel/70 ${grelha}`}>
                <div className="min-w-0">
                  <PessoaNaLinha c={c} />
                  {(estadoAcesso(c) !== "activo" || resumo.atencao) && (
                    <div className="ml-12 mt-1 flex flex-wrap gap-1.5">
                      {estadoAcesso(c) !== "activo" && <EtiquetaAcesso c={c} />}
                      {resumo.atencao && <Etiqueta tom="vermelho">{resumo.atencao}</Etiqueta>}
                    </div>
                  )}
                </div>
                <p className="col-start-1 truncate text-sm text-suave md:col-start-auto md:text-base md:text-tinta">
                  <span className="md:hidden">{c.cargo} · </span>
                  {c.departamento}
                </p>
                <div className="col-start-2 row-start-1 md:col-start-auto md:row-start-auto">{estado ? <EtiquetaEstado estado={estado} /> : <span className="text-sm text-suave">–</span>}</div>
                <p className="hidden tabular-nums md:block">
                  {resumo.feitos}
                  <span className="text-suave">/{resumo.recebidos}</span>
                </p>
                <p className="hidden font-semibold tabular-nums md:block">{percentagem(resumo.acerto)}</p>
              </li>
            ))}
          </CaixaLista>
        )}
        <p className="mt-3 text-sm text-suave">
          {visiveis.length === linhas.length ? plural(linhas.length, "colaborador", "colaboradores") : `${visiveis.length} de ${linhas.length} colaboradores`}
        </p>
      </div>
    </div>
  );
}
