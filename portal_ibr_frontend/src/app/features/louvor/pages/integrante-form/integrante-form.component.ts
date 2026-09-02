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
  forkJoin
} from 'rxjs';

import {
  Integrante,
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
export class IntegranteFormComponent
  implements OnInit {

  private readonly integrantesService =
    inject(IntegrantesService);

  private readonly snackbar =
    inject(PortalSnackbarService);

  private readonly router =
    inject(Router);

  private readonly route =
    inject(ActivatedRoute);


  nome = '';

  funcoesSelecionadas:
    PortalSelectOption[] = [];

  salvando = false;

  carregando = false;


  integranteCarregado:
    Integrante | null = null;


  readonly integranteId =
    this.route.snapshot.paramMap.get('id');

  readonly modoEdicao =
    this.integranteId !== null;


  readonly funcoes: PortalSelectOption[] = [
    {
      id: 'ministracao',
      nome: 'Ministração'
    },
    {
      id: 'sonoplastia',
      nome: 'Sonoplastia'
    },
    {
      id: 'bateria',
      nome: 'Bateria'
    },
    {
      id: 'teclado',
      nome: 'Teclado'
    },
    {
      id: 'violao',
      nome: 'Violão'
    },
    {
      id: 'tenor',
      nome: 'Tenor'
    },
    {
      id: 'baritono',
      nome: 'Barítono'
    },
    {
      id: 'contralto',
      nome: 'Contralto'
    },
    {
      id: 'soprano',
      nome: 'Soprano'
    },
    {
      id: 'segunda-voz',
      nome: '2ª Voz'
    },
    {
      id: 'baixo',
      nome: 'Baixo'
    },
    {
      id: 'guitarra',
      nome: 'Guitarra'
    },
    {
      id: 'projecao',
      nome: 'Projeção'
    },
    {
      id: 'cajon',
      nome: 'Cajon'
    }
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
      .buscarPorId(
        this.integranteId
      )
      .subscribe({

        next: response => {

          const integrante =
            response.data;


          this.integranteCarregado =
            integrante;


          this.nome =
            integrante.nome;


          this.funcoesSelecionadas =
            this.funcoes.filter(
              funcao =>
                integrante.funcoes.includes(
                  String(
                    funcao['nome']
                  )
                )
            );


          this.carregando =
            false;

        },


        error: erro => {

          this.carregando =
            false;


          const mensagem =
            erro?.error?.message ??
            'Não foi possível carregar o integrante.';


          this.snackbar.error(
            mensagem
          );


          this.voltarParaLista();

        }

      });

  }


  salvar(): void {

    if (
      !this.formularioValido ||
      this.salvando
    ) {
      return;
    }


    if (
      this.modoEdicao &&
      this.integranteId &&
      this.integranteCarregado
    ) {

      this.salvarEdicao();

      return;

    }


    this.verificarIntegranteExistente();

  }


  private salvarEdicao(): void {

    if (
      !this.integranteId ||
      !this.integranteCarregado
    ) {
      return;
    }


    this.salvando = true;


    const funcoesLouvor =
      this.obterFuncoesLouvorSelecionadas();


    /*
     * Remove apenas as funções pertencentes
     * ao Louvor.
     *
     * Funções de outros ministérios,
     * como Foto, Vídeo e Story,
     * permanecem preservadas.
     */
    const outrasFuncoes =
      this.integranteCarregado.funcoes.filter(
        funcao =>
          !this.ehFuncaoLouvor(
            funcao
          )
      );


    /*
     * Mantém os ministérios que a pessoa
     * já possui e garante Louvor.
     */
    const ministerios =
      Array.from(
        new Set([
          ...this.integranteCarregado.ministerios,
          'Louvor'
        ])
      );


    const dados:
      EditarIntegranteRequest = {

      nome:
        this.nome.trim(),

      ministerios,

      funcoes: [
        ...outrasFuncoes,
        ...funcoesLouvor
      ],

      perfil_ministro:
        this.integranteCarregado.perfil_ministro

    };


    this.integrantesService
      .editar(
        this.integranteId,
        dados
      )
      .subscribe({

        next: response => {

          this.salvando =
            false;


          this.snackbar.success(
            response.message ??
            'Integrante atualizado com sucesso.'
          );


          this.voltarParaLista();

        },


        error: erro => {

          this.salvando =
            false;


          const mensagem =
            erro?.error?.message ??
            'Não foi possível atualizar o integrante.';


          this.snackbar.error(
            mensagem
          );

        }

      });

  }


  private verificarIntegranteExistente(): void {

    this.salvando = true;


    /*
     * Procuramos nos dois ministérios porque
     * a pessoa pode já existir apenas na Mídia.
     */
    forkJoin({

      louvor:
        this.integrantesService.listar(
          'Louvor',
          false
        ),

      midia:
        this.integrantesService.listar(
          'Midia',
          false
        )

    }).subscribe({

      next: response => {

        const integrantes =
          this.unirIntegrantes([
            ...response.louvor.data,
            ...response.midia.data
          ]);


        const integranteExistente =
          integrantes.find(
            integrante =>
              this.normalizarNome(
                integrante.nome
              ) ===
              this.normalizarNome(
                this.nome
              )
          );


        /*
         * Se a pessoa já existe,
         * não cria um segundo documento.
         *
         * Apenas adiciona Louvor ao cadastro.
         */
        if (integranteExistente) {

          this.vincularIntegranteExistente(
            integranteExistente
          );

          return;

        }


        /*
         * Não existe em nenhum ministério:
         * cadastro normal.
         */
        this.cadastrarNovoIntegrante();

      },


      error: erro => {

        this.salvando =
          false;


        const mensagem =
          erro?.error?.message ??
          'Não foi possível verificar os integrantes cadastrados.';


        this.snackbar.error(
          mensagem
        );

      }

    });

  }


  private vincularIntegranteExistente(
    integrante: Integrante
  ): void {

    const funcoesLouvor =
      this.obterFuncoesLouvorSelecionadas();


    const ministerios =
      Array.from(
        new Set([
          ...integrante.ministerios,
          'Louvor'
        ])
      );


    /*
     * Mantém todas as funções existentes
     * e acrescenta as funções selecionadas
     * para o Louvor.
     */
    const funcoes =
      Array.from(
        new Set([
          ...integrante.funcoes,
          ...funcoesLouvor
        ])
      );


    const dados:
      EditarIntegranteRequest = {

      nome:
        integrante.nome,

      ministerios,

      funcoes,

      perfil_ministro:
        integrante.perfil_ministro

    };


    this.integrantesService
      .editar(
        integrante._id,
        dados
      )
      .subscribe({

        next: response => {

          this.salvando =
            false;


          this.snackbar.success(
            response.message ??
            `${integrante.nome} foi adicionado ao Ministério de Louvor com sucesso.`
          );


          this.voltarParaLista();

        },


        error: erro => {

          this.salvando =
            false;


          const mensagem =
            erro?.error?.message ??
            'Não foi possível adicionar o integrante ao Ministério de Louvor.';


          this.snackbar.error(
            mensagem
          );

        }

      });

  }


  private cadastrarNovoIntegrante(): void {

    const dados:
      CadastrarIntegranteRequest = {

      nome:
        this.nome.trim(),

      ministerios: [
        'Louvor'
      ],

      funcoes:
        this.obterFuncoesLouvorSelecionadas(),

      perfil_ministro:
        false

    };


    this.integrantesService
      .cadastrar(
        dados
      )
      .subscribe({

        next: response => {

          this.salvando =
            false;


          this.snackbar.success(
            response.message ??
            'Integrante cadastrado com sucesso.'
          );


          this.voltarParaLista();

        },


        error: erro => {

          this.salvando =
            false;


          const mensagem =
            erro?.error?.message ??
            'Não foi possível cadastrar o integrante.';


          this.snackbar.error(
            mensagem
          );

        }

      });

  }


  private obterFuncoesLouvorSelecionadas(): string[] {

    return this.funcoesSelecionadas.map(
      funcao =>
        String(
          funcao['nome']
        )
    );

  }


  private ehFuncaoLouvor(
    funcao: string
  ): boolean {

    return this.funcoes.some(
      item =>
        String(
          item['nome']
        ) === funcao
    );

  }


  private unirIntegrantes(
    integrantes: Integrante[]
  ): Integrante[] {

    const integrantesUnicos =
      new Map<
        string,
        Integrante
      >();


    for (
      const integrante
      of integrantes
    ) {

      integrantesUnicos.set(
        integrante._id,
        integrante
      );

    }


    return Array.from(
      integrantesUnicos.values()
    );

  }


  private normalizarNome(
    nome: string
  ): string {

    return nome
      .trim()
      .toLocaleLowerCase(
        'pt-BR'
      )
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      );

  }


  private voltarParaLista(): void {

    void this.router.navigate([
      '/louvor/lideranca/integrantes'
    ]);

  }


  cancelar(): void {

    this.voltarParaLista();

  }

}