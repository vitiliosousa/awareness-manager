import type { Desafio } from "./tipos";

const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

/** "2026-10" -> "Outubro de 2026" */
export function nomeMes(id: string) {
  const [a, m] = id.split("-");
  return `${meses[Number(m) - 1] ?? id} de ${a}`;
}

/** "2026-10" -> "Outubro" */
export function soMes(id: string) {
  return meses[Number(id.split("-")[1]) - 1] ?? id;
}

/** "2026-10" -> "Out" */
export function mesCurto(id: string) {
  const m = Number(id.split("-")[1]);
  return meses[m - 1]?.slice(0, 3) ?? id;
}

/** O mês seguinte a "AAAA-MM". */
export function mesSeguinte(id: string) {
  const [a, m] = id.split("-").map(Number);
  return m === 12 ? `${a + 1}-01` : `${a}-${String(m + 1).padStart(2, "0")}`;
}

/** "2026-10-31" -> "31 de outubro de 2026" */
export function formatarDia(iso: string) {
  const [a, m, d] = iso.split("-").map(Number);
  return `${d} de ${meses[m - 1].toLowerCase()} de ${a}`;
}

/** "2026-10-31" -> "31 out." */
export function diaCurto(iso: string) {
  const [, m, d] = iso.split("-").map(Number);
  return `${d} ${meses[m - 1].slice(0, 3).toLowerCase()}.`;
}

/** Dias de `de` até `ate` (AAAA-MM-DD). */
export function diasEntre(de: string, ate: string) {
  return Math.round((Date.parse(ate) - Date.parse(de)) / 86_400_000);
}

/** "1 colaborador", "3 colaboradores". */
export function plural(n: number, um: string, varios: string) {
  return `${n} ${n === 1 ? um : varios}`;
}

export const percentagem = (v: number | null) => (v === null ? "–" : `${v}%`);

/** As iniciais de um nome: "Ana Machava" -> "AM". */
export function iniciais(nome: string) {
  const ps = nome.split(/\s+/).filter(Boolean);
  return ((ps[0]?.[0] ?? "") + (ps.length > 1 ? ps[ps.length - 1][0] : (ps[0]?.[1] ?? ""))).toUpperCase();
}

/** Um ponto da evolução mês a mês (ver components/empresa-visual). */
export type PontoHistorico = {
  desafio: Desafio;
  mes: string;
  /** 0 a 1 */
  conclusao: number;
  acerto: number | null;
  concluiram: number;
  total: number;
};
