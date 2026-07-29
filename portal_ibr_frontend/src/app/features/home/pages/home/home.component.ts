import {
  Component,
  inject
} from '@angular/core';

import { Router } from '@angular/router';

import {
  LogoComponent
} from '../../../../shared/components/ui/logo/logo.component';

import {
  SelectionCardComponent
} from '../../../../shared/components/ui/selection-card/selection-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LogoComponent,
    SelectionCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private readonly router = inject(Router);

  selecionarMinisterio(
    ministerio: 'Louvor' | 'Midia'
  ): void {
    const rota =
      ministerio === 'Louvor'
        ? '/louvor'
        : '/midia';

    void this.router.navigate([rota]);
  }
}