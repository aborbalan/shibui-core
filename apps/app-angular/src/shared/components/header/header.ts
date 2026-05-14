import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HeaderAction, NavLink } from '@shibui-ui/ui/components/molecules/header/lib-header.types';

@Component({
  selector: 'app-header',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {

  DEFAULT_LINKS: NavLink[] = [
    { id: 'componentes', label: 'Componentes', href: '/componentes' },
    { id: 'tokens', label: 'Tokens', href: '/tokens' },
    { id: 'filosofia', label: 'Filosofía', href: '/filosofia' },
    { id: 'about', label: 'Sobre mí', href: '/about' },
  ];
  
  DEFAULT_ACTIONS: HeaderAction[] = [
    { label: 'Empezar →', href: '#', variant: 'kintsugi' },
  ];
  

}
