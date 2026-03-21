import { Post } from '../types';

export const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    content: 'O RU hoje estava surpreendentemente bom. Será que trocaram o cozinheiro ou eu que estava com muita fome?',
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
    authorNickname: 'Coruja Furtiva',
    honestyScore: '🤥',
    factCount: 12,
    ficCount: 45,
    userVote: null,
    tag: '#RU',
    comments: [
      {
        id: 'c1',
        content: 'Pura ilusão sua, a carne tava dura igual pedra.',
        createdAt: new Date(Date.now() - 1000 * 60 * 2),
        authorNickname: 'Panda Galático',
        honestyScore: '😇',
        isOp: false,
      },
      {
        id: 'c2',
        content: 'Juro que tava bom! Pelo menos o estrogonofe.',
        createdAt: new Date(Date.now() - 1000 * 60 * 1),
        authorNickname: 'Coruja Furtiva',
        honestyScore: '🤥',
        isOp: true,
      }
    ],
  },
  {
    id: '2',
    content: '⚠️ AVISO: A biblioteca vai fechar mais cedo hoje (18h) por causa de manutenção na rede elétrica.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    authorNickname: 'Bot de Eventos',
    honestyScore: '🤖',
    factCount: 89,
    ficCount: 2,
    userVote: 'fact',
    tag: '#Eventos',
    isBot: true,
    comments: [],
  },
  {
    id: '3',
    content: 'Vi duas pessoas do CA de Engenharia discutindo feio perto do bloco C. Alguém sabe o que rolou?',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    authorNickname: 'Ninja Invisível',
    honestyScore: '😇',
    factCount: 34,
    ficCount: 12,
    userVote: null,
    tag: '#Fofoca',
    comments: [],
  }
];
