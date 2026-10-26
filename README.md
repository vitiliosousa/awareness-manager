# Vigia Gestor

A app do responsável de cada empresa: como corre o treino da equipa, quem fez e quem falta cada desafio, os departamentos, os temas e os relatórios mensais. Lê tudo da API (`../awareness-api`).

## Arrancar

Com a API a correr em `localhost:3000`:

```bash
cp .env.example .env.local   # só da primeira vez (NEXT_PUBLIC_API_URL)
pnpm install
pnpm dev -p 3300
```

## Entrar

Quem entra é o responsável da empresa: o contacto que está na empresa no admin (o nome e o email de quem recebe os relatórios). Não há palavra-passe.

1. Em `/entrar`, escreve o email do responsável (nos dados de exemplo, `helder.muianga@sotavento.co.mz`).
2. Abre o link que chega por email. Em desenvolvimento os emails não saem e o link aparece logo no ecrã.

O link vale um dia e só se usa uma vez; a sessão dura 30 dias. Se a empresa mudar de responsável no admin, a sessão do anterior deixa de valer.

## Como está organizada

- `lib/api.ts`: o cliente da API (endereço, sessão, erros), igual ao da app do formando.
- `lib/dados.ts`: os dados da empresa, carregados de `GET /gestor/dados`, e a sessão.
- `components/sessao-gestor.tsx`: sem sessão leva à entrada; com sessão carrega os dados e só depois mostra a app.
- `lib/analise.ts`: as contas (quem falta, por departamento, por tema) a partir dos dados.
- `lib/accoes.ts`: os convites e os lembretes por email.
