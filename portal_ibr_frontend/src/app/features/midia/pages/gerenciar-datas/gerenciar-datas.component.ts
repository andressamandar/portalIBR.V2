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
  DataEscala,
  DatasService
} from '../../../../core/services/datas.service';

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
  selector: 'app-gerenciar-datas',
  standalone: true,
  imports: [
    PortalButtonComponent,
    PortalLoadingComponent,
    PortalEmptyStateComponent
  ],
  templateUrl: './gerenciar-datas.component.html',
  styleUrl: './gerenciar-datas.component.scss'
})
export class GerenciarDatasComponent
  implements OnInit {

  private readonly datasService =
    inject(DatasService);

  private readonly snackbar =
    inject(PortalSnackbarService);

  private readonly router =
    inject(Router);

  private readonly dialog =
    inject(MatDialog);


  datas: DataEscala[] = [];

  carregando = false;


  ngOnInit(): void {
    this.carregarDatas();
  }


  carregarDatas(): void {

    this.carregando = true;


    this.datasService
      .listar('Midia')
      .subscribe({

        next: response => {

          this.datas =
            response.data;

          this.carregando =
            false;
        },


        error: erro => {

          this.datas = [];

          this.carregando =
            false;


          const mensagem =
            erro?.error?.message ??
            'Não foi possível carregar as datas.';


          this.snackbar.error(
            mensagem
          );
        }

      });

  }


  voltar(): void {

    void this.router.navigate([
      '/midia/lideranca/escala'
    ]);

  }


  formatarData(
    data: string
  ): string {

    const partes =
      data.split('-');


    if (partes.length !== 3) {
      return data;
    }


    const [
      ano,
      mes,
      dia
    ] = partes;


    return `${dia}/${mes}/${ano}`;

  }


  novaData(): void {

    void this.router.navigate([
      '/midia/lideranca/escala/datas/nova'
    ]);

  }


  editarData(
    id: string
  ): void {

    void this.router.navigate([
      '/midia/lideranca/escala/datas',
      id,
      'editar'
    ]);

  }


  removerData(
    item: DataEscala
  ): void {

    const nomeData =
      item.tipo === 'Outros'
        ? item.nome_evento ?? 'Evento'
        : item.tipo;


    const dialogRef =
      this.dialog.open(
        PortalDialogComponent,
        {
          data: {
            title: 'Remover data',

            message:
              `Deseja realmente remover ${nomeData} de ${this.formatarData(item.data)}?`,

            type: 'danger',

            confirmText: 'Remover',

            cancelText: 'Cancelar'
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


          this.datasService
            .desativar(item._id)
            .subscribe({

              next: response => {

                this.snackbar.success(
                  response.message ??
                  'Data removida com sucesso.'
                );


                this.carregarDatas();
              },


              error: erro => {

                const mensagem =
                  erro?.error?.message ??
                  'Não foi possível remover a data.';


                this.snackbar.error(
                  mensagem
                );
              }

            });

        }
      );

  }

}