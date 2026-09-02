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
  MatDialog
} from '@angular/material/dialog';

import {
  Louvor,
  LouvoresService
} from '../../../../core/services/louvores.service';

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

import {
  PortalInputComponent
} from '../../../../shared/components/ui/portal-input/portal-input.component';


@Component({
  selector: 'app-gerenciar-louvores',
  standalone: true,
  imports: [
    FormsModule,
    PortalButtonComponent,
    PortalLoadingComponent,
    PortalEmptyStateComponent,
    PortalInputComponent
  ],
  templateUrl: './gerenciar-louvores.component.html',
  styleUrl: './gerenciar-louvores.component.scss'
})
export class GerenciarLouvoresComponent
  implements OnInit {

  private readonly router =
    inject(Router);

  private readonly louvoresService =
    inject(LouvoresService);

  private readonly snackbar =
    inject(PortalSnackbarService);

  private readonly dialog =
    inject(MatDialog);


  louvores: Louvor[] = [];

  carregando = false;

  pesquisa = '';


  ngOnInit(): void {
    this.carregarLouvores();
  }


  get louvoresAgitados(): Louvor[] {

    return this.filtrarLouvores(
      this.louvores.filter(
        louvor =>
          louvor.categoria === 'Agitado'
      )
    );
  }


  get louvoresCalmos(): Louvor[] {

    return this.filtrarLouvores(
      this.louvores.filter(
        louvor =>
          louvor.categoria === 'Calmo'
      )
    );
  }


  get possuiResultadoPesquisa(): boolean {

    return (
      this.louvoresAgitados.length > 0 ||
      this.louvoresCalmos.length > 0
    );
  }


  private filtrarLouvores(
    louvores: Louvor[]
  ): Louvor[] {

    const termo =
      this.normalizarTexto(
        this.pesquisa
      );


    return louvores
      .filter(
        louvor => {

          if (!termo) {
            return true;
          }


          const nome =
            this.normalizarTexto(
              louvor.louvor
            );


          return nome.includes(
            termo
          );

        }
      )
      .sort(
        (a, b) =>
          a.louvor.localeCompare(
            b.louvor,
            'pt-BR'
          )
      );
  }


  private normalizarTexto(
    texto: string
  ): string {

    return texto
      .trim()
      .toLocaleLowerCase(
        'pt-BR'
      )
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      );
  }


  carregarLouvores(): void {

    this.carregando = true;


    this.louvoresService
      .listar()
      .subscribe({

        next: response => {

          this.louvores =
            response.data;

          this.carregando =
            false;
        },


        error: erro => {

          this.carregando =
            false;


          const mensagem =
            erro?.error?.message ??
            'Não foi possível carregar os louvores.';


          this.snackbar.error(
            mensagem
          );
        }

      });
  }


  novoLouvor(): void {

    void this.router.navigate([
      '/louvor/lideranca/louvores/gerenciar/novo'
    ]);
  }


  editarLouvor(
    louvorId: string
  ): void {

    void this.router.navigate([
      '/louvor/lideranca/louvores/gerenciar',
      louvorId,
      'editar'
    ]);
  }


  excluirLouvor(
    louvor: Louvor
  ): void {

    const dialogRef =
      this.dialog.open(
        PortalDialogComponent,
        {
          data: {
            title:
              'Excluir louvor',

            message:
              `Deseja realmente excluir o louvor "${louvor.louvor}"?`,

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


          this.louvoresService
            .excluir(
              louvor._id
            )
            .subscribe({

              next: response => {

                this.snackbar.success(
                  response.message ??
                  'Louvor excluído com sucesso.'
                );


                this.carregarLouvores();
              },


              error: erro => {

                const mensagem =
                  erro?.error?.message ??
                  'Não foi possível excluir o louvor.';


                this.snackbar.error(
                  mensagem
                );
              }

            });

        }
      );
  }


  voltar(): void {

    void this.router.navigate([
      '/louvor/lideranca/louvores'
    ]);
  }

}