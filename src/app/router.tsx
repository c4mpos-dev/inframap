import { createBrowserRouter } from 'react-router'
import type { ComponentType } from 'react'
import { AppLayout } from './layouts/AppLayout'
import { FlowLayout } from './layouts/FlowLayout'
import { TeamLayout } from './layouts/TeamLayout'

const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
})

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', lazy: page(() => import('@/pages/HomePage')) },
      { path: '/mapa', lazy: page(() => import('@/pages/MapPage')) },
      { path: '/indicadores', lazy: page(() => import('@/pages/IndicatorsPage')) },
      { path: '/meus-relatos', lazy: page(() => import('@/pages/MyReportsPage')) },
      { path: '/perfil', lazy: page(() => import('@/pages/ProfilePage')) },
      { path: '*', lazy: page(() => import('@/pages/NotFoundPage')) },
    ],
  },
  {
    element: <AppLayout showMobileNav={false} />,
    children: [{ path: '/ocorrencia/:id', lazy: page(() => import('@/pages/OccurrencePage')) }],
  },
  {
    element: <FlowLayout title="Marcar problema" />,
    children: [{ path: '/marcar', lazy: page(() => import('@/pages/MarkProblemPage')) }],
  },
  {
    element: <FlowLayout title="Entrar" />,
    children: [{ path: '/entrar', lazy: page(() => import('@/pages/SignInPage')) }],
  },
  {
    element: <TeamLayout />,
    children: [{ path: '/equipe', lazy: page(() => import('@/pages/TeamPage')) }],
  },
])
