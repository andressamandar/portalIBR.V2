import {
  Component,
  inject
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  SelectionCardComponent
} from '../../../../shared/components/ui/selection-card/selection-card.component';

import {
  PortalButtonComponent
} from '../../../../shared/components/ui/portal-button/portal-button.component';


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
      | 'datas'
      | 'criar'
      | 'preenchimento'
      | 'disponibilidades'
      | 'download'
  ): void {

    switch (opcao) {

      case 'datas':
        void this.router.navigate([
          '/midia/lideranca/escala/datas'
        ]);
        break;


      case 'criar':
        void this.router.navigate([
          '/midia/lideranca/escala/criar'
        ]);
        break;


      case 'preenchimento':
        void this.router.navigate([
          '/midia/lideranca/escala/preenchimento'
        ]);
        break;


      case 'disponibilidades':
        void this.router.navigate([
          '/midia/lideranca/escala/disponibilidades'
        ]);
        break;


      case 'download':
        void this.router.navigate([
          '/midia/lideranca/escala/download'
        ]);
        break;

    }

  }


  voltar(): void {

    void this.router.navigate([
      '/midia/lideranca'
    ]);

  }

}