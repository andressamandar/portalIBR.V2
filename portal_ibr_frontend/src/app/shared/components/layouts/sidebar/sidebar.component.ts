import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LogoComponent } from '../ui/logo/logo.component';

@Component({
  selector: 'app-sidebar',
  imports: [
    MatIconModule,
    LogoComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {}