import { Suspense } from "react";
import { BarraLateral } from "@/components/barra-lateral";
import { ConfirmarHost } from "@/components/confirmar";
import { SessaoGestor } from "@/components/sessao-gestor";
import { Logo } from "@/components/ui";

function BarraLateralFallback() {
  return (
    <>
      <header className="nao-imprimir flex items-center bg-noite px-4 py-4 lg:hidden">
        <Logo claro />
      </header>
      <aside className="nao-imprimir sticky top-0 hidden h-screen w-64 shrink-0 bg-noite px-6 py-5 lg:block">
        <Logo claro />
        <div className="mt-10 space-y-4" aria-hidden="true">
          {Array.from({ length: 7 }, (_, i) => <div key={i} className="h-5 rounded bg-white/10" style={{ width: `${62 + (i % 3) * 9}%` }} />)}
        </div>
      </aside>
    </>
  );
}

// A app só se mostra com sessão e com os dados da empresa carregados (ver SessaoGestor).
export default function GestorLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessaoGestor>
    <div className="flex min-h-screen flex-col lg:flex-row">
      <a
        href="#conteudo"
        className="sr-only z-50 rounded-md bg-indigo px-4 py-2 font-semibold text-sobre-cor focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Saltar para o conteúdo
      </a>
      <Suspense fallback={<BarraLateralFallback />}>
        <BarraLateral />
      </Suspense>
      <ConfirmarHost />
      <main id="conteudo" tabIndex={-1} className="min-w-0 flex-1 px-4 py-6 outline-none sm:px-6 lg:px-10 lg:py-9 print:p-0">
        {children}
      </main>
    </div>
    </SessaoGestor>
  );
}
