import React, { useState, useEffect } from 'react';
import { PostForm } from './components/PostForm';
import { Feed } from './components/Feed';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { ViewHeader } from './components/ViewHeader';
import { Post, UserIdentity, Comment, Tag, View } from './types';
import { INITIAL_POSTS } from './constants/posts';
import { ALL_TAGS } from './constants/tags';
import { generateIdentity } from './utils/identity';

export default function App() {
  const [identity] = useState<UserIdentity>(() => generateIdentity());
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [activeFilter, setActiveFilter] = useState<'#Tudo' | Tag>('#Tudo');
  const [currentView, setCurrentView] = useState<View>('feed');

  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handlePost = async (content: string, tag: Tag) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const newPost: Post = {
      id: Math.random().toString(36).substring(2, 9),
      content,
      createdAt: new Date(),
      authorNickname: identity.nickname,
      honestyScore: identity.honestyScore,
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
        
        const isOp = post.authorNickname === identity.nickname;
        
        const newComment: Comment = {
          id: Math.random().toString(36).substring(2, 9),
          content,
          createdAt: new Date(),
          authorNickname: identity.nickname,
          honestyScore: identity.honestyScore,
          isOp,
        };
        
        return { ...post, comments: [...post.comments, newComment] };
      })
    );
  };

  const handleReport = (postId: string) => {
    alert('Postagem denunciada. A moderação irá analisar.');
  };

  const getFilteredPosts = () => {
    if (currentView === 'hall') {
      return [...posts].sort((a, b) => (b.factCount + b.ficCount) - (a.factCount + a.ficCount)).slice(0, 10);
    }
    
    if (currentView === 'my-posts') {
      return posts.filter(p => p.authorNickname === identity.nickname);
    }
    
    return posts.filter(post => activeFilter === '#Tudo' || post.tag === activeFilter);
  };

  const filteredPosts = getFilteredPosts();

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 font-sans selection:bg-violet-500/30">
      <Header onLogoClick={() => setCurrentView('feed')} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
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
    </div>
  );
}
