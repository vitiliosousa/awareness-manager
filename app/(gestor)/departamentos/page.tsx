import { CabecalhoPagina } from "@/components/campos";
import { CaixaLista, Cartao } from "@/components/blocos";
import { BarraEstados, Tendencia } from "@/components/empresa-visual";
import { GraficoLinhas, MapaCalor } from "@/components/graficos";
import { dados } from "@/lib/exemplo";
import { departamentos, desafioActual, desafiosComResultados, historico, porDepartamento, porTema, resumoPessoa } from "@/lib/analise";
import { mesCurto, percentagem, soMes } from "@/lib/formatos";

const grelha = "md:grid-cols-[minmax(0,1.4fr)_70px_minmax(0,1.6fr)_80px_90px_110px] md:gap-x-5";

/** Os departamentos lado a lado: quem participa mais, quem acerta mais, e em que temas. */
export default function Departamentos() {
  const d = desafioActual!;
  const linhas = porDepartamento(d).sort((a, b) => b.conclusao - a.conclusao);
  const temas = dados.temas.filter((t) => desafiosComResultados.some((x) => x.temas.includes(t.id)));
  const mapa = departamentos.map((dep) => {
    const nele = dados.colaboradores.filter((c) => c.departamento === dep);
    const contas = porTema(undefined, nele);
    return temas.map((t) => contas.find((x) => x.tema === t.id)?.acerto ?? null);
  });
  const atencaoDe = (dep: string) => dados.colaboradores.filter((c) => c.departamento === dep && resumoPessoa(c).atencao).length;

  return (
    <div className="mx-auto max-w-[1180px]">
      <CabecalhoPagina titulo="Departamentos" descricao="Compara a participação e o acerto de cada departamento, para saber onde agir primeiro." />

      <div className="mt-8 space-y-6">
        <div>
          <h2 className="mb-3 text-lg font-bold">Desafio de {soMes(d.id).toLowerCase()}</h2>
          <CaixaLista colunas={["Departamento", "Pessoas", "Participação", "Acerto", "Tendência", "Atenção"]} grelha={grelha} cabecalhoClasse="hidden md:grid">
            {linhas.map((l) => {
              const atencao = atencaoDe(l.departamento);
              return (
                <li key={l.departamento} className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 border-b border-linha px-5 py-4 last:border-b-0 ${grelha}`}>
                  <p className="font-semibold">{l.departamento}</p>
                  <p className="hidden tabular-nums md:block">{l.pessoas}</p>
                  <div className="col-span-2 md:col-span-1">
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="text-suave" title={l.emCurso > 0 ? `${l.emCurso} em curso` : undefined}>
                        {l.concluiram} de {l.total}
                      </span>
                      <span className="font-semibold tabular-nums">{Math.round(l.conclusao * 100)}%</span>
                    </div>
                    <BarraEstados concluiram={l.concluiram} emCurso={l.emCurso} total={l.total} rotulo={`Participação em ${l.departamento}`} />
                  </div>
                  <p className="col-start-2 row-start-1 font-titulo text-lg font-bold tabular-nums md:col-start-auto md:row-start-auto">{percentagem(l.acerto)}</p>
                  <div className="hidden md:block">
                    <Tendencia valores={l.tendencia} rotulo={`Acerto de ${l.departamento}`} />
                  </div>
                  <p className={`hidden text-sm md:block ${atencao ? "font-semibold text-risco" : "text-suave"}`}>{atencao ? `${atencao} ${atencao === 1 ? "pessoa" : "pessoas"}` : "Ninguém"}</p>
                </li>
              );
            })}
          </CaixaLista>
        </div>

        <Cartao titulo="Participação ao longo dos meses" nota="A percentagem de cada departamento que concluiu o desafio do mês.">
          <GraficoLinhas
            categorias={desafiosComResultados.map((x) => mesCurto(x.id))}
            series={departamentos.map((dep) => ({
              id: dep,
              nome: dep,
              valores: historico(dados.colaboradores.filter((c) => c.departamento === dep)).map((p) => Math.round(p.conclusao * 100)),
            }))}
            rotulo="Participação por departamento, desafio a desafio"
          />
        </Cartao>

        <Cartao titulo="Departamentos e temas" nota="O acerto de cada departamento em cada tema, em todos os desafios. A vermelho, abaixo de 60%.">
          <MapaCalor linhas={departamentos} colunas={temas.map((t) => t.nome)} valores={mapa} rotulo="Acerto por departamento e tema" />
        </Cartao>
      </div>
    </div>
  );
}
