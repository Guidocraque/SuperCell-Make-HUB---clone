import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { CatalogoItem, Pedido, Proposta } from '../src/types/proposta';

let dbInstance: Firestore | null = null;

export function getDb(): Firestore {
  if (!dbInstance) {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  }
  return dbInstance;
}

// 5 Itens de demonstração comercial para o Make HUB (Arte 3D e Criação de Skins)
export const DEMO_CATALOGO: CatalogoItem[] = [
  {
    id: 'servico-modelacao-3d-brawler',
    nome: 'Modelação 3D de Personagem/Skin (Low-Poly)',
    descricao: 'Criação de malha 3D completa e otimizada para mobile (até 4.000 triângulos para Brawl Stars), com topologia limpa e mapas UV abertos. (Preço de demonstração didática).',
    unidadeVenda: 'unidade',
    precoCentimos: 45000, // 450,00 €
    moeda: 'EUR',
    ativo: true,
    condicoes: 'Inclui entrega de ficheiro .FBX e ficheiro de trabalho Blender (.blend). Pressupõe conceito 2D de referência aprovado.',
    isDemonstracao: true,
  },
  {
    id: 'servico-texturizacao-handpainted',
    nome: 'Texturização PBR / Hand-Painted para Jogo',
    descricao: 'Pintura digital de mapas de cor (Albedo/Diffuse), Normal map e Rugosidade (Roughness) com estilo vibrante e compatível com shaders de jogos Supercell. (Preço de demonstração didática).',
    unidadeVenda: 'unidade',
    precoCentimos: 25000, // 250,00 €
    moeda: 'EUR',
    ativo: true,
    condicoes: 'Entrega de texturas em resolução 2048x2048 PNG. Requer modelo 3D com coordenadas UV já abertas.',
    isDemonstracao: true,
  },
  {
    id: 'servico-turnaround-concept-art',
    nome: 'Folha de Conceito & Turnaround 2D (Frente/Lado/Costas)',
    descricao: 'Ilustração conceptual completa com vistas ortogonais (turnarounds front/side/back), paleta de cores e detalhes visuais de armas/adornos para guiar modeladores 3D. (Preço de demonstração didática).',
    unidadeVenda: 'pacote',
    precoCentimos: 32000, // 320,00 €
    moeda: 'EUR',
    ativo: true,
    condicoes: 'Inclui até 2 rondas de revisão de rascunho e entrega de ficheiro .PSD em camadas + PNGs de alta definição.',
    isDemonstracao: true,
  },
  {
    id: 'servico-rigging-animacao-basica',
    nome: 'Rigging e Ciclo de Animação Básica (Idle/Ataque)',
    descricao: 'Construção de armadura esquelética (rig) compatível com o esqueleto do Brawler ou Herói, pesos de vértice refinados e 2 animações básicas (espera e golpe). (Preço de demonstração didática).',
    unidadeVenda: 'unidade',
    precoCentimos: 38000, // 380,00 €
    moeda: 'EUR',
    ativo: true,
    condicoes: 'Compatível com rigs bípedes ou quadrúpedes padrão. Exportação em .FBX com animações incorporadas.',
    isDemonstracao: true,
  },
  {
    id: 'servico-consultoria-revisao-tecnica',
    nome: 'Consultoria e Revisão Técnica de Malha 3D / Portfólio',
    descricao: 'Sessão individual de mentoria técnica para validação de poligonagem (limite de 4.000 tris), conferência de shaders, conformidade com diretrizes do Make HUB e dicas para finalista. (Preço de demonstração didática).',
    unidadeVenda: 'hora',
    precoCentimos: 6500, // 65,00 €
    moeda: 'EUR',
    ativo: true,
    condicoes: 'Sessão individual de 60 minutos por videochamada com relatório síntese de pontos de melhoria.',
    isDemonstracao: true,
  },
];

// Inicialização sem duplicação nem sobreposição de alterações feitas pelo aluno
export async function seedCatalogoIfEmpty(): Promise<void> {
  const db = getDb();
  try {
    const catalogoRef = collection(db, 'catalogo');
    const snap = await getDocs(catalogoRef);
    if (snap.empty) {
      console.log('Catálogo vazio no Firestore. A inicializar os 5 registos de demonstração didática...');
      for (const item of DEMO_CATALOGO) {
        await setDoc(doc(db, 'catalogo', item.id), item);
      }
      console.log('Catálogo inicializado com sucesso.');
    } else {
      console.log(`Catálogo já inicializado com ${snap.size} itens existentes.`);
    }
  } catch (error) {
    console.error('Aviso ao verificar/inicializar catálogo no Firestore:', error);
  }
}

export async function getCatalogo(onlyActive = true): Promise<CatalogoItem[]> {
  const db = getDb();
  const catalogoRef = collection(db, 'catalogo');
  const snap = await getDocs(catalogoRef);
  const items: CatalogoItem[] = [];
  snap.forEach((d) => {
    const data = d.data() as CatalogoItem;
    if (!onlyActive || data.ativo) {
      items.push({ ...data, id: d.id });
    }
  });
  return items;
}

export async function getCatalogoItem(id: string): Promise<CatalogoItem | null> {
  const db = getDb();
  const docRef = doc(db, 'catalogo', id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { ...(snap.data() as CatalogoItem), id: snap.id };
}

export async function saveCatalogoItem(item: CatalogoItem): Promise<void> {
  const db = getDb();
  await setDoc(doc(db, 'catalogo', item.id), item);
}

export async function updateCatalogoItem(id: string, partial: Partial<CatalogoItem>): Promise<void> {
  const db = getDb();
  await updateDoc(doc(db, 'catalogo', id), partial);
}

export async function savePedido(pedido: Pedido): Promise<void> {
  const db = getDb();
  await setDoc(doc(db, 'pedidos', pedido.id), pedido);
}

export async function updatePedido(id: string, partial: Partial<Pedido>): Promise<void> {
  const db = getDb();
  await updateDoc(doc(db, 'pedidos', id), {
    ...partial,
    dataAtualizacao: new Date().toISOString(),
  });
}

export async function getPedido(id: string): Promise<Pedido | null> {
  const db = getDb();
  const snap = await getDoc(doc(db, 'pedidos', id));
  if (!snap.exists()) return null;
  return { ...(snap.data() as Pedido), id: snap.id };
}

export async function getPedidos(): Promise<Pedido[]> {
  const db = getDb();
  const snap = await getDocs(collection(db, 'pedidos'));
  const list: Pedido[] = [];
  snap.forEach((d) => {
    list.push({ ...(d.data() as Pedido), id: d.id });
  });
  // Ordenar por dataCriacao decrescente
  return list.sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime());
}

export async function saveProposta(proposta: Proposta): Promise<void> {
  const db = getDb();
  await setDoc(doc(db, 'propostas', proposta.id), proposta);
}

export async function getProposta(id: string): Promise<Proposta | null> {
  const db = getDb();
  const snap = await getDoc(doc(db, 'propostas', id));
  if (!snap.exists()) return null;
  return { ...(snap.data() as Proposta), id: snap.id };
}

export async function getPropostaByToken(tokenOrId: string): Promise<Proposta | null> {
  const db = getDb();
  const clean = (tokenOrId || '').trim().replace(/\/+$/, '');
  if (!clean) return null;

  // 1. Consulta por campo 'token'
  try {
    const qToken = query(collection(db, 'propostas'), where('token', '==', clean));
    const snapToken = await getDocs(qToken);
    if (!snapToken.empty) {
      const first = snapToken.docs[0];
      return { ...(first.data() as Proposta), id: first.id };
    }
  } catch (err) {
    console.warn('Aviso na consulta por token:', err);
  }

  // 2. Consulta direta por ID de documento no Firestore
  try {
    const docRef = doc(db, 'propostas', clean);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...(docSnap.data() as Proposta), id: docSnap.id };
    }
  } catch (err) {
    // Não é um document ID válido
  }

  // 3. Consulta por número formal da proposta (ex: PROP-2026-0002)
  try {
    const qNum = query(collection(db, 'propostas'), where('numeroProposta', '==', clean));
    const snapNum = await getDocs(qNum);
    if (!snapNum.empty) {
      const first = snapNum.docs[0];
      return { ...(first.data() as Proposta), id: first.id };
    }
  } catch (err) {
    console.warn('Aviso na consulta por numeroProposta:', err);
  }

  // 4. Consulta por pedidoId
  try {
    const qPed = query(collection(db, 'propostas'), where('pedidoId', '==', clean));
    const snapPed = await getDocs(qPed);
    if (!snapPed.empty) {
      const first = snapPed.docs[0];
      return { ...(first.data() as Proposta), id: first.id };
    }
  } catch (err) {
    console.warn('Aviso na consulta por pedidoId:', err);
  }

  // 5. Fallback por varrimento (para tokens com variação de maiúsculas/minúsculas)
  try {
    const allSnap = await getDocs(collection(db, 'propostas'));
    for (const d of allSnap.docs) {
      const data = d.data() as Proposta;
      if (
        data.token === clean ||
        d.id === clean ||
        data.numeroProposta === clean ||
        data.pedidoId === clean ||
        (data.token && data.token.toLowerCase() === clean.toLowerCase())
      ) {
        return { ...data, id: d.id };
      }
    }
  } catch (err) {
    console.warn('Aviso no fallback de varrimento de propostas:', err);
  }

  return null;
}

export async function getPropostas(): Promise<Proposta[]> {
  const db = getDb();
  const snap = await getDocs(collection(db, 'propostas'));
  const list: Proposta[] = [];
  snap.forEach((d) => {
    list.push({ ...(d.data() as Proposta), id: d.id });
  });
  return list.sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime());
}

export async function getNextProposalNumber(): Promise<string> {
  const db = getDb();
  try {
    const snap = await getDocs(collection(db, 'propostas'));
    const count = snap.size + 1;
    const year = new Date().getFullYear();
    const formattedNum = String(count).padStart(4, '0');
    return `PROP-${year}-${formattedNum}`;
  } catch (error) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `PROP-${new Date().getFullYear()}-${randomSuffix}`;
  }
}
