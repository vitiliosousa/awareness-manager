import Link from "next/link";
import { ArrowLeft01Icon, Delete02Icon, PencilEdit01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { Icone, type IconSvgElement } from "@/components/icone";
import { BotaoIcone } from "@/components/campos";

/** Um bloco com título, para organizar uma página. */
export function Cartao({ titulo, nota, accao, children, className = "" }: { titulo: string; nota?: string; accao?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-[14px] border border-linha bg-superficie ${className}`}>
      <header className="flex items-start justify-between gap-4 px-5 pb-0 pt-5 sm:px-6 sm:pt-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold leading-tight">{titulo}</h2>
          {nota && <p className="mt-0.5 text-sm text-suave">{nota}</p>}
        </div>
        {accao && <div className="shrink-0">{accao}</div>}
      </header>
      <div className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6">{children}</div>
    </section>
  );
}

export type Indicador = { rotulo: string; valor: string; nota: string; icone?: IconSvgElement; href?: string };

/** Uma fila de números grandes, cada um no seu cartão. Com `href`, o cartão é uma ligação. */
export function Indicadores({ itens, className = "" }: { itens: Indicador[]; className?: string }) {
  return (
    <dl className={`grid grid-cols-2 gap-4 lg:grid-cols-4 ${className}`}>
      {itens.map((r) => {
        const conteudo = (
          <>
            <dt className="flex min-h-9 items-start justify-between gap-2 text-sm text-suave">
              {r.rotulo}
              {r.icone && (
                <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-energia-claro text-tinta">
                  <Icone icon={r.icone} size={18} />
                </span>
              )}
            </dt>
            <dd className="mt-2 font-titulo text-[2rem] font-extrabold leading-none tracking-tight">{r.valor}</dd>
            <p className="mt-2 text-sm text-suave">{r.nota}</p>
          </>
        );
        const classe = "min-w-0 rounded-[14px] border border-linha bg-superficie p-5";
        return r.href ? (
          <Link key={r.rotulo} href={r.href} className={`${classe} transition-colors hover:border-energia`}>
            {conteudo}
          </Link>
        ) : (
          <div key={r.rotulo} className={classe}>
            {conteudo}
          </div>
        );
      })}
    </dl>
  );
}

/** O mês de um desafio num quadrado pequeno: "OUT" por cima, "26" por baixo. `id` é "AAAA-MM". */
export function MesTile({ id, grande = false }: { id: string; grande?: boolean }) {
  const [ano, mes] = id.split("-");
  const nome = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][Number(mes) - 1] ?? mes;
  return (
    <div aria-hidden="true" className={`shrink-0 rounded-[10px] border border-linha bg-papel text-center ${grande ? "w-16 py-2.5" : "w-14 py-1.5"}`}>
      <p className={`font-semibold uppercase tracking-wide text-suave ${grande ? "text-xs" : "text-[11px]"}`}>{nome}</p>
      <p className={`font-titulo font-bold leading-none ${grande ? "text-xl" : "text-base"}`}>{ano.slice(2)}</p>
    </div>
  );
}

/** Uma ligação para voltar à lista: "‹ Empresas". */
export function LinkVoltar({ href, rotulo }: { href: string; rotulo: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-suave hover:text-tinta">
      <Icone icon={ArrowLeft01Icon} size={16} /> {rotulo}
    </Link>
  );
}

/**
 * O cabeçalho de uma página de detalhe: um elemento visual à esquerda (logótipo, avatar, mês),
 * etiquetas, título e subtítulo no meio, acções à direita e, se for preciso, uma nota por baixo.
 */
export function CabecalhoDetalhe({
  rotulo,
  visual,
  etiquetas,
  titulo,
  subtitulo,
  lateral,
  accoes,
  nota,
}: {
  rotulo: string;
  visual: React.ReactNode;
  etiquetas?: React.ReactNode;
  titulo: React.ReactNode;
  subtitulo?: React.ReactNode;
  /** Algo à direita do título, antes das acções (por exemplo o nível de uma pessoa). */
  lateral?: React.ReactNode;
  accoes?: React.ReactNode;
  nota?: React.ReactNode;
}) {
  return (
    <section aria-label={rotulo} className="mt-4 overflow-hidden rounded-[18px] border border-linha bg-superficie">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-4 p-5 sm:p-7">
        {visual}
        <div className="min-w-0 flex-1 basis-60">
          {etiquetas && <div className="flex flex-wrap items-center gap-x-3 gap-y-1">{etiquetas}</div>}
          <h1 className={`text-[1.75rem] font-extrabold leading-tight tracking-tight sm:text-3xl ${etiquetas ? "mt-1" : ""}`}>{titulo}</h1>
          {subtitulo && <div className="mt-1 text-suave">{subtitulo}</div>}
        </div>
        {lateral}
        {accoes && <div className="flex flex-wrap items-center gap-3">{accoes}</div>}
      </div>
      {nota && <p className="border-t border-linha px-5 py-3 text-sm text-suave sm:px-7">{nota}</p>}
    </section>
  );
}

/** O círculo com um tique: amarelo se está feito, vazio se não. Para listas de verificação. */
export function Tique({ feito, tamanho = 20 }: { feito: boolean; tamanho?: number }) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full ${feito ? "bg-energia text-noite" : "border border-linha text-transparent"}`}
      style={{ width: tamanho, height: tamanho }}
    >
      <Icone icon={Tick02Icon} size={Math.round(tamanho * 0.6)} strokeWidth={2.5} />
    </span>
  );
}

/** Um cartão de um item que se gere (sector, competência, plano): título, descrição, editar e apagar, e um rodapé. */
export function CartaoGestao({
  titulo,
  descricao,
  aoEditar,
  aoApagar,
  rodape,
  children,
}: {
  titulo: string;
  descricao?: string;
  aoEditar: () => void;
  aoApagar: () => void;
  rodape?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <article className="flex h-full flex-col rounded-[14px] border border-linha bg-superficie p-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-bold leading-tight">{titulo}</h2>
        <div className="-mr-2 -mt-1.5 flex">
          <BotaoIcone icone={PencilEdit01Icon} rotulo={`Editar ${titulo}`} aoClicar={aoEditar} />
          <BotaoIcone icone={Delete02Icon} rotulo={`Apagar ${titulo}`} perigo aoClicar={aoApagar} />
        </div>
      </div>
      {descricao !== undefined && <p className="mt-2 text-suave">{descricao || "Sem descrição."}</p>}
      {children}
      {rodape && <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-linha pt-3 text-sm text-suave">{rodape}</p>}
    </article>
  );
}

/** Uma lista com cabeçalho de colunas, dentro de uma caixa. As linhas (`<li>`) são do chamador. */
export function CaixaLista({ colunas, grelha, cabecalhoClasse = "grid", children }: { colunas: string[]; grelha: string; cabecalhoClasse?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[14px] border border-linha bg-superficie">
      <div className={`${cabecalhoClasse} rounded-t-[14px] border-b border-linha bg-papel/60 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-suave ${grelha}`} aria-hidden="true">
        {colunas.map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </div>
      <ul>{children}</ul>
    </div>
  );
}

/** Escolher entre duas ou mais vistas (cartões, tabela, calendário…), só com ícones. */
export function Alternador<T extends string>({ valor, aoMudar, opcoes }: { valor: T; aoMudar: (v: T) => void; opcoes: { valor: T; rotulo: string; icone: IconSvgElement }[] }) {
  return (
    <div role="radiogroup" aria-label="Ver como" className="flex h-[46px] items-center rounded-md border border-linha bg-superficie p-1">
      {opcoes.map((o) => (
        <button
          key={o.valor}
          type="button"
          role="radio"
          aria-checked={valor === o.valor}
          aria-label={o.rotulo}
          title={o.rotulo}
          onClick={() => aoMudar(o.valor)}
          className={`grid h-9 w-9 place-items-center rounded-md transition-colors ${valor === o.valor ? "bg-energia text-noite" : "text-suave hover:text-tinta"}`}
        >
          <Icone icon={o.icone} size={17} />
        </button>
      ))}
    </div>
  );
}

/** A linha de pesquisa, filtros e botões por cima de uma lista. `margem` é a margem de cima (mt-8 por omissão). */
export function BarraFiltros({ children, margem = "mt-8" }: { children: React.ReactNode; margem?: string }) {
  return <div className={`${margem} flex flex-wrap items-center gap-3`}>{children}</div>;
}
