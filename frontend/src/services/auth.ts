const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface NickData {
  name: string;
  expiresAt: string;
  score: number;
  aura: string | null;
}

export interface LoginResponse {
  token: string;
  nick: NickData;
}

export async function register(email: string, password: string): Promise<void> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    const message = typeof data.error === 'string'
      ? data.error
      : 'Erro ao criar conta.';
    throw new Error(message);
  }
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    const message = typeof data.error === 'string'
      ? data.error
      : 'Erro ao fazer login.';
    throw new Error(message);
  }

  return data as LoginResponse;
}
