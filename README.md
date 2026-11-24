# InfraMap

Mapa colaborativo de problemas de infraestrutura urbana em Resende (RJ). Projeto de extensão do Grupo 3 da AEDB (ODS 9.1).

Moradores marcam no mapa buracos, bueiros, calçadas, sinalização e iluminação; a vizinhança confirma ("eu também vi") e a equipe atualiza a situação. O InfraMap organiza e repassa os relatos, mas não é canal oficial da prefeitura nem garante prazo de conserto.

## Rodar localmente

Precisa de Node 20 ou mais novo.

```bash
npm install
npm run dev
```

Abra http://localhost:5173.

### Token do Mapbox

O mapa usa o Mapbox. Crie um arquivo `.env.local` na raiz (ele não vai para o git) com o token público da sua conta, o que começa com `pk.`:

```
VITE_MAPBOX_TOKEN=pk.seu_token
```

Depois de mudar o `.env.local`, reinicie o `npm run dev`. Sem token, o app funciona, mas a área do mapa mostra um aviso no lugar do mapa.

## Scripts

| Comando             | O que faz                     |
| ------------------- | ----------------------------- |
| `npm run dev`       | Servidor de desenvolvimento   |
| `npm run build`     | Typecheck + build de produção |
| `npm run lint`      | ESLint                        |
| `npm run typecheck` | TypeScript sem gerar arquivos |
| `npm run format`    | Formata tudo com Prettier     |

## Telas

| Rota               | O que tem                                                                    |
| ------------------ | ---------------------------------------------------------------------------- |
| `/`                | Início: “Viu? Marca.”, como funciona, o que é e não é, encontros, quem faz   |
| `/entrar`          | Entrar com Google, e-mail ou marcar sem se identificar (login ainda inativo) |
| `/privacidade`     | Privacidade e LGPD (rascunho para revisão do grupo)                          |
| `/termos`          | Termos de uso (rascunho para revisão do grupo)                               |
| `/mapa`            | Mapa com os relatos, busca, filtros de categoria e situação, lista e detalhe |
| `/marcar`          | Marcar um problema (4 passos no celular, uma tela no computador)             |
| `/ocorrencia/:id`  | Detalhe: foto, confirmação, andamento, parecidos perto e denúncia            |
| `/indicadores`     | Números da cidade por período, bairro e categoria, com download em CSV       |
| `/equipe`          | Painel da equipe: fila, situação, repasse, nota, duplicados e inválidos      |
| `/dev/componentes` | Vitrine dos componentes (só em desenvolvimento)                              |

`/meus-relatos` e `/perfil` ainda são telas vazias.

## Como testar o que já existe

1. **Mapa**: abra `/mapa`, filtre por categoria ou situação, busque um bairro e clique num pino ou num card da lista. Os filtros ficam na URL, então dá para compartilhar o link.
2. **Marcar**: abra `/marcar`, escolha o ponto, a categoria e envie. O relato novo aparece no mapa com protocolo `#RES-0147` em diante. Marcando de novo no mesmo ponto e categoria, aparece o aviso de parecido.
3. **Detalhe**: em qualquer relato, use "Eu também vi", compartilhe ou denuncie.
4. **Indicadores**: abra `/indicadores` e troque período, bairro e categoria.
5. **Início e Entrar**: abra `/`, use o menu ☰ no celular e os atalhos "Como funciona" e "Encontros". Em `/entrar`, teste os três caminhos.
6. **Equipe**: abra `/equipe`, clique em "Entrar como equipe", escolha um relato, mude a situação, escreva uma nota e salve. A nota aparece no andamento do detalhe. "Juntar os dois" transforma o mais novo em duplicado do mais antigo, e "Marcar inválido" tira o relato do mapa e dos números.

Para voltar ao estado inicial, limpe os dados do site no navegador (ou rode `localStorage.clear()` no console).

## Limitações até a Etapa 8 (Supabase)

- **Dados de exemplo**: o mapa usa 8 relatos do design. Os indicadores somam a eles 72 relatos gerados e mostram o selo "dados de exemplo". "Moradores cadastrados" é o número fixo do design (46).
- **Tudo fica no navegador**: relatos novos, confirmações, denúncias e mudanças da equipe são guardados no `localStorage` de quem usa. Ninguém mais vê.
- **Modo equipe sem senha**: o acesso a `/equipe` é só de demonstração.
- **Fotos**: são reduzidas para no máximo 1280 px e convertidas para JPEG no próprio aparelho (isso tira o GPS escondido na foto), mas ainda não vão para nenhum servidor.
- **Dias de encontro**: as datas em `src/domain/encounters.ts` são provisórias (24/10, 31/10, 07/11 e 14/11).
- **Entrar**: Google e e-mail ainda não fazem login; mostram que o recurso chega em breve e sugerem marcar sem se identificar.

## Pendências de conteúdo

Ficam em `src/domain/project.ts` e aparecem como `[placeholder]` nas telas até alguém preencher:

- Associação e data/horário de cada um dos 4 encontros (`ENCOUNTERS`).
- @ do perfil do Instagram (`PROJECT_INSTAGRAM`).
- E-mail de contato do projeto para pedidos de remoção e LGPD (`PROJECT_CONTACT_EMAIL`).
- Revisão final dos textos de `/privacidade` e `/termos`.

## Stack

React + Vite + TypeScript, Tailwind CSS 4, React Router, Mapbox (`mapbox-gl` + `react-map-gl`) e zod. Os tokens de cor, fonte, raio e sombra do design ficam em `src/styles/index.css`, no bloco `@theme`.

## Estrutura

```
src/
├─ app/          rotas e layouts (cabeçalhos desktop, navegação mobile)
├─ components/   marca, ícones e componentes reutilizados (botão, chip, pino…)
├─ data/         repositórios (hoje com dados de exemplo; no futuro, Supabase)
├─ domain/       tipos, categorias, situações e cálculos puros
├─ features/     uma pasta por funcionalidade (map, mark-problem, occurrence-detail, indicators, team)
├─ lib/          utilitários (armazenamento, geocodificação, foto, media query)
├─ pages/        uma tela por rota
└─ styles/       tokens e estilos globais
```

A pasta `src/data/` é a única que sabe de onde vêm os dados. Na Etapa 8 ela passa a falar com o Supabase, sem mudar as telas. Tudo que depende do Mapbox fica em `src/features/map/engine/` e `src/lib/geocoding.ts`.

## Andamento

O projeto é construído em etapas, seguindo o briefing e o design no Claude Design.

- [x] Etapa 0 · Fundação: projeto, tokens, fontes, ícones, cabeçalhos e rotas
- [x] Etapa 1 · Componentes base: botões, chips, selos, pinos, cards e a vitrine `/dev/componentes`
- [x] Etapa 2 · Mapa: Mapbox com as cores do design, filtros, busca, lista e seleção
- [x] Etapa 3 · Marcar problema: GPS ou mapa, categoria, foto, descrição e aviso de parecido
- [x] Etapa 4 · Detalhe da ocorrência: confirmação, linha do tempo, parecidos e denúncia
- [x] Etapa 5 · Indicadores: metas, gráficos, filtros e CSV
- [x] Etapa 6 · Painel da equipe: fila, situação, repasse, nota, duplicados e inválidos
- [x] Etapa 7 · Início e Entrar: página inicial, menu do celular, tela de entrar, privacidade e termos
- [ ] Etapa 8 · Supabase
- [ ] Etapa 9 · Testes e entrega
