import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderAction, NavLink } from './header.types';

@Component({
  selector: 'app-header',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  private router = inject(Router);

  DEFAULT_LINKS: NavLink[] = [
    { id: 'componentes', label: 'Componentes', href: '/componentes' },
    { id: 'tokens', label: 'Tokens', href: '/tokens' },
    { id: 'philosophy', label: 'Filosofía', href: '/philosophy' },
    { id: 'about', label: 'Sobre mí', href: '/about' },
  ];

  DEFAULT_ACTIONS: HeaderAction[] = [
    { label: 'Empezar →', href: '#', variant: 'kintsugi' },
  ];

  onLinkClick(event: Event): void {
    const id = (event as CustomEvent<{ id: string }>).detail.id;
    const link = this.DEFAULT_LINKS.find(l => l.id === id);
    if (link?.href) this.router.navigateByUrl(link.href);
  }

  onActionClick(event: Event): void {
    const href = (event as CustomEvent<{ href: string }>).detail.href;
    if (href && href !== '#') this.router.navigateByUrl(href);
  }
}
