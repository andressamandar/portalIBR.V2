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
  Tarefa,
  TarefasService
} from '../../../../core/services/tarefas.service';

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
  selector: 'app-tarefas',
  standalone: true,
  imports: [
    PortalButtonComponent,
    PortalLoadingComponent,
    PortalEmptyStateComponent
  ],
  templateUrl: './tarefas.component.html',
  styleUrl: './tarefas.component.scss'
})
export class TarefasComponent
  implements OnInit {

  private readonly tarefasService =
    inject(TarefasService);

  private readonly snackbar =
    inject(PortalSnackbarService);

  private readonly router =
    inject(Router);

  private readonly dialog =
    inject(MatDialog);


  tarefas: Tarefa[] = [];

  carregando = false;


  ngOnInit(): void {
    this.carregarTarefas();
  }


  carregarTarefas(): void {

    this.carregando = true;


    this.tarefasService
      .listar()
      .subscribe({

        next: response => {

          this.tarefas =
            response.data;

          this.carregando =
            false;

        },


        error: erro => {

          this.tarefas = [];

          this.carregando =
            false;


          const mensagem =
            erro?.error?.message ??
            'Não foi possível carregar as tarefas.';


          this.snackbar.error(
            mensagem
          );

        }

      });

  }


  get tarefasAFazer(): Tarefa[] {

    return this.tarefas.filter(
      tarefa =>
        tarefa.status === 'A Fazer'
    );

  }


  get tarefasFazendo(): Tarefa[] {

    return this.tarefas.filter(
      tarefa =>
        tarefa.status === 'Fazendo'
    );

  }


  get tarefasConcluidas(): Tarefa[] {

    return this.tarefas.filter(
      tarefa =>
        tarefa.status === 'Concluído'
    );

  }


  voltar(): void {

    void this.router.navigate([
      '/midia/lideranca'
    ]);

  }


  cadastrarTarefa(): void {

    void this.router.navigate([
      '/midia/lideranca/tarefas/nova'
    ]);

  }


  editarTarefa(
    id: string
  ): void {

    void this.router.navigate([
      '/midia/lideranca/tarefas',
      id,
      'editar'
    ]);

  }


  excluirTarefa(
    tarefa: Tarefa
  ): void {

    const dialogRef =
      this.dialog.open(
        PortalDialogComponent,
        {
          data: {
            title:
              'Excluir tarefa',

            message:
              'Deseja realmente excluir esta tarefa? ' +
              'Esta ação não poderá ser desfeita.',

            type:
              'danger',

            confirmText:
              'Excluir',

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


          this.tarefasService
            .excluir(
              tarefa._id
            )
            .subscribe({

              next: response => {

                this.snackbar.success(
                  response.message ??
                  'Tarefa excluída com sucesso.'
                );


                this.carregarTarefas();

              },


              error: erro => {

                const mensagem =
                  erro?.error?.message ??
                  'Não foi possível excluir a tarefa.';


                this.snackbar.error(
                  mensagem
                );

              }

            });

        }
      );

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

}