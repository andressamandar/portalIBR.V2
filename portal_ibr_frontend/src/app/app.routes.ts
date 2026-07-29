import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/pages/home/home.component')
        .then(component => component.HomeComponent)
  },

  // Ministério de Louvor
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

  // Ministério de Mídia
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

  // Ambiente interno de desenvolvimento
  {
    path: 'dev/ui',
    loadComponent: () =>
      import('./features/dev/pages/ui-kit/ui-kit.component')
        .then(component => component.UiKitComponent)
  },

  {
    path: '**',
    redirectTo: ''
  }
];