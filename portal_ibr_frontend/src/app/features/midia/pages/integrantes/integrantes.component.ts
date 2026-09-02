import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  MatDialog
} from '@angular/material/dialog';

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
  PortalLoadingComponent
} from '../../../../shared/components/ui/portal-loading/portal-loading.component';

import {
  PortalEmptyStateComponent
} from '../../../../shared/components/ui/portal-empty-state/portal-empty-state.component';

import {
  PortalDialogComponent
} from '../../../../shared/components/ui/portal-dialog/portal-dialog.component';


@Component({
  selector: 'app-integrantes',
  standalone: true,
  imports: [
    PortalButtonComponent,
    PortalLoadingComponent,
    PortalEmptyStateComponent
  ],
  templateUrl: './integrantes.component.html',
  styleUrl: './integrantes.component.scss'
})
export class IntegrantesComponent
  implements OnInit {

  private readonly integrantesService =
    inject(IntegrantesService);

  private readonly snackbar =
    inject(PortalSnackbarService);

  private readonly router =
    inject(Router);

  private readonly dialog =
    inject(MatDialog);


  integrantes: Integrante[] = [];

  carregando = false;


  ngOnInit(): void {
    this.carregarIntegrantes();
  }


  carregarIntegrantes(): void {

    this.carregando = true;


    this.integrantesService
      .listar('Midia')
      .subscribe({

        next: response => {

          this.integrantes =
            response.data;

          this.carregando =
            false;

        },


        error: erro => {

          this.integrantes = [];

          this.carregando =
            false;


          const mensagem =
            erro?.error?.message ??
            'Não foi possível carregar os integrantes.';


          this.snackbar.error(
            mensagem
          );

        }

      });

  }


  voltar(): void {

    void this.router.navigate([
      '/midia/lideranca'
    ]);

  }


  cadastrarIntegrante(): void {

    void this.router.navigate([
      '/midia/lideranca/integrantes/novo'
    ]);

  }


  editarIntegrante(
    id: string
  ): void {

    void this.router.navigate([
      '/midia/lideranca/integrantes',
      id,
      'editar'
    ]);

  }

  


  desativarIntegrante(
    integrante: Integrante
  ): void {

    const dialogRef =
      this.dialog.open(
        PortalDialogComponent,
        {
          data: {
            title:
              'Desativar integrante',

            message:
              `Deseja realmente desativar ${integrante.nome}? ` +
              'Ele deixará de aparecer nas listas de integrantes ativos.',

            type:
              'danger',

            confirmText:
              'Desativar',

            cancelText:
              'Cancelar'
          }
        }
      );


    dialogRef
      .afterClosed()
      .subscribe(
        confirmado => {

          if (confirmado !== true) {
            return;
          }


          this.integrantesService
            .desativar(
              integrante._id
            )
            .subscribe({

              next: response => {

                this.snackbar.success(
                  response.message ??
                  'Integrante desativado com sucesso.'
                );


                this.carregarIntegrantes();

              },


              error: erro => {

                const mensagem =
                  erro?.error?.message ??
                  'Não foi possível desativar o integrante.';


                this.snackbar.error(
                  mensagem
                );

              }

            });

        }
      );

  }


  readonly funcoesMidia: string[] = [
  'Foto',
  'Vídeo',
  'Story'
  ];


  obterFuncoesMidia(
    integrante: Integrante
    ): string[] {

    return integrante.funcoes.filter(
      funcao =>
        this.funcoesMidia.includes(
          funcao
        )
    );

  }

}
