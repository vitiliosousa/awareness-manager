// Acções do gestor. Ainda não há API: esperam um pouco e dão-se como feitas, para o ecrã mostrar o fluxo.

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Lembrete por email a quem ainda não fez o desafio. */
export async function enviarLembrete(colaboradores: string[]) {
  await esperar(900);
  return colaboradores.length;
}

/** Convite (ou novo link de acesso) por email. */
export async function enviarConvite(colaboradores: string[]) {
  await esperar(900);
  return colaboradores.length;
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
