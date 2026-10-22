import { Suspense } from "react";
import { RelatorioMensal } from "@/components/relatorio-mensal";
import { dados } from "@/lib/exemplo";

export function generateStaticParams() {
  return dados.relatorios.map((r) => ({ id: r.desafioId }));
}

export default function PaginaRelatorio({ params }: PageProps<"/relatorios/[id]">) {
  return (
    <Suspense fallback={null}>
      <Conteudo params={params} />
    </Suspense>
  );
}

async function Conteudo({ params }: { params: PageProps<"/relatorios/[id]">["params"] }) {
  const { id } = await params;
  return <RelatorioMensal id={id} />;
}
