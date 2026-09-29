# Documento de Requisitos do Produto (PRD)
## Projeto 1 — Desenvolvimento Web & Produtos Digitais (ISCTE 2026/2027)

---

### Metadados do Documento
- **Nome do Projeto / Produto:** Supercell Make Community HUB (Clone Didático)
- **Autor / Product Manager:** Guilherme Carapinha (ISCTE: `ggcaa1@iscte-iul.pt` | `gui.carapinha@gmail.com`)
- **Instituição:** ISCTE – Instituto Universitário de Lisboa
- **Ano Letivo:** 2026 / 2027
- **Versão:** 1.0 (Retroativo — Produto Final em Produção)
- **Estado:** Em Produção (Live)

---

## 1. Resumo Executivo & Visão Geral

### 1.1 Nome do Produto e Empresa
- **Nome do Produto:** Supercell Make HUB (Clone / Modelo Didático)
- **Organização / Empresa Simulada:** Projeto Pedagógico Didático ISCTE (inspirado no ecossistema oficial da Supercell Oy)
- **Propósito:** Criação de uma plataforma web interativa, responsiva e integrada com inteligência artificial e agendamento em tempo real, permitindo a criadores e entusiastas 3D partilhar, votar e submeter conceitos de skins para jogos móveis competitivos.

### 1.2 Descrição do Produto / Serviço
O **Supercell Make HUB** é uma aplicação web completa (Full-Stack SPA) desenhada para simular e expandir a experiência do portal da comunidade Supercell. A plataforma agrega:
1. **Montra de Campanhas Ativas:** Divulgação de eventos de criação (ex.: *Clancy Esports Japan*, *Tower Skins para Clash Royale*, *Heróis de Clash of Clans*).
2. **Galeria Interativa da Comunidade:** Exploração de criações 3D com filtros por jogo, estado (Todos, Finalistas, Mais Votados) e ordenação por relevância.
3. **Mecanismo de Submissão e Votação com Supercell ID:** Autenticação de utilizadores, submissão de conceitos com imagens e metadados técnicos, e sistema de votação com barreira de 250 votos para apuramento como Finalista.
4. **Sistema de Apoio Inteligente (Chatbot):** Assistente contextualizado especializado nas regras do site, limites de polígonos (4.000 tris) e localização dos botões de ação na interface.
5. **Agendamento Direto de Mentoria e Reuniões:** Módulo interativo de marcação de reuniões sincronizado com o **Cal.com** e notificação para o Outlook institucional.

### 1.3 Segmento de Clientes (Público-Alvo)
- **Modeladores e Artistas 3D (Blender / Maya / ZBrush):** Criadores que pretendem descarregar templates, submeter ficheiros/turnarounds e acompanhar o feedback da comunidade.
- **Jogadores e Fãs de Brawl Stars / Clash Royale / Clash of Clans:** Comunidade gamer que avalia, descobre conceitos criativos e vota nas suas skins preferidas.
- **Mentores e Avaliadores Técnicos:** Docentes e parceiros didáticos que necessitam de agendar revisões técnicas de portfólio 3D ou reuniões de esclarecimento de projeto.

---

## 2. Funcionalidades Principais (Features)

| Funcionalidade | Descrição | Valor de Negócio / UX |
| :--- | :--- | :--- |
| **Autenticação Simulada Supercell ID** | Login e gestão de sessão com Nickname e Tag de jogador única (`#USER`). | Garante a integridade da votação (1 voto por skin) e atribuição de autoria. |
| **Galeria & Votação Comunitária** | Listagem de conceitos com contadores de votos em tempo real, status dinâmico (*Em Progresso* $\rightarrow$ *Finalista* aos 250 votos) e modal de detalhe com zoom e especificações. | Fomenta o engajamento da comunidade e feedback peer-to-peer. |
| **Mecanismo de Submissão de Skins** | Modal completo com validação de campos: título, seleção de campanha/jogo, descrição/lore, software 3D utilizado (Blender, etc.) e anexo de render visual. | Facilita a submissão de arte para aprovação sem atrito para o utilizador. |
| **Módulo de Agendamento Cal.com Integrado** | Calendário interativo com bloqueio dinâmico dos 3 primeiros dias úteis, seleção de horários de Lisboa (WET), duração personalizável (15 a 120 min), geração e download de convites `.ics` e sincronização com `@Guilherme Carapinha_real`. | Automatiza o contacto direto com o criador e mentor do projeto. |
| **Chatbot Assistente com IA & Fallback** | Agente de IA com instruções de sistema estritas sobre o portal, limites de polígonos (4.000 tris), botões da interface e atalho direto para abrir o formulário. | Apoio contínuo 24/7 sem dispersão para temas fora do escopo. |
| **Aviso de Conformidade & Cookies** | Banner de privacidade com consentimento de cookies e aviso de responsabilidade educativa (não-oficial). | Conformidade com o RGPD e transparência institucional com a Supercell. |
| **Design Responsivo & Mobile-First** | Drawer lateral para smartphones, navegação tátil fluida e tipografia moderna (Inter e Montserrat). | Acessibilidade universal em qualquer ecrã ou dispositivo. |

---

## 3. Detalhes de Implementação e Desafios

### 3.1 Descrição da Implementação Técnica
- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Motion (Framer Motion) e Lucide React.
- **Backend / API:** Node.js com Express e TSX, servindo rotas de API (`/api/chat`, `/api/health`) e ficheiros estáticos de produção (`dist`).
- **Camada de Inteligência Artificial:** Google GenAI SDK (`@google/genai` com modelo `gemini-3.8-flash`) com orquestração segura do lado do servidor e motor de regras offline para redundância.
- **Ferramenta de Build & Bundling:** Vite 8.3 com `@tailwindcss/vite` e `esbuild` para transpilação CJS/ESM.
- **Hospedagem & CI/CD:** Vercel (distribuição global na Edge com redirecionamentos SPA em `vercel.json`).

### 3.2 Desafios Técnicos e Soluções Adotadas

1. **Resolução de Dependências Estritas no Vercel (npm ERESOLVE):**
   - *Problema:* O build na cloud do Vercel falhava com `npm error ERESOLVE could not resolve` devido a versões desencontradas de `esbuild` exigidas pelo `vite@8.3.1`.
   - *Solução:* Atualização explícita do `esbuild` para `^0.28.0` e introdução do ficheiro `.npmrc` com `legacy-peer-deps=true`.
2. **Compatibilidade Multi-Porta em Ambientes Cloud (Cloud Run / Local):**
   - *Problema:* O ambiente de contentores Cloud Run injetava dinamicamente `PORT=8080`, enquanto o ambiente local operava na porta `3000`.
   - *Solução:* Implementação de listener duplo no `server.ts` capaz de responder em simultâneo na porta 3000 e na porta atribuída pela Cloud (`process.env.PORT`).
3. **Lógica de Agendamento Dinâmico (Sem Padrões Artificiais):**
   - *Problema:* O calendário apresentava bloqueios recorrentes de 3 em 3 dias que impediam a marcação contínua ao longo do mês.
   - *Solução:* Reformulação algorítmica no `ScheduleMeetingModal.tsx` calculando estritamente os **3 dias úteis imediatos à data de hoje** como ocupados, libertando 100% dos restantes dias úteis para marcação.
4. **Precisão da Base de Conhecimento e Limites de Moderação:**
   - *Problema:* Existência de mitos no FAQ sobre recompensas monetárias no evento da skin do Clancy.
   - *Solução:* Remoção cirúrgica da pergunta errónea nas FAQs e reconfiguração da base local e da *System Instruction* do bot para destacar que o vencedor obtém a inclusão oficial no jogo, sem compensações financeiras.

---

## 4. Recursos de AI & Artefatos de Desenvolvimento

### 4.1 Prompt Inicial de Criação (Google AI Studio / Lovable)
```text
Cria uma réplica completa e interativa do website oficial "Supercell Make" voltada para a comunidade criativa e para fins didáticos:
- Design gamer moderno com tema escuro (#14121F), tipografia marcante, cartões de campanhas (Brawl Stars, Clash Royale, Clash of Clans) e galeria de skins criadas por fãs.
- Funcionalidade de votação interativa com contagem de votos e threshold de 250 votos para tornar a skin "Finalista", associada a um sistema de login simulado com Supercell ID.
- Modal de submissão de novas skins com upload de conceito visual, escolha de jogo, ferramentas 3D utilizadas (Blender, Maya) e descrição de lore.
- Assistente virtual/Chatbot inteligente de apoio que responde a dúvidas sobre regras do site, limites de polígonos (4.000 tris para Brawl Stars, 6.500 tris para CoC), localização dos botões de submissão e processo de aprovação.
- Sistema de marcação de reuniões integrado com Cal.com (utilizador Guilherme Carapinha_real, e-mail Outlook ggcaa1@iscte-iul.pt), com calendário interativo, bloqueio dos primeiros 3 dias úteis, seleção de slots horários e download de convite .ics.
- Secção de FAQs expansível, banner de consentimento de cookies e aviso explícito de modelo educacional não-oficial.
```

### 4.2 Links de Acesso e Código-Fonte
- **URL da Landing Page em Produção (Vercel):**  
  👉 [https://super-cell-make-hub-clone.vercel.app](https://super-cell-make-hub-clone.vercel.app)
- **Repositório de Código-Fonte no GitHub:**  
  👉 [https://github.com/Guidocraque/SuperCell-Make-HUB---clone](https://github.com/Guidocraque/SuperCell-Make-HUB---clone)

---

## 5. FAQs Completas do Produto

Abaixo encontra-se a lista integral das perguntas e respostas oficiais disponibilizadas na secção de apoio da plataforma:

### Categoria: Geral
1. **Como posso marcar uma reunião ou falar diretamente com a organização?**
   - *Resposta:* Podes agendar uma reunião diretamente connosco clicando no botão "Marcar Reunião" no website! O agendamento abre um calendário interativo sincronizado com o Cal.com através da conta "Guilherme Carapinha_real" (com contacto no Outlook `ggcaa1@iscte-iul.pt`). Podes escolher o dia disponível (a partir de 3 dias do dia atual), selecionar a razão (como Dúvidas Rápidas, Revisão Técnica 3D ou Parcerias em Projetos) e personalizar livremente o tempo de duração da reunião!
2. **Este website é o site oficial da Supercell?**
   - *Resposta:* Não. Este website é exclusivamente um modelo de demonstração desenvolvido para fins didáticos e educacionais. Não é o website oficial da Supercell nem possui filiação ou vínculo com a Supercell Oy. Para aceder aos serviços, jogos e competições oficiais da empresa, visita o site oficial em `https://supercell.com` ou o portal original `https://make.supercell.com`.
3. **O que é o Supercell Make e como funciona?**
   - *Resposta:* O Supercell Make é o portal oficial onde fãs e artistas 3D da comunidade podem criar, partilhar e votar em conceitos de skins para os jogos da Supercell. As criações vencedoras são selecionadas pela equipa da Supercell e integradas oficialmente nos jogos (como Brawl Stars, Clash Royale e Clash of Clans)!

### Categoria: Competições & Submissão
4. **Quem pode participar nas competições e eventos?**
   - *Resposta:* Qualquer jogador ou criador maior de 13 anos (ou idade legal no seu país) com uma conta Supercell ID pode participar! Não precisas de ser um artista profissional: aceitamos tanto modelos 3D completos como conceitos 2D detalhados com vistas ortogonais (front/side/back turnarounds).
5. **Como submeter uma skin para uma campanha ativa?**
   - *Resposta:* Para submeter uma skin: 1) Faz login com Supercell ID no botão "Entrar" no topo; 2) Clica no botão "Submeter Skin" no cabeçalho ou menu móvel; 3) Escolhe a campanha/jogo (ex: Brawl Stars); 4) Insere o título, descrição e imagem/render da tua criação; 5) Clica em "Publicar Criação" para enviar para validação e aprovação!
6. **Quais são as recompensas para os vencedores das campanhas?**
   - *Resposta:* Os criadores das skins vencedoras selecionadas pela Supercell têm a honra e o prestígio de ver o seu trabalho modelado, animado e lançado oficialmente dentro do jogo para milhões de jogadores mundiais, com o seu nome creditado na comunidade!

### Categoria: Diretrizes Técnicas 3D
7. **Quais são os limites técnicos e orçamentos de polígonos?**
   - *Resposta:* Para Brawl Stars, o limite padrão é de 4.000 triângulos (tris) para garantir alta performance móvel a 60/120 FPS. Para Heróis de Clash of Clans (ex: Barbarian King), o limite é de 6.500 tris. As skins de Torre em Clash Royale devem respeitar as dimensões da grelha de 3x3 ou 4x4 tiles.
8. **Que programas e softwares posso utilizar para criar as skins?**
   - *Resposta:* Podes utilizar qualquer software de modelação 3D ou ilustração digital! Os mais comuns e recomendados são Blender (gratuito e de código aberto), Autodesk Maya, ZBrush, Substance 3D Painter, Photoshop e Procreate. Os ficheiros de submissão finais devem ser exportados em formato .BLEND, .FBX ou .OBJ com mapas de texturas PNG.

### Categoria: Votação & Supercell ID
9. **Como funciona a votação e quantos votos são precisos para ser Finalista?**
   - *Resposta:* Qualquer utilizador autenticado com Supercell ID pode votar nas suas skins preferidas (1 voto por criação). As criações que atinjam 250 ou mais votos qualificam-se automaticamente como "Finalistas"! A equipa interna de artistas e diretores da Supercell avalia então todos os Finalistas e escolhe o Vencedor Oficial.
10. **Porque preciso do Supercell ID para votar ou submeter?**
    - *Resposta:* O Supercell ID garante a segurança e integridade do processo de votação, prevenindo fraudes e bots. Além disso, permite associar a tua criação diretamente à tua conta de jogador de Brawl Stars, Clash Royale ou Clash of Clans para atribuição de créditos no jogo.

### Categoria: Jogos Suportados
11. **Quais os jogos da Supercell que acolhem competições no Make?**
    - *Resposta:* Atualmente o Supercell Make acolhe competições para: 1) Brawl Stars (Brawlers como Clancy, Mortis, Fang, Kit, Piper, Belle, etc.); 2) Clash Royale (Princess Towers, King Towers e emotes); 3) Clash of Clans (Heróis: Barbarian King, Archer Queen, Grand Warden, Royal Champion e Cenários); 4) Hay Day (Decorações temáticas e espantalhos animados).
12. **Como funcionam as novas Tower Skins de Clash Royale?**
    - *Resposta:* Foi recentemente anunciado no Make que agora os criadores podem criar Skins de Torre de Princesa e Torre do Rei para o Clash Royale! Os modelos devem contemplar animações de disparo, recuo, danos progressivos (100%, 50% e destruição) e partículas de entulho.

---

## 6. Canais de Agendamento e Contacto

Para reuniões de mentoria, apresentação do projeto didático, análise de portfólio 3D ou esclarecimento de parcerias com o autor:

- **Plataforma de Agendamento:** Cal.com
- **URL Direto do Cal.com:**  
  👉 [https://cal.com/guilherme_carapinha_real](https://cal.com/guilherme_carapinha_real)
- **Nome de Utilizador Cal.com:** `Guilherme Carapinha_real`
- **Contacto Institucional Outlook:** `ggcaa1@iscte-iul.pt`
- **Contacto Pessoal:** `gui.carapinha@gmail.com`
- **Integração no Site:** Botão **"Marcar Reunião"** disponível na barra de navegação superior, no footer e no botão flutuante persistente no canto inferior direito.
