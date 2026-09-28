import { Creation, Campaign } from '../types';

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'clancy-esports-japan',
    title: 'MAKE a Clancy esports skin inspired by Japan!',
    game: 'Brawl Stars',
    character: 'Clancy',
    theme: 'Esports & Neo-Tokyo Cyberpunk',
    status: 'Closed',
    submissionsCount: 428,
    prize: '$2,500 USD + In-Game Skin Feature + 25% Net Royalties',
    deadline: 'Voting Ended July 14',
    bannerImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    accentGradient: 'from-purple-900 via-indigo-900 to-black',
    description: 'Design an esports-themed skin for Clancy inspired by Japanese culture, folklore, streetwear, or mecha robotics! The chosen winner will have their skin modeled and placed permanently into Brawl Stars.',
    brief: [
      'Clancy must be clearly recognizable from top-down mobile camera view',
      'Infuse esports vibrancy: neon accents, tournament badge motifs, or futuristic streetwear',
      'Incorporate traditional or modern Japanese aesthetics (origami, kabuki, cyber samurai, ramen, cherry blossoms, shinkansen)',
      'Include front, side, back turnarounds and weapon/attack FX concept'
    ],
    rules: [
      'Must use the official Clancy 3D model template',
      'Maximum 4,000 polygons for standard mobile performance',
      'No third-party intellectual property or copyrighted logos',
      'Original community artwork only'
    ]
  },
  {
    id: 'tower-skins-clash-royale',
    title: 'Tower Skins for Clash Royale have been added to Make!',
    game: 'Clash Royale',
    character: 'Princess & King Towers',
    theme: 'Epic Fortress & Legendary Arenas',
    status: 'Open',
    submissionsCount: 194,
    prize: '$3,000 USD + Feature in Pass Royale Season',
    deadline: 'Submissions close in 14 days',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    accentGradient: 'from-amber-700 via-yellow-900 to-black',
    description: 'For the first time ever in Supercell Make history: creators can design Princess Tower and King Tower skins for Clash Royale arenas!',
    brief: [
      'Create matching skins for 1 King Tower and 2 Princess Towers',
      'Animations for tower destruction, idle flags, and cannon recoil',
      'Distinct damage states (100% HP, 50% HP, critical smoke)'
    ],
    rules: [
      'Skins must fit standard 3x3 and 4x4 arena tile grids',
      'Include destruction debris particles'
    ]
  },
  {
    id: 'make-anything-coc',
    title: 'MAKE ANYTHING! Town Hall 17 Hero Skin Showcase',
    game: 'Clash of Clans',
    character: 'Barbarian King & Archer Queen',
    theme: 'Wildcard Fantasy & Sci-Fi',
    status: 'Closed',
    submissionsCount: 890,
    prize: '$2,500 USD + Official Hero Skin',
    deadline: 'Campaign Closed',
    bannerImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    accentGradient: 'from-rose-900 via-pink-950 to-black',
    description: 'An open-ended creative sprint where Supercell fans reimagined classic Clash of Clans heroes in entirely new mythical and cosmic dimensions.',
    brief: [
      'Must convey powerful hero aura',
      'Dynamic attack animations and sleeping pedestal skin',
      'Distinct audio/visual identity'
    ],
    rules: [
      'Max polygon budget: 6,500 vertices',
      'Must work with existing skeletal rigs'
    ]
  }
];

export const INITIAL_CREATIONS: Creation[] = [
  {
    id: 'kit-futurista',
    title: 'Kit Futurista',
    game: 'Brawl Stars',
    character: 'Kit',
    creator: {
      name: 'PixelPaw_Studio',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=KitFuturista',
      badge: 'Verified Maker'
    },
    votes: 284,
    isFinalist: true,
    badgeType: 'Finalist',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    imageAlt: 'Kit Futurista 3D render preview',
    accentColor: '#38bdf8',
    description: 'Kit transformed into a sleek holographic cyber-cat equipped with anti-gravity yarn orbs and a neon visor helmet. Finalist selected for final Supercell design review!',
    toolsUsed: ['Blender 4.1', 'Substance 3D Painter', 'Photoshop'],
    createdAt: '3 days ago',
    campaignId: 'clancy-esports-japan',
    polyCount: '3,840 tris'
  },
  {
    id: 'upper-curse-fang',
    title: 'Upper Curse Fang',
    game: 'Brawl Stars',
    character: 'Fang',
    creator: {
      name: 'RoninKicks',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=CurseFang',
      badge: 'Community Veteran'
    },
    votes: 540,
    isFinalist: true,
    badgeType: 'Finalist',
    thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    imageAlt: 'Upper Curse Fang martial arts skin',
    accentColor: '#f43f5e',
    description: 'Dark anime cursed energy flowing through Fang’s sneakers. When executing his super kick, spectral dragon talons burst forth in fiery purple spirit flames.',
    toolsUsed: ['ZBrush', 'Blender', 'Procreate'],
    createdAt: '5 days ago',
    campaignId: 'clancy-esports-japan',
    polyCount: '4,100 tris'
  },
  {
    id: 'stone-wizard',
    title: 'Stone Wizard Tower',
    game: 'Clash Royale',
    character: 'Princess & King Towers',
    creator: {
      name: 'RuneCrafter_Royale',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=StoneWizard',
      badge: 'Top 3D Modeler'
    },
    votes: 328,
    isFinalist: true,
    badgeType: 'Finalist',
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    imageAlt: 'Stone Wizard Tower Skin',
    accentColor: '#a855f7',
    description: 'Ancient obsidian monolith carved with glowing arcane runes. The crown is guarded by a levitating crystalline wizard staff firing elemental sparks.',
    toolsUsed: ['Maya', 'Blender', 'Substance Designer'],
    createdAt: '1 week ago',
    campaignId: 'tower-skins-clash-royale',
    polyCount: '3,200 tris'
  },
  {
    id: 'cyber-samurai-clancy',
    title: 'Cyber Samurai Clancy',
    game: 'Brawl Stars',
    character: 'Clancy',
    creator: {
      name: 'TokyoPixel_99',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=CyberClancy',
      badge: 'Supercell Staff Pick'
    },
    votes: 1250,
    isWinner: true,
    badgeType: 'Winner',
    thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    imageAlt: 'Cyber Samurai Clancy campaign winner skin',
    accentColor: '#ec4899',
    description: 'Official Winner of the Japan Esports Campaign! Features an authentic kabuki lacquer armor shell, dual thermal katana pinchers, and cherry blossom jet thrusters.',
    toolsUsed: ['Blender', 'Substance Painter', 'Clip Studio Paint'],
    createdAt: '2 weeks ago',
    campaignId: 'clancy-esports-japan',
    polyCount: '3,950 tris'
  },
  {
    id: 'sakura-piper',
    title: 'Sakura Flutter Piper',
    game: 'Brawl Stars',
    character: 'Piper',
    creator: {
      name: 'MochiBrawler',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=SakuraPiper',
      badge: 'Art Director Favorite'
    },
    votes: 890,
    isStaffPick: true,
    badgeType: 'Staff Pick',
    thumbnail: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600&auto=format&fit=crop&q=80',
    imageAlt: 'Sakura Flutter Piper skin',
    accentColor: '#f472b6',
    description: 'A delicate traditional parasol blossoming into spiraling cherry blossom petals upon firing sniper rounds with custom tea blossom grenades.',
    toolsUsed: ['Blender 4.0', 'Photoshop'],
    createdAt: '1 week ago',
    campaignId: 'clancy-esports-japan',
    polyCount: '3,700 tris'
  },
  {
    id: 'dragon-king-coc',
    title: 'Draconic Sovereign King',
    game: 'Clash of Clans',
    character: 'Barbarian King',
    creator: {
      name: 'VikingForge',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=DragonKing',
      badge: 'Finalist'
    },
    votes: 920,
    isFinalist: true,
    badgeType: 'Finalist',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    imageAlt: 'Dragon King skin for Barbarian King',
    accentColor: '#ea580c',
    description: 'Forged from molten dragon scales and crimson magma ore, this heavy barbarian armor breathes embers with every cleave.',
    toolsUsed: ['ZBrush', 'Marmoset Toolbag', 'Blender'],
    createdAt: '2 weeks ago',
    campaignId: 'make-anything-coc',
    polyCount: '5,200 tris'
  },
  {
    id: 'steampunk-scarecrow-hayday',
    title: 'Clockwork Automaton Scarecrow',
    game: 'Hay Day',
    character: 'Scarecrow Decoration',
    creator: {
      name: 'BarnyardMechanic',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=HayDaySteam',
      badge: 'Community Pick'
    },
    votes: 310,
    isFinalist: true,
    badgeType: 'Finalist',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    imageAlt: 'Clockwork Automaton Scarecrow for Hay Day',
    accentColor: '#ca8a04',
    description: 'Brass gears and gentle steam puffs keep crows away from your wheat harvest while tipping a stylish copper top hat to visiting neighbors.',
    toolsUsed: ['Blender', 'Substance 3D'],
    createdAt: '3 weeks ago',
    campaignId: 'make-anything-coc',
    polyCount: '2,900 tris'
  },
  {
    id: 'neon-mecha-mortis',
    title: 'Neon Overdrive Mortis',
    game: 'Brawl Stars',
    character: 'Mortis',
    creator: {
      name: 'CyberDagger',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=MechaMortis',
      badge: 'Finalist'
    },
    votes: 1540,
    isFinalist: true,
    badgeType: 'Finalist',
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    imageAlt: 'Neon Overdrive Mortis skin preview',
    accentColor: '#8b5cf6',
    description: 'Mortis outfitted in sleek aerodynamic carbon fiber armor with an energized plasma shovel that leaves neon dash trails across the arena.',
    toolsUsed: ['Blender', 'Substance Painter', 'Photoshop'],
    createdAt: '2 weeks ago',
    campaignId: 'clancy-esports-japan',
    polyCount: '4,200 tris'
  }
];
