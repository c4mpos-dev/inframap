# InfraMap

Mapa colaborativo de problemas de infraestrutura urbana em Resende (RJ). Projeto de extensão do Grupo 3 da AEDB (ODS 9.1).

**No ar:** https://inframap-g3.vercel.app

Moradores marcam no mapa buracos, bueiros, calçadas, sinalização e iluminação; a vizinhança confirma ("eu também vi") e a equipe atualiza a situação. O InfraMap organiza e repassa os relatos, mas não é canal oficial da prefeitura nem garante prazo de conserto.

## Rodar localmente

Precisa de Node 20 ou mais novo.

```bash
npm install
npm run dev
```

Abra http://localhost:5173.

### Variáveis de ambiente

Crie um arquivo `.env.local` na raiz (ele não vai para o git), copiando o `.env.example`:

```
VITE_MAPBOX_TOKEN=pk.seu_token
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon
```

- **Mapbox**: o token público da conta, o que começa com `pk.`. Sem ele, a área do mapa mostra um aviso.
- **Supabase**: em _Project Settings → API_, a _Project URL_ e a chave _anon public_. Essa chave pode ir para o navegador; quem protege os dados são as regras do banco (RLS). A chave `service_role` **nunca** entra aqui.

Depois de mudar o `.env.local`, reinicie o `npm run dev`.

## Supabase

O banco, as regras de acesso e as funções ficam em `supabase/migrations/`. As regras de segurança são testadas em `supabase/tests/database/rls.test.sql` (19 verificações).

### Criar o projeto e aplicar o banco

1. Em https://supabase.com/dashboard, crie um projeto (região South America · São Paulo, plano Free).
2. Ligue a pasta ao projeto e envie as migrations (o `login` abre o navegador; o `ref` é o código na URL do projeto):

   ```bash
   npx supabase login
   npx supabase link --project-ref SEU_REF
   npx supabase db push --remote
   ```

   Sem `--remote`, o `db push` grava no banco local do Docker, não na nuvem. O seed (relatos de exemplo) não vai para a nuvem.

3. Em _Authentication → Sign In / Providers_, deixe **Allow anonymous sign-ins desligado**, **Confirm email** ligado e, em _Email_, o **Email OTP length** em `6`.
4. Em _Authentication → URL Configuration_, coloque a URL do site em _Site URL_ e adicione `http://localhost:5173/**` em _Redirect URLs_ (e a URL da Vercel quando houver deploy).
5. **Google**: no Google Cloud (projeto `inframap-515715`), crie um _OAuth client ID_ do tipo Web com a origem do site (`http://localhost:5173` e a URL da Vercel) e o redirect `https://<ref>.supabase.co/auth/v1/callback`. Em _Authentication → Sign In / Providers → Google_, cole o Client ID e o Client Secret. Enquanto o app estiver em modo de teste no Google, só entra quem estiver na lista de usuários de teste.

### E-mails de cadastro e login (Resend)

O e-mail padrão do Supabase só manda para quem é membro do projeto, no máximo 2 por hora. Por isso os e-mails saem pelo Resend, com o domínio verificado `send.cauacampos.dev`.

1. No Resend, crie uma API key com _Sending access_ só para esse domínio.
2. Em _Authentication → Emails → SMTP Settings_, ligue o SMTP próprio: remetente `inframap@send.cauacampos.dev`, nome `InfraMap`, host `smtp.resend.com`, porta `465`, usuário `resend` e a API key como senha.
3. Em _Authentication → Emails → Templates_, cole `supabase/templates/confirmation.html` em _Confirm sign up_ (assunto "Confirme seu cadastro no InfraMap") e `supabase/templates/magic_link.html` em _Magic link or OTP_ (assunto "Seu código para entrar no InfraMap").
4. Deixe _Confirm email_ ligado em _Sign In / Providers_.

Os dois e-mails mandam um **código de 6 números** (não um link): no celular, o link costuma abrir no navegador do app de e-mail e a pessoa fica logada no lugar errado; o código ela digita na mesma tela. Na primeira vez chega "Confirme seu cadastro"; nas seguintes, "Seu código para entrar". No Supabase local os dois templates já vêm ligados pelo `config.toml` e aparecem no Mailpit (http://127.0.0.1:54324).

### Liberar alguém na equipe

A pessoa entra uma vez em `/entrar` com o e-mail dela. Depois, no _SQL Editor_ do Supabase:

```sql
insert into public.staff (user_id)
select id from auth.users where email = 'pessoa@exemplo.com';
```

Para tirar da equipe, `delete from public.staff where user_id = (select id from auth.users where email = 'pessoa@exemplo.com');`.

### Rodar o Supabase no próprio computador (opcional)

Com o Docker Desktop aberto:

```bash
npx supabase start      # sobe banco, login e storage locais com os relatos de exemplo de supabase/seed.sql
npx supabase test db    # roda os testes das regras de segurança
```

O `start` mostra a URL (`http://127.0.0.1:54321`) e a chave anon locais para colocar no `.env.local`.

### O que o banco garante

- Qualquer pessoa vê os relatos e os indicadores; ninguém vê quem marcou. Relatos inválidos somem para o público; duplicados continuam acessíveis pelo link e levam ao original.
- Ver o mapa, os relatos e os indicadores não exige conta. Para marcar, confirmar, denunciar ou enviar foto é preciso uma **conta confirmada** (código no e-mail ou Google): sessões anônimas são recusadas pelo próprio banco, mesmo que alguém religue o login anônimo.
- Cada conta tem um perfil com o nome. No relato público aparece só o primeiro nome e a inicial ("Maria S."), ou "Morador(a) de Resende" quando a pessoa oculta o nome naquele relato.
- O morador não escolhe a situação nem edita o relato depois de enviar. Cada pessoa confirma uma vez.
- No máximo 10 relatos por pessoa a cada 24 horas.
- Só a equipe (tabela `staff`) muda situação, repassa, junta duplicados, marca inválido e lê denúncias, sempre por funções do banco.
- Fotos vão para o bucket público `occurrence-photos`, até 5 MB, só imagem, cada pessoa na própria pasta.

## Publicar na Vercel

O `vercel.json` já cuida das rotas (recarregar `/mapa` não dá 404), do cache dos arquivos e de cabeçalhos de segurança.

1. Em https://vercel.com, _Add New → Project_, importe o repositório do GitHub. A Vercel reconhece o Vite sozinha.
2. Em _Environment Variables_, cadastre as três do `.env.local` (`VITE_MAPBOX_TOKEN`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`; a `service_role` nunca vai para o front) e `VITE_SITE_URL` com a URL pública do site. Não use a integração "Supabase" da Vercel: ela cria variáveis com nomes do Next.js.
3. _Deploy_. A URL fica no formato `https://<projeto>.vercel.app`.
4. Depois do primeiro deploy, aponte os serviços para a URL nova:
   - **Supabase** → _Authentication → URL Configuration_: _Site URL_ = a URL da Vercel e, em _Redirect URLs_, `https://<projeto>.vercel.app/**`.
   - **Google Cloud** (projeto `inframap-515715`) → _Clientes → InfraMap Supabase_: adicione a URL da Vercel em _Origens JavaScript autorizadas_. Em _Branding_, preencha página inicial, `/privacidade`, `/termos` e o domínio autorizado (`vercel.app` não serve: use o domínio completo do projeto). Em _Público-alvo_, _Publicar app_.
   - **Mapbox**: se o token tiver restrição de URL, adicione a URL da Vercel.

### Prévia no WhatsApp e SEO

O `index.html` traz título, descrição, Open Graph e Twitter card com a imagem `public/og.png` (1200×630). As URLs absolutas que o WhatsApp exige são montadas no build a partir de `VITE_SITE_URL` (na Vercel: `https://inframap-g3.vercel.app`). Sem ela, o build usa `VERCEL_PROJECT_PRODUCTION_URL`, que pode ser outro domínio do projeto: foi o que deixou a primeira prévia sem imagem. Ao trocar de domínio, atualize essa variável e faça um novo deploy. O build também gera `robots.txt` e `sitemap.xml`.

A imagem e os ícones PNG saem de `scripts/brand/og.html` e `scripts/brand/icon.html`, renderizados no Chrome sem interface (`--headless=new --screenshot`). O WhatsApp guarda a prévia em cache: se trocar a imagem, mude o nome do arquivo.

## Scripts

| Comando             | O que faz                     |
| ------------------- | ----------------------------- |
| `npm run dev`       | Servidor de desenvolvimento   |
| `npm run build`     | Typecheck + build de produção |
| `npm run lint`      | ESLint                        |
| `npm run typecheck` | TypeScript sem gerar arquivos |
| `npm run format`    | Formata tudo com Prettier     |
| `npm test`          | Testes da lógica (Vitest)     |

## Telas

| Rota               | O que tem                                                                    |
| ------------------ | ---------------------------------------------------------------------------- |
| `/`                | Início: “Viu? Marca.”, como funciona, o que é e não é, encontros, quem faz   |
| `/entrar`          | Entrar com Google ou com código no e-mail; no primeiro acesso, pede o nome   |
| `/privacidade`     | Privacidade e LGPD (rascunho para revisão do grupo)                          |
| `/termos`          | Termos de uso (rascunho para revisão do grupo)                               |
| `/mapa`            | Mapa com os relatos, busca, filtros de categoria e situação, lista e detalhe |
| `/marcar`          | Marcar um problema (4 passos no celular, uma tela no computador)             |
| `/ocorrencia/:id`  | Detalhe: foto, confirmação, andamento, parecidos perto e denúncia            |
| `/indicadores`     | Números da cidade por período, bairro e categoria, com download em CSV       |
| `/equipe`          | Painel da equipe: fila, situação, repasse, nota, duplicados e inválidos      |
| `/dev/componentes` | Vitrine dos componentes (só em desenvolvimento)                              |

`/perfil` mostra nome, e-mail e foto, deixa trocar o nome e sair; no cabeçalho do computador, "Entrar" vira o nome da pessoa. `/meus-relatos` lista os relatos da própria conta. `/marcar` e `/meus-relatos` levam para `/entrar` quem não entrou, e "Eu também vi" e "Denunciar" fazem o mesmo; depois de entrar, a pessoa volta para onde estava.

## Como testar o que já existe

1. **Mapa**: abra `/mapa`, filtre por categoria ou situação, busque um bairro e clique num pino ou num card da lista. Os filtros ficam na URL, então dá para compartilhar o link.
2. **Marcar**: abra `/marcar`, escolha o ponto, a categoria e envie. O relato novo aparece no mapa. Marcando de novo no mesmo ponto e categoria, aparece o aviso de parecido.
3. **Detalhe**: em qualquer relato, use "Eu também vi", compartilhe ou denuncie.
4. **Indicadores**: abra `/indicadores` e troque período, bairro e categoria.
5. **Início e Entrar**: abra `/`, use o menu ☰ no celular e os atalhos "Como funciona" e "Encontros". Em `/entrar`, peça o código por e-mail, digite e escolha o nome.
6. **Equipe**: libere seu e-mail na equipe (veja acima), abra `/equipe`, escolha um relato, mude a situação, escreva uma nota e salve. A nota aparece no andamento do detalhe. "Juntar os dois" transforma o mais novo em duplicado do mais antigo, e "Marcar inválido" tira o relato do mapa e dos números.

## Testes e verificações

- **Lógica** (`npm test`): andamento do relato, indicadores, filtros do mapa, validação do formulário de marcar, título automático, CSV, protocolo, distâncias e datas. Os testes ficam ao lado de cada arquivo (`*.test.ts`).
- **Banco** (`npx supabase test db`, com o Supabase local rodando): regras de segurança em pgTAP.
- **Fluxos à mão, contra o Supabase na nuvem**: marcar com foto, confirmar, denunciar e indicadores. Login por e-mail e painel da equipe foram testados no Supabase local.
- **Acessibilidade**: todas as telas passam no axe (WCAG 2.1 AA) no celular e no computador. Dá para usar só com teclado: "Pular para o conteúdo" no primeiro Tab, pinos do mapa abrem com Enter e fecham com Esc, o foco vai para o título de cada passo ao marcar e volta ao botão quando um painel fecha. Cada tela tem título próprio na aba, e ao trocar de tela o foco vai para o conteúdo, para o leitor de tela começar do topo.
- **Celular de entrada** (tela de 360 px, build de produção): nenhuma tela passa da largura. O início baixa cerca de 120 KB; o Mapbox (cerca de 530 KB comprimido) só carrega nas telas com mapa. As fotos saem do aparelho com no máximo 1280 px, em JPEG.

## Limitações conhecidas

- **Dias de encontro**: as datas em `src/domain/encounters.ts` são provisórias (24/10, 31/10, 07/11 e 14/11).
- **"Cadastros"** nos indicadores conta as contas confirmadas, sem contar a equipe.
- **Fotos**: são reduzidas para no máximo 1280 px e convertidas para JPEG no próprio aparelho (isso tira o GPS escondido na foto). Ninguém borra rostos automaticamente: a equipe tira do ar o que precisar.

## Pendências de conteúdo

Ficam em `src/domain/project.ts` e aparecem como `[placeholder]` nas telas até alguém preencher:

- Associação e data/horário de cada um dos 4 encontros (`ENCOUNTERS`).
- @ do perfil do Instagram (`PROJECT_INSTAGRAM`).
- E-mail de contato do projeto para pedidos de remoção e LGPD (`PROJECT_CONTACT_EMAIL`).
- Revisão final dos textos de `/privacidade` e `/termos`.

## Stack

React + Vite + TypeScript, Tailwind CSS 4, React Router, Mapbox (`mapbox-gl` + `react-map-gl`), zod e Supabase (Postgres com PostGIS, Auth, Storage e RLS). Os tokens de cor, fonte, raio e sombra do design ficam em `src/styles/index.css`, no bloco `@theme`.

## Estrutura

```
src/
├─ app/          rotas e layouts (cabeçalhos desktop, navegação mobile)
├─ components/   marca, ícones e componentes reutilizados (botão, chip, pino…)
├─ data/         repositórios que falam com o Supabase
├─ domain/       tipos, categorias, situações e cálculos puros
├─ features/     uma pasta por funcionalidade (map, mark-problem, occurrence-detail, indicators, team)
├─ lib/          utilitários (cliente do Supabase, geocodificação, foto, media query)
├─ pages/        uma tela por rota
└─ styles/       tokens e estilos globais
supabase/
├─ migrations/   banco, regras de acesso, funções e storage
├─ tests/        testes das regras de segurança (pgTAP)
└─ seed.sql      relatos de exemplo para o Supabase local
```

A pasta `src/data/` é a única que sabe de onde vêm os dados: as telas não conhecem o Supabase. Tudo que depende do Mapbox fica em `src/features/map/engine/` e `src/lib/geocoding.ts`.

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
- [x] Etapa 8 · Supabase: banco com PostGIS, regras de acesso, login, fotos e painel da equipe de verdade
- [ ] Etapa 9 · Testes e entrega
  - [x] Testes da lógica, fluxos principais, acessibilidade e celular de entrada
  - [ ] Formulários SUS e NPS
  - [x] Prévia de link (WhatsApp), ícones PNG, robots, sitemap e `vercel.json`
  - [x] Deploy na Vercel (https://inframap-g3.vercel.app), com Supabase, Google e prévia de link apontando para o domínio
