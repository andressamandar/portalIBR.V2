import {Component,inject,OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DisponibilidadesService,PreenchimentoDisponibilidade} from '../../../../core/services/disponibilidades.service';
import {PortalSnackbarService} from '../../../../core/services/portal-snackbar.service';
import {PortalButtonComponent} from '../../../../shared/components/ui/portal-button/portal-button.component';
import {PortalLoadingComponent} from '../../../../shared/components/ui/portal-loading/portal-loading.component';
import {PortalEmptyStateComponent} from '../../../../shared/components/ui/portal-empty-state/portal-empty-state.component';


@Component({
  selector: 'app-visualizar-preenchimento',
  standalone: true,
  imports: [
    PortalButtonComponent,
    PortalLoadingComponent,
    PortalEmptyStateComponent
  ],
  templateUrl: './visualizar-preenchimento.component.html',
  styleUrl: './visualizar-preenchimento.component.scss'
})
export class VisualizarPreenchimentoComponent
  implements OnInit {

  private readonly router =
    inject(Router);

  private readonly disponibilidadesService =
    inject(DisponibilidadesService);

  private readonly snackbar =
    inject(PortalSnackbarService);


  integrantes:
    PreenchimentoDisponibilidade[] = [];

  carregando = false;


  ngOnInit(): void {
    this.carregarPreenchimento();
  }


  private carregarPreenchimento(): void {
    this.carregando = true;

    this.disponibilidadesService
      .visualizarPreenchimento('Louvor')
      .subscribe({
        next: response => {
          this.integrantes =
            response.data;

          this.carregando = false;
        },

        error: erro => {
          this.carregando = false;

          const mensagem =
            erro?.error?.message ??
            'Não foi possível carregar o preenchimento.';

          this.snackbar.error(mensagem);
        }
      });
  }


  get totalPreencheram(): number {
    return this.integrantes.filter(
      integrante =>
        integrante.preencheu
    ).length;
  }


  get totalPendentes(): number {
    return this.integrantes.filter(
      integrante =>
        !integrante.preencheu
    ).length;
  }


  async copiarLista(): Promise<void> {

    if (this.integrantes.length === 0) {
      return;
    }

    const linhas =
      this.integrantes.map(
        integrante => {

          const status =
            integrante.preencheu
              ? '✅'
              : '❌';

          return (
            `${status} ${integrante.nome}`
          );
        }
      );

    const texto = [
      'PREENCHIMENTO DE DISPONIBILIDADE - LOUVOR',
      '',
      ...linhas
    ].join('\n');

    try {
      await navigator.clipboard.writeText(
        texto
      );

      this.snackbar.success(
        'Lista copiada com sucesso.'
      );

    } catch {
      this.snackbar.error(
        'Não foi possível copiar a lista.'
      );
    }
  }


  voltar(): void {
    void this.router.navigate([
      '/louvor/lideranca/escala'
    ]);
  }
}