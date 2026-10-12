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


interface StatusDisponibilidadeOption
  extends PortalSelectOption {

  id:
    | 'disponivel'
    | 'indisponivel';

  nome: string;

  disponivel: boolean;
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


  /*
   * =====================================
   * ALTERAÇÃO DE DISPONIBILIDADE
   * =====================================
   */

  alterandoDisponibilidade = false;

  carregandoDisponibilidadeIntegrante =
    false;

  salvandoDisponibilidade =
    false;


  /*
   * =====================================
   * DATAS
   * =====================================
   */

  datas:
    DataEscala[] = [];


  datasOpcoes:
    DataEscalaOption[] = [];


  dataSelecionada:
    DataEscalaOption | null = null;


  /*
   * =====================================
   * INTEGRANTES
   * =====================================
   */

  integrantes:
    Integrante[] = [];


  integrantesDisponibilidadeOpcoes:
    IntegranteFuncaoOption[] = [];


  integranteDisponibilidadeSelecionado:
    IntegranteFuncaoOption | null = null;


  statusDisponibilidadeSelecionado:
    StatusDisponibilidadeOption | null = null;


  readonly statusDisponibilidadeOpcoes:
    StatusDisponibilidadeOption[] = [

      {
        id: 'disponivel',
        nome: 'Disponível',
        disponivel: true
      },

      {
        id: 'indisponivel',
        nome: 'Indisponível',
        disponivel: false
      }

    ];


  integrantesDisponiveis:
    IntegranteDisponivel[] = [];


  integrantesDisponiveisCompletos:
    Integrante[] = [];


  /*
   * =====================================
   * ESCALAS
   * =====================================
   */

  escalaExistente:
    Escala | null = null;


  escalaOutroMinisterio:
    Escala | null = null;


  /*
   * Todas as escalas do Louvor.
   *
   * Usado para verificar em quais
   * outras datas do mesmo mês um
   * integrante já está escalado.
   */
  escalasLouvor:
    Escala[] = [];


  readonly funcoesEscala:
    string[] = [

      'Ministração',
      'Sonoplastia',
      'Bateria',
      'Teclado',
      'Violão',
      'Tenor',
      'Barítono',
      'Contralto',
      'Soprano',
      '2ª Voz',
      'Baixo',
      'Guitarra',
      'Projeção',
      'Cajon'

    ];


  selecoesPorFuncao: {
    [nomeFuncao: string]:
      IntegranteFuncaoOption[];
  } = {};


  /*
   * Guarda quem já estava selecionado.
   *
   * Assim o aviso de frequência aparece
   * somente quando alguém é adicionado,
   * e não toda vez que o select muda.
   */
  selecoesAnterioresPorFuncao: {
    [nomeFuncao: string]:
      string[];
  } = {};


  ngOnInit(): void {

    this.carregarDadosIniciais();

  }


  /*
   * =====================================
   * CARREGAMENTO INICIAL
   * =====================================
   */

  private carregarDadosIniciais(): void {

    this.carregando =
      true;


    forkJoin({

      datas:
        this.datasService.listar(
          'Louvor'
        ),

      integrantes:
        this.integrantesService.listar(
          'Louvor'
        ),

      escalasLouvor:
        this.escalasService.listar(
          'Louvor'
        )

    }).subscribe({

      next: response => {

        this.datas =
          response.datas.data;


        this.integrantes =
          response.integrantes.data;


        this.escalasLouvor =
          response.escalasLouvor.data;


        /*
         * Lista usada no bloco
         * "Alterar disponibilidade".
         */
        this.integrantesDisponibilidadeOpcoes =
          this.integrantes

            .map(
              integrante => ({

                id:
                  integrante._id,

                nome:
                  integrante.nome

              })
            )

            .sort(
              (a, b) =>
                a.nome.localeCompare(
                  b.nome,
                  'pt-BR'
                )
            );


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
          (
            'Não foi possível carregar '
            + 'os dados da escala.'
          );


        this.snackbar.error(
          mensagem
        );

      }

    });

  }


  /*
   * =====================================
   * SELEÇÃO DE DATA
   * =====================================
   */

  selecionarData(): void {

    if (
      !this.dataSelecionada
    ) {

      this.limparSelecaoData();

      return;

    }


    /*
     * Se trocar a data enquanto o bloco
     * de alteração estiver aberto,
     * fechamos e limpamos a seleção.
     */
    this.fecharAlteracaoDisponibilidade();


    const data =
      this.dataSelecionada
        .dataEscala;


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
            'Louvor'
          ),

      disponiveis:
        this.disponibilidadesService
          .listarDisponiveisPorData(
            data._id,
            'Louvor'
          ),

      escalasOutroMinisterio:
        this.escalasService.listar(
          'Midia'
        )

    }).subscribe({

      next: response => {

        this.escalaExistente =
          response.escala.data;


        this.escalaOutroMinisterio =
          response
            .escalasOutroMinisterio
            .data
            .find(
              escala =>
                escala.data ===
                data.data
            ) ?? null;


        this.integrantesDisponiveis =
          response.disponiveis.data;


        const idsDisponiveis =
          new Set(
            this.integrantesDisponiveis
              .map(
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
          (
            'Não foi possível carregar '
            + 'os dados da data selecionada.'
          );


        this.snackbar.error(
          mensagem
        );

      }

    });

  }


  /*
   * =====================================
   * PREPARAR ESCALA
   * =====================================
   */

  private prepararSelecoes(): void {

    this.selecoesPorFuncao =
      {};


    this.selecoesAnterioresPorFuncao =
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


      /*
       * Guarda quem já estava na escala.
       *
       * Ao abrir uma escala existente,
       * essas pessoas não devem gerar
       * aviso imediatamente.
       */
      this.selecoesAnterioresPorFuncao[
        funcao
      ] =
        integrantesEscalados.map(
          integrante =>
            integrante.id
        );

    }

  }


  obterOpcoesPorFuncao(
    funcao: string
  ): IntegranteFuncaoOption[] {

    /*
     * Primeiro traz somente quem:
     *
     * 1. está disponível;
     * 2. possui a função.
     */
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


    /*
     * Mantemos integrantes que já
     * estavam escalados mesmo que a
     * disponibilidade tenha mudado.
     *
     * Assim não removemos automaticamente
     * alguém de uma escala existente.
     */
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


    this.selecoesAnterioresPorFuncao =
      {};


    this.camposEscalaAbertos =
      false;


    this.fecharAlteracaoDisponibilidade();

  }


  /*
   * =====================================
   * ALTERAR DISPONIBILIDADE
   * =====================================
   */

  abrirAlteracaoDisponibilidade(): void {

    if (
      !this.dataSelecionada
    ) {
      return;
    }


    this.alterandoDisponibilidade =
      true;

  }


  fecharAlteracaoDisponibilidade(): void {

    this.alterandoDisponibilidade =
      false;


    this.integranteDisponibilidadeSelecionado =
      null;


    this.statusDisponibilidadeSelecionado =
      null;


    this.carregandoDisponibilidadeIntegrante =
      false;

  }


  selecionarIntegranteDisponibilidade(): void {

    this.statusDisponibilidadeSelecionado =
      null;


    if (
      !this.integranteDisponibilidadeSelecionado ||
      !this.dataSelecionada
    ) {
      return;
    }


    const integranteId =
      this.integranteDisponibilidadeSelecionado
        .id;


    const dataId =
      this.dataSelecionada
        .dataEscala
        ._id;


    this.carregandoDisponibilidadeIntegrante =
      true;


    this.disponibilidadesService
      .buscarPorIntegrante(
        integranteId,
        'Louvor'
      )
      .subscribe({

        next: response => {

          this.carregandoDisponibilidadeIntegrante =
            false;


          /*
           * Procura somente a disponibilidade
           * referente à data selecionada.
           */
          const disponibilidadeData =
            response.data
              ?.disponibilidades
              .find(
                item =>
                  item.data_id ===
                  dataId
              );


          /*
           * Se já existe disponibilidade
           * registrada, mostra o status atual.
           */
          if (
            disponibilidadeData
          ) {

            this.statusDisponibilidadeSelecionado =
              this.statusDisponibilidadeOpcoes
                .find(
                  opcao =>
                    opcao.disponivel ===
                    disponibilidadeData
                      .disponivel
                )
              ?? null;

          }

        },


        error: erro => {

          this.carregandoDisponibilidadeIntegrante =
            false;


          const mensagem =
            erro?.error?.message ??
            (
              'Não foi possível carregar '
              + 'a disponibilidade do integrante.'
            );


          this.snackbar.error(
            mensagem
          );

        }

      });

  }


  salvarAlteracaoDisponibilidade(): void {

    if (
      !this.dataSelecionada ||
      !this.integranteDisponibilidadeSelecionado ||
      !this.statusDisponibilidadeSelecionado ||
      this.salvandoDisponibilidade
    ) {
      return;
    }


    const integrante =
      this.integranteDisponibilidadeSelecionado;


    const disponivel =
      this.statusDisponibilidadeSelecionado
        .disponivel;


    this.salvandoDisponibilidade =
      true;


    this.disponibilidadesService
      .alterarPelaLideranca({

        integrante_id:
          integrante.id,

        ministerio:
          'Louvor',

        data_id:
          this.dataSelecionada
            .dataEscala
            ._id,

        disponivel

      })
      .subscribe({

        next: response => {

          this.salvandoDisponibilidade =
            false;


          /*
           * Atualiza a lista local
           * imediatamente.
           */
          this.atualizarDisponibilidadeLocal(
            integrante.id,
            integrante.nome,
            disponivel
          );


          this.snackbar.success(
            response.message ??
            (
              'Disponibilidade alterada '
              + 'com sucesso.'
            )
          );


          this.fecharAlteracaoDisponibilidade();

        },


        error: erro => {

          this.salvandoDisponibilidade =
            false;


          const mensagem =
            erro?.error?.message ??
            (
              'Não foi possível alterar '
              + 'a disponibilidade.'
            );


          this.snackbar.error(
            mensagem
          );

        }

      });

  }


  private atualizarDisponibilidadeLocal(
    integranteId: string,
    integranteNome: string,
    disponivel: boolean
  ): void {

    /*
     * MARCOU COMO DISPONÍVEL
     */
    if (
      disponivel
    ) {

      const jaDisponivel =
        this.integrantesDisponiveis
          .some(
            integrante =>
              integrante.integrante_id ===
              integranteId
          );


      if (
        !jaDisponivel
      ) {

        this.integrantesDisponiveis.push({

          integrante_id:
            integranteId,

          integrante_nome:
            integranteNome

        });

      }

    } else {

      /*
       * MARCOU COMO INDISPONÍVEL
       */
      this.integrantesDisponiveis =
        this.integrantesDisponiveis
          .filter(
            integrante =>
              integrante.integrante_id !==
              integranteId
          );

    }


    /*
     * Recria a lista usada nos
     * selects das funções.
     */
    const idsDisponiveis =
      new Set(
        this.integrantesDisponiveis
          .map(
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

  }


  /*
   * =====================================
   * DATAS
   * =====================================
   */

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


  /*
   * =====================================
   * FREQUÊNCIA NO MESMO MÊS
   * =====================================
   */

  private obterDatasEscaladasNoMesmoMes(
    integranteId: string
  ): string[] {

    if (
      !this.dataSelecionada
    ) {
      return [];
    }


    const dataAtual =
      this.dataSelecionada
        .dataEscala;


    const [
      anoAtual,
      mesAtual
    ] =
      dataAtual.data.split('-');


    const datas =
      this.escalasLouvor

        .filter(
          escala => {

            /*
             * Não considera a própria
             * data que está sendo montada
             * ou editada.
             */
            if (
              escala.data_id ===
              dataAtual._id
            ) {
              return false;
            }


            const [
              anoEscala,
              mesEscala
            ] =
              escala.data.split('-');


            /*
             * Considera somente escalas
             * do mesmo mês e ano.
             */
            if (
              anoEscala !== anoAtual ||
              mesEscala !== mesAtual
            ) {
              return false;
            }


            /*
             * Verifica se o integrante
             * aparece em qualquer função
             * daquela escala.
             */
            return Object.values(
              escala.funcoes
            ).some(
              integrantes =>
                integrantes.some(
                  integrante =>
                    integrante.id ===
                    integranteId
                )
            );

          }
        )

        .map(
          escala =>
            escala.data
        );


    /*
     * Remove datas duplicadas caso
     * a pessoa esteja em duas funções
     * na mesma escala.
     */
    return [
      ...new Set(
        datas
      )
    ].sort();

  }


  private formatarListaDatas(
    datas: string[]
  ): string {

    const formatadas =
      datas.map(
        data =>
          this.formatarData(
            data
          )
      );


    if (
      formatadas.length === 0
    ) {
      return '';
    }


    if (
      formatadas.length === 1
    ) {

      return formatadas[0];

    }


    if (
      formatadas.length === 2
    ) {

      return (
        `${formatadas[0]} e `
        + `${formatadas[1]}`
      );

    }


    const ultimaData =
      formatadas[
        formatadas.length - 1
      ];


    const anteriores =
      formatadas
        .slice(
          0,
          -1
        )
        .join(', ');


    return (
      `${anteriores} e `
      + `${ultimaData}`
    );

  }


  private obterFuncoesRepetidasNoMesmoDia(
    integranteId: string,
    funcaoAtual: string
  ): string[] {

    return this.funcoesEscala
      .filter(
        outraFuncao => {

          if (
            outraFuncao ===
            funcaoAtual
          ) {
            return false;
          }


          const selecionados =
            this.selecoesPorFuncao[
              outraFuncao
            ] ?? [];


          return selecionados.some(
            integrante =>
              integrante.id ===
              integranteId
          );

        }
      );

  }


  /*
   * Mantém a lista de escalas do mês
   * atualizada depois de criar ou editar.
   */
  private atualizarEscalaLouvorLocal(
    escala: Escala
  ): void {

    const indice =
      this.escalasLouvor.findIndex(
        item =>
          item._id ===
          escala._id
      );


    if (
      indice >= 0
    ) {

      this.escalasLouvor[
        indice
      ] =
        escala;

      return;

    }


    this.escalasLouvor.push(
      escala
    );

  }


  /*
   * =====================================
   * EDITAR ESCALA
   * =====================================
   */

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


    this.dataSelecionada =
      this.datasOpcoes.find(
        opcao =>
          opcao.id ===
          dataId
      ) ?? null;

  }


  /*
   * =====================================
   * CONFLITO COM OUTRO MINISTÉRIO
   * =====================================
   */

  private estaEscaladoNoOutroMinisterio(
    integranteId: string
  ): boolean {

    if (
      !this.escalaOutroMinisterio
    ) {
      return false;
    }


    return Object.values(
      this.escalaOutroMinisterio
        .funcoes
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
          (
            `${integrante.nome} já foi `
            + 'escalado(a) para a Mídia neste dia.'
          )
        );

      }


      encontrouConflito =
        true;

    }


    return encontrouConflito;

  }


  /*
   * =====================================
   * SALVAR ESCALA
   * =====================================
   */

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
        (
          'Selecione pelo menos um '
          + 'integrante antes de salvar a escala.'
        )
      );

      return;

    }


    if (
      this.removerConflitosComOutroMinisterio()
    ) {
      return;
    }


    const data =
      this.dataSelecionada
        .dataEscala;


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
        'Louvor',

      data_id:
        data._id,

      data:
        data.data,

      funcoes

    };


    this.salvandoEscala =
      true;


    /*
     * ESCALA EXISTENTE
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


              /*
               * Atualiza a lista usada
               * pela verificação mensal.
               */
              this.atualizarEscalaLouvorLocal(
                response.data
              );

            }


            this.marcarDataComoEscalaCriada();


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
              (
                'Não foi possível atualizar '
                + 'a escala.'
              );


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


            /*
             * Inclui a nova escala
             * na verificação mensal.
             */
            this.atualizarEscalaLouvorLocal(
              response.data
            );

          }


          this.marcarDataComoEscalaCriada();


          /*
           * Fecha os campos após salvar.
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
            (
              'Não foi possível criar '
              + 'a escala.'
            );


          this.snackbar.error(
            mensagem
          );

        }

      });

  }


  /*
   * =====================================
   * DUPLICIDADE E FREQUÊNCIA
   * =====================================
   */

  verificarDuplicidade(
    funcaoAtual: string
  ): void {

    /*
     * Primeiro verifica conflito
     * Louvor x Mídia.
     *
     * Este conflito continua bloqueando
     * a seleção, como já funcionava.
     */
    const conflitoOutroMinisterio =
      this.removerConflitosComOutroMinisterio(
        funcaoAtual
      );


    if (
      conflitoOutroMinisterio
    ) {

      /*
       * Como o integrante conflitante
       * já foi removido da seleção,
       * atualizamos o estado anterior.
       */
      this.selecoesAnterioresPorFuncao[
        funcaoAtual
      ] =
        (
          this.selecoesPorFuncao[
            funcaoAtual
          ] ?? []
        ).map(
          integrante =>
            integrante.id
        );

      return;

    }


    const selecionados =
      this.selecoesPorFuncao[
        funcaoAtual
      ] ?? [];


    const idsAnteriores =
      new Set(
        this.selecoesAnterioresPorFuncao[
          funcaoAtual
        ] ?? []
      );


    /*
     * Descobre quem acabou de ser
     * adicionado nesta função.
     */
    const novosSelecionados =
      selecionados.filter(
        integrante =>
          !idsAnteriores.has(
            integrante.id
          )
      );


    const avisos:
      string[] = [];


    for (
      const integrante
      of novosSelecionados
    ) {

      /*
       * =================================
       * OUTRA FUNÇÃO NO MESMO DIA
       * =================================
       */
      const funcoesRepetidas =
        this.obterFuncoesRepetidasNoMesmoDia(
          integrante.id,
          funcaoAtual
        );


      if (
        funcoesRepetidas.length > 0
      ) {

        const funcoesTexto =
          funcoesRepetidas.join(
            ', '
          );


        avisos.push(
          (
            `${integrante.nome} também está `
            + `escalado(a) para ${funcoesTexto} `
            + 'neste dia.'
          )
        );

      }


      /*
       * =================================
       * OUTRAS DATAS NO MESMO MÊS
       * =================================
       */
      const datasMes =
        this.obterDatasEscaladasNoMesmoMes(
          integrante.id
        );


      if (
        datasMes.length > 0
      ) {

        const datasFormatadas =
          this.formatarListaDatas(
            datasMes
          );


        avisos.push(
          (
            `${integrante.nome} já está `
            + 'escalado(a) em '
            + `${datasFormatadas} `
            + 'neste mês.'
          )
        );

      }

    }


    /*
     * Guarda o estado atual para
     * a próxima alteração do select.
     */
    this.selecoesAnterioresPorFuncao[
      funcaoAtual
    ] =
      selecionados.map(
        integrante =>
          integrante.id
      );


    /*
     * O aviso não bloqueia a escolha.
     *
     * Caso tenha conflito de função
     * e frequência mensal, mostra
     * os dois juntos.
     */
    if (
      avisos.length > 0
    ) {

      this.snackbar.warning(
        avisos.join(
          ' '
        )
      );

    }

  }


  /*
   * =====================================
   * AUXILIARES DA TELA
   * =====================================
   */

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


  /*
   * =====================================
   * VOLTAR
   * =====================================
   */

  voltar(): void {

    void this.router.navigate([
      '/louvor/lideranca/escala'
    ]);

  }

}