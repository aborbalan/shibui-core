/**
 * AppComponent — Angular 21 consumer fixture
 *
 * Cubre los cinco ejes del contrato usando patrones idiomáticos de Angular:
 *   - [prop]="value"   → property binding (establece .prop en el elemento)
 *   - prop="value"     → attribute binding (string literal)
 *   - (eventName)="h"  → event binding con nombres de eventos kebab-case
 *                        (Angular los mapea directamente vía addEventListener)
 *   - #ref / @ViewChild → acceso al elemento nativo para listener manual
 *
 * CUSTOM_ELEMENTS_SCHEMA: obligatorio en cualquier componente Angular que
 * renderice elementos lib-*. Sin él, el compilador rechaza tags desconocidos.
 *
 * tokens.css: cargado en angular.json styles[]. Sin esa entrada, los tokens
 * semánticos no se propagan y el sistema Katachi no funciona.
 */
import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  ViewChild,
  signal,
} from '@angular/core';
// El tipo CapturedEventsMap se define inline para no crear dependencia
// cruzada con el paquete @shibui/consumer-tests vía ruta relativa.
type CapturedEventsMap = Record<string, Array<Record<string, unknown>>>;
type WindowWithCapture = Window & { __capturedEvents__: CapturedEventsMap };

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.html',
})
export class AppComponent implements AfterViewInit {

  // Señal reactiva para controlar la apertura del modal.
  // [open]="modalOpen()" en el template activa property binding de Angular.
  readonly modalOpen = signal(false);

  // @ViewChild da acceso al nativeElement del custom element para
  // registrar el listener de forma imperativa (no existe (ui-lib-modal-close)
  // como binding de Angular porque el compilador no conoce el elemento).
  @ViewChild('testModal') modalRef!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    this.modalRef.nativeElement.addEventListener(
      'ui-lib-modal-close',
      (e: Event) => {
        const detail = (e as CustomEvent<Record<string, unknown>>).detail ?? {};
        const win = window as unknown as WindowWithCapture;
        win.__capturedEvents__['ui-lib-modal-close'] ??= [];
        win.__capturedEvents__['ui-lib-modal-close'].push(detail);
        this.modalOpen.set(false);
      },
    );
  }

  openModal(): void {
    this.modalOpen.set(true);
  }
}
