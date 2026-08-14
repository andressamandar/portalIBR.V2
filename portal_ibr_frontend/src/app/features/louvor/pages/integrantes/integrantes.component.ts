import {Component,inject,OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Integrante,IntegrantesService} from '../../../../core/services/integrantes.service';
import {PortalSnackbarService} from '../../../../core/services/portal-snackbar.service';
import {PortalButtonComponent} from '../../../../shared/components/ui/portal-button/portal-button.component';
import {PortalLoadingComponent} from '../../../../shared/components/ui/portal-loading/portal-loading.component';
import {PortalEmptyStateComponent} from '../../../../shared/components/ui/portal-empty-state/portal-empty-state.component';


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
export class IntegrantesComponent implements OnInit {
  private readonly integrantesService =
    inject(IntegrantesService);

  private readonly snackbar =
    inject(PortalSnackbarService);

  private readonly router =
    inject(Router);

  integrantes: Integrante[] = [];

  carregando = false;

  ngOnInit(): void {
    this.carregarIntegrantes();
  }

  carregarIntegrantes(): void {
    this.carregando = true;

    this.integrantesService
      .listar('Louvor')
      .subscribe({
        next: response => {
          this.integrantes = response.data;
          this.carregando = false;
        },

        error: erro => {
          this.integrantes = [];
          this.carregando = false;

          const mensagem =
            erro?.error?.message ??
            'Não foi possível carregar os integrantes.';

          this.snackbar.error(mensagem);
        }
      });
  }

  voltar(): void {
    void this.router.navigate([
      '/louvor/lideranca'
    ]);
  }

  cadastrarIntegrante(): void {
    void this.router.navigate([
      '/louvor/lideranca/integrantes/novo'
    ]);
  }

  editarIntegrante(id: string): void {
    void this.router.navigate([
      '/louvor/lideranca/integrantes',
      id,
      'editar'
    ]);
  }

}

