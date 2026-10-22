"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnalyticsUpIcon, Cancel01Icon, DashboardSquare01Icon, Idea01Icon, Layers01Icon, Logout01Icon, Menu01Icon, Settings02Icon, SidebarLeft01Icon, SidebarRight01Icon, Target02Icon, UserMultiple02Icon } from "@hugeicons/core-free-icons";
import { Icone, type IconSvgElement } from "@/components/icone";
import { Logo } from "@/components/ui";
import { Monograma } from "@/components/empresa-visual";
import { confirmar } from "@/components/confirmar";
import { dados } from "@/lib/exemplo";
import { alternarBarra, useBarraRecolhida } from "@/lib/preferencias";

type Ligacao = { href: string; rotulo: string; icone: IconSvgElement };

const grupos: { titulo: string; ligacoes: Ligacao[] }[] = [
  {
    titulo: "Visão geral",
    ligacoes: [{ href: "/", rotulo: "Início", icone: DashboardSquare01Icon }],
  },
  {
    titulo: "Equipa",
    ligacoes: [
      { href: "/colaboradores", rotulo: "Colaboradores", icone: UserMultiple02Icon },
      { href: "/departamentos", rotulo: "Departamentos", icone: Layers01Icon },
    ],
  },
  {
    titulo: "Treino",
    ligacoes: [
      { href: "/desafios", rotulo: "Desafios", icone: Target02Icon },
      { href: "/temas", rotulo: "Temas", icone: Idea01Icon },
    ],
  },
  {
    titulo: "Resultados",
    ligacoes: [{ href: "/relatorios", rotulo: "Relatórios", icone: AnalyticsUpIcon }],
  },
  {
    titulo: "Conta",
    ligacoes: [{ href: "/definicoes", rotulo: "Definições", icone: Settings02Icon }],
  },
];

/** Etiqueta que aparece ao lado de um ícone quando a barra está recolhida. */
function Dica({ texto }: { texto: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-tinta-2 px-2.5 py-1.5 text-sm font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
    >
      {texto}
    </span>
  );
}

function LogoMarca() {
  return (
    <svg width="30" height="30" viewBox="0 0 28 28" aria-hidden="true">
      <rect width="28" height="28" rx="7" fill="#ffffff" />
      <path d="M5 16.5 L23 11" stroke="var(--marcador)" strokeWidth="6" strokeLinecap="round" />
      <path d="M8 8 L14 20 L20 8" fill="none" stroke="var(--noite)" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/** O logótipo com a etiqueta "Gestor", para não se confundir com a app do formando nem com o admin. */
function LogoGestor() {
  return (
    <span className="flex items-center gap-2">
      <Logo claro />
      <span className="rounded bg-energia px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-noite">Gestor</span>
    </span>
  );
}

/** A empresa de quem está a gerir, por baixo do logótipo. */
function EmpresaActual({ recolhida }: { recolhida: boolean }) {
  const { empresa } = dados;
  if (recolhida) {
    return (
      <div className="group relative mx-auto mt-5 w-fit" tabIndex={0} aria-label={empresa.nome}>
        <Monograma nome={empresa.nome} logo={empresa.logo} tamanho="sm" />
        <Dica texto={empresa.nome} />
      </div>
    );
  }
  return (
    <div className="mt-5 flex items-center gap-3 rounded-[12px] bg-white/5 p-2.5 [&_span]:border-white/10 [&_span]:bg-white/10 [&_span]:text-white [&_span]:shadow-none">
      <Monograma nome={empresa.nome} logo={empresa.logo} tamanho="sm" />
      <div className="min-w-0">
        <p className="truncate font-semibold text-white">{empresa.nome}</p>
        <p className="truncate text-sm text-white/60">Plano {empresa.plano}</p>
      </div>
    </div>
  );
}

export function BarraLateral() {
  const caminho = usePathname();
  const recolhida = useBarraRecolhida();

  return (
    <>
      <BarraMovel caminho={caminho} />
      <aside
        className={`nao-imprimir sticky top-0 hidden h-screen shrink-0 flex-col bg-noite py-4 text-white/90 transition-[width] duration-200 lg:flex ${
          recolhida ? "w-[76px] px-3" : "w-64 px-4"
        }`}
      >
        {recolhida ? (
          // Recolhida: o logótipo é o próprio botão; ao passar o rato mostra o ícone de expandir.
          <button
            type="button"
            onClick={alternarBarra}
            aria-label="Expandir barra lateral"
            aria-expanded={false}
            className="group relative mx-auto grid h-10 w-10 place-items-center rounded-md transition-colors hover:bg-white/10"
          >
            <span className="transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0">
              <LogoMarca />
            </span>
            <span className="absolute inset-0 grid place-items-center text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <Icone icon={SidebarRight01Icon} size={20} />
            </span>
            <Dica texto="Expandir" />
          </button>
        ) : (
          <div className="flex items-center justify-between pl-2">
            <LogoGestor />
            <button
              type="button"
              onClick={alternarBarra}
              aria-label="Recolher barra lateral"
              aria-expanded
              className="grid h-9 w-9 place-items-center rounded-md text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Icone icon={SidebarLeft01Icon} size={19} />
            </button>
          </div>
        )}

        <EmpresaActual recolhida={recolhida} />
        <Navegacao recolhida={recolhida} caminho={caminho} rolar />
      </aside>
    </>
  );
}

/** Uma ligação do menu, igual em todo o lado. */
function ItemMenu({ ligacao, caminho, recolhida, aoNavegar }: { ligacao: Ligacao; caminho: string; recolhida: boolean; aoNavegar?: () => void }) {
  const { href, rotulo, icone } = ligacao;
  const activo = href === "/" ? caminho === "/" : caminho.startsWith(href);
  return (
    <li>
      <Link
        href={href}
        onClick={aoNavegar}
        aria-current={activo ? "page" : undefined}
        aria-label={recolhida ? rotulo : undefined}
        className={`group relative flex items-center gap-3 rounded-md py-2.5 font-medium transition-colors ${recolhida ? "justify-center px-0" : "px-3"} ${activo ? "bg-white/10 text-white" : "hover:bg-white/5 hover:text-white"}`}
      >
        {activo && <span aria-hidden="true" className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-energia" />}
        <Icone icon={icone} size={20} className={activo ? "text-energia" : ""} />
        {recolhida ? <Dica texto={rotulo} /> : rotulo}
      </Link>
    </li>
  );
}

/** As ligações principais, iguais na barra lateral e no menu do telemóvel. Na barra lateral só este menu rola. */
function Navegacao({ recolhida, caminho, aoNavegar, rolar = false }: { recolhida: boolean; caminho: string; aoNavegar?: () => void; rolar?: boolean }) {
  const nav = useRef<HTMLElement>(null);
  const router = useRouter();
  // A página activa fica sempre à vista, mesmo que o menu esteja rolado para outro sítio.
  useEffect(() => {
    nav.current?.querySelector("[aria-current=page]")?.scrollIntoView({ block: "nearest" });
  }, [caminho]);
  return (
    <nav ref={nav} aria-label="Principal" className={`flex flex-col gap-6 ${rolar ? "barra-rolar -mr-2 mt-6 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-2" : "mt-8"}`}>
      {grupos.map((g) => (
        <div key={g.titulo}>
          {recolhida ? <div aria-hidden="true" className="mx-auto mb-2 h-px w-8 bg-white/10" /> : <p className="mb-1.5 px-3 text-sm text-white/60">{g.titulo}</p>}
          <ul className="flex flex-col gap-0.5">
            {g.ligacoes.map((l) => (
              <ItemMenu key={l.href} ligacao={l} caminho={caminho} recolhida={recolhida} aoNavegar={aoNavegar} />
            ))}
            {g.titulo === "Conta" && (
              <li>
                <button
                  type="button"
                  aria-label={recolhida ? "Terminar sessão" : undefined}
                  onClick={async () => {
                    if (await confirmar({ titulo: "Terminar sessão?", texto: "Para voltar, abre o link de acesso que recebes por email.", confirmar: "Terminar sessão" })) {
                      aoNavegar?.();
                      router.push("/sessao-terminada");
                    }
                  }}
                  className={`group relative flex w-full items-center gap-3 rounded-md py-2.5 font-medium transition-colors hover:bg-white/5 hover:text-white ${recolhida ? "justify-center px-0" : "px-3"}`}
                >
                  <Icone icon={Logout01Icon} size={20} />
                  {recolhida ? <Dica texto="Terminar sessão" /> : "Terminar sessão"}
                </button>
              </li>
            )}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/** No telemóvel e em ecrãs pequenos: uma barra no topo e o menu num painel que abre por cima. */
function BarraMovel({ caminho }: { caminho: string }) {
  const [aberto, setAberto] = useState(false);
  const fechar = () => setAberto(false);

  useEffect(() => {
    if (!aberto) return;
    const tecla = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") setAberto(false);
    };
    document.addEventListener("keydown", tecla);
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", tecla);
      document.body.style.overflow = antes;
    };
  }, [aberto]);

  return (
    <div className="nao-imprimir lg:hidden">
      <header className="sticky top-0 z-40 flex items-center justify-between bg-noite px-4 py-3">
        <LogoGestor />
        <button
          type="button"
          onClick={() => setAberto(true)}
          aria-label="Abrir menu"
          aria-expanded={aberto}
          className="grid h-11 w-11 place-items-center rounded-md text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Icone icon={Menu01Icon} size={24} />
        </button>
      </header>

      {aberto && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" aria-label="Fechar menu" onClick={fechar} className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col overflow-y-auto bg-noite px-4 py-5 text-white/80 shadow-2xl">
            <div className="flex items-center justify-between pl-2">
              <LogoGestor />
              <button
                type="button"
                onClick={fechar}
                aria-label="Fechar menu"
                className="grid h-11 w-11 place-items-center rounded-md text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Icone icon={Cancel01Icon} size={22} />
              </button>
            </div>
            <EmpresaActual recolhida={false} />
            <Navegacao recolhida={false} caminho={caminho} aoNavegar={fechar} />
          </div>
        </div>
      )}
    </div>
  );
}
