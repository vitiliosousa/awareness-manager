import { Suspense } from "react";
import { DetalhePessoa } from "@/components/detalhe-pessoa";
import { dados } from "@/lib/exemplo";

export function generateStaticParams() {
  return dados.colaboradores.map((c) => ({ id: c.id }));
}

// Os params ficam dentro de Suspense para a navegação ser instantânea (Cache Components).
export default function PaginaPessoa({ params }: PageProps<"/colaboradores/[id]">) {
  return (
    <Suspense fallback={null}>
      <Conteudo params={params} />
    </Suspense>
  );
}

async function Conteudo({ params }: { params: PageProps<"/colaboradores/[id]">["params"] }) {
  const { id } = await params;
  return <DetalhePessoa id={id} />;
}
