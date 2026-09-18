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
  DataEscala,
  DatasService
} from '../../../../core/services/datas.service';

import {
  Escala,
  EscalasService,
  SalvarEscalaRequest
} from '../../../../core/services/escalas.service';

import {
  DisponibilidadesService,
  IntegranteDisponivel
} from '../../../../core/services/disponibilidades.service';

import {
  Integrante,
  IntegrantesService
} from '../../../../core/services/integrantes.service';

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


interface DataEscalaOption
  extends PortalSelectOption {

  id: string;
  nome: string;
  dataEscala: DataEscala;
}


interface IntegranteFuncaoOption
  extends PortalSelectOption {

  id: string;
  nome: string;
}


@Component({
  selector: 'app-criar-escala',
  standalone: true,
  imports: [
    FormsModule,
    PortalButtonComponent,
    PortalSelectComponent,
    PortalLoadingComponent
  ],
  templateUrl: './criar-escala.component.html',
  styleUrl: './criar-escala.component.scss'
})
export class CriarEscalaComponent
  implements OnInit {

  private readonly router =
    inject(Router);

  private readonly datasService =
    inject(DatasService);

  private readonly escalasService =
    inject(EscalasService);

  private readonly disponibilidadesService =
    inject(DisponibilidadesService);

  private readonly integrantesService =
    inject(IntegrantesService);

  private readonly snackbar =
    inject(PortalSnackbarService);


  carregando = false;

  carregandoData = false;

  salvandoEscala = false;

  camposEscalaAbertos = false;


  datas: DataEscala[] = [];


  datasOpcoes:
    DataEscalaOption[] = [];


  dataSelecionada:
    DataEscalaOption | null = null;


  integrantes:
    Integrante[] = [];


  integrantesDisponiveis:
    IntegranteDisponivel[] = [];


  integrantesDisponiveisCompletos:
    Integrante[] = [];


  escalaExistente:
    Escala | null = null;


  escalaOutroMinisterio:
    Escala | null = null;


  readonly funcoesEscala: string[] = [
    'Foto',
    'Vídeo',
    'Story'
  ];


  selecoesPorFuncao: {
    [nomeFuncao: string]:
      IntegranteFuncaoOption[];
  } = {};


  ngOnInit(): void {

    this.carregarDadosIniciais();

  }


  private carregarDadosIniciais(): void {

    this.carregando =
      true;


    forkJoin({

      datas:
        this.datasService.listar(
          'Midia'
        ),

      integrantes:
        this.integrantesService.listar(
          'Midia'
        )

    }).subscribe({

      next: response => {

        this.datas =
          response.datas.data;


        this.integrantes =
          response.integrantes.data;


        this.datasOpcoes =
          this.datas.map(
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


        this.carregando =
          false;

      },


      error: erro => {

        this.carregando =
          false;


        const mensagem =
          erro?.error?.message ??
          'Não foi possível carregar os dados da escala.';


        this.snackbar.error(
          mensagem
        );

      }

    });

  }


  selecionarData(): void {

    if (
      !this.dataSelecionada
    ) {

      this.limparSelecaoData();

      return;

    }


    const data =
      this.dataSelecionada.dataEscala;


    this.carregandoData =
      true;


    this.escalaExistente =
      null;


    this.escalaOutroMinisterio =
      null;


    this.integrantesDisponiveis =
      [];


    this.integrantesDisponiveisCompletos =
      [];


    this.camposEscalaAbertos =
      false;


    forkJoin({

      escala:
        this.escalasService
          .buscarPorData(
            data._id,
            'Midia'
          ),

      disponiveis:
        this.disponibilidadesService
          .listarDisponiveisPorData(
            data._id,
            'Midia'
          ),

      escalasOutroMinisterio:
        this.escalasService.listar(
          'Louvor'
        )

    }).subscribe({

      next: response => {

        this.escalaExistente =
          response.escala.data;


        this.escalaOutroMinisterio =
          response.escalasOutroMinisterio.data.find(
            escala =>
              escala.data ===
              data.data
          ) ?? null;


        this.integrantesDisponiveis =
          response.disponiveis.data;


        const idsDisponiveis =
          new Set(
            this.integrantesDisponiveis.map(
              integrante =>
                integrante.integrante_id
            )
          );


        this.integrantesDisponiveisCompletos =
          this.integrantes.filter(
            integrante =>
              idsDisponiveis.has(
                integrante._id
              )
          );


        this.prepararSelecoes();


        /*
         * Se ainda não existe escala,
         * os campos ficam abertos.
         *
         * Se já existe escala,
         * os campos ficam fechados.
         */
        this.camposEscalaAbertos =
          !this.escalaExistente;


        this.carregandoData =
          false;

      },


      error: erro => {

        this.carregandoData =
          false;


        const mensagem =
          erro?.error?.message ??
          'Não foi possível carregar os dados da data selecionada.';


        this.snackbar.error(
          mensagem
        );

      }

    });

  }


  private prepararSelecoes(): void {

    this.selecoesPorFuncao =
      {};


    for (
      const funcao
      of this.funcoesEscala
    ) {

      const integrantesEscalados =
        this.escalaExistente
          ?.funcoes?.[funcao] ?? [];


      this.selecoesPorFuncao[
        funcao
      ] =
        integrantesEscalados.map(
          integrante => ({

            id:
              integrante.id,

            nome:
              integrante.nome

          })
        );

    }

  }


  obterOpcoesPorFuncao(
    funcao: string
  ): IntegranteFuncaoOption[] {

    const disponiveis =
      this.integrantesDisponiveisCompletos

        .filter(
          integrante =>
            integrante.funcoes.includes(
              funcao
            )
        )

        .map(
          integrante => ({

            id:
              integrante._id,

            nome:
              integrante.nome

          })
        );


    const selecionados =
      this.selecoesPorFuncao[
        funcao
      ] ?? [];


    const opcoes = [
      ...disponiveis
    ];


    for (
      const selecionado
      of selecionados
    ) {

      const jaExiste =
        opcoes.some(
          opcao =>
            opcao.id ===
            selecionado.id
        );


      if (
        !jaExiste
      ) {

        opcoes.push(
          selecionado
        );

      }

    }


    return opcoes.sort(
      (a, b) =>
        a.nome.localeCompare(
          b.nome,
          'pt-BR'
        )
    );

  }


  private limparSelecaoData(): void {

    this.escalaExistente =
      null;


    this.escalaOutroMinisterio =
      null;


    this.integrantesDisponiveis =
      [];


    this.integrantesDisponiveisCompletos =
      [];


    this.selecoesPorFuncao =
      {};


    this.camposEscalaAbertos =
      false;

  }


  private montarNomeData(
    item: DataEscala
  ): string {

    const dataFormatada =
      this.formatarData(
        item.data
      );


    const descricao =
      item.tipo === 'Outros'
        ? item.nome_evento ?? 'Evento'
        : item.tipo;


    if (
      item.escala_criada
    ) {

      return (
        `${dataFormatada} - ${descricao} - Escala criada`
      );

    }


    return (
      `${dataFormatada} - ${descricao}`
    );

  }


  private formatarData(
    data: string
  ): string {

    const [
      ano,
      mes,
      dia
    ] =
      data.split('-');


    return `${dia}/${mes}/${ano}`;

  }


  editarEscala(): void {

    if (
      !this.escalaExistente
    ) {
      return;
    }


    this.camposEscalaAbertos =
      true;

  }


  private marcarDataComoEscalaCriada(): void {

    if (
      !this.dataSelecionada
    ) {
      return;
    }


    const dataId =
      this.dataSelecionada
        .dataEscala
        ._id;


    const dataEncontrada =
      this.datas.find(
        data =>
          data._id ===
          dataId
      );


    if (
      dataEncontrada
    ) {

      dataEncontrada.escala_criada =
        true;

    }


    /*
     * Recria as opções para atualizar
     * imediatamente o texto:
     * "- Escala criada".
     */
    this.datasOpcoes =
      this.datas.map(
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


    /*
     * Mantém a mesma data selecionada
     * depois de recriar o select.
     */
    this.dataSelecionada =
      this.datasOpcoes.find(
        opcao =>
          opcao.id ===
          dataId
      ) ?? null;

  }


  private estaEscaladoNoOutroMinisterio(
    integranteId: string
  ): boolean {

    if (
      !this.escalaOutroMinisterio
    ) {
      return false;
    }


    return Object.values(
      this.escalaOutroMinisterio.funcoes
    ).some(
      integrantes =>
        integrantes.some(
          integrante =>
            integrante.id ===
            integranteId
        )
    );

  }


  private removerConflitosComOutroMinisterio(
    funcao?: string
  ): boolean {

    const funcoesParaVerificar =
      funcao
        ? [funcao]
        : this.funcoesEscala;


    let encontrouConflito =
      false;


    for (
      const nomeFuncao
      of funcoesParaVerificar
    ) {

      const selecionados =
        this.selecoesPorFuncao[
          nomeFuncao
        ] ?? [];


      const conflitantes =
        selecionados.filter(
          integrante =>
            this.estaEscaladoNoOutroMinisterio(
              integrante.id
            )
        );


      if (
        conflitantes.length === 0
      ) {
        continue;
      }


      this.selecoesPorFuncao[
        nomeFuncao
      ] =
        selecionados.filter(
          integrante =>
            !this.estaEscaladoNoOutroMinisterio(
              integrante.id
            )
        );


      for (
        const integrante
        of conflitantes
      ) {

        this.snackbar.warning(
          `${integrante.nome} já foi escalado(a) para o Louvor neste dia.`
        );

      }


      encontrouConflito =
        true;

    }


    return encontrouConflito;

  }


  salvarEscala(): void {

    if (
      !this.dataSelecionada ||
      this.salvandoEscala
    ) {
      return;
    }


    if (
      !this.temAlgumaSelecao
    ) {

      this.snackbar.warning(
        'Selecione pelo menos um integrante antes de salvar a escala.'
      );

      return;

    }


    /*
     * Confere novamente antes de salvar
     * se alguém já está escalado no Louvor.
     */
    if (
      this.removerConflitosComOutroMinisterio()
    ) {
      return;
    }


    const data =
      this.dataSelecionada.dataEscala;


    const funcoes: {
      [nomeFuncao: string]:
        string[];
    } = {};


    for (
      const funcao
      of this.funcoesEscala
    ) {

      const selecionados =
        this.selecoesPorFuncao[
          funcao
        ] ?? [];


      funcoes[
        funcao
      ] =
        selecionados.map(
          integrante =>
            integrante.id
        );

    }


    const dados:
      SalvarEscalaRequest = {

      ministerio:
        'Midia',

      data_id:
        data._id,

      data:
        data.data,

      funcoes

    };


    this.salvandoEscala =
      true;


    /*
     * EDIÇÃO
     */
    if (
      this.escalaExistente
    ) {

      this.escalasService
        .editar(
          this.escalaExistente._id,
          dados
        )
        .subscribe({

          next: response => {

            this.salvandoEscala =
              false;


            if (
              response.data
            ) {

              this.escalaExistente =
                response.data;

            }


            /*
             * Mantém o select atualizado.
             */
            this.marcarDataComoEscalaCriada();


            /*
             * Fecha os campos depois
             * de salvar a edição.
             */
            this.camposEscalaAbertos =
              false;


            this.snackbar.success(
              response.message ??
              'Escala atualizada com sucesso.'
            );

          },


          error: erro => {

            this.salvandoEscala =
              false;


            const mensagem =
              erro?.error?.message ??
              'Não foi possível atualizar a escala.';


            this.snackbar.error(
              mensagem
            );

          }

        });


      return;

    }


    /*
     * NOVA ESCALA
     */
    this.escalasService
      .criar(
        dados
      )
      .subscribe({

        next: response => {

          this.salvandoEscala =
            false;


          if (
            response.data
          ) {

            this.escalaExistente =
              response.data;

          }


          /*
           * Atualiza imediatamente:
           * "- Escala criada".
           */
          this.marcarDataComoEscalaCriada();


          /*
           * Fecha Foto, Vídeo e Story.
           */
          this.camposEscalaAbertos =
            false;


          this.snackbar.success(
            response.message ??
            'Escala criada com sucesso.'
          );

        },


        error: erro => {

          this.salvandoEscala =
            false;


          const mensagem =
            erro?.error?.message ??
            'Não foi possível criar a escala.';


          this.snackbar.error(
            mensagem
          );

        }

      });

  }


  verificarDuplicidade(
    funcaoAtual: string
  ): void {

    /*
     * Primeiro verifica conflito
     * com a escala do Louvor.
     */
    const conflitoOutroMinisterio =
      this.removerConflitosComOutroMinisterio(
        funcaoAtual
      );


    if (
      conflitoOutroMinisterio
    ) {
      return;
    }


    /*
     * Depois mantém a regra existente
     * de aviso se a mesma pessoa estiver
     * em mais de uma função da Mídia.
     */
    const selecionados =
      this.selecoesPorFuncao[
        funcaoAtual
      ] ?? [];


    for (
      const integrante
      of selecionados
    ) {

      for (
        const outraFuncao
        of this.funcoesEscala
      ) {

        if (
          outraFuncao ===
          funcaoAtual
        ) {
          continue;
        }


        const selecionadosOutraFuncao =
          this.selecoesPorFuncao[
            outraFuncao
          ] ?? [];


        const repetido =
          selecionadosOutraFuncao.some(
            item =>
              item.id ===
              integrante.id
          );


        if (
          repetido
        ) {

          this.snackbar.warning(
            `${integrante.nome} também está escalado para ${outraFuncao} neste dia.`
          );

          return;

        }

      }

    }

  }


  get temAlgumaSelecao(): boolean {

    return this.funcoesEscala.some(
      funcao =>
        (
          this.selecoesPorFuncao[
            funcao
          ] ?? []
        ).length > 0
    );

  }


  obterSelecionadosPorFuncao(
    funcao: string
  ): IntegranteFuncaoOption[] {

    return (
      this.selecoesPorFuncao[
        funcao
      ] ?? []
    );

  }


  voltar(): void {

    void this.router.navigate([
      '/midia/lideranca/escala'
    ]);

  }

}