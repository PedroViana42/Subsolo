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
import { ReportModal } from './components/ReportModal';
import { Post, UserIdentity, Comment, Tag, View } from './types';
import { INITIAL_POSTS } from './constants/posts';
import { ALL_TAGS } from './constants/tags';
import type { NickData } from './services/auth';

type AuthState = 'login' | 'mask' | 'app';

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
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [activeFilter, setActiveFilter] = useState<'#Tudo' | Tag>('#Tudo');
  const [currentView, setCurrentView] = useState<View>('feed');
  const [reportingPostId, setReportingPostId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleLoginSuccess = (token: string, nick: NickData) => {
    localStorage.setItem('subsolo_token', token);
    setIdentity(nickToIdentity(nick));
    setAuthState('mask');
  };

  const handleLogout = () => {
    localStorage.removeItem('subsolo_token');
    setIdentity(null);
    setAuthState('login');
  };

  const handlePost = async (content: string, tag: Tag) => {
    if (!identity) return;
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newPost: Post = {
      id: Math.random().toString(36).substring(2, 9),
      content,
      createdAt: new Date(),
      authorNickname: identity.nickname,
      honestyScore: identity.honestyScore,
      authorBadges: identity.badges,
      factCount: 0,
      ficCount: 0,
      userVote: null,
      comments: [],
      tag,
    };

    setPosts((prev) => [newPost, ...prev]);
  };

  const handleVote = (postId: string, vote: 'fact' | 'fic') => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        let newFact = post.factCount;
        let newFic = post.ficCount;
        let newVote: 'fact' | 'fic' | null = vote;

        if (post.userVote === vote) {
          newVote = null;
          if (vote === 'fact') newFact--;
          if (vote === 'fic') newFic--;
        } else {
          if (post.userVote === 'fact') newFact--;
          if (post.userVote === 'fic') newFic--;
          if (vote === 'fact') newFact++;
          if (vote === 'fic') newFic++;
        }

        return { ...post, factCount: newFact, ficCount: newFic, userVote: newVote };
      })
    );
  };

  const handleComment = async (postId: string, content: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        const isOp = identity && post.authorNickname === identity.nickname;

        const newComment: Comment = {
          id: Math.random().toString(36).substring(2, 9),
          content,
          createdAt: new Date(),
          authorNickname: identity?.nickname || 'Unknown',
          honestyScore: identity?.honestyScore || '❓',
          isOp: !!isOp,
        };

        return { ...post, comments: [...post.comments, newComment] };
      })
    );
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
        .sort((a, b) => b.factCount + b.ficCount - (a.factCount + a.ficCount))
        .slice(0, 10);
    }
    if (currentView === 'my-posts' && identity) {
      return posts.filter((p) => p.authorNickname === identity.nickname);
    }
    return posts.filter((post) => activeFilter === '#Tudo' || post.tag === activeFilter);
  };

  const filteredPosts = getFilteredPosts();

  if (authState === 'login') {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  if (authState === 'mask' && identity) {
    return (
      <MaskGenerationScreen
        identity={identity}
        onAcceptMask={() => setAuthState('app')}
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
              <FilterBar
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                tags={ALL_TAGS}
              />
            )}

            <Feed
              posts={filteredPosts}
              identity={identity}
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
