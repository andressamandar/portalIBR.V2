import {
  Routes
} from '@angular/router';

import {
  authGuard
} from './core/guards/auth.guard';


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
        component =>
          component.HomeComponent
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
        component =>
          component.LouvorAccessComponent
      )
  },


  // =====================================
  // LOGIN - LOUVOR
  // =====================================

  {
    path: 'louvor/lideranca/login',

    loadComponent: () =>
      import(
        './features/auth/pages/login/login.component'
      ).then(
        component =>
          component.LoginComponent
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
        component =>
          component.LoginComponent
      ),

    data: {
      ministerio: 'louvor',
      perfil: 'integrante'
    }
  },


  // =====================================
  // LOUVOR - LIDERANÇA
  // =====================================

  {
    path: 'louvor/lideranca',

    canActivate: [
      authGuard
    ],

    data: {
      perfis: [
        'lideranca_louvor'
      ]
    },

    loadComponent: () =>
      import(
        './shared/layouts/dashboard-layout/dashboard-layout.component'
      ).then(
        component =>
          component.DashboardLayoutComponent
      ),

    children: [

      // ---------------------------------
      // Dashboard
      // ---------------------------------

      {
        path: '',

        loadComponent: () =>
          import(
            './features/louvor/pages/lideranca-dashboard/lideranca-dashboard.component'
          ).then(
            component =>
              component.LiderancaDashboardComponent
          )
      },


      // ---------------------------------
      // Integrantes
      // ---------------------------------

      {
        path: 'integrantes',

        loadComponent: () =>
          import(
            './features/louvor/pages/integrantes/integrantes.component'
          ).then(
            component =>
              component.IntegrantesComponent
          )
      },

      {
        path: 'integrantes/novo',

        loadComponent: () =>
          import(
            './features/louvor/pages/integrante-form/integrante-form.component'
          ).then(
            component =>
              component.IntegranteFormComponent
          )
      },

      {
        path: 'integrantes/:id/editar',

        loadComponent: () =>
          import(
            './features/louvor/pages/integrante-form/integrante-form.component'
          ).then(
            component =>
              component.IntegranteFormComponent
          )
      },


      // ---------------------------------
      // Escala
      // ---------------------------------

      {
        path: 'escala',

        loadComponent: () =>
          import(
            './features/louvor/pages/escala/escala.component'
          ).then(
            component =>
              component.EscalaComponent
          )
      },

      {
        path: 'escala/datas',

        loadComponent: () =>
          import(
            './features/louvor/pages/gerenciar-datas/gerenciar-datas.component'
          ).then(
            component =>
              component.GerenciarDatasComponent
          )
      },

      {
        path: 'escala/datas/nova',

        loadComponent: () =>
          import(
            './features/louvor/pages/data-form/data-form.component'
          ).then(
            component =>
              component.DataFormComponent
          )
      },

      {
        path: 'escala/datas/:id/editar',

        loadComponent: () =>
          import(
            './features/louvor/pages/data-form/data-form.component'
          ).then(
            component =>
              component.DataFormComponent
          )
      },

      {
        path: 'escala/criar',

        loadComponent: () =>
          import(
            './features/louvor/pages/criar-escala/criar-escala.component'
          ).then(
            component =>
              component.CriarEscalaComponent
          )
      },

      {
        path: 'escala/preenchimento',

        loadComponent: () =>
          import(
            './features/louvor/pages/visualizar-preenchimento/visualizar-preenchimento.component'
          ).then(
            component =>
              component.VisualizarPreenchimentoComponent
          )
      },

      {
        path: 'escala/disponibilidades',

        loadComponent: () =>
          import(
            './features/louvor/pages/visualizar-disponibilidades/visualizar-disponibilidades.component'
          ).then(
            component =>
              component.VisualizarDisponibilidadesComponent
          )
      },

      {
        path: 'escala/download',

        loadComponent: () =>
          import(
            './features/louvor/pages/download-escala/download-escala.component'
          ).then(
            component =>
              component.DownloadEscalaComponent
          )
      },


      // ---------------------------------
      // Louvores
      // ---------------------------------

      {
        path: 'louvores',

        loadComponent: () =>
          import(
            './features/louvor/pages/louvores/louvores.component'
          ).then(
            component =>
              component.LouvoresComponent
          )
      },

      {
        path: 'louvores/gerenciar',

        loadComponent: () =>
          import(
            './features/louvor/pages/gerenciar-louvores/gerenciar-louvores.component'
          ).then(
            component =>
              component.GerenciarLouvoresComponent
          )
      },

      {
        path: 'louvores/gerenciar/novo',

        loadComponent: () =>
          import(
            './features/louvor/pages/louvor-form/louvor-form.component'
          ).then(
            component =>
              component.LouvorFormComponent
          )
      },

      {
        path: 'louvores/gerenciar/:id/editar',

        loadComponent: () =>
          import(
            './features/louvor/pages/louvor-form/louvor-form.component'
          ).then(
            component =>
              component.LouvorFormComponent
          )
      },

      {
        path: 'louvores/escalar',

        loadComponent: () =>
          import(
            './features/louvor/pages/escalar-louvores/escalar-louvores.component'
          ).then(
            component =>
              component.EscalarLouvoresComponent
          )
      }

    ]
  },


  // =====================================
  // LOUVOR - INTEGRANTE
  // =====================================

  {
    path: 'louvor/integrante',

    canActivate: [
      authGuard
    ],

    data: {
      perfis: [
        'integrante_louvor'
      ]
    },

    loadComponent: () =>
      import(
        './shared/layouts/dashboard-layout/dashboard-layout.component'
      ).then(
        component =>
          component.DashboardLayoutComponent
      ),

    children: [

      // ---------------------------------
      // Dashboard
      // ---------------------------------

      {
        path: '',

        loadComponent: () =>
          import(
            './features/louvor/pages/integrante-dashboard/integrante-dashboard.component'
          ).then(
            component =>
              component.IntegranteDashboardComponent
          )
      },


      // ---------------------------------
      // Disponibilidade
      // ---------------------------------

      {
        path: 'disponibilidade',

        loadComponent: () =>
          import(
            './features/louvor/pages/disponibilidade/disponibilidade.component'
          ).then(
            component =>
              component.DisponibilidadeComponent
          )
      },


      // ---------------------------------
      // Louvores
      // ---------------------------------

      {
        path: 'louvores',

        loadComponent: () =>
          import(
            './features/louvor/pages/escalar-louvores/escalar-louvores.component'
          ).then(
            component =>
              component.EscalarLouvoresComponent
          )
      },


      // ---------------------------------
      // Escalas
      // ---------------------------------

      {
        path: 'minha-escala',

        loadComponent: () =>
          import(
            './features/louvor/pages/minha-escala/minha-escala.component'
          ).then(
            component =>
              component.MinhaEscalaComponent
          )
      },

      {
        path: 'escala-completa',

        loadComponent: () =>
          import(
            './features/louvor/pages/escala-completa/escala-completa.component'
          ).then(
            component =>
              component.EscalaCompletaComponent
          )
      }

    ]
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
        component =>
          component.MidiaAccessComponent
      )
  },


  // =====================================
  // LOGIN - MÍDIA
  // =====================================

  {
    path: 'midia/lideranca/login',

    loadComponent: () =>
      import(
        './features/auth/pages/login/login.component'
      ).then(
        component =>
          component.LoginComponent
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
        component =>
          component.LoginComponent
      ),

    data: {
      ministerio: 'midia',
      perfil: 'integrante'
    }
  },


  // =====================================
  // MÍDIA - LIDERANÇA
  // =====================================

  {
    path: 'midia/lideranca',

    canActivate: [
      authGuard
    ],

    data: {
      perfis: [
        'lideranca_midia'
      ]
    },

    loadComponent: () =>
      import(
        './shared/layouts/dashboard-layout/dashboard-layout.component'
      ).then(
        component =>
          component.DashboardLayoutComponent
      ),

    children: [

      // ---------------------------------
      // Dashboard
      // ---------------------------------

      {
        path: '',

        loadComponent: () =>
          import(
            './features/midia/pages/lideranca-dashboard/lideranca-dashboard.component'
          ).then(
            component =>
              component.LiderancaDashboardComponent
          )
      },


      // ---------------------------------
      // Escala
      // ---------------------------------

      {
        path: 'escala',

        loadComponent: () =>
          import(
            './features/midia/pages/escala/escala.component'
          ).then(
            component =>
              component.EscalaComponent
          )
      },

      {
        path: 'escala/datas',

        loadComponent: () =>
          import(
            './features/midia/pages/gerenciar-datas/gerenciar-datas.component'
          ).then(
            component =>
              component.GerenciarDatasComponent
          )
      },

      {
        path: 'escala/datas/nova',

        loadComponent: () =>
          import(
            './features/midia/pages/data-form/data-form.component'
          ).then(
            component =>
              component.DataFormComponent
          )
      },

      {
        path: 'escala/datas/:id/editar',

        loadComponent: () =>
          import(
            './features/midia/pages/data-form/data-form.component'
          ).then(
            component =>
              component.DataFormComponent
          )
      },

      {
        path: 'escala/criar',

        loadComponent: () =>
          import(
            './features/midia/pages/criar-escala/criar-escala.component'
          ).then(
            component =>
              component.CriarEscalaComponent
          )
      },

      {
        path: 'escala/preenchimento',

        loadComponent: () =>
          import(
            './features/midia/pages/visualizar-preenchimento/visualizar-preenchimento.component'
          ).then(
            component =>
              component.VisualizarPreenchimentoComponent
          )
      },

      {
        path: 'escala/disponibilidades',

        loadComponent: () =>
          import(
            './features/midia/pages/visualizar-disponibilidades/visualizar-disponibilidades.component'
          ).then(
            component =>
              component.VisualizarDisponibilidadesComponent
          )
      },

      {
        path: 'escala/download',

        loadComponent: () =>
          import(
            './features/midia/pages/download-escala/download-escala.component'
          ).then(
            component =>
              component.DownloadEscalaComponent
          )
      },


      // ---------------------------------
      // Integrantes
      // ---------------------------------

      {
        path: 'integrantes',

        loadComponent: () =>
          import(
            './features/midia/pages/integrantes/integrantes.component'
          ).then(
            component =>
              component.IntegrantesComponent
          )
      },

      {
        path: 'integrantes/novo',

        loadComponent: () =>
          import(
            './features/midia/pages/integrante-form/integrante-form.component'
          ).then(
            component =>
              component.IntegranteFormComponent
          )
      },

      {
        path: 'integrantes/:id/editar',

        loadComponent: () =>
          import(
            './features/midia/pages/integrante-form/integrante-form.component'
          ).then(
            component =>
              component.IntegranteFormComponent
          )
      },


      // ---------------------------------
      // Tarefas
      // ---------------------------------

      {
        path: 'tarefas',

        loadComponent: () =>
          import(
            './features/midia/pages/tarefas/tarefas.component'
          ).then(
            component =>
              component.TarefasComponent
          )
      },

      {
        path: 'tarefas/nova',

        loadComponent: () =>
          import(
            './features/midia/pages/tarefa-form/tarefa-form.component'
          ).then(
            component =>
              component.TarefaFormComponent
          )
      },

      {
        path: 'tarefas/:id/editar',

        loadComponent: () =>
          import(
            './features/midia/pages/tarefa-form/tarefa-form.component'
          ).then(
            component =>
              component.TarefaFormComponent
          )
      }

    ]
  },


  // =====================================
  // MÍDIA - INTEGRANTE
  // =====================================

  {
    path: 'midia/integrante',

    canActivate: [
      authGuard
    ],

    data: {
      perfis: [
        'integrante_midia'
      ]
    },

    loadComponent: () =>
      import(
        './shared/layouts/dashboard-layout/dashboard-layout.component'
      ).then(
        component =>
          component.DashboardLayoutComponent
      ),

    children: [

      // ---------------------------------
      // Dashboard
      // ---------------------------------

      {
        path: '',

        loadComponent: () =>
          import(
            './features/midia/pages/integrante-dashboard/integrante-dashboard.component'
          ).then(
            component =>
              component.IntegranteDashboardComponent
          )
      },


      // ---------------------------------
      // Disponibilidade
      // ---------------------------------

      {
        path: 'disponibilidade',

        loadComponent: () =>
          import(
            './features/midia/pages/disponibilidade/disponibilidade.component'
          ).then(
            component =>
              component.DisponibilidadeComponent
          )
      },


      // ---------------------------------
      // Tarefas
      // ---------------------------------

      {
        path: 'tarefas',

        loadComponent: () =>
          import(
            './features/midia/pages/tarefas-integrante/tarefas-integrante.component'
          ).then(
            component =>
              component.TarefasIntegranteComponent
          )
      },


      // ---------------------------------
      // Escalas
      // ---------------------------------

      {
        path: 'minha-escala',

        loadComponent: () =>
          import(
            './features/midia/pages/minha-escala/minha-escala.component'
          ).then(
            component =>
              component.MinhaEscalaComponent
          )
      },

      {
        path: 'escala-completa',

        loadComponent: () =>
          import(
            './features/midia/pages/escala-completa/escala-completa.component'
          ).then(
            component =>
              component.EscalaCompletaComponent
          )
      }

    ]
  },


  // =====================================
  // SOLICITAÇÕES - PÚBLICO
  // =====================================

  {
    path: 'midia/solicitacoes',

    loadComponent: () =>
      import(
        './features/midia/pages/solicitacoes/solicitacoes.component'
      ).then(
        component =>
          component.SolicitacoesComponent
      )
  },

  {
    path: 'midia/solicitacoes/nova',

    loadComponent: () =>
      import(
        './features/midia/pages/nova-solicitacao/nova-solicitacao.component'
      ).then(
        component =>
          component.NovaSolicitacaoComponent
      )
  },

  {
    path: 'midia/solicitacoes/acompanhar',

    loadComponent: () =>
      import(
        './features/midia/pages/acompanhar-solicitacao/acompanhar-solicitacao.component'
      ).then(
        component =>
          component.AcompanharSolicitacaoComponent
      )
  },

  {
    path:
      'midia/solicitacoes/acompanhar/:celular/:id/editar',

    loadComponent: () =>
      import(
        './features/midia/pages/editar-solicitacao/editar-solicitacao.component'
      ).then(
        component =>
          component.EditarSolicitacaoComponent
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
        component =>
          component.UiKitComponent
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