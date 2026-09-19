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
  Solicitacao,
  SolicitacoesService
} from '../../../../core/services/solicitacoes.service';

import {
  PortalSnackbarService
} from '../../../../core/services/portal-snackbar.service';

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
  selector: 'app-acompanhar-solicitacao',
  standalone: true,
  imports: [
    FormsModule,
    PortalInputComponent,
    PortalButtonComponent,
    PortalLoadingComponent
  ],
  templateUrl: './acompanhar-solicitacao.component.html',
  styleUrl: './acompanhar-solicitacao.component.scss'
})
export class AcompanharSolicitacaoComponent {

  private readonly solicitacoesService =
    inject(SolicitacoesService);

  private readonly snackbar =
    inject(PortalSnackbarService);

  private readonly router =
    inject(Router);


  celular = '';

  solicitacoes: Solicitacao[] = [];

  solicitacaoExpandidaId:
    string | null = null;

  consultando = false;


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


  consultar(): void {

    if (
      !this.celularValido ||
      this.consultando
    ) {
      return;
    }


    this.consultando =
      true;

    this.solicitacoes =
      [];

    this.solicitacaoExpandidaId =
      null;


    this.solicitacoesService
      .acompanhar(
        this.celular.trim()
      )
      .subscribe({

        next: response => {

          this.consultando =
            false;

          this.solicitacoes =
            response.data;

        },


        error: erro => {

          this.consultando =
            false;

          this.solicitacoes =
            [];

          this.solicitacaoExpandidaId =
            null;


          const mensagem =
            erro?.error?.message ??
            'Não foi possível localizar solicitações para este celular.';


          this.snackbar.error(
            mensagem
          );

        }

      });

  }


  alternarSolicitacao(
    solicitacao: Solicitacao
  ): void {

    if (
      this.solicitacaoExpandidaId ===
      solicitacao._id
    ) {

      this.solicitacaoExpandidaId =
        null;

      return;
    }


    this.solicitacaoExpandidaId =
      solicitacao._id;

  }


  estaExpandida(
    solicitacao: Solicitacao
  ): boolean {

    return (
      this.solicitacaoExpandidaId ===
      solicitacao._id
    );

  }


  podeEditar(
    solicitacao: Solicitacao
  ): boolean {

    if (
      !solicitacao.status_tarefa
    ) {
      return true;
    }


    return (
      solicitacao.status_tarefa ===
      'A Fazer'
    );

  }


  editarSolicitacao(
    solicitacao: Solicitacao
  ): void {

    if (
      !this.podeEditar(
        solicitacao
      )
    ) {
      return;
    }


    void this.router.navigate([
      '/midia',
      'solicitacoes',
      'acompanhar',
      this.celular.trim(),
      solicitacao._id,
      'editar'
    ]);

  }


  statusAtual(
    solicitacao: Solicitacao
  ): string {

    if (
      solicitacao.status_tarefa
    ) {

      return solicitacao.status_tarefa;

    }


    return solicitacao.status;

  }


  formatarData(
    data: string
  ): string {

    if (!data) {
      return '-';
    }


    const [
      ano,
      mes,
      dia
    ] = data.split('-');


    return `${dia}/${mes}/${ano}`;

  }


  formatarFormatos(
    formatos: string[]
  ): string {

    return formatos.join(', ');

  }


  voltar(): void {

    void this.router.navigate([
      '/midia',
      'solicitacoes'
    ]);

  }

}