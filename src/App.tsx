import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NotificationBanner } from './components/NotificationBanner';
import { EducationalDisclaimerBanner } from './components/EducationalDisclaimerBanner';
import { HeroSection } from './components/HeroSection';
import { ExploreSection } from './components/ExploreSection';
import { CampaignsSection } from './components/CampaignsSection';
import { CreationCalloutSection } from './components/CreationCalloutSection';
import { PedidoPropostaSection } from './components/PedidoPropostaSection';
import { ProposalView } from './components/ProposalView';
import { AdminView } from './components/AdminView';
import { CookieBanner } from './components/CookieBanner';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { CreationDetailModal } from './components/CreationDetailModal';
import { CampaignDetailModal } from './components/CampaignDetailModal';
import { CreatorGuideModal } from './components/CreatorGuideModal';
import { CreateSkinModal } from './components/CreateSkinModal';
import { MobileDrawer } from './components/MobileDrawer';
import { FaqSection } from './components/FaqSection';
import { FloatingChatBot } from './components/FloatingChatBot';
import { ScheduleMeetingModal } from './components/ScheduleMeetingModal';
import { INITIAL_CAMPAIGNS, INITIAL_CREATIONS } from './data/mockData';
import { Creation, Campaign, SupercellUser } from './types';

// Função de parse seguro de rotas suportando pathname, search query (?proposta=...) e hash (#proposta/...)
function parseCurrentRoute(): { path: 'home' | 'admin' | 'proposta'; token?: string } {
  const p = window.location.pathname || '';
  const search = new URLSearchParams(window.location.search || '');
  const hash = window.location.hash || '';

  // 1. Proposta via Search Query (?proposta=TOKEN ou ?token=TOKEN) — Prioridade máxima
  const qToken = search.get('proposta') || search.get('token');
  if (qToken && qToken.trim() !== '') {
    return { path: 'proposta', token: qToken.trim().replace(/^#+/, '').replace(/^\/+/, '').replace(/\/+$/, '') };
  }

  // 2. Proposta via Hash Router (#/proposta/TOKEN ou #proposta/TOKEN)
  const hashMatch = hash.match(/#\/?proposta\/([a-zA-Z0-9_\-\.]+)/);
  if (hashMatch && hashMatch[1]) {
    return { path: 'proposta', token: hashMatch[1].trim().replace(/\/+$/, '') };
  }

  // 3. Proposta via Pathname tradicional: /proposta/TOKEN
  const pathMatch = p.match(/^\/proposta\/([a-zA-Z0-9_\-\.]+)/);
  if (pathMatch && pathMatch[1]) {
    return { path: 'proposta', token: pathMatch[1].trim().replace(/\/+$/, '') };
  }

  // 4. Admin via Search (?view=admin ou ?admin=true)
  if (search.get('view') === 'admin' || search.get('admin') === 'true') {
    return { path: 'admin' };
  }

  // 5. Admin via Hash (#/admin ou #admin)
  if (hash.startsWith('#/admin') || hash === '#admin') {
    return { path: 'admin' };
  }

  // 6. Admin via Pathname (/admin)
  if (p.startsWith('/admin')) {
    return { path: 'admin' };
  }

  return { path: 'home' };
}

export default function App() {
  const [route, setRoute] = useState<{ path: 'home' | 'admin' | 'proposta'; token?: string }>(() => parseCurrentRoute());

  useEffect(() => {
    const onLocationChange = () => {
      setRoute(parseCurrentRoute());
    };
    window.addEventListener('popstate', onLocationChange);
    window.addEventListener('hashchange', onLocationChange);
    return () => {
      window.removeEventListener('popstate', onLocationChange);
      window.removeEventListener('hashchange', onLocationChange);
    };
  }, []);

  const navigateTo = (url: string) => {
    try {
      window.history.pushState({}, '', url);
    } catch {
      // Fallback para ambientes em que pushState pode ser restrito
    }

    // Atualização direta do estado sem depender exclusivamente do timing do window.location
    if (url.startsWith('/proposta/')) {
      const token = url.replace('/proposta/', '').trim().replace(/\/+$/, '');
      setRoute({ path: 'proposta', token });
      return;
    }
    if (url.startsWith('/admin')) {
      setRoute({ path: 'admin' });
      return;
    }
    if (url === '/' || url === '') {
      setRoute({ path: 'home' });
      return;
    }
    setRoute(parseCurrentRoute());
  };

  const [creations, setCreations] = useState<Creation[]>(() => {
    const saved = localStorage.getItem('sc_make_creations');
    return saved ? JSON.parse(saved) : INITIAL_CREATIONS;
  });

  const [campaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);

  const [user, setUser] = useState<SupercellUser | null>(() => {
    const saved = localStorage.getItem('sc_make_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [votedIds, setVotedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('sc_make_voted');
    return saved ? JSON.parse(saved) : ['kit-futurista'];
  });

  // Modal states
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isVotePrompt, setIsVotePrompt] = useState(false);
  const [selectedCreation, setSelectedCreation] = useState<Creation | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('explore');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('sc_make_creations', JSON.stringify(creations));
  }, [creations]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('sc_make_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sc_make_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sc_make_voted', JSON.stringify(votedIds));
  }, [votedIds]);

  // Vote handler with Supercell ID gating
  const handleVote = (creationId: string) => {
    if (!user) {
      setIsVotePrompt(true);
      setIsLoginModalOpen(true);
      return;
    }

    setVotedIds((prev) => {
      const alreadyVoted = prev.includes(creationId);
      const updated = alreadyVoted
        ? prev.filter((id) => id !== creationId)
        : [...prev, creationId];

      setCreations((current) =>
        current.map((item) => {
          if (item.id === creationId) {
            return {
              ...item,
              votes: alreadyVoted ? item.votes - 1 : item.votes + 1,
            };
          }
          return item;
        })
      );

      return updated;
    });
  };

  const handleLoginSuccess = (newUser: SupercellUser) => {
    setUser(newUser);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleCreateSkin = (newCreation: Creation) => {
    setCreations((prev) => [newCreation, ...prev]);
    setSelectedCreation(newCreation);
  };

  const handleSelectNav = (nav: string) => {
    setActiveNav(nav);
    if (nav === 'explore') {
      document.getElementById('explore-heading')?.scrollIntoView({ behavior: 'smooth' });
    } else if (nav === 'campaigns') {
      document.getElementById('campaigns-heading')?.scrollIntoView({ behavior: 'smooth' });
    } else if (nav === 'proposta') {
      document.getElementById('pedido-proposta')?.scrollIntoView({ behavior: 'smooth' });
    } else if (nav === 'admin') {
      navigateTo('/admin');
    } else if (nav === 'create') {
      setIsCreateModalOpen(true);
    } else if (nav === 'help') {
      document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (nav === 'about') {
      setIsGuideModalOpen(true);
    }
  };

  // Se a rota for a Área de Administração (/admin)
  if (route.path === 'admin') {
    return <AdminView onNavigate={navigateTo} onBackToHome={() => navigateTo('/')} />;
  }

  // Se a rota for uma Proposta Individual (/proposta/:token)
  if (route.path === 'proposta' && route.token) {
    return <ProposalView token={route.token} onBackToHome={() => navigateTo('/')} />;
  }

  // Rota padrão: Landing Page Completa
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col selection:bg-purple-500 selection:text-white">
      {/* Top Educational Disclaimer Banner with official Supercell hyperlink */}
      <EducationalDisclaimerBanner />

      {/* Top Notification Announcement Banner */}
      <NotificationBanner
        onViewAnnouncement={() => setSelectedCampaign(campaigns[1])}
      />

      {/* Main Sticky Header */}
      <Header
        user={user}
        onOpenLogin={() => {
          setIsVotePrompt(false);
          setIsLoginModalOpen(true);
        }}
        onLogout={handleLogout}
        onOpenCreate={() => setIsCreateModalOpen(true)}
        onOpenMeeting={() => setIsMeetingModalOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeNav={activeNav}
        onSelectNav={handleSelectNav}
      />

      {/* Main Page Sections */}
      <main className="flex-1 pb-10">
        {/* Section 2: Hero Visual Card (Spotlight & Active Clancy Campaign) */}
        <HeroSection
          featuredCampaign={campaigns[0]}
          onViewCampaign={(camp) => setSelectedCampaign(camp)}
          onExploreClick={() => {
            document.getElementById('explore-heading')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Section 3: Explore / Community Creations (Social Proof) */}
        <ExploreSection
          creations={creations}
          votedIds={votedIds}
          onVote={handleVote}
          onSelectCreation={(c) => setSelectedCreation(c)}
        />

        {/* Section 4: Campaigns Roster */}
        <CampaignsSection
          campaigns={campaigns}
          onSelectCampaign={(c) => setSelectedCampaign(c)}
        />

        {/* Section 5: Creator Call-To-Action (Solution Reveal) */}
        <CreationCalloutSection
          onLearnMore={() => setIsGuideModalOpen(true)}
          onOpenCreate={() => setIsCreateModalOpen(true)}
        />

        {/* Section Nova: Pedido de Proposta com IA (Integrada na Landing Page) */}
        <PedidoPropostaSection />

        {/* Section 7: Frequently Asked Questions, Cal.com Meeting Card & Chat Bot Assistant */}
        <FaqSection
          onOpenMeeting={() => setIsMeetingModalOpen(true)}
          onOpenCreate={() => setIsCreateModalOpen(true)}
        />
      </main>

      {/* Footer with Educational Clarification and Official Links */}
      <Footer
        onSelectNav={handleSelectNav}
        onOpenGuide={() => setIsGuideModalOpen(true)}
      />

      {/* Floating Action Dock: Perguntar ao Bot & Marcar Reunião (Cal.com) */}
      <FloatingChatBot
        onOpenMeeting={() => setIsMeetingModalOpen(true)}
        onOpenCreate={() => setIsCreateModalOpen(true)}
      />

      {/* Section 6 & Compliance: Sticky Cookie Consent Banner */}
      <CookieBanner />

      {/* Modals & Overlays */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        isVotePrompt={isVotePrompt}
      />

      <CreationDetailModal
        creation={selectedCreation}
        onClose={() => setSelectedCreation(null)}
        hasVoted={selectedCreation ? votedIds.includes(selectedCreation.id) : false}
        onVote={handleVote}
      />

      <CampaignDetailModal
        campaign={selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
        onSubmitSkin={() => setIsCreateModalOpen(true)}
      />

      <CreatorGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        onStartCreating={() => setIsCreateModalOpen(true)}
      />

      <CreateSkinModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        user={user}
        onRequireLogin={() => {
          setIsCreateModalOpen(false);
          setIsLoginModalOpen(true);
        }}
        onSubmitCreation={handleCreateSkin}
      />

      {/* Schedule Meeting with Guilherme Carapinha (Cal.com & Outlook Sync) */}
      <ScheduleMeetingModal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
        defaultEmail={user?.email}
        defaultName={user?.username}
      />

      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        onOpenLogin={() => {
          setIsVotePrompt(false);
          setIsLoginModalOpen(true);
        }}
        onLogout={handleLogout}
        onOpenCreate={() => setIsCreateModalOpen(true)}
        onOpenMeeting={() => setIsMeetingModalOpen(true)}
        onSelectNav={handleSelectNav}
        onOpenGuide={() => setIsGuideModalOpen(true)}
      />
    </div>
  );
}
