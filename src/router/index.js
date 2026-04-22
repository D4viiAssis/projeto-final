import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
  {
    path: '/',
    redirect: '/feed'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { requiresGuest: true, layout: 'AuthLayout' }
  },
  {
    path: '/cadastro',
    name: 'cadastro',
    component: () => import('@/views/auth/CadastroView.vue'),
    meta: { requiresGuest: true, layout: 'AuthLayout' }
  },
  {
    path: '/feed',
    name: 'feed',
    component: () => import('@/views/FeedView.vue'),
    meta: { requiresAuth: true, layout: 'AppLayout' }
  },
  // As outras rotas abaixo darão erro enquanto não criarmos os arquivos nas views,
  // mas já deixamos o contrato pronto aqui.
  {
    path: '/descobrir',
    component: () => import('@/views/DescubrirView.vue'),
    meta: { requiresAuth: true, layout: 'AppLayout' }
  },
  {
    path: '/criar',
    component: () => import('@/views/CriarPostView.vue'),
    meta: { requiresAuth: true, layout: 'AppLayout' }
  },
  {
    path: '/perfil',
    component: () => import('@/views/PerfilView.vue'),
    meta: { requiresAuth: true, layout: 'AppLayout' }
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/NotFoundView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  if (authStore.token && !authStore.user) {
    await authStore.init();
  }

  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/feed');
  } else {
    next();
  }
});

export default router;