// Paletas de cor que o formando pode escolher em Definições.
// As cores completas estão em app/globals.css; aqui ficam só as amostras para a interface.

export type Amostras = { noite: string; papel: string; superficie: string; indigo: string; progresso: string; energia: string; tinta: string; linha: string };
export type Paleta = { id: string; nome: string; descricao: string; claro: Amostras; escuro: Amostras };

export const paletas: Paleta[] = [
  {
    "id": "vigia",
    "nome": "Marinho",
    "descricao": "Azul-tinta e índigo, com toques de amarelo.",
    "claro": {
      "noite": "#16213a",
      "papel": "#f4f5f1",
      "superficie": "#ffffff",
      "indigo": "#2f3fb8",
      "progresso": "#0f7f63",
      "energia": "#f2b233",
      "tinta": "#16213a",
      "linha": "#dfe2da"
    },
    "escuro": {
      "noite": "#212c48",
      "papel": "#0e1422",
      "superficie": "#161f33",
      "indigo": "#8f9bff",
      "progresso": "#3dbb94",
      "energia": "#f2b233",
      "tinta": "#e6e9f0",
      "linha": "#2a3551"
    }
  },
  {
    "id": "energia",
    "nome": "Energia",
    "descricao": "Preto e verde-ácido. Intensa.",
    "claro": {
      "noite": "#111112",
      "papel": "#f3f4f1",
      "superficie": "#ffffff",
      "indigo": "#2f7a00",
      "progresso": "#6cc417",
      "energia": "#7ed321",
      "tinta": "#111112",
      "linha": "#e0e2dc"
    },
    "escuro": {
      "noite": "#111112",
      "papel": "#0a0a0b",
      "superficie": "#161617",
      "indigo": "#7ed321",
      "progresso": "#7ed321",
      "energia": "#7ed321",
      "tinta": "#f2f2f2",
      "linha": "#2a2a2c"
    }
  },
  {
    "id": "grafite",
    "nome": "Grafite",
    "descricao": "Cinzentos sóbrios, sem distracções.",
    "claro": {
      "noite": "#27272a",
      "papel": "#f4f4f5",
      "superficie": "#ffffff",
      "indigo": "#18181b",
      "progresso": "#3f3f46",
      "energia": "#f2b233",
      "tinta": "#18181b",
      "linha": "#e4e4e7"
    },
    "escuro": {
      "noite": "#1c1c1f",
      "papel": "#09090b",
      "superficie": "#141417",
      "indigo": "#f4f4f5",
      "progresso": "#e4e4e7",
      "energia": "#f2b233",
      "tinta": "#f4f4f5",
      "linha": "#27272a"
    }
  },
  {
    "id": "hibisco",
    "nome": "Hibisco",
    "descricao": "Magenta e vinho. Quente e viva.",
    "claro": {
      "noite": "#2a1020",
      "papel": "#f8f4f6",
      "superficie": "#ffffff",
      "indigo": "#be185d",
      "progresso": "#db2777",
      "energia": "#f472b6",
      "tinta": "#26111c",
      "linha": "#eddfe6"
    },
    "escuro": {
      "noite": "#2b1222",
      "papel": "#140a10",
      "superficie": "#1e1018",
      "indigo": "#f472b6",
      "progresso": "#f472b6",
      "energia": "#f472b6",
      "tinta": "#f5e9ef",
      "linha": "#3a2030"
    }
  },
  {
    "id": "indico",
    "nome": "Índico",
    "descricao": "Azul-petróleo e ciano. Fresca.",
    "claro": {
      "noite": "#0b2a3a",
      "papel": "#f2f6f7",
      "superficie": "#ffffff",
      "indigo": "#0369a1",
      "progresso": "#0e7490",
      "energia": "#22d3ee",
      "tinta": "#0b2230",
      "linha": "#d9e4e8"
    },
    "escuro": {
      "noite": "#0f2a38",
      "papel": "#071923",
      "superficie": "#0d2230",
      "indigo": "#38bdf8",
      "progresso": "#22d3ee",
      "energia": "#22d3ee",
      "tinta": "#e3eef2",
      "linha": "#1d3a4b"
    }
  },
  {
    "id": "jacaranda",
    "nome": "Jacarandá",
    "descricao": "Lilás e roxo. Suave e elegante.",
    "claro": {
      "noite": "#241638",
      "papel": "#f6f4f8",
      "superficie": "#ffffff",
      "indigo": "#6d28d9",
      "progresso": "#7c3aed",
      "energia": "#c084fc",
      "tinta": "#1e1530",
      "linha": "#e4dfeb"
    },
    "escuro": {
      "noite": "#261a3b",
      "papel": "#120c1c",
      "superficie": "#1b1329",
      "indigo": "#b794f6",
      "progresso": "#a78bfa",
      "energia": "#c084fc",
      "tinta": "#ece8f3",
      "linha": "#33264a"
    }
  }
];
