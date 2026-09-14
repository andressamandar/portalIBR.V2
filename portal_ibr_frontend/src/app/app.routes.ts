import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';


export const routes: Routes = [

  // =====================================
  // HOME
  // =====================================

  {
    path: '',
    loadComponent: () =>
      import(
        './features/home/pages/home/home.component'
      ).then(
        component => component.HomeComponent
      )
  },


  // =====================================
  // MINISTÉRIO DE LOUVOR
  // =====================================

  {
    path: 'louvor',
    loadComponent: () =>
      import(
        './features/louvor/pages/louvor-access/louvor-access.component'
      ).then(
        component => component.LouvorAccessComponent
      )
  },


  // -------------------------------------
  // Login
  // -------------------------------------

  {
    path: 'louvor/lideranca/login',
    loadComponent: () =>
      import(
        './features/auth/pages/login/login.component'
      ).then(
        component => component.LoginComponent
      ),
    data: {
      ministerio: 'louvor',
      perfil: 'lideranca'
    }
  },

  {
    path: 'louvor/integrante/login',
    loadComponent: () =>
      import(
        './features/auth/pages/login/login.component'
      ).then(
        component => component.LoginComponent
      ),
    data: {
      ministerio: 'louvor',
      perfil: 'integrante'
    }
  },


  // -------------------------------------
  // Dashboards
  // -------------------------------------

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


  // -------------------------------------
  // Integrantes
  // -------------------------------------

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


  // -------------------------------------
  // Escala - Liderança
  // -------------------------------------

  {
    path: 'louvor/lideranca/escala',
    canActivate: [authGuard],
    data: {
      perfis: ['lideranca_louvor']
    },
    loadComponent: () =>
      import(
        './features/louvor/pages/escala/escala.component'
      ).then(
        component => component.EscalaComponent
      )
  },

  {
    path: 'louvor/lideranca/escala/datas',
    canActivate: [authGuard],
    data: {
      perfis: ['lideranca_louvor']
    },
    loadComponent: () =>
      import(
        './features/louvor/pages/gerenciar-datas/gerenciar-datas.component'
      ).then(
        component => component.GerenciarDatasComponent
      )
  },

  {
    path: 'louvor/lideranca/escala/datas/nova',
    canActivate: [authGuard],
    data: {
      perfis: ['lideranca_louvor']
    },
    loadComponent: () =>
      import(
        './features/louvor/pages/data-form/data-form.component'
      ).then(
        component => component.DataFormComponent
      )
  },

  {
    path: 'louvor/lideranca/escala/datas/:id/editar',
    canActivate: [authGuard],
    data: {
      perfis: ['lideranca_louvor']
    },
    loadComponent: () =>
      import(
        './features/louvor/pages/data-form/data-form.component'
      ).then(
        component => component.DataFormComponent
      )
  },

  {
    path: 'louvor/lideranca/escala/criar',
    canActivate: [authGuard],
    data: {
      perfis: ['lideranca_louvor']
    },
    loadComponent: () =>
      import(
        './features/louvor/pages/criar-escala/criar-escala.component'
      ).then(
        component => component.CriarEscalaComponent
      )
  },

  {
    path: 'louvor/lideranca/escala/preenchimento',
    canActivate: [authGuard],
    data: {
      perfis: ['lideranca_louvor']
    },
    loadComponent: () =>
      import(
        './features/louvor/pages/visualizar-preenchimento/visualizar-preenchimento.component'
      ).then(
        component => component.VisualizarPreenchimentoComponent
      )
  },

  {
    path: 'louvor/lideranca/escala/disponibilidades',
    canActivate: [authGuard],
    data: {
      perfis: ['lideranca_louvor']
    },
    loadComponent: () =>
      import(
        './features/louvor/pages/visualizar-disponibilidades/visualizar-disponibilidades.component'
      ).then(
        component => component.VisualizarDisponibilidadesComponent
      )
  },

  {
    path: 'louvor/lideranca/escala/download',
    canActivate: [authGuard],
    data: {
      perfis: ['lideranca_louvor']
    },
    loadComponent: () =>
      import(
        './features/louvor/pages/download-escala/download-escala.component'
      ).then(
        component => component.DownloadEscalaComponent
      )
  },


  // -------------------------------------
  // Disponibilidade - Integrante
  // -------------------------------------

  {
    path: 'louvor/integrante/disponibilidade',
    canActivate: [authGuard],
    data: {
      perfis: ['integrante_louvor']
    },
    loadComponent: () =>
      import(
        './features/louvor/pages/disponibilidade/disponibilidade.component'
      ).then(
        component => component.DisponibilidadeComponent
      )
  },


  // -------------------------------------
  // Louvores
  // -------------------------------------

  {
    path: 'louvor/lideranca/louvores',
    canActivate: [authGuard],
    data: {
      perfis: ['lideranca_louvor']
    },
    loadComponent: () =>
      import(
        './features/louvor/pages/louvores/louvores.component'
      ).then(
        component => component.LouvoresComponent
      )
  },

  {
    path: 'louvor/lideranca/louvores/gerenciar',
    canActivate: [authGuard],
    data: {
      perfis: ['lideranca_louvor']
    },
    loadComponent: () =>
      import(
        './features/louvor/pages/gerenciar-louvores/gerenciar-louvores.component'
      ).then(
        component => component.GerenciarLouvoresComponent
      )
  },

  {
    path: 'louvor/lideranca/louvores/gerenciar/novo',
    canActivate: [authGuard],
    data: {
      perfis: ['lideranca_louvor']
    },
    loadComponent: () =>
      import(
        './features/louvor/pages/louvor-form/louvor-form.component'
      ).then(
        component => component.LouvorFormComponent
      )
  },

  {
    path: 'louvor/lideranca/louvores/gerenciar/:id/editar',
    canActivate: [authGuard],
    data: {
      perfis: ['lideranca_louvor']
    },
    loadComponent: () =>
      import(
        './features/louvor/pages/louvor-form/louvor-form.component'
      ).then(
        component => component.LouvorFormComponent
      )
  },

  {
    path: 'louvor/lideranca/louvores/escalar',
    canActivate: [authGuard],
    data: {
      perfis: ['lideranca_louvor']
    },
    loadComponent: () =>
      import(
        './features/louvor/pages/escalar-louvores/escalar-louvores.component'
      ).then(
        component => component.EscalarLouvoresComponent
      )
  },

  {
    path: 'louvor/integrante/louvores',
    canActivate: [authGuard],
    data: {
      perfis: ['integrante_louvor']
    },
    loadComponent: () =>
      import(
        './features/louvor/pages/escalar-louvores/escalar-louvores.component'
      ).then(
        component => component.EscalarLouvoresComponent
      )
  },


  // -------------------------------------
  // Escalas - Integrante
  // -------------------------------------

  {
    path: 'louvor/integrante/minha-escala',
    canActivate: [authGuard],
    data: {
      perfis: ['integrante_louvor']
    },
    loadComponent: () =>
      import(
        './features/louvor/pages/minha-escala/minha-escala.component'
      ).then(
        component => component.MinhaEscalaComponent
      )
  },

  {
    path: 'louvor/integrante/escala-completa',
    canActivate: [authGuard],
    data: {
      perfis: ['integrante_louvor']
    },
    loadComponent: () =>
      import(
        './features/louvor/pages/escala-completa/escala-completa.component'
      ).then(
        component => component.EscalaCompletaComponent
      )
  },


  // =====================================
  // MINISTÉRIO DE MÍDIA
  // =====================================

  {
    path: 'midia',
    loadComponent: () =>
      import(
        './features/midia/pages/midia-access/midia-access.component'
      ).then(
        component => component.MidiaAccessComponent
      )
  },


  // -------------------------------------
  // Login
  // -------------------------------------

  {
    path: 'midia/lideranca/login',
    loadComponent: () =>
      import(
        './features/auth/pages/login/login.component'
      ).then(
        component => component.LoginComponent
      ),
    data: {
      ministerio: 'midia',
      perfil: 'lideranca'
    }
  },

  {
    path: 'midia/integrante/login',
    loadComponent: () =>
      import(
        './features/auth/pages/login/login.component'
      ).then(
        component => component.LoginComponent
      ),
    data: {
      ministerio: 'midia',
      perfil: 'integrante'
    }
  },


  // -------------------------------------
  // Dashboards
  // -------------------------------------

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


  // -------------------------------------
  // Escala - Liderança
  // -------------------------------------

  {
    path: 'midia/lideranca/escala',
    canActivate: [authGuard],
    data: {
      perfis: ['lideranca_midia']
    },
    loadComponent: () =>
      import(
        './features/midia/pages/escala/escala.component'
      ).then(
        component => component.EscalaComponent
      )
  },

  {
    path: 'midia/lideranca/escala/datas',
    canActivate: [authGuard],
    data: {
      perfis: ['lideranca_midia']
    },
    loadComponent: () =>
      import(
        './features/midia/pages/gerenciar-datas/gerenciar-datas.component'
      ).then(
        component => component.GerenciarDatasComponent
      )
  },

  {
    path: 'midia/lideranca/escala/datas/nova',
    canActivate: [authGuard],
    data: {
      perfis: ['lideranca_midia']
    },
    loadComponent: () =>
      import(
        './features/midia/pages/data-form/data-form.component'
      ).then(
        component => component.DataFormComponent
      )
  },

  {
    path: 'midia/lideranca/escala/datas/:id/editar',
    canActivate: [authGuard],
    data: {
      perfis: ['lideranca_midia']
    },
    loadComponent: () =>
      import(
        './features/midia/pages/data-form/data-form.component'
      ).then(
        component => component.DataFormComponent
      )
  },

  {
    path: 'midia/lideranca/escala/criar',
    canActivate: [authGuard],
    data: {
      perfis: ['lideranca_midia']
    },
    loadComponent: () =>
      import(
        './features/midia/pages/criar-escala/criar-escala.component'
      ).then(
        component => component.CriarEscalaComponent
      )
  },

  // -------------------------------------
// Integrantes - Liderança
// -------------------------------------

  {
    path: 'midia/lideranca/integrantes',
    canActivate: [authGuard],
    data: {
      perfis: ['lideranca_midia']
    },
    loadComponent: () =>
      import(
        './features/midia/pages/integrantes/integrantes.component'
      ).then(
        component => component.IntegrantesComponent
      )
  },

  {
    path: 'midia/lideranca/integrantes/novo',
    canActivate: [authGuard],
    data: {
      perfis: ['lideranca_midia']
    },
    loadComponent: () =>
      import(
        './features/midia/pages/integrante-form/integrante-form.component'
      ).then(
        component => component.IntegranteFormComponent
      )
  },

  {
    path: 'midia/lideranca/integrantes/:id/editar',
    canActivate: [authGuard],
    data: {
      perfis: ['lideranca_midia']
    },
    loadComponent: () =>
      import(
        './features/midia/pages/integrante-form/integrante-form.component'
      ).then(
        component => component.IntegranteFormComponent
      )
  },

  {
    path: 'midia/integrante/disponibilidade',
    canActivate: [authGuard],
    data: {
      perfis: ['integrante_midia']
    },
    loadComponent: () =>
      import(
        './features/midia/pages/disponibilidade/disponibilidade.component'
      ).then(
        component => component.DisponibilidadeComponent
      )
  },

  {
    path: 'midia/lideranca/escala/preenchimento',
    canActivate: [authGuard],
    data: {
      perfis: ['lideranca_midia']
    },
    loadComponent: () =>
      import(
        './features/midia/pages/visualizar-preenchimento/visualizar-preenchimento.component'
      ).then(


        component => component.VisualizarPreenchimentoComponent
      )
  },

  {
    path: 'midia/lideranca/escala/disponibilidades',
    canActivate: [authGuard],
    data: {
      perfis: ['lideranca_midia']
    },
    loadComponent: () =>
      import(
        './features/midia/pages/visualizar-disponibilidades/visualizar-disponibilidades.component'
      ).then(
        component => component.VisualizarDisponibilidadesComponent
      )
  },

  {
    path: 'midia/lideranca/escala/download',
    canActivate: [authGuard],
    data: {
      perfis: ['lideranca_midia']
    },
    loadComponent: () =>
      import(
        './features/midia/pages/download-escala/download-escala.component'
      ).then(
        component => component.DownloadEscalaComponent
      )
  },

  {
    path: 'midia/lideranca/tarefas',
    canActivate: [authGuard],
    data: {
      perfis: ['lideranca_midia']
    },
    loadComponent: () =>
      import(
        './features/midia/pages/tarefas/tarefas.component'
      ).then(
        component => component.TarefasComponent
      )
  },

  {
    path: 'midia/lideranca/tarefas/nova',
    canActivate: [authGuard],
    data: {
      perfis: ['lideranca_midia']
    },
    loadComponent: () =>
      import(
        './features/midia/pages/tarefa-form/tarefa-form.component'
      ).then(
        component => component.TarefaFormComponent
      )
  },

  {
    path: 'midia/lideranca/tarefas/:id/editar',
    canActivate: [authGuard],
    data: {
      perfis: ['lideranca_midia']
    },
    loadComponent: () =>
      import(
        './features/midia/pages/tarefa-form/tarefa-form.component'
      ).then(
        component => component.TarefaFormComponent
      )
  },

  {
    path: 'midia/integrante/tarefas',
    canActivate: [authGuard],
    data: {
      perfis: ['integrante_midia']
    },
    loadComponent: () =>
      import(
        './features/midia/pages/tarefas-integrante/tarefas-integrante.component'
      ).then(
        component => component.TarefasIntegranteComponent
      )
  },

  {
    path: 'midia/integrante/minha-escala',
    canActivate: [authGuard],
    data: {
      perfis: ['integrante_midia']
    },
    loadComponent: () =>
      import(
        './features/midia/pages/minha-escala/minha-escala.component'
      ).then(
        component => component.MinhaEscalaComponent
      )
  },

  {
    path: 'midia/integrante/escala-completa',
    canActivate: [authGuard],
    data: {
      perfis: ['integrante_midia']
    },
    loadComponent: () =>
      import(
        './features/midia/pages/escala-completa/escala-completa.component'
      ).then(
        component => component.EscalaCompletaComponent
      )
  },
  // =====================================
  // DESENVOLVIMENTO
  // =====================================

  {
    path: 'dev/ui',
    loadComponent: () =>
      import(
        './features/dev/pages/ui-kit/ui-kit.component'
      ).then(
        component => component.UiKitComponent
      )
  },




  // =====================================
  // FALLBACK
  // =====================================

  {
    path: '**',
    redirectTo: ''
  }

];