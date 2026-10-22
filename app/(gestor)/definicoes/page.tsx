"use client";

import { useState } from "react";
import { CabecalhoPagina, Interruptor } from "@/components/campos";
import { Cartao } from "@/components/blocos";
import { EscolhaPaleta } from "@/components/escolha-paleta";
import { SeletorTema } from "@/components/seletor-tema";
import { dados } from "@/lib/exemplo";
import { formatarDia } from "@/lib/formatos";

/** Aparência desta app, avisos por email e os dados da conta. */
export default function Definicoes() {
  // Ainda sem API: as escolhas de email ficam só nesta página.
  const [resumo, setResumo] = useState(true);
  const [alerta, setAlerta] = useState(true);
  const [relatorio, setRelatorio] = useState(true);
  const { gestor, empresa } = dados;

  return (
    <div className="mx-auto max-w-[1180px]">
      <CabecalhoPagina titulo="Definições" descricao="Como esta app se mostra neste browser, e que emails recebes." />

      <div className="mt-8 space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Cartao titulo="Modo" nota="Claro, escuro, ou o que o teu computador usar.">
            <SeletorTema />
          </Cartao>
          <Cartao titulo="A tua conta">
            <dl className="space-y-2.5">
              {[
                ["Nome", gestor.nome],
                ["Cargo", gestor.cargo],
                ["Email", gestor.email],
                ["Empresa", `${empresa.nome} · plano ${empresa.plano}`],
                ["Cliente desde", formatarDia(empresa.clienteDesde)],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-wrap justify-between gap-x-4">
                  <dt className="text-suave">{k}</dt>
                  <dd className="min-w-0 break-all font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Cartao>
        </div>

        <Cartao titulo="Emails" nota={`Vão para ${gestor.email}.`}>
          <div className="space-y-4">
            <Interruptor rotulo="Relatório mensal" ajuda="Quando cada desafio fecha, com os resultados da empresa." ligado={relatorio} aoMudar={setRelatorio} />
            <Interruptor rotulo="Resumo semanal" ajuda="Às segundas: quem concluiu o desafio e quem ainda falta." ligado={resumo} aoMudar={setResumo} />
            <Interruptor rotulo="Alerta de participação baixa" ajuda="A meio do mês, se menos de 40% da equipa tiver concluído." ligado={alerta} aoMudar={setAlerta} />
          </div>
        </Cartao>

        <Cartao titulo="Cores" nota="Escolhe a paleta desta app. Cada miniatura mostra a versão clara e a escura.">
          <EscolhaPaleta rotuloId="t-cores" colunas="sm:grid-cols-2 lg:grid-cols-3" />
        </Cartao>
      </div>
    </div>
  );
}
