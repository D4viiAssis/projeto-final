/**
 * Constantes de limites de caracteres (Contrato com o Backend)
 */
export const PROFILE_NAME_MAX_LENGTH = 255;
export const PROFILE_USERNAME_MAX_LENGTH = 30;
export const PROFILE_BIO_MAX_LENGTH = 500;
export const POST_CAPTION_MAX_LENGTH = 2200;

/**
 * Retorna um objeto de autor padrão para evitar erros de undefined na UI
 * (Usado como fallback em posts e comentários)
 */
export const defaultAuthor = () => ({
  id: null,
  name: 'Usuário',
  username: 'usuario',
  avatar_url: null
});

/**
 * Regex para validação de username conforme especificação
 */
export const USERNAME_REGEX = /^[A-Za-z0-9._]+$/;