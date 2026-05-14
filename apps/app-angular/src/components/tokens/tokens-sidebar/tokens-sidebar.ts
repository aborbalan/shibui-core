import { Component } from '@angular/core';

interface SidebarLink {
  anchor: string;
  label: string;
}

@Component({
  selector: 'app-tokens-sidebar',
  standalone: true,
  templateUrl: './tokens-sidebar.html',
  styleUrl: './tokens-sidebar.scss',
})
export class TokensSidebarComponent {
  readonly links: SidebarLink[] = [
    { anchor: 'colors', label: 'Colores' },
    { anchor: 'typography', label: 'Tipografía' },
    { anchor: 'spacing', label: 'Espaciado' },
    { anchor: 'radius', label: 'Radio' },
    { anchor: 'shadows', label: 'Sombras' },
    { anchor: 'animation', label: 'Animación' },
    { anchor: 'z-index', label: 'Z-Index' },
    { anchor: 'glass', label: 'Glass' },
    { anchor: 'spotlight', label: 'Spotlight' },
  ];
}
