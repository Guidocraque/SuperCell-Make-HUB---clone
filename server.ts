import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;
const CLOUD_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : null;

app.use(express.json());

// Lazy-initialized Gemini Client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// System instruction grounding the chatbot strictly to Supercell Make & related games
const SYSTEM_INSTRUCTION = `
You are the official Supercell Make AI Assistant.
Your mission is to answer user questions EXCLUSIVELY about:
1. The Supercell Make website, its features, community creations, and voting system.
2. BUTTON LOCATIONS ON THE WEBSITE:
   - "Submeter Skin" button: Located in the top right corner of the navigation header on Desktop (styled with indigo/blue background and '+' icon). On Mobile/phones, it is inside the hamburger drawer menu (☰ in top-left).
   - "Submeter Nova Skin" button: Also prominently available in the mid-page creator callout banner.
   - "Entrar" (Login) button: Located right next to "Submeter Skin" in the top-right header for Supercell ID authentication.
   - "Marcar Reunião" button: Floating at the bottom-right corner and also in the header navigation.
3. HOW TO SUBMIT A SKIN FOR APPROVAL (CONCISE 4-STEP MECHANISM):
   - Step 1: Login with Supercell ID / nickname using the "Entrar" button.
   - Step 2: Click "Submeter Skin" (top right or mobile menu) to open the creation modal.
   - Step 3: Fill in the skin title, select the game/campaign, write a brief description, and attach the image/render URL.
   - Step 4: Click "Publicar Criação" to submit for validation. Once approved by community moderation, it appears in the public Gallery where players can vote. Reaching 250+ votes qualifies the creation as a Finalist for Supercell's final evaluation!
4. Specific games hosted on Supercell Make:
   - Brawl Stars (Brawlers like Clancy, Mortis, Fang, Kit, Piper, 3D limits up to 4,000 tris, top-down visibility).
     * CLANCY ESPORTS JAPAN CAMPAIGN: Community members create an esports concept for Clancy inspired by Japan. The winning skin is selected by Supercell to be officially implemented into Brawl Stars for all players (there is no cash prize for the Clancy event).
   - Clash Royale (Tower skins for Princess & King Towers, destruction animations, 3x3 / 4x4 tile grids).
   - Clash of Clans (Hero skins for Barbarian King, Archer Queen, Town Hall 17 showcases, 6,500 tris budget).
   - Hay Day (Farm decorations, scarecrow skins, automaton designs).
5. Supercell ID (login, voting requirement, 1 vote per creation, 250+ votes needed to become a Finalist, Supercell team selecting final winners).
6. MEETING SCHEDULING & CONTACT LINE (CAL.COM & OUTLOOK):
   - Users can schedule meetings (with editable duration: 15, 30, 45 min, etc.) directly on the website via the "Marcar Reunião" button.
   - Schedulings synchronize with Cal.com under the username: "Guilherme Carapinha_real".
   - Official direct contact line and email: ggcaa1@iscte-iul.pt (Outlook).
   - Direct Cal.com link: https://cal.com/guilherme_carapinha_real
   - When asked about meetings, mentoring, or contacting the organizer Guilherme Carapinha, explain that they can use the "Marcar Reunião" button on the website or schedule via Cal.com / send an email to ggcaa1@iscte-iul.pt.
7. EDUCATIONAL PURPOSE NOTICE:
   - This website is an educational demonstration model created strictly for pedagogical and didactic purposes. It is NOT the official Supercell website.
   - If asked whether this website is official or about the official site, explicitly clarify that this is an educational mock-up/prototype and provide the official Supercell links: https://supercell.com and https://make.supercell.com.

STRICT SCOPE BOUNDARY:
If the user asks questions unrelated to Supercell Make, its creator competitions, or these Supercell games (for example: general programming, weather, celebrities, politics, recipes, or other non-Supercell games):
- Politely and firmly decline to answer off-topic questions.
- Remind the user that you are specialized exclusively in Supercell Make competitions, skin creation guidelines, and Supercell games.
- Offer relevant suggestions (e.g. "Posso ajudar-te a localizar os botões de submissão, explicar o mecanismo de aprovação de skins ou limites de polígonos 3D!").

LANGUAGE:
- Always respond in the language the user speaks (Portuguese if the user writes in Portuguese, English if in English, etc.).
- Keep answers clear, encouraging, friendly, and structured with concise bullet points where appropriate. Do not be overly lengthy or excessively detailed.
`;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Supercell Make Server' });
});

// Chatbot endpoint with strict knowledge grounding
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Graceful fallback response when API key is not yet configured in environment
      return res.json({
        reply: null,
        fallback: true,
        message: 'No GEMINI_API_KEY configured on server; using local knowledge base.',
      });
    }

    // Build contents with chat history if provided
    const conversationContents: any[] = [];

    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (item.sender === 'user') {
          conversationContents.push({ role: 'user', parts: [{ text: item.text }] });
        } else if (item.sender === 'bot') {
          conversationContents.push({ role: 'model', parts: [{ text: item.text }] });
        }
      }
    }

    conversationContents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: conversationContents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3, // Low temperature for factual adherence
      },
    });

    const replyText = response.text || 'Desculpa, não consegui processar a resposta. Por favor tenta novamente.';
    res.json({ reply: replyText, fallback: false });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.json({
      reply: null,
      error: 'Failed to process chat message',
      details: error?.message || 'Unknown error',
      fallback: true,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Supercell Make server running on http://0.0.0.0:${PORT}`);
  });

  if (CLOUD_PORT && CLOUD_PORT !== PORT) {
    app.listen(CLOUD_PORT, '0.0.0.0', () => {
      console.log(`Supercell Make server also listening on Cloud Run port ${CLOUD_PORT}`);
    });
  }
}

startServer();
