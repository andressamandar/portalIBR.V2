import {Component,inject} from '@angular/core';
import {Router} from '@angular/router';
import {SelectionCardComponent} from '../../../../shared/components/ui/selection-card/selection-card.component';
import {PortalButtonComponent} from '../../../../shared/components/ui/portal-button/portal-button.component';


@Component({
  selector: 'app-louvores',
  standalone: true,
  imports: [
    SelectionCardComponent,
    PortalButtonComponent
  ],
  templateUrl: './louvores.component.html',
  styleUrl: './louvores.component.scss'
})
export class LouvoresComponent {

  private readonly router =
    inject(Router);


  selecionarOpcao(
    opcao:
      | 'gerenciar'
      | 'escalar'
  ): void {

    if (opcao === 'gerenciar') {
      void this.router.navigate([
        '/louvor/lideranca/louvores/gerenciar'
      ]);
    }

    if (opcao === 'escalar') {
      void this.router.navigate([
        '/louvor/lideranca/louvores/escalar'
      ]);
    }
  }


  voltar(): void {
    void this.router.navigate([
      '/louvor/lideranca'
    ]);
  }
}