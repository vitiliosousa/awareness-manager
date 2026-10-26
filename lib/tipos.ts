// O que o gestor de uma empresa vê. Vem da API (GET /gestor/dados), já nesta forma.

export type Tema = { id: string; nome: string };

export type Empresa = {
  id: string;
  nome: string;
  /** O logótipo, como data URL. Sem logótipo, mostram-se as iniciais. */
  logo?: string;
  sector: string;
  plano: string;
  /** Máximo de colaboradores do plano. Sem limite, é null. */
  limiteColaboradores: number | null;
  /** AAAA-MM-DD */
  clienteDesde: string;
};

/** Quem está a usar esta app: o responsável da empresa pelo treino. */
export type Gestor = { nome: string; email: string; cargo: string };

export type Colaborador = {
  id: string;
  nome: string;
  email: string;
  departamento: string;
  cargo: string;
  /** Quando foi acrescentado à plataforma, AAAA-MM-DD. Só recebe desafios a partir daí. */
  entrouEm: string;
  /** O link de acesso por email. Sem convite nem acesso, a pessoa ainda não foi convidada. */
  convite?: { enviadoEm: string; vezes: number };
  ultimoAcesso?: string;
};

export type EstadoAcesso = "activo" | "convite" | "sem-convite";

export function estadoAcesso(c: Colaborador): EstadoAcesso {
  return c.ultimoAcesso ? "activo" : c.convite ? "convite" : "sem-convite";
}

/** O gestor só vê desafios que já saíram ou que estão marcados para sair. */
export type EstadoDesafio = "agendado" | "enviado" | "fechado";

export type Desafio = {
  /** "AAAA-MM" */
  id: string;
  titulo: string;
  resumo: string;
  /** AAAA-MM-DD */
  inicio: string;
  fim: string;
  estado: EstadoDesafio;
  /** Ids dos temas que o desafio treina. */
  temas: string[];
  exercicios: number;
};

/** O que um colaborador fez num desafio. Sem resultado, não começou. */
export type Resultado = {
  desafioId: string;
  colaboradorId: string;
  /** Data de conclusão, ou null se não concluiu. */
  concluido: string | null;
  /** Começou mas ainda não terminou. */
  emCurso: boolean;
  acertos: number;
  total: number;
  porTema: { tema: string; acertos: number; total: number }[];
};

/** O treino de cada um na app do formando, fora dos desafios. */
export type Progresso = {
  colaboradorId: string;
  xp: number;
  nivel: number;
  /** Dias seguidos a treinar. */
  sequencia: number;
  licoes: number;
  distintivos: number;
};

/** O relatório mensal que o Vigia envia ao gestor quando um desafio fecha. */
export type Relatorio = { desafioId: string; enviadoEm: string; para: string };

export type Dados = {
  empresa: Empresa;
  gestor: Gestor;
  temas: Tema[];
  colaboradores: Colaborador[];
  desafios: Desafio[];
  resultados: Resultado[];
  progresso: Progresso[];
  relatorios: Relatorio[];
};
