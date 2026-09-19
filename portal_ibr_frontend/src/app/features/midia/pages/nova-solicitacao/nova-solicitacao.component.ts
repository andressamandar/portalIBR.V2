import {
  Component,
  inject
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  NovaSolicitacaoRequest,
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


@Component({
  selector: 'app-nova-solicitacao',
  standalone: true,
  imports: [
    FormsModule,
    PortalInputComponent,
    PortalButtonComponent,
    PortalSelectComponent
  ],
  templateUrl: './nova-solicitacao.component.html',
  styleUrl: './nova-solicitacao.component.scss'
})
export class NovaSolicitacaoComponent {

  private readonly solicitacoesService =
    inject(SolicitacoesService);

  private readonly snackbar =
    inject(PortalSnackbarService);

  private readonly router =
    inject(Router);


  ministerio = '';

  solicitante = '';

  celular = '';

  formatosSelecionados:
    PortalSelectOption[] = [];

  descricao = '';

  sugestaoArte = '';

  dataEvento = '';

  horarioEvento = '';

  dataEntrega = '';


  salvando = false;

  protocolo:
    string | null = null;


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


  get celularValido(): boolean {

    const numero =
      this.celular.trim();


    return (
      /^\d+$/.test(numero) &&
      (
        numero.length === 10 ||
        numero.length === 11
      )
    );

  }


  get formularioValido(): boolean {

    return (
      this.ministerio.trim().length > 0 &&
      this.solicitante.trim().length > 0 &&
      this.celularValido &&
      this.obterFormatosSolicitados().length > 0 &&
      this.descricao.trim().length > 0 &&
      this.dataEvento.length > 0 &&
      this.horarioEvento.length > 0 &&
      this.dataEntrega.length > 0
    );

  }


  salvar(): void {

    if (
      !this.formularioValido ||
      this.salvando
    ) {
      return;
    }


    const dados:
      NovaSolicitacaoRequest = {

      ministerio:
        this.ministerio.trim(),

      solicitante:
        this.solicitante.trim(),

      celular:
        this.celular.trim(),

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
      .cadastrar(
        dados
      )
      .subscribe({

        next: response => {

          this.salvando =
            false;


          this.protocolo =
            response.data.protocolo;


          this.snackbar.success(
            response.message ??
            'Solicitação enviada com sucesso.'
          );

        },


        error: erro => {

          this.salvando =
            false;


          const mensagem =
            erro?.error?.message ??
            'Não foi possível enviar a solicitação.';


          this.snackbar.error(
            mensagem
          );

        }

      });

  }


  copiarProtocolo(): void {

    if (!this.protocolo) {
      return;
    }


    navigator.clipboard
      .writeText(
        this.protocolo
      )
      .then(() => {

        this.snackbar.success(
          'Número de celular copiado.'
        );

      })
      .catch(() => {

        this.snackbar.error(
          'Não foi possível copiar o número.'
        );

      });

  }


  acompanharSolicitacao(): void {

    void this.router.navigate([
      '/midia',
      'solicitacoes',
      'acompanhar'
    ]);

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
      'solicitacoes'
    ]);

  }

}