import {Component,inject} from '@angular/core';
import {Router} from '@angular/router';
import {SelectionCardComponent} from '../../../../shared/components/ui/selection-card/selection-card.component';
import {PortalButtonComponent} from '../../../../shared/components/ui/portal-button/portal-button.component';

@Component({
  selector: 'app-escala',
  standalone: true,
  imports: [
    SelectionCardComponent,
    PortalButtonComponent
  ],
  templateUrl: './escala.component.html',
  styleUrl: './escala.component.scss'
})
export class EscalaComponent {

  private readonly router =
    inject(Router);

  selecionarOpcao(
    opcao:
      | 'gerenciar-datas'
      | 'criar-escala'
      | 'preenchimento'
      | 'disponibilidades'
      | 'download'
    ): void {

    if (opcao === 'gerenciar-datas') {
      void this.router.navigate([
        '/louvor/lideranca/escala/datas'
      ]);
    }

    if (opcao === 'criar-escala') {
      void this.router.navigate([
        '/louvor/lideranca/escala/criar'
      ]);
    }

    if (opcao === 'preenchimento') {
      void this.router.navigate([
        '/louvor/lideranca/escala/preenchimento'
      ]);
    }

    if (opcao === 'disponibilidades') {
      void this.router.navigate([
        '/louvor/lideranca/escala/disponibilidades'
      ]);
    }

    if (opcao === 'download') {
      void this.router.navigate([
        '/louvor/lideranca/escala/download'
      ]);
    }

  }

  voltar(): void {
    void this.router.navigate([
      '/louvor/lideranca'
    ]);
  }
}