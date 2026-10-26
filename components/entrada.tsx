"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail01Icon } from "@hugeicons/core-free-icons";
import { Icone, type IconSvgElement } from "@/components/icone";
import { Texto } from "@/components/campos";
import { BotaoAsync } from "@/components/botao-async";
import { Logo, Spinner, botaoPrimario } from "@/components/ui";
import { lerToken, mensagemDeErro } from "@/lib/api";
import { entrarComLink, pedirLink } from "@/lib/dados";

/** Um cartão ao centro, com o logótipo por cima: a entrada, os avisos e os erros. */
export function CartaoEntrada({ titulo, icone = Mail01Icon, children }: { titulo: string; icone?: IconSvgElement; children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <Logo grande />
        </div>
        <section className="mt-10 rounded-[18px] border border-linha bg-superficie p-7">
          <span aria-hidden="true" className="grid h-14 w-14 place-items-center rounded-[14px] bg-energia-claro text-tinta">
            <Icone icon={icone} size={26} />
          </span>
          <h1 className="mt-4 text-2xl font-bold">{titulo}</h1>
          {children}
        </section>
      </div>
    </main>
  );
}

/**
 * A entrada do responsável da empresa: escreve o email e recebe um link de acesso. Não há palavra-passe.
 * Só entra o contacto da empresa (quem recebe os relatórios); a resposta é a mesma para qualquer email, para não revelar quem existe.
 */
export function PedirLink({ expirou = false }: { expirou?: boolean }) {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState<{ link?: string } | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  if (enviado) {
    return (
      <CartaoEntrada titulo="Vê o teu email">
        <p className="mt-2 text-suave">
          Se <span className="font-semibold text-tinta">{email}</span> for o contacto de uma empresa no Vigia, recebe dentro de momentos um link para entrar. O link vale um dia e só se usa uma vez.
        </p>
        {enviado.link && (
          <p className="mt-5 rounded-[10px] bg-papel px-4 py-3 text-sm text-suave">
            Em desenvolvimento os emails não saem.{" "}
            <a href={enviado.link} className="font-semibold text-indigo hover:underline">
              Abrir o link
            </a>
          </p>
        )}
        <button type="button" onClick={() => setEnviado(null)} className="mt-6 font-semibold text-indigo hover:underline">
          Usar outro email
        </button>
      </CartaoEntrada>
    );
  }

  const valido = /^\S+@\S+\.\S+$/.test(email.trim());
  const enviar = async () => {
    setErro(null);
    try {
      setEnviado(await pedirLink(email.trim()));
    } catch (e) {
      setErro(mensagemDeErro(e));
    }
  };

  return (
    <CartaoEntrada titulo="Entrar no Vigia Gestor">
      <p className="mt-2 text-suave">Os resultados do treino da tua empresa. Escreve o email do responsável da empresa no Vigia e enviamos-te um link de acesso. Não há palavra-passe.</p>
      {expirou && (
        <p role="status" className="mt-4 rounded-[10px] bg-papel px-4 py-3 text-suave">
          A tua sessão terminou. Pede um link novo para voltar a entrar.
        </p>
      )}
      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (valido) void enviar();
        }}
      >
        <Texto rotulo="Email" tipo="email" valor={email} aoMudar={setEmail} placeholder="nome@empresa.co.mz" />
        {erro && (
          <p role="alert" className="text-sm font-medium text-risco">
            {erro}
          </p>
        )}
        <BotaoAsync aoClicar={enviar} ocupado="A enviar…" desactivado={!valido} className={`${botaoPrimario} w-full`}>
          Enviar link de acesso
        </BotaoAsync>
      </form>
    </CartaoEntrada>
  );
}

/** A página /entrar, com o aviso de sessão terminada se vier no endereço. */
export function PaginaPedirLink() {
  return <PedirLink expirou={useSearchParams().get("expirou") === "1"} />;
}

/** Troca o link do email por uma sessão e leva o responsável à app. O link só vale uma vez. */
export function EntrarComLink({ token }: { token: string }) {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const feito = useRef(false);

  useEffect(() => {
    if (feito.current) return; // Em desenvolvimento o efeito corre duas vezes; o link só se usa uma.
    feito.current = true;
    entrarComLink(token)
      .then(() => router.replace("/"))
      .catch((e) => {
        // Quem abre o link de novo no mesmo aparelho já tem sessão: segue para a app em vez de ver um erro.
        if (lerToken()) return router.replace("/");
        setErro(mensagemDeErro(e));
      });
  }, [token, router]);

  if (!erro)
    return (
      <main className="grid min-h-screen place-items-center text-suave">
        <p className="flex items-center gap-2" role="status">
          <Spinner /> A entrar…
        </p>
      </main>
    );
  return (
    <CartaoEntrada titulo="Este link já não serve">
      <p className="mt-2 text-suave">{erro}</p>
      <p className="mt-2 text-suave">Cada link só se usa uma vez e vale um dia.</p>
      <Link href="/entrar" className={`${botaoPrimario} mt-6 w-full`}>
        Pedir um link novo
      </Link>
    </CartaoEntrada>
  );
}
