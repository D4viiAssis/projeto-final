import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ROUTE_NAMES } from './routeNames';

const routes = [
  {
    path: '/',
    redirect: '/feed'
  },
  {
    path: '/login',
    name: ROUTE_NAMES.LOGIN, // <--- Adicionado
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { layout: 'AuthLayout', requiresGuest: true }
  },
  {
    path: '/cadastro',
    name: ROUTE_NAMES.REGISTER, // <--- Adicionado
    component: () => import('@/views/auth/CadastroView.vue'),
    meta: { layout: 'AuthLayout', requiresGuest: true }
  },
  {
    path: '/feed',
    name: ROUTE_NAMES.FEED, // <--- Adicionado
    component: () => import('@/views/app/FeedView.vue'),
    meta: { layout: 'AppLayout', requiresAuth: true }
  },
  {
    path: '/descobrir',
    name: ROUTE_NAMES.DISCOVER, // <--- Adicionado
    component: () => import('@/views/app/DescubrirView.vue'),
    meta: { layout: 'AppLayout', requiresAuth: true }
  },
  {
    path: '/criar',
    name: ROUTE_NAMES.CREATE, // <--- Adicionado
    component: () => import('@/views/app/CriarPostView.vue'),
    meta: { layout: 'AppLayout', requiresAuth: true }
  },
  {
    path: '/perfil',
    name: ROUTE_NAMES.PROFILE, // <--- Adicionado
    component: () => import('@/views/app/PerfilView.vue'),
    meta: { layout: 'AppLayout', requiresAuth: true }
  },
  {
    path: '/perfil/editar',
    name: ROUTE_NAMES.EDIT_PROFILE, // <--- O QUE ESTAVA DANDO ERRO!
    component: () => import('@/views/app/EditarPerfilView.vue'),
    meta: { layout: 'AppLayout', requiresAuth: true }
  },
  {
    path: '/perfil/lista/:type',
    name: ROUTE_NAMES.PROFILE_CONNECTIONS, // <--- Adicionado
    component: () => import('@/views/app/ListaConexoesView.vue'),
    meta: { layout: 'AppLayout', requiresAuth: true }
  },
  {
    path: '/posts/:postId',
    name: ROUTE_NAMES.POST_DETAILS, // <--- Adicionado
    component: () => import('@/views/app/PostDetailView.vue'),
    meta: { layout: 'AppLayout', requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/NotFoundView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guards de Segurança
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  if (!authStore.user && localStorage.getItem('instaclone.token')) {
    await authStore.init();
  }

  const isAuth = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuth) {
    next('/login');
  } else if (to.meta.requiresGuest && isAuth) {
    next('/feed');
  } else {
    next();
  }
});

export default router;