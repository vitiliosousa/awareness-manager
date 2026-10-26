import { api, mensagemDeErro } from "./api";
import { plural } from "./formatos";

// Acções do gestor, na API. A API só aceita pessoas da empresa de quem entrou.

type Envio = { enviados: number; falharam: number };

/** O que dizer depois de um envio: quantos seguiram e quantos falharam. */
function resumoEnvio(r: Envio, oQue: string) {
  const ok = r.enviados - r.falharam;
  if (r.enviados === 0) return "Não havia ninguém a quem enviar.";
  if (r.falharam === 0) return `${oQue} enviado a ${plural(ok, "pessoa", "pessoas")}.`;
  return `${oQue} enviado a ${plural(ok, "pessoa", "pessoas")}; ${plural(r.falharam, "email falhou", "emails falharam")}.`;
}

/** Lembrete por email a quem ainda não concluiu o desafio. Devolve a frase para mostrar. */
export async function enviarLembrete(desafioId: string, colaboradores: string[]) {
  try {
    return resumoEnvio(await api.criar<Envio>("/gestor/lembretes", { desafioId, colaboradores }), "Lembrete");
  } catch (e) {
    return mensagemDeErro(e);
  }
}

/** Convite (ou novo link de acesso) por email. Devolve a frase para mostrar. */
export async function enviarConvite(colaboradores: string[]) {
  try {
    return resumoEnvio(await api.criar<Envio>("/gestor/convites", { colaboradores }), "Link de acesso");
  } catch (e) {
    return mensagemDeErro(e);
  }
}

/** Descarrega uma tabela como CSV, separado por ponto e vírgula (é o que o Excel em português espera). */
export function descarregarCsv(nome: string, linhas: (string | number | null)[][]) {
  const celula = (v: string | number | null) => {
    const s = v === null ? "" : String(v);
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const texto = linhas.map((l) => l.map(celula).join(";")).join("\n");
  const url = URL.createObjectURL(new Blob(["﻿" + texto], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  a.click();
  URL.revokeObjectURL(url);
}
