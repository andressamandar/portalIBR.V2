import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  forkJoin
} from 'rxjs';

import {
  DomSanitizer,
  SafeResourceUrl
} from '@angular/platform-browser';

import {
  DataEscala,
  DatasService
} from '../../../../core/services/datas.service';

import {
  Louvor,
  LouvoresService
} from '../../../../core/services/louvores.service';

import {
  LouvoresEscala,
  LouvoresEscalaService
} from '../../../../core/services/louvores-escala.service';

import {
  Escala,
  EscalasService
} from '../../../../core/services/escalas.service';

import {
  AuthService
} from '../../../../core/services/auth.service';

import {
  PortalSnackbarService
} from '../../../../core/services/portal-snackbar.service';

import {
  PortalButtonComponent
} from '../../../../shared/components/ui/portal-button/portal-button.component';

import {
  PortalSelectComponent,
  PortalSelectOption
} from '../../../../shared/components/ui/portal-select/portal-select.component';

import {
  PortalLoadingComponent
} from '../../../../shared/components/ui/portal-loading/portal-loading.component';

import {
  PortalInputComponent
} from '../../../../shared/components/ui/portal-input/portal-input.component';


interface DataLouvorOption
  extends PortalSelectOption {

  id: string;

  nome: string;

  dataEscala: DataEscala;
}


interface LouvorSelecionado {
  louvor: Louvor;

  tom: string;
}


interface FuncaoEscalaPreview {
  nome: string;

  integrantes: string[];
}


@Component({
  selector: 'app-escalar-louvores',

  standalone: true,

  imports: [
    FormsModule,
    PortalButtonComponent,
    PortalSelectComponent,
    PortalLoadingComponent,
    PortalInputComponent
  ],

  templateUrl:
    './escalar-louvores.component.html',

  styleUrl:
    './escalar-louvores.component.scss'
})
export class EscalarLouvoresComponent
  implements OnInit {

  private readonly router =
    inject(Router);

  private readonly datasService =
    inject(DatasService);

  private readonly louvoresService =
    inject(LouvoresService);

  private readonly louvoresEscalaService =
    inject(LouvoresEscalaService);

  private readonly escalasService =
    inject(EscalasService);

  private readonly snackbar =
    inject(PortalSnackbarService);

  private readonly authService =
    inject(AuthService);

  private readonly sanitizer =
    inject(DomSanitizer);


  carregando = false;

  carregandoData = false;

  salvando = false;


  modoEdicaoLouvores = false;


  datasEscaladas:
    DataEscala[] = [];

  datasOpcoes:
    DataLouvorOption[] = [];

  datasMinistro:
    DataLouvorOption[] = [];

  dataSelecionada:
    DataLouvorOption | null = null;


  louvores:
    Louvor[] = [];

  louvoresAgitados:
    Louvor[] = [];

  louvoresCalmos:
    Louvor[] = [];


  pesquisaAgitados = '';

  pesquisaCalmos = '';


  louvoresEscalaExistentes:
    LouvoresEscala | null = null;

  louvoresSelecionados:
    LouvorSelecionado[] = [];

  escalaSelecionada:
    Escala | null = null;


  videosEmbed:
    Record<string, SafeResourceUrl> = {};


  ngOnInit(): void {
    this.carregarDadosIniciais();
  }


  get louvoresAgitadosFiltrados():
    Louvor[] {

    return this.filtrarLouvores(
      this.louvoresAgitados,
      this.pesquisaAgitados
    );
  }


  get louvoresCalmosFiltrados():
    Louvor[] {

    return this.filtrarLouvores(
      this.louvoresCalmos,
      this.pesquisaCalmos
    );
  }


  get totalSelecionados(): number {
    return this.louvoresSelecionados.length;
  }


  get ehLiderancaLouvor(): boolean {

    const usuario =
      this.authService.obterUsuario();

    return (
      usuario?.perfil ===
      'lideranca_louvor'
    );
  }


  get ehIntegranteLouvor(): boolean {

    const usuario =
      this.authService.obterUsuario();

    return (
      usuario?.perfil ===
      'integrante_louvor'
    );
  }


  get temDatasComoMinistro(): boolean {

    return (
      this.ehIntegranteLouvor
      &&
      this.datasMinistro.length > 0
    );
  }


  get podeEditarLouvores(): boolean {

    const usuario =
      this.authService.obterUsuario();


    if (!usuario) {
      return false;
    }


    if (
      usuario.perfil ===
      'lideranca_louvor'
    ) {
      return true;
    }


    if (
      usuario.perfil !==
        'integrante_louvor'
      ||
      !usuario.id
      ||
      !this.escalaSelecionada
    ) {
      return false;
    }


    const ministracao =
      this.escalaSelecionada
        .funcoes['Ministração']
      ??
      [];


    return ministracao.some(
      integrante =>
        integrante.id === usuario.id
    );
  }


  private filtrarLouvores(
    louvores: Louvor[],
    pesquisa: string
  ): Louvor[] {

    const termo =
      pesquisa
        .trim()
        .toLocaleLowerCase('pt-BR')
        .normalize('NFD')
        .replace(
          /[\u0300-\u036f]/g,
          ''
        );


    if (!termo) {
      return louvores;
    }


    return louvores.filter(
      louvor => {

        const nome =
          louvor.louvor
            .toLocaleLowerCase(
              'pt-BR'
            )
            .normalize('NFD')
            .replace(
              /[\u0300-\u036f]/g,
              ''
            );


        return nome.includes(
          termo
        );
      }
    );
  }


  private carregarDadosIniciais():
    void {

    this.carregando = true;


    forkJoin({

      datas:
        this.datasService.listar(
          'Louvor'
        ),

      louvores:
        this.louvoresService.listar(),

      escalas:
        this.escalasService.listar(
          'Louvor'
        )

    }).subscribe({

      next: response => {

        this.datasEscaladas =
          response.datas.data
            .filter(
              data =>
                data.escala_criada
            );


        this.datasOpcoes =
          this.datasEscaladas.map(
            data => ({

              id:
                data._id,

              nome:
                this.montarNomeData(
                  data
                ),

              dataEscala:
                data

            })
          );


        this.prepararDatasMinistro(
          response.escalas.data
        );


        this.louvores =
          response.louvores.data;


        this.prepararVideos();


        this.louvoresAgitados =
          this.louvores
            .filter(
              louvor =>
                louvor.categoria ===
                'Agitado'
            )
            .sort(
              (a, b) =>
                a.louvor.localeCompare(
                  b.louvor,
                  'pt-BR'
                )
            );


        this.louvoresCalmos =
          this.louvores
            .filter(
              louvor =>
                louvor.categoria ===
                'Calmo'
            )
            .sort(
              (a, b) =>
                a.louvor.localeCompare(
                  b.louvor,
                  'pt-BR'
                )
            );


        this.carregando = false;
      },


      error: erro => {

        this.carregando = false;


        const mensagem =
          erro?.error?.message
          ??
          'Não foi possível carregar os dados dos louvores.';


        this.snackbar.error(
          mensagem
        );
      }

    });
  }


  private prepararDatasMinistro(
    escalas: Escala[]
  ): void {

    const usuario =
      this.authService.obterUsuario();


    if (
      usuario?.perfil !==
        'integrante_louvor'
      ||
      !usuario.id
    ) {

      this.datasMinistro = [];

      return;
    }


    this.datasMinistro =
      this.datasOpcoes.filter(
        opcao => {

          const escala =
            escalas.find(
              item =>
                item.data ===
                opcao.dataEscala.data
            );


          if (!escala) {
            return false;
          }


          const ministracao =
            escala.funcoes[
              'Ministração'
            ]
            ??
            [];


          return ministracao.some(
            integrante =>
              integrante.id ===
              usuario.id
          );
        }
      );
  }


  selecionarDataMinistro(
    data:
      DataLouvorOption
  ): void {

    this.dataSelecionada =
      data;

    this.selecionarData();
  }


  selecionarData(): void {

    this.louvoresEscalaExistentes =
      null;

    this.escalaSelecionada =
      null;

    this.louvoresSelecionados =
      [];

    this.modoEdicaoLouvores =
      false;

    this.pesquisaAgitados =
      '';

    this.pesquisaCalmos =
      '';


    if (!this.dataSelecionada) {
      return;
    }


    this.carregandoData = true;


    forkJoin({

      louvores:
        this.louvoresEscalaService
          .buscarPorData(
            this.dataSelecionada.id,
            'Louvor'
          ),

      escala:
        this.escalasService
          .buscarPorData(
            this.dataSelecionada.id,
            'Louvor'
          )

    }).subscribe({

      next: response => {

        this.louvoresEscalaExistentes =
          response.louvores.data;

        this.escalaSelecionada =
          response.escala.data;


        if (
          this.louvoresEscalaExistentes
        ) {

          this.louvoresSelecionados =
            this.louvoresEscalaExistentes
              .louvores
              .map(
                item => {

                  const louvor =
                    this.louvores.find(
                      cadastrado =>
                        cadastrado._id ===
                        item.louvor_id
                    );


                  if (!louvor) {
                    return null;
                  }


                  return {
                    louvor,

                    tom:
                      item.tom
                      ||
                      louvor.tom
                      ||
                      ''
                  };
                }
              )
              .filter(
                (
                  item
                ): item is LouvorSelecionado =>
                  item !== null
              );
        }


        /*
         * Se já existem louvores:
         * abre somente em visualização.
         *
         * Se ainda não existem:
         * liderança ou ministro já
         * podem começar a selecionar.
         */
        this.modoEdicaoLouvores =
          !this.louvoresEscalaExistentes
          &&
          this.podeEditarLouvores;


        this.carregandoData =
          false;
      },


      error: erro => {

        this.carregandoData =
          false;


        const mensagem =
          erro?.error?.message
          ??
          'Não foi possível carregar os dados desta escala.';


        this.snackbar.error(
          mensagem
        );
      }

    });
  }


  editarLouvores(): void {

    if (
      !this.podeEditarLouvores
      ||
      !this.dataSelecionada
    ) {
      return;
    }


    this.modoEdicaoLouvores =
      true;
  }


  estaSelecionado(
    louvorId: string
  ): boolean {

    return this.louvoresSelecionados.some(
      item =>
        item.louvor._id ===
        louvorId
    );
  }


  alternarLouvor(
    louvor: Louvor
  ): void {

    if (
      !this.podeEditarLouvores
      ||
      !this.modoEdicaoLouvores
    ) {
      return;
    }


    const indice =
      this.louvoresSelecionados
        .findIndex(
          item =>
            item.louvor._id ===
            louvor._id
        );


    if (indice >= 0) {

      this.louvoresSelecionados.splice(
        indice,
        1
      );

      return;
    }


    this.louvoresSelecionados.push({
      louvor,

      tom:
        louvor.tom
        ||
        ''
    });
  }


  alterarTom(
    louvorId: string,
    novoTom: string
  ): void {

    if (
      !this.podeEditarLouvores
      ||
      !this.modoEdicaoLouvores
    ) {
      return;
    }


    const item =
      this.louvoresSelecionados.find(
        selecionado =>
          selecionado.louvor._id ===
          louvorId
      );


    if (!item) {
      return;
    }


    item.tom =
      novoTom.trim();
  }


  obterTomSelecionado(
    louvorId: string
  ): string {

    const item =
      this.louvoresSelecionados.find(
        selecionado =>
          selecionado.louvor._id ===
          louvorId
      );


    return item?.tom ?? '';
  }


  salvarLouvores(): void {

    if (
      !this.dataSelecionada
      ||
      !this.podeEditarLouvores
      ||
      !this.modoEdicaoLouvores
      ||
      this.salvando
    ) {
      return;
    }


    this.salvando = true;


    this.louvoresEscalaService
      .salvar({

        ministerio:
          'Louvor',

        data_id:
          this.dataSelecionada.id,

        louvores:
          this.louvoresSelecionados.map(
            item => ({

              louvor_id:
                item.louvor._id,

              tom:
                item.tom.trim()

            })
          )

      })
      .subscribe({

        next: response => {

          this.louvoresEscalaExistentes =
            response.data;

          this.salvando =
            false;

          /*
           * Depois de salvar,
           * fecha automaticamente
           * as opções de edição.
           */
          this.modoEdicaoLouvores =
            false;


          this.snackbar.success(
            response.message
            ??
            'Louvores salvos com sucesso.'
          );
        },


        error: erro => {

          this.salvando =
            false;


          const mensagem =
            erro?.error?.message
            ??
            'Não foi possível salvar os louvores.';


          this.snackbar.error(
            mensagem
          );
        }

      });
  }


  private montarNomeData(
    item: DataEscala
  ): string {

    const data =
      this.formatarData(
        item.data
      );


    const descricao =
      item.tipo === 'Outros'
        ? item.nome_evento
          ??
          'Evento'
        : item.tipo;


    return (
      `${data} - ${descricao}`
    );
  }


  formatarData(
    data: string
  ): string {

    const [
      ano,
      mes,
      dia
    ] =
      data.split('-');


    return (
      `${dia}/${mes}/${ano}`
    );
  }


  get funcoesEscalaPreview():
    FuncaoEscalaPreview[] {

    if (
      !this.escalaSelecionada
    ) {
      return [];
    }


    return Object.entries(
      this.escalaSelecionada.funcoes
    )
      .filter(
        ([, integrantes]) =>
          integrantes.length > 0
      )
      .map(
        ([nome, integrantes]) => ({
          nome,

          integrantes:
            integrantes.map(
              integrante =>
                integrante.nome
            )
        })
      );
  }


  private prepararVideos(): void {

    this.videosEmbed = {};


    for (
      const louvor
      of this.louvores
    ) {

      if (!louvor.link) {
        continue;
      }


      const videoId =
        this.extrairYoutubeId(
          louvor.link
        );


      if (!videoId) {
        continue;
      }


      const url =
        `https://www.youtube.com/embed/${videoId}`;


      this.videosEmbed[
        louvor._id
      ] =
        this.sanitizer
          .bypassSecurityTrustResourceUrl(
            url
          );
    }
  }


  private extrairYoutubeId(
    link: string
  ): string | null {

    try {

      const url =
        new URL(link);


      if (
        url.hostname.includes(
          'youtu.be'
        )
      ) {

        return (
          url.pathname
            .replace('/', '')
            .split('/')[0]
          ||
          null
        );
      }


      if (
        url.hostname.includes(
          'youtube.com'
        )
      ) {

        if (
          url.pathname ===
          '/watch'
        ) {

          return url.searchParams.get(
            'v'
          );
        }


        if (
          url.pathname.startsWith(
            '/shorts/'
          )
        ) {

          return (
            url.pathname
              .split('/')[2]
            ||
            null
          );
        }


        if (
          url.pathname.startsWith(
            '/embed/'
          )
        ) {

          return (
            url.pathname
              .split('/')[2]
            ||
            null
          );
        }
      }


      return null;

    } catch {

      return null;
    }
  }


  obterVideoEmbed(
    louvorId: string
  ): SafeResourceUrl | null {

    return (
      this.videosEmbed[
        louvorId
      ]
      ??
      null
    );
  }


  voltar(): void {

    if (
      this.ehLiderancaLouvor
    ) {

      void this.router.navigate([
        '/louvor/lideranca/louvores'
      ]);

      return;
    }


    void this.router.navigate([
      '/louvor/integrante'
    ]);
  }

}