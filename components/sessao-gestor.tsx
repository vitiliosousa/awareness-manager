"use client";

import { Suspense, use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircleIcon } from "@hugeicons/core-free-icons";
import { CartaoEntrada } from "@/components/entrada";
import { Logo, Spinner, botaoPrimario } from "@/components/ui";
import { definirAoExpirar, ErroApi, guardarToken, lerToken, mensagemDeErro } from "@/lib/api";
import { carregarDados, ContextoDados, definirDados } from "@/lib/dados";
import { recalcularAnalise } from "@/lib/analise";
import type { Dados } from "@/lib/tipos";

/** O que se vê enquanto os dados chegam: a barra e o conteúdo em esboço. */
function EmEspera() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <header className="flex items-center bg-noite px-4 py-4 lg:hidden">
        <Logo claro />
      </header>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 bg-noite px-6 py-5 lg:block">
        <Logo claro />
        <div className="mt-10 space-y-4" aria-hidden="true">
          {Array.from({ length: 7 }, (_, i) => <div key={i} className="h-5 rounded bg-white/10" style={{ width: `${62 + (i % 3) * 9}%` }} />)}
        </div>
      </aside>
      <main className="flex flex-1 items-center justify-center p-10 text-suave">
        <p className="flex items-center gap-2" role="status">
          <Spinner /> A carregar os dados da empresa…
        </p>
      </main>
    </div>
  );
}

/** Uma promessa que nunca se cumpre: enquanto os dados não chegam, as páginas ficam suspensas e vê-se o ecrã de espera. */
const semDados = new Promise<never>(() => {});

function EsperaPelosDados({ children }: { children: React.ReactNode }): React.ReactNode {
  use(semDados);
  return children;
}

/**
 * A sessão do responsável da empresa. Sem sessão, vai para a entrada. Com sessão, carrega os dados da empresa da API
 * e só depois mostra a app. Se a sessão acabar a meio (a API responde 401), volta à entrada com o aviso.
 */
export function SessaoGestor({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [estado, setEstado] = useState<"a-carregar" | "pronto" | { erro: string }>("a-carregar");
  const [versao, setVersao] = useState(0);

  const aplicar = useCallback((novos: Dados) => {
    definirDados(novos);
    recalcularAnalise();
    setVersao((v) => v + 1);
    setEstado("pronto");
  }, []);
  // Um 401 já levou à entrada (ver definirAoExpirar).
  const falhar = useCallback((e: unknown) => (e instanceof ErroApi && e.estado === 401 ? undefined : setEstado({ erro: mensagemDeErro(e) })), []);

  const recarregar = useCallback(async () => aplicar(await carregarDados()), [aplicar]);

  useEffect(() => {
    definirAoExpirar(() => {
      guardarToken(null);
      router.replace("/entrar?expirou=1");
    });
    if (!lerToken()) router.replace("/entrar");
    else carregarDados().then(aplicar).catch(falhar);
  }, [router, aplicar, falhar]);

  // As páginas entram na árvore desde o início (também no servidor), suspensas até os dados chegarem.
  if (estado === "a-carregar")
    return (
      <Suspense fallback={<EmEspera />}>
        <EsperaPelosDados>{children}</EsperaPelosDados>
      </Suspense>
    );
  if (estado !== "pronto")
    return (
      <CartaoEntrada titulo="Não foi possível abrir" icone={AlertCircleIcon}>
        <p className="mt-2 text-suave">{estado.erro}</p>
        <button
          type="button"
          onClick={() => {
            setEstado("a-carregar");
            carregarDados().then(aplicar).catch(falhar);
          }}
          className={`${botaoPrimario} mt-6 w-full`}
        >
          Tentar de novo
        </button>
      </CartaoEntrada>
    );
  return <ContextoDados.Provider value={{ versao, recarregar }}>{children}</ContextoDados.Provider>;
}
