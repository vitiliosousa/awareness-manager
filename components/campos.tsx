"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Add01Icon, ArrowDown02Icon, ArrowUp02Icon, Cancel01Icon, Delete02Icon, InboxIcon, Search01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { Icone } from "@/components/icone";
import { botaoPrimario, botaoSecundario, Spinner } from "@/components/ui";

// Peças de formulário do admin, no mesmo estilo da app do formando.
// Não usa <select> nativo: as escolhas são botões, para ficarem iguais ao resto da plataforma.

/** Todos os controlos (campos, escolhas, pesquisa, botões) têm esta altura. */
export const alturaControlo = "h-[46px]";

const entrada =
  "h-[46px] w-full rounded-md border border-linha bg-superficie px-3.5 text-[16px] text-tinta outline-none transition-colors placeholder:text-suave/70 focus:border-energia focus:ring-2 focus:ring-energia/30 disabled:opacity-60";

export function Campo({
  rotulo,
  ajuda,
  children,
  className = "",
}: {
  rotulo: string;
  ajuda?: React.ReactNode;
  children: (id: string) => React.ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold">
        {rotulo}
      </label>
      {ajuda && <p className="mt-0.5 text-sm text-suave">{ajuda}</p>}
      <div className="mt-1.5">{children(id)}</div>
    </div>
  );
}

export function Texto({
  rotulo,
  ajuda,
  valor,
  aoMudar,
  placeholder,
  mono = false,
  tipo = "text",
  className = "",
}: {
  rotulo: string;
  ajuda?: React.ReactNode;
  valor: string;
  aoMudar: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
  /** "password" para palavras-passe, "email" para endereços de email. */
  tipo?: "text" | "password" | "email";
  className?: string;
}) {
  return (
    <Campo rotulo={rotulo} ajuda={ajuda} className={className}>
      {(id) => (
        <input
          id={id}
          type={tipo}
          autoComplete={tipo === "password" ? "off" : tipo === "email" ? "email" : undefined}
          value={valor}
          onChange={(e) => aoMudar(e.target.value)}
          placeholder={placeholder}
          className={`${entrada} ${mono ? "font-mono text-[15px]" : ""}`}
        />
      )}
    </Campo>
  );
}

export function Area({
  rotulo,
  ajuda,
  valor,
  aoMudar,
  linhas = 3,
  placeholder,
  mono = false,
  className = "",
}: {
  rotulo: string;
  ajuda?: React.ReactNode;
  valor: string;
  aoMudar: (v: string) => void;
  linhas?: number;
  placeholder?: string;
  mono?: boolean;
  className?: string;
}) {
  return (
    <Campo rotulo={rotulo} ajuda={ajuda} className={className}>
      {(id) => (
        <textarea
          id={id}
          rows={linhas}
          value={valor}
          onChange={(e) => aoMudar(e.target.value)}
          placeholder={placeholder}
          className={`${entrada} h-auto py-2.5 resize-y leading-relaxed ${mono ? "font-mono text-[15px]" : ""}`}
        />
      )}
    </Campo>
  );
}

export function Numero({
  rotulo,
  valor,
  aoMudar,
  min = 0,
  className = "",
}: {
  rotulo: string;
  valor: number;
  aoMudar: (v: number) => void;
  min?: number;
  className?: string;
}) {
  return (
    <Campo rotulo={rotulo} className={className}>
      {(id) => <input id={id} type="number" min={min} value={valor} onChange={(e) => aoMudar(Number(e.target.value))} className={entrada} />}
    </Campo>
  );
}

/** Escolha única entre poucas opções, em botões. */
export function Opcoes<T extends string | number | boolean>({
  rotulo,
  opcoes,
  valor,
  aoMudar,
  className = "",
}: {
  rotulo: string;
  opcoes: readonly { valor: T; rotulo: string }[];
  valor: T;
  aoMudar: (v: T) => void;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={className}>
      <p id={id} className="text-sm font-semibold">
        {rotulo}
      </p>
      <div role="radiogroup" aria-labelledby={id} className="mt-1.5 flex flex-wrap gap-2">
        {opcoes.map((o) => {
          const activa = valor === o.valor;
          return (
            <button
              key={String(o.valor)}
              type="button"
              role="radio"
              aria-checked={activa}
              onClick={() => aoMudar(o.valor)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                activa ? "border-energia bg-energia text-noite" : "border-linha bg-superficie text-suave hover:border-tinta/40 hover:text-tinta"
              }`}
            >
              {o.rotulo}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Interruptor com texto. */
export function Interruptor({ rotulo, ligado, aoMudar, ajuda }: { rotulo: string; ligado: boolean; aoMudar: (v: boolean) => void; ajuda?: string }) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p id={id} className="text-sm font-semibold">
          {rotulo}
        </p>
        {ajuda && <p className="text-sm text-suave">{ajuda}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={ligado}
        aria-labelledby={id}
        onClick={() => aoMudar(!ligado)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${ligado ? "bg-indigo" : "bg-linha"}`}
      >
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-superficie shadow transition-[left] ${ligado ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );
}

/** Uma caixa de selecção, para escolhas múltiplas. */
export function Caixa({ rotulo, marcada, aoMudar, detalhe }: { rotulo: string; marcada: boolean; aoMudar: (v: boolean) => void; detalhe?: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-md border border-linha bg-superficie px-3.5 py-2.5 transition-colors hover:border-tinta/40 has-[:checked]:border-energia has-[:checked]:bg-energia-claro">
      <input type="checkbox" checked={marcada} onChange={(e) => aoMudar(e.target.checked)} className="h-4 w-4 shrink-0 accent-[var(--energia)]" />
      <span className="min-w-0 flex-1">
        <span className="block font-medium">{rotulo}</span>
        {detalhe && <span className="block text-sm text-suave">{detalhe}</span>}
      </span>
    </label>
  );
}

/** Botão pequeno só com ícone. */
export function BotaoIcone({
  icone,
  rotulo,
  aoClicar,
  desactivado = false,
  perigo = false,
}: {
  icone: Parameters<typeof Icone>[0]["icon"];
  rotulo: string;
  /** Se devolver uma promessa, o botão mostra um círculo a rodar e fica desactivado até ela acabar. */
  aoClicar: () => void | Promise<unknown>;
  desactivado?: boolean;
  perigo?: boolean;
}) {
  const [aCorrer, setACorrer] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        if (aCorrer) return;
        setACorrer(true);
        try {
          await aoClicar();
        } finally {
          setACorrer(false);
        }
      }}
      disabled={desactivado || aCorrer}
      aria-busy={aCorrer || undefined}
      aria-label={rotulo}
      title={rotulo}
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-md text-suave transition-colors enabled:hover:bg-papel disabled:opacity-30 ${aCorrer ? "disabled:opacity-100 " : ""}${
        perigo ? "enabled:hover:text-risco" : "enabled:hover:text-tinta"
      }`}
    >
      {aCorrer ? <Spinner tamanho={18} /> : <Icone icon={icone} size={18} />}
    </button>
  );
}

/**
 * Uma lista de itens que se podem acrescentar, remover e mudar de ordem.
 * `criar` devolve um item novo; `desenhar` mostra os campos de um item.
 */
export function ListaEditavel<T>({
  itens,
  aoMudar,
  criar,
  desenhar,
  rotuloAdicionar,
  rotuloItem,
  minimo = 0,
  ordenavel = true,
}: {
  itens: T[];
  aoMudar: (itens: T[]) => void;
  criar: () => T;
  desenhar: (item: T, indice: number, mudar: (parcial: Partial<T>) => void) => React.ReactNode;
  rotuloAdicionar: string;
  rotuloItem: string;
  minimo?: number;
  ordenavel?: boolean;
}) {
  function mover(i: number, delta: -1 | 1) {
    const n = [...itens];
    [n[i], n[i + delta]] = [n[i + delta], n[i]];
    aoMudar(n);
  }
  return (
    <div className="space-y-3">
      {itens.map((item, i) => (
        <div key={i} className="rounded-[10px] border border-linha bg-papel/60 p-3 sm:p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-suave">
              {rotuloItem} {i + 1}
            </p>
            <div className="-mr-1 flex">
              {ordenavel && (
                <>
                  <BotaoIcone icone={ArrowUp02Icon} rotulo={`Subir ${rotuloItem.toLowerCase()} ${i + 1}`} aoClicar={() => mover(i, -1)} desactivado={i === 0} />
                  <BotaoIcone icone={ArrowDown02Icon} rotulo={`Descer ${rotuloItem.toLowerCase()} ${i + 1}`} aoClicar={() => mover(i, 1)} desactivado={i === itens.length - 1} />
                </>
              )}
              <BotaoIcone
                icone={Delete02Icon}
                rotulo={`Remover ${rotuloItem.toLowerCase()} ${i + 1}`}
                aoClicar={() => aoMudar(itens.filter((_, k) => k !== i))}
                desactivado={itens.length <= minimo}
                perigo
              />
            </div>
          </div>
          {desenhar(item, i, (parcial) => aoMudar(itens.map((x, k) => (k === i ? { ...x, ...parcial } : x))))}
        </div>
      ))}
      <button
        type="button"
        onClick={() => aoMudar([...itens, criar()])}
        className="inline-flex items-center gap-2 rounded-md border border-dashed border-linha px-4 py-2.5 text-sm font-semibold text-suave transition-colors hover:border-indigo hover:text-indigo"
      >
        <Icone icon={Add01Icon} size={16} />
        {rotuloAdicionar}
      </button>
    </div>
  );
}

/** Uma caixa de diálogo por cima da página. Fecha com Esc ou ao clicar fora. */
export function Modal({ titulo, aoFechar, children, largura = "max-w-lg" }: { titulo: string; aoFechar: () => void; children: React.ReactNode; largura?: string }) {
  const caixa = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const tecla = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") aoFechar();
    };
    document.addEventListener("keydown", tecla);
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    caixa.current?.focus();
    return () => {
      document.removeEventListener("keydown", tecla);
      document.body.style.overflow = antes;
    };
  }, [aoFechar]);

  return (
    <div className="fixed inset-0 z-[60] grid place-items-end sm:place-items-center" role="dialog" aria-modal="true" aria-label={titulo}>
      <button type="button" aria-label="Fechar" onClick={aoFechar} className="absolute inset-0 bg-black/60" />
      <div
        ref={caixa}
        tabIndex={-1}
        className={`relative max-h-[92dvh] w-full ${largura} overflow-y-auto rounded-t-2xl bg-superficie p-5 shadow-2xl outline-none sm:rounded-2xl sm:p-7`}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold">{titulo}</h2>
          <button type="button" onClick={aoFechar} aria-label="Fechar" className="-mr-2 grid h-10 w-10 place-items-center rounded-md text-suave hover:bg-papel hover:text-tinta">
            <Icone icon={Cancel01Icon} size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const tons = {
  neutro: "bg-papel text-suave",
  verde: "bg-mangal-claro text-mangal",
  amarelo: "bg-marcador-claro text-tinta",
  vermelho: "bg-risco-claro text-risco",
  azul: "bg-indigo-claro text-indigo",
};

/** Uma etiqueta pequena com o estado de algo. */
export function Etiqueta({ children, tom = "neutro" }: { children: React.ReactNode; tom?: keyof typeof tons }) {
  return <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tons[tom]}`}>{children}</span>;
}

export function CabecalhoPagina({ titulo, descricao, accoes }: { titulo: string; descricao?: React.ReactNode; accoes?: React.ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-3xl font-bold">{titulo}</h1>
        {descricao && <p className="mt-1 max-w-2xl text-suave">{descricao}</p>}
      </div>
      {accoes && <div className="flex flex-wrap items-center gap-3">{accoes}</div>}
    </header>
  );
}

export function Vazio({ titulo, texto, accao }: { titulo: string; texto?: string; accao?: React.ReactNode }) {
  return (
    <div className="relative isolate overflow-hidden rounded-[14px] border border-dashed border-linha bg-papel/45 px-6 py-10 text-center sm:py-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-32 max-w-md bg-[radial-gradient(circle_at_top,var(--indigo-claro),transparent_68%)] opacity-80" />
      <div aria-hidden="true" className="relative mx-auto mb-5 grid h-[72px] w-[72px] place-items-center rounded-[18px] border border-indigo/20 bg-superficie text-indigo shadow-[0_10px_30px_-18px_var(--indigo)]">
        <Icone icon={InboxIcon} size={34} strokeWidth={1.6} />
        <span className="absolute -bottom-1 h-2 w-7 rounded-full bg-marcador ring-[3px] ring-superficie" />
      </div>
      <p className="text-[17px] font-bold text-tinta">{titulo}</p>
      {texto && <p className="mx-auto mt-1.5 max-w-md leading-relaxed text-suave">{texto}</p>}
      {accao && <div className="mt-5 flex flex-wrap justify-center gap-3">{accao}</div>}
    </div>
  );
}

/**
 * Uma escolha numa lista, no estilo da plataforma (sem o selector do browser, que não segue o tema).
 * Abre uma lista por baixo; setas, Enter e Esc funcionam.
 */
export function Escolha({
  rotulo,
  ajuda,
  valor,
  aoMudar,
  opcoes,
  placeholder = "Escolher",
  vazio,
  semRotulo = false,
  desactivado = false,
  className = "",
}: {
  rotulo: string;
  ajuda?: React.ReactNode;
  valor: string;
  aoMudar: (v: string) => void;
  opcoes: { valor: string; rotulo: string; detalhe?: string }[];
  placeholder?: string;
  /** O que mostrar se não houver opções. */
  vazio?: React.ReactNode;
  /** Esconde o rótulo (continua para os leitores de ecrã), para filtros em linha. */
  semRotulo?: boolean;
  desactivado?: boolean;
  className?: string;
}) {
  const id = useId();
  const raiz = useRef<HTMLDivElement>(null);
  const lista = useRef<HTMLUListElement>(null);
  const [aberto, setAberto] = useState(false);
  const [activo, setActivo] = useState(0);
  const escolhida = opcoes.find((o) => o.valor === valor);

  useEffect(() => {
    if (!aberto) return;
    const fora = (ev: MouseEvent) => {
      if (raiz.current && !raiz.current.contains(ev.target as Node)) setAberto(false);
    };
    document.addEventListener("mousedown", fora);
    return () => document.removeEventListener("mousedown", fora);
  }, [aberto]);

  useEffect(() => {
    if (aberto) lista.current?.querySelector<HTMLElement>(`[data-i="${activo}"]`)?.scrollIntoView({ block: "nearest" });
  }, [aberto, activo]);

  function abrir() {
    setActivo(Math.max(0, opcoes.findIndex((o) => o.valor === valor)));
    setAberto(true);
  }

  function aoTeclar(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      if (aberto) {
        e.preventDefault();
        e.stopPropagation();
        setAberto(false);
      }
      return;
    }
    if (!aberto) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        abrir();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActivo((i) => Math.min(opcoes.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActivo((i) => Math.max(0, i - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActivo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActivo(opcoes.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (opcoes[activo]) {
        aoMudar(opcoes[activo].valor);
        setAberto(false);
      }
    } else if (e.key.length === 1) {
      // Escrever uma letra salta para a primeira opção que começa por ela.
      const i = opcoes.findIndex((o) => o.rotulo.toLowerCase().startsWith(e.key.toLowerCase()));
      if (i >= 0) setActivo(i);
    }
  }

  return (
    <div ref={raiz} className={`relative ${className}`} onKeyDown={aoTeclar}>
      <label htmlFor={id} className={semRotulo ? "sr-only" : "block text-sm font-semibold"}>
        {rotulo}
      </label>
      {ajuda && <p className="mt-0.5 text-sm text-suave">{ajuda}</p>}
      {opcoes.length === 0 && vazio ? (
        <div className="mt-1.5 rounded-md border border-dashed border-linha px-3.5 py-2.5 text-sm text-suave">{vazio}</div>
      ) : (
        <button
          id={id}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={aberto}
          disabled={desactivado}
          aria-controls={`${id}-lista`}
          onClick={() => (aberto ? setAberto(false) : abrir())}
          className={`${semRotulo ? "" : "mt-1.5"} flex h-[46px] w-full items-center justify-between gap-3 rounded-md border border-linha bg-superficie px-3.5 text-left text-[16px] outline-none transition-colors hover:border-tinta/40 focus-visible:border-energia focus-visible:ring-2 focus-visible:ring-energia/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-linha`}
        >
          <span className={`truncate ${escolhida ? "" : "text-suave"}`}>{escolhida?.rotulo ?? placeholder}</span>
          <Icone icon={ArrowDown02Icon} size={18} className={`shrink-0 text-suave transition-transform ${aberto ? "rotate-180" : ""}`} />
        </button>
      )}
      {aberto && (
        <ul
          ref={lista}
          id={`${id}-lista`}
          role="listbox"
          aria-label={rotulo}
          className="absolute left-0 right-0 top-full z-40 mt-2 max-h-64 overflow-y-auto rounded-[12px] border border-linha bg-superficie p-1.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.4)]"
        >
          {opcoes.map((o, i) => (
            <li
              key={o.valor}
              data-i={i}
              role="option"
              aria-selected={o.valor === valor}
              onMouseEnter={() => setActivo(i)}
              onClick={() => {
                aoMudar(o.valor);
                setAberto(false);
              }}
              className={`flex cursor-pointer items-start justify-between gap-3 rounded-md px-3 py-2 ${i === activo ? "bg-papel" : ""}`}
            >
              <span className="min-w-0">
                <span className={`block ${o.valor === valor ? "font-semibold" : ""}`}>{o.rotulo}</span>
                {o.detalhe && <span className="block text-sm text-suave">{o.detalhe}</span>}
              </span>
              {o.valor === valor && <Icone icon={Tick02Icon} size={16} className="mt-1 shrink-0" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Campo de pesquisa, com a mesma altura e estilo dos outros controlos. */
export function Pesquisa({ rotulo, valor, aoMudar, placeholder, className = "" }: { rotulo: string; valor: string; aoMudar: (v: string) => void; placeholder: string; className?: string }) {
  return (
    <label className={`relative block ${className}`}>
      <span className="sr-only">{rotulo}</span>
      <Icone icon={Search01Icon} size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-suave" />
      <input type="search" value={valor} onChange={(e) => aoMudar(e.target.value)} placeholder={placeholder} className={`${entrada} pl-10`} />
    </label>
  );
}

/** Uma mensagem de erro por baixo de um campo. */
export function ErroCampo({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-sm text-risco">{children}</p>;
}

/**
 * Os botões no fim de um formulário: Cancelar e Guardar. Com `esquerda`, algo à esquerda (por exemplo, apagar).
 * O botão de guardar é `type="submit"`.
 */
export function RodapeForm({ aoCancelar, rotuloGuardar, aoGuardar, esquerda, desactivado = false }: { aoCancelar: () => void; rotuloGuardar: string; aoGuardar?: () => void | Promise<unknown>; esquerda?: React.ReactNode; desactivado?: boolean }) {
  // Se `aoGuardar` devolver uma promessa, o botão mostra que está a trabalhar e fica desactivado até ela acabar.
  const [aGuardar, setAGuardar] = useState(false);
  return (
    <div className={`flex flex-wrap items-center gap-3 pt-1 ${esquerda ? "justify-between" : "justify-end"}`}>
      {esquerda}
      <div className="flex gap-3">
        <button type="button" onClick={aoCancelar} disabled={aGuardar} className={`${botaoSecundario} disabled:opacity-50`}>
          Cancelar
        </button>
        <button
          type={aoGuardar ? "button" : "submit"}
          onClick={
            aoGuardar &&
            (async () => {
              setAGuardar(true);
              try {
                await aoGuardar();
              } finally {
                setAGuardar(false);
              }
            })
          }
          disabled={desactivado || aGuardar}
          aria-busy={aGuardar || undefined}
          className={`${botaoPrimario} ${aGuardar ? "disabled:!opacity-100" : ""}`}
        >
          {aGuardar && <Spinner />}
          {rotuloGuardar}
        </button>
      </div>
    </div>
  );
}

/** Um botão de texto vermelho para apagar algo, com o ícone do lixo. */
export function BotaoApagar({ rotulo, aoClicar }: { rotulo: string; aoClicar: () => void }) {
  return (
    <button type="button" onClick={aoClicar} className="inline-flex h-[46px] items-center gap-2 text-sm font-semibold text-risco hover:underline">
      <Icone icon={Delete02Icon} size={16} /> {rotulo}
    </button>
  );
}

/**
 * Uma lista de itens curtos que se acrescentam um a um: escreve-se, carrega-se em Enter (ou em Acrescentar)
 * e o item passa a etiqueta, que se tira com o ×. Sem itens à partida.
 */
export function EtiquetasEditaveis({
  rotulo,
  ajuda,
  placeholder,
  itens,
  aoMudar,
  jaExiste = "Já está na lista.",
}: {
  rotulo: string;
  ajuda?: React.ReactNode;
  placeholder?: string;
  itens: string[];
  aoMudar: (itens: string[]) => void;
  jaExiste?: string;
}) {
  const [texto, setTexto] = useState("");
  const repetido = itens.some((p) => p.toLowerCase() === texto.trim().toLowerCase());

  function acrescentar() {
    const t = texto.trim();
    if (!t || repetido) return;
    aoMudar([...itens, t]);
    setTexto("");
  }

  return (
    <Campo rotulo={rotulo} ajuda={ajuda}>
      {(id) => (
        <div>
          <div className="flex gap-2">
            <input
              id={id}
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  acrescentar();
                }
              }}
              placeholder={placeholder}
              className={`${entrada} min-w-0 flex-1`}
            />
            <button type="button" onClick={acrescentar} disabled={!texto.trim() || repetido} className={`${botaoSecundario} disabled:opacity-40`}>
              Acrescentar
            </button>
          </div>
          {repetido && <ErroCampo>{jaExiste}</ErroCampo>}
          {itens.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {itens.map((p) => (
                <li key={p}>
                  <button
                    type="button"
                    onClick={() => aoMudar(itens.filter((x) => x !== p))}
                    aria-label={`Tirar ${p}`}
                    className="inline-flex h-8 items-center gap-2 rounded-full border border-linha bg-superficie pl-3 pr-2 text-sm font-medium transition-colors hover:border-risco hover:text-risco"
                  >
                    {p}
                    <Icone icon={Cancel01Icon} size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Campo>
  );
}
