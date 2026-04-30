export const PROFILE_NAME_MAX_LENGTH = 255;
export const PROFILE_USERNAME_MAX_LENGTH = 30;
export const PROFILE_BIO_MAX_LENGTH = 500;
export const POST_CAPTION_MAX_LENGTH = 2200;

export const defaultAuthor = () => ({
  id: null,
  name: 'Usuário',
  username: 'usuario',
  avatar_url: null
});

export const USERNAME_REGEX = /^[A-Za-z0-9._]+$/;