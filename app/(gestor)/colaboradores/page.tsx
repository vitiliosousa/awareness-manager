import { Suspense } from "react";
import { ListaColaboradores } from "@/components/lista-colaboradores";

// O filtro vem no endereço (?situacao=atencao), e lê-lo pede Suspense com Cache Components.
export default function Colaboradores() {
  return (
    <Suspense fallback={null}>
      <ListaColaboradores />
    </Suspense>
  );
}
