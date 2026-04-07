import { Post } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface FetchPostsResponse {
  posts: Array<{
    id: string;
    content: string;
    tag: string | null;
    nickId: string;
    createdAt: string;
    factCount: number;
    ficCount: number;
    nick: {
      name: string;
      aura: string | null;
      score: number;
    };
    comments: Array<{
      id: string;
      content: string;
      createdAt: string;
      nickId: string;
      nick: {
        name: string;
        aura: string | null;
        score: number;
      };
    }>;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getPosts(token: string, page = 1, currentNickId?: string): Promise<Post[]> {
  const res = await fetch(`${API_URL}/posts?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Falha ao carregar posts');
  }

  const data: FetchPostsResponse = await res.json();

  return data.posts.map((p) => ({
    id: p.id,
    content: p.content,
    tag: p.tag || '',
    createdAt: new Date(p.createdAt),
    authorNickname: p.nick.name,
    honestyScore: p.nick.score >= 80 ? '😇' : '🤥',
    authorBadges: [],
    factCount: p.factCount,
    ficCount: p.ficCount,
    userVote: null,
    isOwner: currentNickId ? p.nickId === currentNickId : false,
    comments: p.comments.map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: new Date(c.createdAt),
      authorNickname: c.nick.name,
      honestyScore: c.nick.score >= 80 ? '😇' : '🤥',
      isOp: c.nickId === p.nickId,
    })),
  }));
}

export async function createPost(token: string, content: string, tag: string): Promise<void> {
  const res = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content, tag }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Falha ao criar post');
  }
}

export async function createComment(token: string, postId: string, content: string): Promise<void> {
  const res = await fetch(`${API_URL}/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Falha ao comentar');
  }
}

export async function updatePost(token: string, postId: string, content: string, tag: string): Promise<void> {
  const res = await fetch(`${API_URL}/posts/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content, tag }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Falha ao editar post');
  }
}

export async function deletePost(token: string, postId: string): Promise<void> {
  const res = await fetch(`${API_URL}/posts/${postId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Falha ao excluir post');
  }
}

export async function voteOnPost(token: string, postId: string, isReal: boolean): Promise<void> {
  const res = await fetch(`${API_URL}/posts/${postId}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isReal }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Falha ao votar');
  }
}
