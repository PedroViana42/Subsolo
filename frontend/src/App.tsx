import React, { useState, useEffect } from 'react';
import { PostForm } from './components/PostForm';
import { Feed } from './components/Feed';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { Header } from './components/Header';
import { ViewHeader } from './components/ViewHeader';
import { FilterBar } from './components/FilterBar';
import { LoginScreen } from './components/LoginScreen';
import { MaskGenerationScreen } from './components/MaskGenerationScreen';
import { EmailVerifyScreen } from './components/EmailVerifyScreen';
import { ReportModal } from './components/ReportModal';
import { NewPostsPill } from './components/NewPostsPill';
import { SearchInput } from './components/SearchInput';
import { Post, UserIdentity, Tag, View } from './types';
import { ALL_TAGS } from './constants/tags';
import type { NickData } from './services/auth';
import { getPosts, createPost, voteOnPost, createComment } from './services/posts';

type AuthState = 'login' | 'mask' | 'app' | 'verifying';

function nickToIdentity(nick: NickData): UserIdentity {
  return {
    nickname: nick.name,
    expiresAt: new Date(nick.expiresAt),
    honestyScore: nick.score >= 80 ? '😇' : '🤥',
    badges: [],
  };
}

export default function App() {
  const [authState, setAuthState] = useState<AuthState>('login');
  const [identity, setIdentity] = useState<UserIdentity | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [bufferPosts, setBufferPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'#Tudo' | Tag>('#Tudo');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<View>('feed');
  const [reportingPostId, setReportingPostId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const [verifyToken, setVerifyToken] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('verify');
  });

  useEffect(() => {
    document.documentElement.classList.add('dark');

    if (verifyToken) {
      setAuthState('verifying');
      return;
    }

    const token = localStorage.getItem('subsolo_token');
    const nickRaw = localStorage.getItem('subsolo_nick');
    if (token && nickRaw) {
      try {
        const nick: NickData = JSON.parse(nickRaw);
        if (new Date(nick.expiresAt) > new Date()) {
          setIdentity(nickToIdentity(nick));
          setAuthState('app');
        } else {
          localStorage.removeItem('subsolo_token');
          localStorage.removeItem('subsolo_nick');
        }
      } catch {
        localStorage.removeItem('subsolo_token');
        localStorage.removeItem('subsolo_nick');
      }
    }
  }, []);

  const fetchPosts = async (silent = false) => {
    const token = localStorage.getItem('subsolo_token');
    if (token) {
      if (posts.length === 0 && !silent) setIsLoading(true);
      try {
        const data = await getPosts(token);
        
        if (posts.length === 0) {
          setPosts(data);
        } else {
          // 1. Sincronizar posts existentes (votos, comentários, etc.)
          setPosts(prev => prev.map(p => {
            const updated = data.find(newP => newP.id === p.id);
            if (!updated) return p;
            
            // Só trocar o objeto se houver mudança real para evitar re-renderizações desnecessárias
            if (updated.factCount !== p.factCount || 
                updated.ficCount !== p.ficCount || 
                updated.comments.length !== p.comments.length ||
                updated.userVote !== p.userVote) {
              return { ...p, ...updated };
            }
            return p;
          }));

          // 2. Filtrar posts que realmente são novos para o buffer
          const existingIds = new Set(posts.map(p => p.id));
          const newPosts = data.filter(p => !existingIds.has(p.id));
          
          if (newPosts.length > 0) {
            setBufferPosts(prev => {
              const bufferIds = new Set(prev.map(p => p.id));
              const uniqueNew = newPosts.filter(p => !bufferIds.has(p.id));
              if (uniqueNew.length === 0) return prev;
              return [...uniqueNew, ...prev];
            });
          }
        }
      } catch (error) {
        console.error('Falha ao carregar feed', error);
      } finally {
        if (!silent) setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (authState === 'app') {
      fetchPosts();

      // Polling para atualizar o feed a cada 5 segundos (silenciosamente)
      const intervalId = setInterval(() => {
        fetchPosts(true);
      }, 5000);

      return () => clearInterval(intervalId);
    }
  }, [authState]);

  const handleLoginSuccess = (token: string, nick: NickData) => {
    localStorage.setItem('subsolo_token', token);
    localStorage.setItem('subsolo_nick', JSON.stringify(nick));
    setIdentity(nickToIdentity(nick));

    const maskKey = `has_seen_mask_for_${nick.name}`;
    if (localStorage.getItem(maskKey) === 'true') {
      setAuthState('app');
    } else {
      setAuthState('mask');
    }
  };

  const handleAcceptMask = () => {
    if (identity) {
      localStorage.setItem(`has_seen_mask_for_${identity.nickname}`, 'true');
    }
    setAuthState('app');
  };

  const handleApplyBuffer = () => {
    setPosts(prev => [...bufferPosts, ...prev]);
    setBufferPosts([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('subsolo_token');
    localStorage.removeItem('subsolo_nick');
    setIdentity(null);
    setAuthState('login');
  };

  const handlePost = async (content: string, tag: Tag) => {
    const token = localStorage.getItem('subsolo_token');
    if (!identity || !token) return;

    try {
      await createPost(token, content, tag);
      await fetchPosts(); // Refresh feed after posting
      showToast('Confissão publicada com sucesso!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Erro ao publicar confissão.', 'error');
    }
  };

  const handleVote = async (postId: string, vote: 'fact' | 'fic') => {
    const token = localStorage.getItem('subsolo_token');
    if (!token) return;

    // Optimistic UI update
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        let newFact = post.factCount;
        let newFic = post.ficCount;
        let newVote: 'fact' | 'fic' | null = vote;

        // Simplified for now: assuming server blocks duplicate votes, 
        // we'll just increment naively to make UI feel fast.
        if (vote === 'fact') newFact++;
        if (vote === 'fic') newFic++;

        return { ...post, factCount: newFact, ficCount: newFic, userVote: newVote };
      })
    );

    try {
      await voteOnPost(token, postId, vote === 'fact');
      await fetchPosts(); // Re-sync to get correct server truth
    } catch (error: any) {
      showToast(error.message || 'Sua identidade atual já votou nessa confissão.', 'error');
      await fetchPosts(); // Revert back to original state on failure
    }
  };

  const handleComment = async (postId: string, content: string) => {
    const token = localStorage.getItem('subsolo_token');
    if (!token) return;
    try {
      await createComment(token, postId, content);
      await fetchPosts();
    } catch (error: any) {
      showToast(error.message || 'Erro ao comentar.', 'error');
    }
  };

  const handleReport = (postId: string) => {
    setReportingPostId(postId);
  };

  const handleSubmitReport = (reason: string) => {
    console.log(`Reporting post ${reportingPostId} for reason: ${reason}`);
    showToast('Sua denúncia foi enviada para a moderação.', 'success');
  };

  const getFilteredPosts = () => {
    if (currentView === 'hall') {
      return [...posts]
        .sort((a, b) => {
          // Relíquias são posts onde Verdade vence a Ficção
          // Peso 2x para o saldo positivo de Fato
          const scoreA = (a.factCount - a.ficCount) * 2 + (a.factCount + a.ficCount);
          const scoreB = (b.factCount - b.ficCount) * 2 + (b.factCount + b.ficCount);
          return scoreB - scoreA;
        })
        .slice(0, 20);
    }
    if (currentView === 'my-posts' && identity) {
      return posts.filter((p) => p.authorNickname === identity.nickname);
    }
    const tagFiltered = posts.filter((post) => activeFilter === '#Tudo' || post.tag === activeFilter);
    
    if (!searchQuery.trim()) return tagFiltered;

    const query = searchQuery.toLowerCase().trim();
    return tagFiltered.filter(
      (post) => 
        post.content.toLowerCase().includes(query) || 
        post.authorNickname.toLowerCase().includes(query)
    );
  };

  const filteredPosts = getFilteredPosts();

  if (authState === 'verifying' && verifyToken) {
    return (
      <EmailVerifyScreen
        token={verifyToken}
        onSuccess={() => {
          setVerifyToken(null);
          setAuthState('login');
        }}
      />
    );
  }

  if (authState === 'login') {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  if (authState === 'mask' && identity) {
    return (
      <MaskGenerationScreen
        identity={identity}
        onAcceptMask={handleAcceptMask}
      />
    );
  }

  if (!identity) return null;

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 font-sans selection:bg-violet-500/30">
      <Header onLogoClick={() => setCurrentView('feed')} onLogout={handleLogout} />

      <div className="max-w-[1440px] mx-auto px-4 py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          <LeftSidebar identity={identity} currentView={currentView} onViewChange={setCurrentView} />

          <main className="flex-1 min-w-0">
            {currentView === 'feed' && <PostForm onPost={handlePost} identity={identity} />}

            <ViewHeader currentView={currentView} />

            {currentView === 'feed' && (
              <SearchInput value={searchQuery} onChange={setSearchQuery} />
            )}

            {currentView === 'feed' && (
              <FilterBar
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                tags={ALL_TAGS}
              />
            )}

            {currentView === 'feed' && bufferPosts.length > 0 && (
              <NewPostsPill 
                count={bufferPosts.length} 
                onClick={handleApplyBuffer} 
              />
            )}

            <Feed
              posts={filteredPosts}
              identity={identity}
              isLoading={isLoading}
              currentView={currentView}
              onVote={handleVote}
              onComment={handleComment}
              onReport={handleReport}
            />
          </main>

          <RightSidebar />
        </div>
      </div>

      <ReportModal
        isOpen={reportingPostId !== null}
        onClose={() => setReportingPostId(null)}
        onSubmit={handleSubmitReport}
      />

      {toast && (
        <div className="fixed bottom-6 right-6 z-[200] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-[#1a1a1a] border border-zinc-800 rounded-xl p-4 shadow-2xl flex items-center gap-3">
            <div className={`p-1.5 rounded-full ${toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {toast.type === 'success' ? <polyline points="20 6 9 17 4 12" /> : <path d="M18 6L6 18M6 6l12 12" />}
              </svg>
            </div>
            <p className="text-sm font-medium text-zinc-200">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
