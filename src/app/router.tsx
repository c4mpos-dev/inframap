import { createBrowserRouter } from 'react-router'
import type { ComponentType } from 'react'
import { AppLayout } from './layouts/AppLayout'
import { FlowLayout } from './layouts/FlowLayout'
import { RootLayout } from './layouts/RootLayout'
import { RouteFallback } from './layouts/RouteFallback'
import { TeamLayout } from './layouts/TeamLayout'

const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
})

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    HydrateFallback: RouteFallback,
    children: [
      { path: '/', HydrateFallback: RouteFallback, lazy: page(() => import('@/pages/HomePage')) },
      {
        element: <AppLayout />,
        HydrateFallback: RouteFallback,
        children: [
          { path: '/mapa', handle: { title: 'Mapa' }, lazy: page(() => import('@/pages/MapPage')) },
          {
            path: '/indicadores',
            handle: { title: 'Números da cidade' },
            lazy: page(() => import('@/pages/IndicatorsPage')),
          },
          {
            path: '/meus-relatos',
            handle: { title: 'Meus relatos' },
            lazy: page(() => import('@/pages/MyReportsPage')),
          },
          {
            path: '/perfil',
            handle: { title: 'Perfil' },
            lazy: page(() => import('@/pages/ProfilePage')),
          },
          {
            path: '/privacidade',
            handle: { title: 'Privacidade' },
            lazy: page(() => import('@/pages/PrivacyPage')),
          },
          {
            path: '/termos',
            handle: { title: 'Termos de uso' },
            lazy: page(() => import('@/pages/TermsPage')),
          },
          ...(import.meta.env.DEV
            ? [
                {
                  path: '/dev/componentes',
                  handle: { title: 'Componentes' },
                  lazy: page(() => import('@/pages/dev/ComponentsPage')),
                },
              ]
            : []),
          {
            path: '*',
            handle: { title: 'Página não encontrada' },
            lazy: page(() => import('@/pages/NotFoundPage')),
          },
        ],
      },
      {
        element: <AppLayout showMobileNav={false} />,
        HydrateFallback: RouteFallback,
        children: [
          {
            path: '/ocorrencia/:id',
            handle: { title: 'Relato' },
            lazy: page(() => import('@/pages/OccurrencePage')),
          },
        ],
      },
      {
        element: <FlowLayout title="Marcar problema" />,
        HydrateFallback: RouteFallback,
        children: [
          {
            path: '/marcar',
            handle: { title: 'Marcar problema' },
            lazy: page(() => import('@/pages/MarkProblemPage')),
          },
        ],
      },
      {
        element: <FlowLayout title="Entrar" />,
        HydrateFallback: RouteFallback,
        children: [
          {
            path: '/entrar',
            handle: { title: 'Entrar' },
            lazy: page(() => import('@/pages/SignInPage')),
          },
        ],
      },
      {
        element: <TeamLayout />,
        HydrateFallback: RouteFallback,
        children: [
          {
            path: '/equipe',
            handle: { title: 'Painel da equipe' },
            lazy: page(() => import('@/pages/TeamPage')),
          },
        ],
      },
    ],
  },
])
