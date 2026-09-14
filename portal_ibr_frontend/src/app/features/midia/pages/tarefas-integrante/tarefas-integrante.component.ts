import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  NgTemplateOutlet
} from '@angular/common';

import {
  Router
} from '@angular/router';

import {
  AuthService,
  AuthUsuario
} from '../../../../core/services/auth.service';

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


@Component({
  selector: 'app-tarefas-integrante',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    PortalButtonComponent,
    PortalLoadingComponent,
    PortalEmptyStateComponent
  ],
  templateUrl: './tarefas-integrante.component.html',
  styleUrl: './tarefas-integrante.component.scss'
})
export class TarefasIntegranteComponent
  implements OnInit {

  private readonly tarefasService =
    inject(TarefasService);

  private readonly authService =
    inject(AuthService);

  private readonly snackbar =
    inject(PortalSnackbarService);

  private readonly router =
    inject(Router);


  usuario:
    AuthUsuario | null = null;

  tarefas:
    Tarefa[] = [];

  carregando = false;

  tarefaEmAcaoId:
    string | null = null;


  ngOnInit(): void {

    this.usuario =
      this.authService.obterUsuario();


    if (
      !this.usuario ||
      !this.usuario.id
    ) {

      this.snackbar.error(
        'Não foi possível identificar o integrante logado.'
      );

      void this.router.navigate([
        '/midia/integrante'
      ]);

      return;

    }


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


  ehResponsavel(
    tarefa: Tarefa
  ): boolean {

    return (
      !!this.usuario?.id &&
      tarefa.responsavel_id ===
        this.usuario.id
    );

  }


  assumirTarefa(
    tarefa: Tarefa
  ): void {

    if (
      tarefa.status !== 'A Fazer' ||
      this.tarefaEmAcaoId
    ) {
      return;
    }


    this.tarefaEmAcaoId =
      tarefa._id;


    this.tarefasService
      .assumir(
        tarefa._id
      )
      .subscribe({

        next: response => {

          this.tarefaEmAcaoId =
            null;


          this.snackbar.success(
            response.message ??
            'Tarefa assumida com sucesso.'
          );


          this.carregarTarefas();

        },


        error: erro => {

          this.tarefaEmAcaoId =
            null;


          const mensagem =
            erro?.error?.message ??
            'Não foi possível assumir a tarefa.';


          this.snackbar.error(
            mensagem
          );

        }

      });

  }


  concluirTarefa(
    tarefa: Tarefa
  ): void {

    if (
      tarefa.status !== 'Fazendo' ||
      !this.ehResponsavel(tarefa) ||
      this.tarefaEmAcaoId
    ) {
      return;
    }


    this.tarefaEmAcaoId =
      tarefa._id;


    this.tarefasService
      .concluir(
        tarefa._id
      )
      .subscribe({

        next: response => {

          this.tarefaEmAcaoId =
            null;


          this.snackbar.success(
            response.message ??
            'Tarefa concluída com sucesso.'
          );


          this.carregarTarefas();

        },


        error: erro => {

          this.tarefaEmAcaoId =
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


  estaExecutandoAcao(
    tarefa: Tarefa
  ): boolean {

    return (
      this.tarefaEmAcaoId ===
      tarefa._id
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


  voltar(): void {

    void this.router.navigate([
      '/midia/integrante'
    ]);

  }

}