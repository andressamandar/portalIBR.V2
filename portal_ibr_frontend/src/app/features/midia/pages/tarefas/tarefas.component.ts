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
  forkJoin
} from 'rxjs';

import {
  Tarefa,
  TarefasService
} from '../../../../core/services/tarefas.service';

import {
  Solicitacao,
  SolicitacoesService
} from '../../../../core/services/solicitacoes.service';

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

  private readonly solicitacoesService =
    inject(SolicitacoesService);

  private readonly snackbar =
    inject(PortalSnackbarService);

  private readonly router =
    inject(Router);

  private readonly dialog =
    inject(MatDialog);


  tarefas: Tarefa[] = [];

  solicitacoes: Solicitacao[] = [];


  carregando = false;

  solicitacaoConvertendoId:
    string | null = null;

  tarefaConcluindoId:
    string | null = null;


  ngOnInit(): void {

    this.carregarDados();

  }


  carregarDados(): void {

    this.carregando =
      true;


    this.tarefasService
      .listar()
      .subscribe({

        next: response => {

          this.tarefas =
            response.data;


          this.carregarSolicitacoes();

        },


        error: erro => {

          this.tarefas =
            [];

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

  private carregarSolicitacoes(): void {

    this.solicitacoesService
      .listar()
      .subscribe({

        next: response => {

          this.solicitacoes =
            response.data;


          this.carregando =
            false;

        },


        error: erro => {

          this.solicitacoes =
            [];

          this.carregando =
            false;


          const mensagem =
            erro?.error?.message ??
            'Não foi possível carregar as solicitações.';


          this.snackbar.error(
            mensagem
          );

        }

      });

  }


  carregarTarefas(): void {

    this.tarefasService
      .listar()
      .subscribe({

        next: response => {

          this.tarefas =
            response.data;

        },


        error: erro => {

          const mensagem =
            erro?.error?.message ??
            'Não foi possível carregar as tarefas.';


          this.snackbar.error(
            mensagem
          );

        }

      });

  }


  get solicitacoesRecebidas():
    Solicitacao[] {

    return this.solicitacoes.filter(
      solicitacao =>
        solicitacao.status ===
        'Recebida'
    );

  }


  get tarefasAFazer(): Tarefa[] {

    return this.tarefas.filter(
      tarefa =>
        tarefa.status ===
        'A Fazer'
    );

  }


  get tarefasFazendo(): Tarefa[] {

    return this.tarefas.filter(
      tarefa =>
        tarefa.status ===
        'Fazendo'
    );

  }


  get tarefasConcluidas(): Tarefa[] {

    return this.tarefas.filter(
      tarefa =>
        tarefa.status ===
        'Concluído'
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


  converterEmTarefa(
    solicitacao: Solicitacao
  ): void {

    if (
      this.solicitacaoConvertendoId
    ) {
      return;
    }


    const dialogRef =
      this.dialog.open(
        PortalDialogComponent,
        {
          data: {
            title:
              'Converter em tarefa',

            message:
              'Deseja converter esta solicitação em uma tarefa?',

            type:
              'info',

            confirmText:
              'Converter',

            cancelText:
              'Cancelar'
          }
        }
      );


    dialogRef
      .afterClosed()
      .subscribe(
        confirmado => {

          if (
            confirmado !== true
          ) {
            return;
          }


          this.solicitacaoConvertendoId =
            solicitacao._id;


          this.solicitacoesService
            .converterEmTarefa(
              solicitacao._id
            )
            .subscribe({

              next: response => {

                this.solicitacaoConvertendoId =
                  null;


                this.snackbar.success(
                  response.message ??
                  'Solicitação convertida em tarefa com sucesso.'
                );


                this.carregarDados();

              },


              error: erro => {

                this.solicitacaoConvertendoId =
                  null;


                const mensagem =
                  erro?.error?.message ??
                  'Não foi possível converter a solicitação em tarefa.';


                this.snackbar.error(
                  mensagem
                );

              }

            });

        }
      );

  }


  concluirTarefa(
    tarefa: Tarefa
  ): void {

    if (
      this.tarefaConcluindoId
    ) {
      return;
    }


    const dialogRef =
      this.dialog.open(
        PortalDialogComponent,
        {
          data: {
            title:
              'Concluir tarefa',

            message:
              'Deseja marcar esta tarefa como concluída?',

            type:
              'info',

            confirmText:
              'Concluir',

            cancelText:
              'Cancelar'
          }
        }
      );


    dialogRef
      .afterClosed()
      .subscribe(
        confirmado => {

          if (
            confirmado !== true
          ) {
            return;
          }


          this.tarefaConcluindoId =
            tarefa._id;


          this.tarefasService
            .concluir(
              tarefa._id
            )
            .subscribe({

              next: response => {

                this.tarefaConcluindoId =
                  null;


                this.snackbar.success(
                  response.message ??
                  'Tarefa concluída com sucesso.'
                );


                this.carregarDados();

              },


              error: erro => {

                this.tarefaConcluindoId =
                  null;


                const mensagem =
                  erro?.error?.message ??
                  'Não foi possível concluir a tarefa.';


                this.snackbar.error(
                  mensagem
                );

              }

            });

        }
      );

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

          if (
            confirmado !== true
          ) {
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


                this.carregarDados();

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