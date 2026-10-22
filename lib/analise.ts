import { dados } from "./exemplo";
import type { PontoHistorico } from "./formatos";
import type { Colaborador, Desafio, Resultado } from "./tipos";

// As contas do gestor: quem fez, quem falta, como corre cada departamento e cada tema.

export type EstadoNoDesafio = "concluido" | "em-curso" | "nao-iniciou" | "nao-fez";

export const rotuloEstado: Record<EstadoNoDesafio, string> = { concluido: "Concluído", "em-curso": "Em curso", "nao-iniciou": "Não começou", "nao-fez": "Não fez" };
export const tomEstado = { concluido: "verde", "em-curso": "azul", "nao-iniciou": "amarelo", "nao-fez": "vermelho" } as const;

export const rotuloEstadoDesafio = { agendado: "Agendado", enviado: "A decorrer", fechado: "Fechado" } as const;
export const tomEstadoDesafio = { agendado: "azul", enviado: "verde", fechado: "neutro" } as const;

export const nomeTema = (id: string) => dados.temas.find((t) => t.id === id)?.nome ?? id;

/** Os desafios que já saíram, do mais antigo para o mais recente. */
export const desafiosComResultados = dados.desafios.filter((d) => d.estado !== "agendado").sort((a, b) => a.id.localeCompare(b.id));

/** O desafio a decorrer; sem nenhum, o último que fechou. */
export const desafioActual = desafiosComResultados.find((d) => d.estado === "enviado") ?? desafiosComResultados.at(-1);

export const proximoDesafio = dados.desafios.find((d) => d.estado === "agendado");

export const departamentos = [...new Set(dados.colaboradores.map((c) => c.departamento))].sort((a, b) => a.localeCompare(b, "pt"));

/** Quem recebeu o desafio: quem já estava na plataforma antes de ele acabar. */
export function participantesDe(d: Desafio, pessoas: Colaborador[] = dados.colaboradores) {
  return pessoas.filter((c) => c.entrouEm <= d.fim);
}

export function resultadoDe(d: Desafio, colaboradorId: string): Resultado | undefined {
  return dados.resultados.find((r) => r.desafioId === d.id && r.colaboradorId === colaboradorId);
}

export function estadoNoDesafio(d: Desafio, colaboradorId: string): EstadoNoDesafio {
  const r = resultadoDe(d, colaboradorId);
  if (r?.concluido) return "concluido";
  if (d.estado === "fechado") return "nao-fez";
  return r?.emCurso ? "em-curso" : "nao-iniciou";
}

export const acertoDe = (r: { acertos: number; total: number } | undefined) => (r && r.total ? Math.round((r.acertos / r.total) * 100) : null);

/** Soma acertos de vários resultados e devolve a percentagem. */
function acertoJunto(rs: { acertos: number; total: number }[]) {
  const total = rs.reduce((t, r) => t + r.total, 0);
  return total ? Math.round((rs.reduce((t, r) => t + r.acertos, 0) / total) * 100) : null;
}

export type Resumo = { total: number; concluiram: number; emCurso: number; faltam: number; conclusao: number; acerto: number | null };

export function resumoDesafio(d: Desafio, pessoas: Colaborador[] = dados.colaboradores): Resumo {
  const quem = participantesDe(d, pessoas);
  const estados = quem.map((c) => estadoNoDesafio(d, c.id));
  const concluiram = estados.filter((e) => e === "concluido").length;
  const emCurso = estados.filter((e) => e === "em-curso").length;
  const feitos = quem.map((c) => resultadoDe(d, c.id)).filter((r): r is Resultado => !!r?.concluido);
  return { total: quem.length, concluiram, emCurso, faltam: quem.length - concluiram - emCurso, conclusao: quem.length ? concluiram / quem.length : 0, acerto: acertoJunto(feitos) };
}

/** A evolução mês a mês, para o gráfico de evolução. */
export function historico(pessoas: Colaborador[] = dados.colaboradores): PontoHistorico[] {
  return desafiosComResultados
    .map((d) => {
      const r = resumoDesafio(d, pessoas);
      return { desafio: d, mes: d.id, conclusao: r.conclusao, acerto: r.acerto, concluiram: r.concluiram, total: r.total };
    })
    .filter((p) => p.total > 0);
}

export type LinhaDepartamento = Resumo & { departamento: string; pessoas: number; tendencia: (number | null)[] };

export function porDepartamento(d: Desafio): LinhaDepartamento[] {
  return departamentos.map((dep) => {
    const nele = dados.colaboradores.filter((c) => c.departamento === dep);
    return { departamento: dep, pessoas: nele.length, ...resumoDesafio(d, nele), tendencia: historico(nele).map((p) => p.acerto) };
  });
}

export type LinhaTema = { tema: string; nome: string; acerto: number; respostas: number; desafios: number };

/** O acerto em cada tema, do mais fraco para o mais forte. */
export function porTema(desafios: Desafio[] = desafiosComResultados, pessoas: Colaborador[] = dados.colaboradores): LinhaTema[] {
  const ids = new Set(pessoas.map((c) => c.id));
  const ds = new Set(desafios.map((d) => d.id));
  const contas = new Map<string, { acertos: number; total: number; desafios: Set<string> }>();
  for (const r of dados.resultados) {
    if (!r.concluido || !ids.has(r.colaboradorId) || !ds.has(r.desafioId)) continue;
    for (const t of r.porTema) {
      const c = contas.get(t.tema) ?? { acertos: 0, total: 0, desafios: new Set() };
      c.acertos += t.acertos;
      c.total += t.total;
      c.desafios.add(r.desafioId);
      contas.set(t.tema, c);
    }
  }
  return [...contas.entries()]
    .map(([tema, c]) => ({ tema, nome: nomeTema(tema), acerto: Math.round((c.acertos / c.total) * 100), respostas: c.total, desafios: c.desafios.size }))
    .sort((a, b) => a.acerto - b.acerto);
}

/** O acerto num tema em cada desafio que o treinou (null nos que não o treinaram). */
export function temaAoLongo(tema: string, pessoas: Colaborador[] = dados.colaboradores) {
  return desafiosComResultados.map((d) => (d.temas.includes(tema) ? (porTema([d], pessoas).find((t) => t.tema === tema)?.acerto ?? null) : null));
}

export type ResumoPessoa = {
  recebidos: number;
  feitos: number;
  acerto: number | null;
  /** Não fez os dois últimos desafios fechados, ou acerta pouco. */
  atencao: string | null;
};

export function resumoPessoa(c: Colaborador): ResumoPessoa {
  const recebidos = desafiosComResultados.filter((d) => c.entrouEm <= d.fim);
  const feitos = recebidos.map((d) => resultadoDe(d, c.id)).filter((r): r is Resultado => !!r?.concluido);
  const acerto = acertoJunto(feitos);
  const fechados = recebidos.filter((d) => d.estado === "fechado").slice(-2);
  // Quem falhou dois desafios mas já fez o deste mês voltou a treinar.
  const voltou = desafioActual?.estado === "enviado" && estadoNoDesafio(desafioActual, c.id) === "concluido";
  let atencao: string | null = null;
  if (!voltou && fechados.length === 2 && fechados.every((d) => estadoNoDesafio(d, c.id) === "nao-fez")) atencao = "Não fez os dois últimos desafios";
  else if (feitos.length >= 2 && acerto !== null && acerto < 55) atencao = "Acerta pouco";
  return { recebidos: recebidos.length, feitos: feitos.length, acerto, atencao };
}

export const progressoDe = (id: string) => dados.progresso.find((p) => p.colaboradorId === id);

export const colaborador = (id: string) => dados.colaboradores.find((c) => c.id === id);
export const desafio = (id: string) => dados.desafios.find((d) => d.id === id);
