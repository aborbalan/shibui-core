import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-footer',
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  /**
   * Sin esto el footer se queda con los legalLinks por defecto de la libreria,
   * que son `href="#"` y no llevan a ningun sitio.
   */
  readonly legalLinks = [
    { label: 'ecosistema', href: 'https://shibui-torii.web.app' },
    { label: 'github', href: 'https://github.com/aborbalan/shibui-core' },
  ];
}
