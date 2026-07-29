import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss'
})
export class LogoComponent {
  @Input() variant: 'full' | 'symbol' = 'full';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() alt = 'Igreja Batista Redenção';
}