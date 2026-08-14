import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  IntegrantesService,
  CadastrarIntegranteRequest,
  EditarIntegranteRequest
} from '../../../../core/services/integrantes.service';

import {
  PortalSnackbarService
} from '../../../../core/services/portal-snackbar.service';

import {
  PortalInputComponent
} from '../../../../shared/components/ui/portal-input/portal-input.component';

import {
  PortalSelectComponent,
  PortalSelectOption
} from '../../../../shared/components/ui/portal-select/portal-select.component';

import {
  PortalButtonComponent
} from '../../../../shared/components/ui/portal-button/portal-button.component';

import {
  PortalLoadingComponent
} from '../../../../shared/components/ui/portal-loading/portal-loading.component';

@Component({
  selector: 'app-integrante-form',
  standalone: true,
  imports: [
    FormsModule,
    PortalInputComponent,
    PortalSelectComponent,
    PortalButtonComponent,
    PortalLoadingComponent
  ],
  templateUrl: './integrante-form.component.html',
  styleUrl: './integrante-form.component.scss'
})
export class IntegranteFormComponent implements OnInit {
  private readonly integrantesService =
    inject(IntegrantesService);

  private readonly snackbar =
    inject(PortalSnackbarService);

  private readonly router =
    inject(Router);

  private readonly route =
    inject(ActivatedRoute);

  nome = '';

  funcoesSelecionadas: PortalSelectOption[] = [];

  salvando = false;
  carregando = false;

  readonly integranteId =
    this.route.snapshot.paramMap.get('id');

  readonly modoEdicao =
    this.integranteId !== null;

  readonly funcoes: PortalSelectOption[] = [
    { id: 'ministracao', nome: 'Ministração' },
    { id: 'sonoplastia', nome: 'Sonoplastia' },
    { id: 'bateria', nome: 'Bateria' },
    { id: 'teclado', nome: 'Teclado' },
    { id: 'violao', nome: 'Violão' },
    { id: 'tenor', nome: 'Tenor' },
    { id: 'baritono', nome: 'Barítono' },
    { id: 'contralto', nome: 'Contralto' },
    { id: 'soprano', nome: 'Soprano' },
    { id: 'segunda-voz', nome: '2ª Voz' },
    { id: 'baixo', nome: 'Baixo' },
    { id: 'guitarra', nome: 'Guitarra' },
    { id: 'projecao', nome: 'Projeção' },
    { id: 'cajon', nome: 'Cajon' }
  ];

  ngOnInit(): void {
    if (this.modoEdicao) {
      this.carregarIntegrante();
    }
  }

  get formularioValido(): boolean {
    return (
      this.nome.trim().length > 0 &&
      this.funcoesSelecionadas.length > 0
    );
  }

  private carregarIntegrante(): void {
    if (!this.integranteId) {
      return;
    }

    this.carregando = true;

    this.integrantesService
      .buscarPorId(this.integranteId)
      .subscribe({
        next: response => {
          const integrante = response.data;

          this.nome = integrante.nome;

          this.funcoesSelecionadas =
            this.funcoes.filter(
              funcao =>
                integrante.funcoes.includes(
                  String(funcao['nome'])
                )
            );

          this.carregando = false;
        },

        error: erro => {
          this.carregando = false;

          const mensagem =
            erro?.error?.message ??
            'Não foi possível carregar o integrante.';

          this.snackbar.error(mensagem);

          void this.router.navigate([
            '/louvor/lideranca/integrantes'
          ]);
        }
      });
  }

  salvar(): void {
    if (!this.formularioValido || this.salvando) {
      return;
    }

    this.salvando = true;

    const dadosBase = {
      nome: this.nome.trim(),

      ministerios: [
        'Louvor'
      ],

      funcoes: this.funcoesSelecionadas.map(
        funcao => String(funcao['nome'])
      ),

      perfil_ministro: false
    };

    if (
      this.modoEdicao &&
      this.integranteId
    ) {
      const dados: EditarIntegranteRequest =
        dadosBase;

      this.integrantesService
        .editar(
          this.integranteId,
          dados
        )
        .subscribe({
          next: response => {
            this.salvando = false;

            this.snackbar.success(
              response.message ??
              'Integrante atualizado com sucesso.'
            );

            void this.router.navigate([
              '/louvor/lideranca/integrantes'
            ]);
          },

          error: erro => {
            this.salvando = false;

            const mensagem =
              erro?.error?.message ??
              'Não foi possível atualizar o integrante.';

            this.snackbar.error(mensagem);
          }
        });

      return;
    }

    const dados: CadastrarIntegranteRequest =
      dadosBase;

    this.integrantesService
      .cadastrar(dados)
      .subscribe({
        next: response => {
          this.salvando = false;

          this.snackbar.success(
            response.message ??
            'Integrante cadastrado com sucesso.'
          );

          void this.router.navigate([
            '/louvor/lideranca/integrantes'
          ]);
        },

        error: erro => {
          this.salvando = false;

          const mensagem =
            erro?.error?.message ??
            'Não foi possível cadastrar o integrante.';

          this.snackbar.error(mensagem);
        }
      });
  }

  cancelar(): void {
    void this.router.navigate([
      '/louvor/lideranca/integrantes'
    ]);
  }
}