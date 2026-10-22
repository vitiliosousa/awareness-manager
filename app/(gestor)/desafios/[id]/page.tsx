import { Suspense } from "react";
import { DetalheDesafio } from "@/components/detalhe-desafio";
import { dados } from "@/lib/exemplo";

export function generateStaticParams() {
  return dados.desafios.map((d) => ({ id: d.id }));
}

// Os params (e o filtro no endereço) ficam dentro de Suspense para a navegação ser instantânea (Cache Components).
export default function PaginaDesafio({ params }: PageProps<"/desafios/[id]">) {
  return (
    <Suspense fallback={null}>
      <Conteudo params={params} />
    </Suspense>
  );
}

async function Conteudo({ params }: { params: PageProps<"/desafios/[id]">["params"] }) {
  const { id } = await params;
  return <DetalheDesafio id={id} />;
}
