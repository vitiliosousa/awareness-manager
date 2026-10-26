// O cliente HTTP da API: um único sítio que sabe o endereço, leva a sessão e traduz os erros (como na app do formando).

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const CHAVE_SESSAO = "vigia-gestor:sessao";

/** O erro de um pedido: a mensagem da API e, se for de validação, o que está mal em cada campo. */
export class ErroApi extends Error {
  constructor(
    readonly estado: number,
    mensagem: string,
    readonly campos: { campo: string; erro: string }[] = [],
  ) {
    super(mensagem);
  }

  /** A mensagem, com os campos mal preenchidos à frente. */
  get texto() {
    return this.campos.length ? this.campos.map((c) => c.erro).join(" ") : this.message;
  }
}

/** A mensagem de um erro qualquer, para mostrar a quem usa a app. */
export const mensagemDeErro = (e: unknown) => (e instanceof ErroApi ? e.texto : "Algo correu mal. Tenta de novo.");

/* ---------- Sessão ---------- */

export const lerToken = () => {
  try {
    return window.localStorage.getItem(CHAVE_SESSAO);
  } catch {
    return null;
  }
};

export function guardarToken(token: string | null) {
  try {
    if (token) window.localStorage.setItem(CHAVE_SESSAO, token);
    else window.localStorage.removeItem(CHAVE_SESSAO);
  } catch {
    // Sem armazenamento, a sessão vale só até recarregar.
  }
}

/** Chamado quando a API diz que a sessão acabou (401). Quem gere a sessão regista-se aqui. */
let aoExpirar: () => void = () => {};
export const definirAoExpirar = (f: () => void) => {
  aoExpirar = f;
};

/* ---------- Pedidos ---------- */

type Corpo = Record<string, unknown> | unknown[];

async function pedir<T>(metodo: string, caminho: string, corpo?: Corpo, semSessao = false): Promise<T> {
  const token = semSessao ? null : lerToken();
  let resposta: Response;
  try {
    resposta = await fetch(`${BASE}${caminho}`, {
      method: metodo,
      headers: { ...(corpo ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw new ErroApi(0, "Não consegui falar com o servidor. Verifica a ligação e tenta de novo.");
  }
  if (resposta.status === 204) return undefined as T;
  const dados = (await resposta.json().catch(() => null)) as (T & { message?: string | string[]; erros?: { campo: string; erro: string }[] }) | null;
  if (!resposta.ok) {
    if (resposta.status === 401 && token) aoExpirar();
    const mensagem = Array.isArray(dados?.message) ? dados.message.join(" ") : (dados?.message ?? "Algo correu mal.");
    throw new ErroApi(resposta.status, mensagem, dados?.erros ?? []);
  }
  return dados as T;
}

export const api = {
  ler: <T>(caminho: string) => pedir<T>("GET", caminho),
  criar: <T>(caminho: string, corpo: Corpo = {}) => pedir<T>("POST", caminho, corpo),
  /** Sem sessão: pedir o link e entrar com ele. */
  publico: <T>(caminho: string, corpo: Corpo) => pedir<T>("POST", caminho, corpo, true),
};
