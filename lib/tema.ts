// Partilhado entre o servidor (script no <head>) e o cliente (lib/preferencias.ts).

export const CHAVE_TEMA = "vigia-gestor:tema";
export const CHAVE_PALETA = "vigia-gestor:paleta";

/** A paleta do gestor quando ninguém escolheu outra: a Vigia, como na app do formando. */
export const PALETA_OMISSAO = "vigia";

/** Paletas além da Vigia (que se escolhe tirando o atributo). */
export const PALETAS_EXTRA = ["energia", "hibisco", "indico", "jacaranda", "grafite"] as const;

/** Corre no <head> antes da primeira pintura, para não haver flash do tema ou das cores errados. */
export const scriptTema = `(function(){try{var d=document.documentElement;var t=localStorage.getItem("${CHAVE_TEMA}");if(t==="claro"||t==="escuro")d.setAttribute("data-tema",t);var p=localStorage.getItem("${CHAVE_PALETA}");if(p==="vigia")d.removeAttribute("data-paleta");else if(${JSON.stringify(PALETAS_EXTRA)}.indexOf(p)>-1)d.setAttribute("data-paleta",p)}catch(e){}})()`;
