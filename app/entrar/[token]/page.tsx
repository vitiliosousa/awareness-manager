import { Suspense } from "react";
import { EntrarComLink } from "@/components/entrada";

// O link que chega por email. Os params ficam dentro de Suspense (Cache Components).
export default function PaginaEntrarComLink({ params }: PageProps<"/entrar/[token]">) {
  return (
    <Suspense fallback={null}>
      <Conteudo params={params} />
    </Suspense>
  );
}

async function Conteudo({ params }: { params: PageProps<"/entrar/[token]">["params"] }) {
  const { token } = await params;
  return <EntrarComLink token={token} />;
}
