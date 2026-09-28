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
    answer: 'O Supercell Make é o portal oficial onde fãs e artistas 3D da comunidade podem criar, partilhar e votar em conceitos de skins para os jogos da Supercell. As criações vencedoras são selecionadas pela equipa da Supercell e integradas oficialmente nos jogos (como Brawl Stars, Clash Royale e Clash of Clans), recebendo prémios em dinheiro e royalties!',
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
    answer: 'Para submeter uma skin: 1) Acede à secção de Campanhas e escolhe a campanha aberta; 2) Descarrega o template 3D oficial do personagem; 3) Modela ou desenha a tua skin respeitando o tema; 4) Clica no botão "Submit Skin" no topo da página; 5) Preenche o título, descrição, ferramentas usadas e anexa as imagens da tua criação!',
    tags: ['submeter', 'enviar', 'upload', 'passo a passo', 'templates']
  },
  {
    id: 'campaign-prizes',
    category: 'Competições',
    question: 'Quais são os prémios para os vencedores das campanhas?',
    answer: 'Os vencedores recebem prémios monetários significativos (tipicamente entre $2,500 e $3,000 USD), além de terem a sua skin implementada para sempre dentro do jogo oficial e uma percentagem de royalties (até 25% do valor líquido das vendas da skin no jogo)!',
    tags: ['prémios', 'dinheiro', 'royalties', 'recompensas', 'vencedor']
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
    id: 'clancy-campaign-details',
    category: 'Jogos',
    question: 'O que é a campanha do Clancy Esports Japan?',
    answer: 'É uma das maiores campanhas em destaque no Supercell Make! O desafio pede aos criadores para desenharem uma skin de esports para o brawler Clancy inspirada na cultura, folclore, mechas ou streetwear japonês (como kabuki, samurais, neons de Tóquio ou cerejeiras). O vencedor recebe $2,500 USD e inclusão no jogo!',
    tags: ['clancy', 'esports', 'japão', 'brawl stars', 'campanha ativa']
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
  'Como marcar reunião com Guilherme Carapinha?',
  'Como posso participar nas competições?',
  'Quais as regras para a campanha do Clancy?',
  'Quantos votos são precisos para ser Finalista?',
  'Qual é o limite de polígonos para Brawl Stars?',
  'Como funciona a votação com Supercell ID?',
  'Que jogos da Supercell fazem parte do Make?'
];

// Offline knowledge matcher strictly adhering to Supercell Make & related games
export function answerFromLocalKnowledge(prompt: string): string {
  const p = prompt.toLowerCase().trim();

  // Meeting scheduling with Guilherme Carapinha via Cal.com
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
    return 'Podes marcar uma reunião diretamente connosco através da integração com o **Cal.com**!\n\n📅 **Linha de Contacto & Sincronização:**\n• **Nome de Utilizador Cal.com**: Guilherme Carapinha_real\n• **E-mail Outlook**: ggcaa1@iscte-iul.pt\n• **Link Cal.com**: https://cal.com/guilherme_carapinha_real\n\nClica no botão **"Marcar Reunião"** no canto inferior direito ou no menu superior para escolheres o teu dia e horário (15, 30 ou 45 min) e gerar o convite de calendário (.ics) sincronizado!';
  }

  // Check off-topic questions (strictly reject)
  const offTopicKeywords = [
    'clima', 'tempo amanhã', 'receita', 'bolo', 'presidente', 'política',
    'futebol', 'bitcoin', 'cripto', 'chatgpt', 'openai', 'fortnite', 'roblox',
    'league of legends', 'minecraft', 'capital de', 'quem é messi', 'quem é ronaldo',
    'weather', 'politics', 'crypto', 'recipe', 'cooking'
  ];

  for (const word of offTopicKeywords) {
    if (p.includes(word)) {
      return 'Sou o assistente especializado do **Supercell Make**. O meu conhecimento está estritamente focado neste website, nas campanhas e competições de skins, nas regras de submissão e nos jogos da Supercell integrados (Brawl Stars, Clash Royale, Clash of Clans e Hay Day).\n\nPosso ajudar-te com: como participar num evento, limites de polígonos 3D, votações com Supercell ID ou detalhes das campanhas!';
    }
  }

  // Specific campaign: Clancy Japan
  if (p.includes('clancy') || (p.includes('japão') || p.includes('japan'))) {
    return 'A campanha **"MAKE a Clancy esports skin inspired by Japan!"** desafia a comunidade a criar um visual de desportos eletrónicos para o Clancy inspirado no Japão (streetwear cyberpunk, armaduras samurai, kabuki ou néon). O vencedor recebe **$2,500 USD** e a skin será adicionada permanentemente ao Brawl Stars!';
  }

  // Clash Royale tower skins
  if (p.includes('torre') || p.includes('tower') || p.includes('clash royale')) {
    return 'As **Tower Skins para Clash Royale** foram recentemente adicionadas ao Supercell Make! Podes criar skins para a Princess Tower e King Tower com animações de recuo de canhão e estados de destruição em grelhas de 3x3 ou 4x4 tiles. A campanha tem um prémio de **$3,000 USD** e destaque no Pass Royale!';
  }

  // Voting and Finalist requirements
  if (p.includes('voto') || p.includes('finalista') || p.includes('quantos votos') || p.includes('voting')) {
    return 'Para uma criação se tornar **Finalista**, precisa de alcançar **250+ votos** da comunidade! A votação requer autenticação com **Supercell ID** (cada utilizador tem direito a 1 voto por criação). Depois da fase de votação popular, os artistas e diretores da Supercell avaliam os Finalistas e elegem o Vencedor Oficial.';
  }

  // 3D Polygons and technical rules
  if (p.includes('polígon') || p.includes('poly') || p.includes('tris') || p.includes('blender') || p.includes('formato')) {
    return 'Os orçamentos de polígonos técnicos no Supercell Make são:\n• **Brawl Stars**: Até 4.000 triângulos (tris), mantendo leitura clara da câmara isométrica móvel.\n• **Clash of Clans**: Até 6.500 tris para Heróis (Barbarian King, Archer Queen).\n• **Softwares recomendados**: Blender, Autodesk Maya, ZBrush e Substance Painter.\n• **Ficheiros**: .BLEND, .FBX e imagens de turnaround (frente, perfil, costas).';
  }

  // Supercell ID
  if (p.includes('supercell id') || p.includes('login') || p.includes('conta')) {
    return 'O **Supercell ID** é a tua conta única para os jogos da Supercell e para o Supercell Make. É obrigatório para votar e submeter skins, prevenindo bots e associando a tua vitória diretamente à tua tag de jogador. Se ainda não tens, podes criar um gratuitamente em qualquer jogo da Supercell!';
  }

  // How to participate / step-by-step
  if (p.includes('como participar') || p.includes('participar') || p.includes('submeter') || p.includes('começar') || p.includes('create')) {
    return 'Para participares nas competições do Supercell Make:\n1. **Escolhe uma campanha**: Consulta as campanhas abertas no topo da página.\n2. **Descarrega o modelo 3D**: Faz o download do template oficial (.blend/.fbx).\n3. **Cria a tua skin**: Modela em 3D ou desenha vistas ortogonais (turnaround 2D).\n4. **Submete a criação**: Clica em "Submit Skin", insere o título, imagens e lore.\n5. **Partilha com a comunidade**: Reúne 250+ votos para entrares no grupo de Finalistas!';
  }

  // Games covered
  if (p.includes('jogo') || p.includes('games') || p.includes('quais jogos') || p.includes('brawl stars') || p.includes('clash of clans') || p.includes('hay day')) {
    return 'O Supercell Make acolhe atualmente competições para 4 grandes jogos da Supercell:\n• **Brawl Stars**: Skins completas para brawlers (ex: Clancy, Mortis, Fang, Kit, Piper).\n• **Clash Royale**: Skins de Torre do Rei e Torre da Princesa.\n• **Clash of Clans**: Skins temáticas para Heróis (Barbarian King, Archer Queen).\n• **Hay Day**: Decorações rurais e estátuas de espantalho animadas.';
  }

  // Prizes
  if (p.includes('prémio') || p.includes('premio') || p.includes('dinheiro') || p.includes('ganhar') || p.includes('prize')) {
    return 'Os prémios para as campanhas do Supercell Make incluem:\n• Prémio financeiro entre **$2,500 e $3,000 USD** pagos diretamente ao criador.\n• A tua criação modelada e lançada mundialmente dentro do jogo oficial.\n• Até **25% de royalties líquidas** sobre as vendas da skin no jogo!';
  }

  // Default helpful response within website scope
  return 'O **Supercell Make** é a plataforma oficial da Supercell onde a comunidade desenha skins para Brawl Stars, Clash Royale e Clash of Clans. Podes perguntar-me sobre:\n• Como participar e submeter uma skin\n• Regras e limites de polígonos 3D (ex: 4.000 tris em Brawl Stars)\n• Como funcionam os 250+ votos para ser Finalista\n• Detalhes das campanhas ativas (Clancy Esports Japan, Tower Skins Royale)\n• Como usar o teu Supercell ID!';
}
