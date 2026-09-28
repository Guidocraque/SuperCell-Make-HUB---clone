export interface FaqItem {
  id: string;
  category: 'Geral' | 'Competições' | 'Diretrizes 3D' | 'Votação & Supercell ID' | 'Jogos';
  question: string;
  answer: string;
  tags: string[];
}

export const FAQ_CATEGORIES = [
  'Todas',
  'Geral',
  'Competições',
  'Diretrizes 3D',
  'Votação & Supercell ID',
  'Jogos',
] as const;

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'schedule-meeting-calcom',
    category: 'Geral',
    question: 'Como posso marcar uma reunião ou falar diretamente com a organização?',
    answer: 'Podes agendar uma reunião diretamente connosco clicando no botão "Marcar Reunião" no website! O agendamento abre um calendário interativo sincronizado com o Cal.com através da conta "Guilherme Carapinha_real" (com contacto no Outlook ggcaa1@iscte-iul.pt). Podes escolher o dia disponível (a partir de 3 dias do dia atual), selecionar a razão (como Dúvidas Rápidas, Revisão Técnica 3D ou Parcerias em Projetos) e personalizar livremente o tempo de duração da reunião!',
    tags: ['reunião', 'agendar', 'cal.com', 'contacto', 'outlook', 'guilherme carapinha', 'mentoria']
  },
  {
    id: 'is-official-site',
    category: 'Geral',
    question: 'Este website é o site oficial da Supercell?',
    answer: 'Não. Este website é exclusivamente um modelo de demonstração desenvolvido para fins didáticos e educacionais. Não é o website oficial da Supercell nem possui filiação ou vínculo com a Supercell Oy. Para aceder aos serviços, jogos e competições oficiais da empresa, visita o site oficial em https://supercell.com ou o portal original https://make.supercell.com.',
    tags: ['oficial', 'modelo', 'didático', 'supercell', 'aviso', 'original', 'educacional', 'site oficial']
  },
  {
    id: 'what-is-supercell-make',
    category: 'Geral',
    question: 'O que é o Supercell Make e como funciona?',
    answer: 'O Supercell Make é o portal oficial onde fãs e artistas 3D da comunidade podem criar, partilhar e votar em conceitos de skins para os jogos da Supercell. As criações vencedoras são selecionadas pela equipa da Supercell e integradas oficialmente nos jogos (como Brawl Stars, Clash Royale e Clash of Clans)!',
    tags: ['sobre', 'funciona', 'supercell make', 'comunidade', 'skins']
  },
  {
    id: 'who-can-participate',
    category: 'Competições',
    question: 'Quem pode participar nas competições e eventos?',
    answer: 'Qualquer jogador ou criador maior de 13 anos (ou idade legal no seu país) com uma conta Supercell ID pode participar! Não precisas de ser um artista profissional: aceitamos tanto modelos 3D completos como conceitos 2D detalhados com vistas ortogonais (front/side/back turnarounds).',
    tags: ['participar', 'idade', 'requisitos', 'inscrição', 'iniciantes']
  },
  {
    id: 'how-to-submit-skin',
    category: 'Competições',
    question: 'Como submeter uma skin para uma campanha ativa?',
    answer: 'Para submeter uma skin: 1) Faz login com Supercell ID no botão "Entrar" no topo; 2) Clica no botão "Submeter Skin" no cabeçalho ou menu móvel; 3) Escolhe a campanha/jogo (ex: Brawl Stars); 4) Insere o título, descrição e imagem/render da tua criação; 5) Clica em "Publicar Criação" para enviar para validação e aprovação!',
    tags: ['submeter', 'enviar', 'upload', 'passo a passo', 'templates', 'botão']
  },
  {
    id: 'campaign-prizes',
    category: 'Competições',
    question: 'Quais são as recompensas para os vencedores das campanhas?',
    answer: 'Os criadores das skins vencedoras selecionadas pela Supercell têm a honra e o prestígio de ver o seu trabalho modelado, animado e lançado oficialmente dentro do jogo para milhões de jogadores mundiais, com o seu nome creditado na comunidade!',
    tags: ['recompensas', 'vencedor', 'jogo oficial', 'créditos', 'reconhecimento']
  },
  {
    id: '3d-requirements',
    category: 'Diretrizes 3D',
    question: 'Quais são os limites técnicos e orçamentos de polígonos?',
    answer: 'Para Brawl Stars, o limite padrão é de 4.000 triângulos (tris) para garantir alta performance móvel a 60/120 FPS. Para Heróis de Clash of Clans (ex: Barbarian King), o limite é de 6.500 tris. As skins de Torre em Clash Royale devem respeitar as dimensões da grelha de 3x3 ou 4x4 tiles.',
    tags: ['polígonos', 'tris', '3d', 'blender', 'otimização', 'malha']
  },
  {
    id: 'software-accepted',
    category: 'Diretrizes 3D',
    question: 'Que programas e softwares posso utilizar para criar as skins?',
    answer: 'Podes utilizar qualquer software de modelação 3D ou ilustração digital! Os mais comuns e recomendados são Blender (gratuito e de código aberto), Autodesk Maya, ZBrush, Substance 3D Painter, Photoshop e Procreate. Os ficheiros de submissão finais devem ser exportados em formato .BLEND, .FBX ou .OBJ com mapas de texturas PNG.',
    tags: ['software', 'blender', 'maya', 'zbrush', 'procreate', 'formato']
  },
  {
    id: 'voting-threshold',
    category: 'Votação & Supercell ID',
    question: 'Como funciona a votação e quantos votos são precisos para ser Finalista?',
    answer: 'Qualquer utilizador autenticado com Supercell ID pode votar nas suas skins preferidas (1 voto por criação). As criações que atinjam 250 ou mais votos qualificam-se automaticamente como "Finalistas"! A equipa interna de artistas e diretores da Supercell avalia então todos os Finalistas e escolhe o Vencedor Oficial.',
    tags: ['votos', 'finalista', '250 votos', 'como votar', 'vitória']
  },
  {
    id: 'supercell-id-need',
    category: 'Votação & Supercell ID',
    question: 'Porque preciso do Supercell ID para votar ou submeter?',
    answer: 'O Supercell ID garante a segurança e integridade do processo de votação, prevenindo fraudes e bots. Além disso, permite associar a tua criação diretamente à tua conta de jogador de Brawl Stars, Clash Royale ou Clash of Clans para atribuição de créditos no jogo.',
    tags: ['supercell id', 'segurança', 'login', 'autenticação', 'conta']
  },
  {
    id: 'games-covered',
    category: 'Jogos',
    question: 'Quais os jogos da Supercell que acolhem competições no Make?',
    answer: 'Atualmente o Supercell Make acolhe competições para: 1) Brawl Stars (Brawlers como Clancy, Mortis, Fang, Kit, Piper, Belle, etc.); 2) Clash Royale (Princess Towers, King Towers e emotes); 3) Clash of Clans (Heróis: Barbarian King, Archer Queen, Grand Warden, Royal Champion e Cenários); 4) Hay Day (Decorações temáticas e espantalhos animados).',
    tags: ['jogos', 'brawl stars', 'clash royale', 'clash of clans', 'hay day']
  },
  {
    id: 'clash-royale-towers',
    category: 'Jogos',
    question: 'Como funcionam as novas Tower Skins de Clash Royale?',
    answer: 'Foi recentemente anunciado no Make que agora os criadores podem criar Skins de Torre de Princesa e Torre do Rei para o Clash Royale! Os modelos devem contemplar animações de disparo, recuo, danos progressivos (100%, 50% e destruição) e partículas de entulho.',
    tags: ['clash royale', 'torres', 'skins de torre', 'anúncio']
  }
];

export const SUGGESTED_QUESTIONS = [
  'Onde fica o botão para submeter uma skin?',
  'Como funciona o mecanismo de aprovação no site?',
  'Como marcar reunião com Guilherme Carapinha?',
  'Quantos votos são precisos para ser Finalista?',
  'Qual é o limite de polígonos para Brawl Stars?',
  'Como funciona a votação com Supercell ID?',
  'Que jogos da Supercell fazem parte do Make?'
];

// Offline knowledge matcher strictly adhering to Supercell Make & related games
export function answerFromLocalKnowledge(prompt: string): string {
  const p = prompt.toLowerCase().trim();

  // 1. Where are the buttons / UI location guidance
  if (
    p.includes('onde fica o botão') ||
    p.includes('onde está o botão') ||
    p.includes('onde clico') ||
    p.includes('onde clicar') ||
    p.includes('onde encontro') ||
    p.includes('localização') ||
    (p.includes('onde') && (p.includes('botão') || p.includes('botao') || p.includes('submeter') || p.includes('enviar')))
  ) {
    return 'Os principais botões para colocares uma skin para aprovação encontram-se em:\n\n' +
      '🖥️ **No Computador / Desktop:**\n' +
      '• **Botão "Submeter Skin"**: No **canto superior direito** da barra de navegação (Header), destacado a azul/índigo com o ícone de pincel/`+`.\n' +
      '• **Botão "Submeter Nova Skin"**: Na secção de chamada para criadores a meio da página principal.\n' +
      '• **Botão "Entrar"**: Ao lado de Submeter Skin no topo direito, para login com Supercell ID.\n\n' +
      '📱 **No Telemóvel / Mobile:**\n' +
      '• Toca no **ícone do menu (três barras ☰)** no canto superior esquerdo e escolhe a opção **"Submeter Skin"** no menu deslizante.\n\n' +
      '💡 Podes clicar diretamente no botão que aparece abaixo desta mensagem para abrir logo o formulário de submissão!';
  }

  // 2. Submission & Approval Mechanism (Concise, simple process explanation)
  if (
    p.includes('aprovação') ||
    p.includes('aprovacao') ||
    p.includes('mecanismo') ||
    p.includes('processo') ||
    p.includes('como colocar') ||
    p.includes('como publicar') ||
    p.includes('colocar skin') ||
    (p.includes('como') && p.includes('submeter')) ||
    (p.includes('como') && p.includes('aprovar'))
  ) {
    return 'O mecanismo para colocar uma skin para aprovação no site funciona em **4 passos simples**:\n\n' +
      '1. **Iniciar Sessão**: Clica em **"Entrar"** no topo direito com o teu Supercell ID ou Nickname (o site solicita login caso ainda não tenhas entrado).\n' +
      '2. **Abrir a Submissão**: Clica no botão **"Submeter Skin"** (no cabeçalho à direita ou no menu móvel à esquerda).\n' +
      '3. **Preencher os Dados Básicos**: Insere o **Título da Skin**, seleciona o **Jogo / Campanha** (ex: Brawl Stars), escreve uma breve descrição e adiciona a imagem ou render do teu conceito.\n' +
      '4. **Validação & Aprovação**: Clica em **"Publicar Criação"**. O conceito é submetido ao mecanismo de validação comunitária e, uma vez aprovado, passa logo para a **Galeria Pública** para receber votos!\n\n' +
      '🌟 **Dica**: Quando a tua skin atingir **250 votos** da comunidade, torna-se automaticamente **Finalista** para avaliação da equipa da Supercell!';
  }

  // 3. Meeting scheduling with Guilherme Carapinha via Cal.com
  if (
    p.includes('reuni') ||
    p.includes('agendar') ||
    p.includes('marcar') ||
    p.includes('cal.com') ||
    p.includes('calcom') ||
    p.includes('guilherme') ||
    p.includes('carapinha') ||
    p.includes('outlook') ||
    p.includes('ggcaa1')
  ) {
    return 'Podes marcar uma reunião diretamente connosco através da integração com o **Cal.com**!\n\n' +
      '📅 **Linha de Contacto & Sincronização:**\n' +
      '• **Nome de Utilizador Cal.com**: Guilherme Carapinha_real\n' +
      '• **E-mail Outlook**: ggcaa1@iscte-iul.pt\n' +
      '• **Link Cal.com**: https://cal.com/guilherme_carapinha_real\n\n' +
      'Clica no botão flutuante **"Marcar Reunião"** no canto inferior direito ou no cabeçalho para escolheres o teu dia livre no calendário interativo (com antecedência mínima e duração editável)!';
  }

  // 4. Check off-topic questions (strictly reject)
  const offTopicKeywords = [
    'clima', 'tempo amanhã', 'receita', 'bolo', 'presidente', 'política',
    'futebol', 'bitcoin', 'cripto', 'chatgpt', 'openai', 'fortnite', 'roblox',
    'league of legends', 'minecraft', 'capital de', 'quem é messi', 'quem é ronaldo',
    'weather', 'politics', 'crypto', 'recipe', 'cooking'
  ];

  for (const word of offTopicKeywords) {
    if (p.includes(word)) {
      return 'Sou o assistente especializado do **Supercell Make**. O meu conhecimento está estritamente focado neste website, nas campanhas e competições de skins, nas regras de submissão e nos jogos da Supercell integrados (Brawl Stars, Clash Royale, Clash of Clans e Hay Day).\n\nPosso ajudar-te a encontrar os botões de submissão, explicar o mecanismo de aprovação de skins ou regras técnicas de 3D!';
    }
  }

  // 5. Specific campaign: Clancy Japan (Correcting myth - winner is chosen to join the game without cash prizes)
  if (p.includes('clancy') || (p.includes('japão') || p.includes('japan'))) {
    return 'A campanha **"MAKE a Clancy esports skin inspired by Japan!"** desafia a comunidade a criar um conceito de skin de esports para o brawler Clancy inspirado no Japão (streetwear, mechas, estética samurai ou néons de Tóquio).\n\nO conceito vencedor é selecionado pela equipa da Supercell para ser implementado oficialmente dentro do Brawl Stars e jogado por toda a comunidade mundial!';
  }

  // 6. Clash Royale tower skins
  if (p.includes('torre') || p.includes('tower') || p.includes('clash royale')) {
    return 'As **Tower Skins para Clash Royale** estão no Supercell Make! Podes criar skins para a Princess Tower e King Tower com animações de recuo de canhão e estados de destruição em grelhas de 3x3 ou 4x4 tiles. A criação vencedora ganha implementação oficial no jogo e destaque no Pass Royale!';
  }

  // 7. Voting and Finalist requirements
  if (p.includes('voto') || p.includes('finalista') || p.includes('quantos votos') || p.includes('voting')) {
    return 'Para uma criação se tornar **Finalista**, precisa de alcançar **250+ votos** da comunidade! A votação requer autenticação com **Supercell ID** (cada utilizador tem direito a 1 voto por criação). Depois da fase de votação popular, os artistas e diretores da Supercell avaliam os Finalistas e elegem a skin vencedora oficial.';
  }

  // 8. 3D Polygons and technical rules
  if (p.includes('polígon') || p.includes('poly') || p.includes('tris') || p.includes('blender') || p.includes('formato')) {
    return 'Os orçamentos de polígonos técnicos no Supercell Make são:\n• **Brawl Stars**: Até 4.000 triângulos (tris), mantendo leitura clara da câmara isométrica móvel.\n• **Clash of Clans**: Até 6.500 tris para Heróis (Barbarian King, Archer Queen).\n• **Softwares recomendados**: Blender, Autodesk Maya, ZBrush e Substance Painter.\n• **Ficheiros**: .BLEND, .FBX e imagens de turnaround (frente, perfil, costas).';
  }

  // 9. Supercell ID
  if (p.includes('supercell id') || p.includes('login') || p.includes('conta')) {
    return 'O **Supercell ID** é a tua conta única para os jogos da Supercell e para o Supercell Make. É obrigatório para votar e submeter skins, prevenindo bots e associando a tua criação diretamente ao teu perfil. Podes entrar clicando no botão **"Entrar"** no canto superior direito do website!';
  }

  // 10. How to participate / step-by-step
  if (p.includes('como participar') || p.includes('participar') || p.includes('submeter') || p.includes('começar') || p.includes('create')) {
    return 'Para participares nas competições do Supercell Make:\n' +
      '1. **Localiza o botão**: Clica em **"Submeter Skin"** no topo direito da barra de navegação (ou no menu móvel ☰).\n' +
      '2. **Faz login**: Entra com a tua conta Supercell ID / Nickname.\n' +
      '3. **Submete a tua criação**: Preenche o nome da skin, escolhe a campanha e anexa a imagem/render do conceito.\n' +
      '4. **Aprovação & Votos**: Após validação, a tua skin fica na galeria pública. Reúne **250 votos** para ser Finalista!';
  }

  // 11. Games covered
  if (p.includes('jogo') || p.includes('games') || p.includes('quais jogos') || p.includes('brawl stars') || p.includes('clash of clans') || p.includes('hay day')) {
    return 'O Supercell Make acolhe competições para 4 grandes jogos da Supercell:\n• **Brawl Stars**: Skins completas para brawlers (ex: Clancy, Mortis, Fang, Kit, Piper).\n• **Clash Royale**: Skins de Torre do Rei e Torre da Princesa.\n• **Clash of Clans**: Skins temáticas para Heróis (Barbarian King, Archer Queen).\n• **Hay Day**: Decorações rurais e estátuas de espantalho animadas.';
  }

  // 12. Default helpful response within website scope
  return 'Olá! Sou o assistente do **Supercell Make**. Posso ajudar-te com orientações práticas sobre o website:\n\n' +
    '• **Onde estão os botões**: O botão **"Submeter Skin"** e **"Entrar"** ficam no canto superior direito (ou no menu ☰ em dispositivos móveis).\n' +
    '• **Mecanismo de aprovação**: Como submeter uma skin e passar pela validação até à Galeria pública e aos 250 votos de Finalista.\n' +
    '• **Diretrizes 3D**: Limites de triângulos (4.000 tris em Brawl Stars) e formatos aceites.\n' +
    '• **Reuniões**: Agendamento de mentoria com Guilherme Carapinha via Cal.com.\n\n' +
    'Como posso ajudar-te agora?';
}
