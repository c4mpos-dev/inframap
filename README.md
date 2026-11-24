# InfraMap

Mapa colaborativo de problemas de infraestrutura urbana em Resende (RJ). Projeto de extensão do Grupo 3 da AEDB (ODS 9.1).

## Rodar localmente

Precisa de Node 20 ou mais novo.

```bash
npm install
npm run dev
```

Abra http://localhost:5173.

## Scripts

| Comando             | O que faz                     |
| ------------------- | ----------------------------- |
| `npm run dev`       | Servidor de desenvolvimento   |
| `npm run build`     | Typecheck + build de produção |
| `npm run lint`      | ESLint                        |
| `npm run typecheck` | TypeScript sem gerar arquivos |
| `npm run format`    | Formata tudo com Prettier     |

## Stack

React + Vite + TypeScript, Tailwind CSS 4 e React Router. Os tokens de cor, fonte, raio e sombra do design ficam em `src/styles/index.css`, no bloco `@theme`.

## Estrutura

```
src/
├─ app/          rotas e layouts (cabeçalho desktop, navegação mobile)
├─ components/   marca, ícones e peças de layout
├─ pages/        uma tela por rota
└─ styles/       tokens e estilos globais
```

## Andamento

O projeto é construído em etapas, seguindo o briefing e o design no Claude Design.

- [x] Etapa 0 · Fundação
- [ ] Etapa 1 · Componentes base
- [ ] Etapa 2 · Mapa
- [ ] Etapa 3 · Marcar problema
- [ ] Etapa 4 · Detalhe da ocorrência
- [ ] Etapa 5 · Indicadores
- [ ] Etapa 6 · Painel da equipe
- [ ] Etapa 7 · Início e Entrar
- [ ] Etapa 8 · Supabase
- [ ] Etapa 9 · Testes e entrega
