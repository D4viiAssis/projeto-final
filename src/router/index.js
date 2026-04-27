import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
  {
    path: '/',
    redirect: '/feed'
  },
  {
    path: '/login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { layout: 'AuthLayout', requiresGuest: true }
  },
  {
    path: '/cadastro',
    component: () => import('@/views/auth/CadastroView.vue'),
    meta: { layout: 'AuthLayout', requiresGuest: true }
  },
  {
    path: '/feed',
    component: () => import('@/views/FeedView.vue'),
    meta: { layout: 'AppLayout', requiresAuth: true }
  },
  {
    path: '/descobrir',
    component: () => import('@/views/DescubrirView.vue'),
    meta: { layout: 'AppLayout', requiresAuth: true }
  },
  {
    path: '/criar',
    component: () => import('@/views/CriarPostView.vue'),
    meta: { layout: 'AppLayout', requiresAuth: true }
  },
  {
    path: '/perfil',
    component: () => import('@/views/PerfilView.vue'),
    meta: { layout: 'AppLayout', requiresAuth: true }
  },
  {
    path: '/perfil/editar',
    component: () => import('@/views/EditarPerfilView.vue'),
    meta: { layout: 'AppLayout', requiresAuth: true }
  },
  {
    path: '/perfil/lista/:type',
    component: () => import('@/views/ListaConexoesView.vue'),
    meta: { layout: 'AppLayout', requiresAuth: true }
  },
  {
    path: '/posts/:postId',
    component: () => import('@/views/PostDetailView.vue'),
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
  
  // Se a store ainda não foi inicializada (F5), inicializa agora
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