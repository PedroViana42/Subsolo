import xss from 'xss';

// Opções do XSS: Por padrão, a biblioteca xss tira todas as tags html como <script>, <iframe>, etc.
// Se quisermos permitir algumas (ex: <b>, <i>), podemos configurar aqui no futuro.
// Por um sistema anônimo de texto puro, remover tudo é a melhor opção inicial.
const xssOptions: any = {
  whiteList: {}, // array vazio = nenhuma tag HTML é permitida
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script'] // remove the content of script tags entirely
};

/**
 * Sanitiza uma string removendo qualquer tag HTML potencialmente perigosa.
 */
export function sanitizeText(text: string | undefined | null): string {
  if (!text) return '';
  // Usamos a função padrão 'xss' que é mais robusta em ambientes híbridos ESM/CJS
  return xss(text, xssOptions);
}
