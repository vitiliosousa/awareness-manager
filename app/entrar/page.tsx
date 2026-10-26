import { Suspense } from "react";
import { PaginaPedirLink } from "@/components/entrada";

// A entrada do responsável da empresa. O aviso de sessão terminada vem no endereço (?expirou=1), e lê-lo pede Suspense.
export default function Entrar() {
  return (
    <Suspense fallback={null}>
      <PaginaPedirLink />
    </Suspense>
  );
}
