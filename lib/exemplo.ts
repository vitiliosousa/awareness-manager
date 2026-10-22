import { semente } from "./semente";
import type { Colaborador, Dados, Desafio, Progresso, Relatorio, Resultado, Tema } from "./tipos";

// Dados de demonstração de uma empresa, até a app ligar à API. Nomes e números são fictícios.
// São sempre os mesmos (gerador com semente), para o servidor e o browser mostrarem o mesmo.

/** O dia a que os dados de exemplo se referem. */
export const HOJE = "2026-10-21";

const temas: Tema[] = [
  { id: "phishing", nome: "Emails falsos (phishing)" },
  { id: "engenharia", nome: "Engenharia social" },
  { id: "senhas", nome: "Palavras-passe e acessos" },
  { id: "mensagens", nome: "Burlas por SMS e WhatsApp" },
  { id: "dados", nome: "Protecção de dados" },
  { id: "fisica", nome: "Segurança física" },
  { id: "moveis", nome: "Telemóveis e apps" },
];

/** Uns temas custam mais do que outros. */
const dificuldade: Record<string, number> = { phishing: -0.04, engenharia: -0.1, senhas: 0.06, mensagens: 0, dados: -0.13, fisica: 0.08, moveis: -0.03 };

const desafios: Desafio[] = [
  { id: "2026-05", titulo: "Emails que pedem pressa", resumo: "Reconhecer pedidos urgentes que não são o que parecem.", inicio: "2026-05-04", fim: "2026-05-29", estado: "fechado", temas: ["phishing", "engenharia"], exercicios: 8 },
  { id: "2026-06", titulo: "Palavras-passe que aguentam", resumo: "Criar, guardar e partilhar acessos sem abrir portas.", inicio: "2026-06-01", fim: "2026-06-30", estado: "fechado", temas: ["senhas", "dados"], exercicios: 8 },
  { id: "2026-07", titulo: "Burlas no WhatsApp", resumo: "Mensagens de colegas, chefes e familiares que pedem dinheiro ou códigos.", inicio: "2026-07-01", fim: "2026-07-31", estado: "fechado", temas: ["mensagens", "engenharia"], exercicios: 8 },
  { id: "2026-08", titulo: "Quem está à porta?", resumo: "Visitas, entregas e técnicos que ninguém chamou.", inicio: "2026-08-03", fim: "2026-08-31", estado: "fechado", temas: ["fisica", "engenharia"], exercicios: 8 },
  { id: "2026-09", titulo: "O telemóvel da empresa", resumo: "Apps, permissões e redes Wi-Fi fora do escritório.", inicio: "2026-09-01", fim: "2026-09-30", estado: "fechado", temas: ["moveis", "mensagens"], exercicios: 8 },
  { id: "2026-10", titulo: "Faturas falsas e links trocados", resumo: "Pagamentos desviados por emails que imitam fornecedores.", inicio: "2026-10-01", fim: "2026-10-31", estado: "enviado", temas: ["phishing", "dados"], exercicios: 8 },
  { id: "2026-11", titulo: "Contas partilhadas", resumo: "Quem tem acesso a quê, e o que fazer quando alguém sai.", inicio: "2026-11-02", fim: "2026-11-30", estado: "agendado", temas: ["senhas", "moveis"], exercicios: 8 },
];

const primeiros = [
  "Carlos", "Helena", "Edson", "Graça", "Rui", "Nelson", "Lurdes", "Dércio", "Telma", "Fátima", "Aurélio", "Bernardo", "Celeste", "Domingos",
  "Eunice", "Fernando", "Gil", "Hortência", "Ismael", "Jacinta", "Kátia", "Leonel", "Mércia", "Nuno", "Olívia", "Paulo", "Rafael", "Sónia",
];
const apelidos = ["Nhantumbo", "Langa", "Sitoe", "Tembe", "Cossa", "Macuácua", "Mabunda", "Chaúque", "Bila", "Matsinhe", "Mondlane", "Mucavele", "Zimba", "Nhaca", "Bambo", "Mavie"];
const cargos: Record<string, string[]> = {
  Financeiro: ["Técnico de contabilidade", "Tesoureiro", "Analista financeiro"],
  Operações: ["Coordenador de armazém", "Despachante", "Motorista", "Técnico de frota"],
  Comercial: ["Gestor de clientes", "Assistente comercial", "Técnico de vendas"],
  TI: ["Técnico de suporte", "Administrador de sistemas"],
  "Recursos Humanos": ["Técnico de RH", "Assistente administrativo"],
};

const semAcentos = (t: string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const DOMINIO = "sotavento.co.mz";
const TOTAL = 34;

/** Pessoas que deixaram de treinar, para haver casos a acompanhar. */
const desligados = new Set([5, 11, 19, 26]);

function gerarColaboradores(): Colaborador[] {
  const rnd = semente("gestor-colaboradores");
  const usados = new Set<string>(["Ana Machava"]);
  const lista: Colaborador[] = [{ id: "c0", nome: "Ana Machava", email: `ana.machava@${DOMINIO}`, departamento: "Financeiro", cargo: "Técnica de contabilidade", entrouEm: "2026-04-20" }];
  for (let i = 1; i < TOTAL; i++) {
    let nome = "";
    do nome = `${primeiros[Math.floor(rnd() * primeiros.length)]} ${apelidos[Math.floor(rnd() * apelidos.length)]}`;
    while (usados.has(nome));
    usados.add(nome);
    // Os departamentos não têm todos o mesmo tamanho.
    const r = rnd();
    const dep = r < 0.32 ? "Operações" : r < 0.55 ? "Comercial" : r < 0.75 ? "Financeiro" : r < 0.88 ? "TI" : "Recursos Humanos";
    const [p, a] = nome.split(" ");
    // A maioria entrou com a empresa; alguns chegaram depois, e os últimos acabaram de ser acrescentados.
    const entrouEm = i >= TOTAL - 3 ? "2026-10-14" : i >= TOTAL - 6 ? "2026-08-18" : "2026-04-20";
    lista.push({ id: `c${i}`, nome, email: `${semAcentos(p)}.${semAcentos(a)}@${DOMINIO}`, departamento: dep, cargo: cargos[dep][Math.floor(rnd() * cargos[dep].length)], entrouEm });
  }
  return lista;
}

const limitar = (v: number) => Math.max(0, Math.min(1, v));

function gerar(): Dados {
  const colaboradores = gerarColaboradores();
  const resultados: Resultado[] = [];
  const progresso: Progresso[] = [];

  colaboradores.forEach((c, i) => {
    const rnd = semente("gestor-" + c.id);
    // Os últimos acrescentados: dois ainda sem convite, um com o convite por abrir.
    if (i >= TOTAL - 3) {
      if (i === TOTAL - 1) c.convite = { enviadoEm: "2026-10-15", vezes: 1 };
      progresso.push({ colaboradorId: c.id, xp: 0, nivel: 1, sequencia: 0, licoes: 0, distintivos: 0 });
      return;
    }
    // Um convidado de Agosto que nunca abriu o link.
    if (i === TOTAL - 4) {
      c.convite = { enviadoEm: "2026-08-18", vezes: 3 };
      progresso.push({ colaboradorId: c.id, xp: 0, nivel: 1, sequencia: 0, licoes: 0, distintivos: 0 });
      return;
    }
    c.convite = { enviadoEm: c.entrouEm, vezes: 1 };
    const empenho = desligados.has(i) ? 0.18 + rnd() * 0.12 : 0.62 + rnd() * 0.38;
    const jeito = 0.5 + rnd() * 0.36;
    let xp = 0;
    let ultimo = c.entrouEm;

    desafios.forEach((d, k) => {
      if (d.estado === "agendado" || c.entrouEm > d.fim) return;
      const aberto = d.estado === "enviado";
      // Quem deixou de treinar ainda fez os primeiros desafios.
      const vontade = desligados.has(i) && k < 2 ? 0.9 : empenho;
      const conclui = rnd() < (aberto ? vontade * 0.72 : vontade * 0.97);
      const ate = aberto ? HOJE : d.fim;
      const dia = (n: number) => `${d.id}-${String(Math.min(Number(ate.slice(8)), Math.max(Number(d.inicio.slice(8)), n))).padStart(2, "0")}`;
      if (!conclui) {
        const emCurso = aberto && rnd() < 0.5;
        if (emCurso) {
          resultados.push({ desafioId: d.id, colaboradorId: c.id, concluido: null, emCurso: true, acertos: 0, total: 0, porTema: [] });
          ultimo = dia(10 + Math.floor(rnd() * 11));
        }
        return;
      }
      const porTema = d.temas.map((t) => {
        const p = limitar(jeito + 0.035 * k + dificuldade[t] + (rnd() - 0.5) * 0.24);
        return { tema: t, acertos: Math.round(p * 6), total: 6 };
      });
      const acertos = porTema.reduce((s, t) => s + t.acertos, 0);
      const total = porTema.reduce((s, t) => s + t.total, 0);
      const concluido = dia(3 + Math.floor(rnd() * 24));
      resultados.push({ desafioId: d.id, colaboradorId: c.id, concluido, emCurso: false, acertos, total, porTema });
      xp += acertos * 10 + 40;
      if (concluido > ultimo) ultimo = concluido;
    });

    const licoes = Math.round(empenho * 34 * (c.entrouEm === "2026-04-20" ? 1 : 0.4));
    xp += licoes * 15;
    c.ultimoAcesso = desligados.has(i) ? ultimo : ultimo < "2026-10-01" ? "2026-10-" + String(2 + Math.floor(rnd() * 18)).padStart(2, "0") : ultimo;
    progresso.push({
      colaboradorId: c.id,
      xp,
      nivel: 1 + Math.floor(xp / 450),
      sequencia: desligados.has(i) ? 0 : Math.floor(rnd() * empenho * 22),
      licoes,
      distintivos: Math.floor(licoes / 6),
    });
  });

  const relatorios: Relatorio[] = desafios
    .filter((d) => d.estado === "fechado")
    .map((d) => {
      const [a, m] = d.id.split("-").map(Number);
      const seguinte = m === 12 ? `${a + 1}-01` : `${a}-${String(m + 1).padStart(2, "0")}`;
      return { desafioId: d.id, enviadoEm: `${seguinte}-03`, para: `helder.muianga@${DOMINIO}` };
    })
    .reverse();

  return {
    empresa: { id: "sotavento", nome: "Sotavento Logística", sector: "Logística", plano: "Profissional", limiteColaboradores: 50, clienteDesde: "2026-04-12" },
    gestor: { nome: "Hélder Muianga", email: `helder.muianga@${DOMINIO}`, cargo: "Director de Operações" },
    temas,
    colaboradores,
    desafios,
    resultados,
    progresso,
    relatorios,
  };
}

export const dados = gerar();
