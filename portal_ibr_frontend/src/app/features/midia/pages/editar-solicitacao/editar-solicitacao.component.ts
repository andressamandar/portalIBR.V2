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
  EditarSolicitacaoRequest,
  Solicitacao,
  SolicitacoesService
} from '../../../../core/services/solicitacoes.service';

import {
  PortalSnackbarService
} from '../../../../core/services/portal-snackbar.service';

import {
  PortalSelectComponent,
  PortalSelectOption
} from '../../../../shared/components/ui/portal-select/portal-select.component';

import {
  PortalInputComponent
} from '../../../../shared/components/ui/portal-input/portal-input.component';

import {
  PortalButtonComponent
} from '../../../../shared/components/ui/portal-button/portal-button.component';

import {
  PortalLoadingComponent
} from '../../../../shared/components/ui/portal-loading/portal-loading.component';


@Component({
  selector: 'app-editar-solicitacao',
  standalone: true,
  imports: [
    FormsModule,
    PortalInputComponent,
    PortalButtonComponent,
    PortalSelectComponent,
    PortalLoadingComponent
  ],
  templateUrl: './editar-solicitacao.component.html',
  styleUrl: './editar-solicitacao.component.scss'
})
export class EditarSolicitacaoComponent
  implements OnInit {

  private readonly solicitacoesService =
    inject(SolicitacoesService);

  private readonly snackbar =
    inject(PortalSnackbarService);

  private readonly router =
    inject(Router);

  private readonly route =
    inject(ActivatedRoute);


  readonly celular =
    this.route.snapshot.paramMap.get(
      'celular'
    ) ?? '';

  readonly solicitacaoId =
    this.route.snapshot.paramMap.get(
      'id'
    ) ?? '';


  solicitacao:
    Solicitacao | null = null;


  ministerio = '';

  solicitante = '';

  formatosSelecionados:
    PortalSelectOption[] = [];

  descricao = '';

  sugestaoArte = '';

  dataEvento = '';

  horarioEvento = '';

  dataEntrega = '';


  carregando = false;

  salvando = false;


  readonly formatos:
    PortalSelectOption[] = [

    {
      id: 'instagram-story',
      nome: 'Instagram Story'
    },

    {
      id: 'instagram-post',
      nome: 'Instagram Post'
    },

    {
      id: 'projecao',
      nome: 'Projeção'
    },

    {
      id: 'todos-tamanhos',
      nome: 'Todos os tamanhos'
    }

  ];


  ngOnInit(): void {

    this.carregarSolicitacao();

  }


  get formularioValido(): boolean {

    return (
      this.ministerio.trim().length > 0 &&
      this.solicitante.trim().length > 0 &&
      this.obterFormatosSolicitados().length > 0 &&
      this.descricao.trim().length > 0 &&
      this.dataEvento.length > 0 &&
      this.horarioEvento.length > 0 &&
      this.dataEntrega.length > 0
    );

  }


  private carregarSolicitacao(): void {

    if (
      !this.celular ||
      !this.solicitacaoId
    ) {

      this.snackbar.error(
        'Solicitação inválida.'
      );

      this.voltar();

      return;
    }


    this.carregando =
      true;


    this.solicitacoesService
      .acompanhar(
        this.celular
      )
      .subscribe({

        next: response => {

          const solicitacao =
            response.data.find(
              item =>
                item._id ===
                this.solicitacaoId
            );


          if (!solicitacao) {

            this.carregando =
              false;


            this.snackbar.error(
              'Solicitação não encontrada.'
            );


            this.voltar();

            return;
          }


          if (
            solicitacao.status_tarefa ===
            'Fazendo' ||
            solicitacao.status_tarefa ===
            'Concluído'
          ) {

            this.carregando =
              false;


            this.snackbar.error(
              'Esta solicitação não pode mais ser editada, pois já foi assumida pela equipe.'
            );


            this.voltar();

            return;
          }


          this.solicitacao =
            solicitacao;


          this.ministerio =
            solicitacao.ministerio;

          this.solicitante =
            solicitacao.solicitante;

          this.formatosSelecionados =
            this.formatos.filter(
              formato =>
                solicitacao
                  .formatos_solicitados
                  .includes(
                    String(
                      formato['nome']
                    )
                  )
            );

          this.descricao =
            solicitacao.descricao;

          this.sugestaoArte =
            solicitacao.sugestao_arte;

          this.dataEvento =
            solicitacao.data_evento;

          this.horarioEvento =
            solicitacao.horario_evento;

          this.dataEntrega =
            solicitacao.data_entrega;


          this.carregando =
            false;

        },


        error: erro => {

          this.carregando =
            false;


          const mensagem =
            erro?.error?.message ??
            'Não foi possível carregar a solicitação.';


          this.snackbar.error(
            mensagem
          );


          this.voltar();

        }

      });

  }


  salvar(): void {

    if (
      !this.formularioValido ||
      this.salvando ||
      !this.solicitacao
    ) {
      return;
    }


    const dados:
      EditarSolicitacaoRequest = {

      ministerio:
        this.ministerio.trim(),

      solicitante:
        this.solicitante.trim(),

      formatos_solicitados:
        this.obterFormatosSolicitados(),

      descricao:
        this.descricao.trim(),

      sugestao_arte:
        this.sugestaoArte.trim(),

      data_evento:
        this.dataEvento,

      horario_evento:
        this.horarioEvento,

      data_entrega:
        this.dataEntrega

    };


    this.salvando =
      true;


    this.solicitacoesService
      .editarPublica(
        this.celular,
        this.solicitacaoId,
        dados
      )
      .subscribe({

        next: response => {

          this.salvando =
            false;


          this.snackbar.success(
            response.message ??
            'Solicitação atualizada com sucesso.'
          );


          this.voltar();

        },


        error: erro => {

          this.salvando =
            false;


          const mensagem =
            erro?.error?.message ??
            'Não foi possível atualizar a solicitação.';


          this.snackbar.error(
            mensagem
          );

        }

      });

  }


  private obterFormatosSolicitados(): string[] {

    return this.formatosSelecionados.map(
      formato =>
        String(
          formato['nome']
        )
    );

  }


  voltar(): void {

    void this.router.navigate([
      '/midia',
      'solicitacoes',
      'acompanhar'
    ]);

  }

}