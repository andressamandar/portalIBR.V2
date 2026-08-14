import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/pages/home/home.component')
        .then(component => component.HomeComponent)
  },

  // =====================================
  // MINISTÉRIO DE LOUVOR
  // =====================================

  {
    path: 'louvor',
    loadComponent: () =>
      import('./features/louvor/pages/louvor-access/louvor-access.component')
        .then(component => component.LouvorAccessComponent)
  },

  {
    path: 'louvor/lideranca/login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component')
        .then(component => component.LoginComponent),
    data: {
      ministerio: 'louvor',
      perfil: 'lideranca'
    }
  },

  {
    path: 'louvor/integrante/login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component')
        .then(component => component.LoginComponent),
    data: {
      ministerio: 'louvor',
      perfil: 'integrante'
    }
  },

  {
    path: 'louvor/lideranca',
    canActivate: [authGuard],
    data: {
      perfis: ['lideranca_louvor']
    },
    loadComponent: () =>
      import(
        './features/louvor/pages/lideranca-dashboard/lideranca-dashboard.component'
      ).then(
        component => component.LiderancaDashboardComponent
      )
  },

  {
    path: 'louvor/integrante',
    canActivate: [authGuard],
    data: {
      perfis: ['integrante_louvor']
    },
    loadComponent: () =>
      import(
        './features/louvor/pages/integrante-dashboard/integrante-dashboard.component'
      ).then(
        component => component.IntegranteDashboardComponent
      )
  },

  {
  path: 'louvor/lideranca/integrantes',
  canActivate: [authGuard],
  data: {
    perfis: ['lideranca_louvor']
  },
  loadComponent: () =>
    import(
      './features/louvor/pages/integrantes/integrantes.component'
    ).then(
      component => component.IntegrantesComponent
    )
},

{
  path: 'louvor/lideranca/integrantes/novo',
  canActivate: [authGuard],
  data: {
    perfis: ['lideranca_louvor']
  },
  loadComponent: () =>
    import(
      './features/louvor/pages/integrante-form/integrante-form.component'
    ).then(
      component => component.IntegranteFormComponent
    )
},

{
  path: 'louvor/lideranca/integrantes/:id/editar',
  canActivate: [authGuard],
  data: {
    perfis: ['lideranca_louvor']
  },
  loadComponent: () =>
    import(
      './features/louvor/pages/integrante-form/integrante-form.component'
    ).then(
      component => component.IntegranteFormComponent
    )
},

  // =====================================
  // MINISTÉRIO DE MÍDIA
  // =====================================

  {
    path: 'midia',
    loadComponent: () =>
      import('./features/midia/pages/midia-access/midia-access.component')
        .then(component => component.MidiaAccessComponent)
  },

  {
    path: 'midia/lideranca/login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component')
        .then(component => component.LoginComponent),
    data: {
      ministerio: 'midia',
      perfil: 'lideranca'
    }
  },

  {
    path: 'midia/integrante/login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component')
        .then(component => component.LoginComponent),
    data: {
      ministerio: 'midia',
      perfil: 'integrante'
    }
  },

  {
  path: 'midia/lideranca',
  canActivate: [authGuard],
  data: {
    perfis: ['lideranca_midia']
  },
  loadComponent: () =>
    import(
      './features/midia/pages/lideranca-dashboard/lideranca-dashboard.component'
    ).then(
      component => component.LiderancaDashboardComponent
    )
},

{
  path: 'midia/integrante',
  canActivate: [authGuard],
  data: {
    perfis: ['integrante_midia']
  },
  loadComponent: () =>
    import(
      './features/midia/pages/integrante-dashboard/integrante-dashboard.component'
    ).then(
      component => component.IntegranteDashboardComponent
    )
},

  // =====================================
  // DESENVOLVIMENTO
  // =====================================

  {
    path: 'dev/ui',
    loadComponent: () =>
      import('./features/dev/pages/ui-kit/ui-kit.component')
        .then(component => component.UiKitComponent)
  },

  // =====================================
  // FALLBACK
  // =====================================

  {
    path: '**',
    redirectTo: ''
  }
];