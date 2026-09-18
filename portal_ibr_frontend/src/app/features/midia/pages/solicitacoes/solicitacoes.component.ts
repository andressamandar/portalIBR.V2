import {
  Component,
  inject
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  LogoComponent
} from '../../../../shared/components/ui/logo/logo.component';

import {
  SelectionCardComponent
} from '../../../../shared/components/ui/selection-card/selection-card.component';


@Component({
  selector: 'app-solicitacoes',
  standalone: true,
  imports: [
    LogoComponent,
    SelectionCardComponent
  ],
  templateUrl: './solicitacoes.component.html',
  styleUrl: './solicitacoes.component.scss'
})
export class SolicitacoesComponent {

  private readonly router =
    inject(Router);


  novaSolicitacao(): void {

    void this.router.navigate([
      '/midia',
      'solicitacoes',
      'nova'
    ]);

  }


  acompanharSolicitacoes(): void {

    void this.router.navigate([
      '/midia',
      'solicitacoes',
      'acompanhar'
    ]);

  }


  voltar(): void {

    void this.router.navigate([
      '/midia'
    ]);

  }

}