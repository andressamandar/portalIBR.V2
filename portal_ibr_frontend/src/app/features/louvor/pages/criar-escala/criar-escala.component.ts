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
  EscalasService
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


interface DataEscalaOption extends PortalSelectOption {
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
export class CriarEscalaComponent implements OnInit {

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

  datas: DataEscala[] = [];

  datasOpcoes: DataEscalaOption[] = [];

  dataSelecionada:
    DataEscalaOption | null = null;

  integrantes: Integrante[] = [];

  integrantesDisponiveis:
    IntegranteDisponivel[] = [];

  integrantesDisponiveisCompletos:
    Integrante[] = [];

  escalaExistente:
    Escala | null = null;

  readonly funcoesEscala: string[] = [
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
    [nomeFuncao: string]: IntegranteFuncaoOption[];
  } = {};


  ngOnInit(): void {
    this.carregarDadosIniciais();
  }


  private carregarDadosIniciais(): void {
    this.carregando = true;

    forkJoin({
      datas:
        this.datasService.listar('Louvor'),

      integrantes:
        this.integrantesService.listar(
          'Louvor'
        )
    }).subscribe({
      next: response => {
        this.datas =
          response.datas.data;

        this.integrantes =
          response.integrantes.data;

        this.datasOpcoes =
          this.datas.map(data => ({
            id: data._id,
            nome: this.montarNomeData(data),
            dataEscala: data
          }));

        this.carregando = false;
      },

      error: erro => {
        this.carregando = false;

        const mensagem =
          erro?.error?.message ??
          'Não foi possível carregar os dados da escala.';

        this.snackbar.error(mensagem);
      }
    });
  }


  selecionarData(): void {
    if (!this.dataSelecionada) {
      this.limparSelecaoData();
      return;
    }

    const data =
      this.dataSelecionada.dataEscala;

    this.carregandoData = true;

    this.escalaExistente = null;

    this.integrantesDisponiveis = [];

    this.integrantesDisponiveisCompletos = [];

    forkJoin({
      escala:
        this.escalasService.buscarPorData(
          data._id,
          'Louvor'
        ),

      disponiveis:
        this.disponibilidadesService
          .listarDisponiveisPorData(
            data._id,
            'Louvor'
          )
    }).subscribe({
      next: response => {
        this.escalaExistente =
          response.escala.data;

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

        this.carregandoData = false;
      },

      error: erro => {
        this.carregandoData = false;

        const mensagem =
          erro?.error?.message ??
          'Não foi possível carregar os dados da data selecionada.';

        this.snackbar.error(mensagem);
      }
    });
  }

  private prepararSelecoes(): void {
    this.selecoesPorFuncao = {};

    for (const funcao of this.funcoesEscala) {

      const integrantesEscalados =
        this.escalaExistente?.funcoes?.[funcao] ?? [];

      this.selecoesPorFuncao[funcao] =
        integrantesEscalados.map(
          integrante => ({
            id: integrante.id,
            nome: integrante.nome
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
            id: integrante._id,
            nome: integrante.nome
          })
        );

  
    const selecionados =
      this.selecoesPorFuncao[funcao] ?? [];

    const opcoes = [
      ...disponiveis
    ];

    for (const selecionado of selecionados) {

      const jaExiste =
        opcoes.some(
          opcao =>
            opcao.id === selecionado.id
        );

      if (!jaExiste) {
        opcoes.push(selecionado);
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
    this.escalaExistente = null;

    this.integrantesDisponiveis = [];

    this.integrantesDisponiveisCompletos = [];

    this.selecoesPorFuncao = {};
  }


  private montarNomeData(
    item: DataEscala
  ): string {

    const dataFormatada =
      this.formatarData(item.data);

    const descricao =
      item.tipo === 'Outros'
        ? item.nome_evento ?? 'Evento'
        : item.tipo;

    if (item.escala_criada) {
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
    ] = data.split('-');

    return `${dia}/${mes}/${ano}`;
  }


  voltar(): void {
    void this.router.navigate([
      '/louvor/lideranca/escala'
    ]);
  }
}