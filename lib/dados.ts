import { createContext, useContext } from "react";
import { api, guardarToken } from "./api";
import type { Dados } from "./tipos";

// Os dados da empresa de quem entrou, vindos da API (GET /gestor/dados). Ficam aqui, num só objecto, depois de carregados:
// as contas de lib/analise.ts e as páginas leem daqui. A app só mostra as páginas depois de carregar (ver SessaoGestor).

export const dados = {} as Dados;

/** O dia de hoje, AAAA-MM-DD, no fuso de quem usa a app. */
const hojeLocal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/** O dia a que os dados se referem: o do último carregamento. */
export let HOJE = hojeLocal();

export function definirDados(novos: Dados) {
  Object.assign(dados, novos);
  HOJE = hojeLocal();
}

export const carregarDados = () => api.ler<Dados>("/gestor/dados");

/* ---------- Sessão ---------- */

/** Pede o link de entrada para o email do responsável. Em desenvolvimento, a API devolve o link. */
export const pedirLink = (email: string) => api.publico<{ link?: string }>("/auth/gestor/pedir-link", { email });

/** Troca o link do email por uma sessão. O link só vale uma vez. */
export async function entrarComLink(token: string) {
  const r = await api.publico<{ token: string }>("/auth/gestor/entrar", { token });
  guardarToken(r.token);
}

export const terminarSessao = () => guardarToken(null);

/* ---------- Para as páginas voltarem a desenhar quando os dados mudam ---------- */

export const ContextoDados = createContext<{ versao: number; recarregar: () => Promise<void> }>({ versao: 0, recarregar: async () => {} });

/** Os dados da empresa. Quem os usa volta a desenhar-se quando se recarregam (depois de enviar um convite, por exemplo). */
export function useDados() {
  useContext(ContextoDados);
  return dados;
}

/** Volta a pedir os dados à API. */
export const useRecarregar = () => useContext(ContextoDados).recarregar;
