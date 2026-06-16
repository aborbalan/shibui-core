/* ============================================================
   hanko · Observación del runtime (F3)

   La OTRA mitad del par de F3. `ComponentContract` (core/contract)
   es lo DECLARADO por el manifest; `ComponentRuntime` es lo
   OBSERVADO en el elemento real del DOM. El check de contrato
   (checks/contract) compara uno contra otro — la Conformance del
   ADR-001 (lo declarado ↔ el runtime).

   hanko NO sabe instanciar el componente: hacerlo importaría
   runtime ajeno y rompería la genericidad del core. Un harness del
   lado del consumidor —o el probe DOM genérico de un incremento
   futuro (@vitest/browser, ADR-002)— monta el elemento y rellena
   esta estructura. El core solo COMPARA. Así el cerebro de F3 se
   testea en Node con observaciones falsas, sin navegador.

   Semántica de observación (simétrica a la regla de oro):
     campo undefined → el harness NO pudo/quiso observar la faceta
                       → el check la OMITE (no es fallo).
     campo presente  → observación fiable → el check la usa.

   Spec: docs/specs/checks-contract.md
   ============================================================ */

/** Instantánea observada de un custom element vivo. */
export interface ComponentRuntime {
  /** Debe casar con `ComponentContract.tagName`. */
  tagName: string;
  /**
   * ¿`customElements.get(tagName)` está definido? Registrabilidad:
   * la parte runtime del Floor que F2 (estático) difirió a F3.
   */
  registered: boolean;
  /**
   * Nombres de propiedades alcanzables en la instancia (campos propios +
   * accessors del prototipo, hasta `HTMLElement` excluido).
   * `undefined` = el harness no observó propiedades.
   */
  properties?: string[];
  /**
   * `observedAttributes` del custom element.
   * `undefined` = el harness no observó atributos.
   */
  observedAttributes?: string[];
  /**
   * Nombres de métodos públicos (funciones del prototipo, excl. constructor,
   * hasta `HTMLElement` excluido). `undefined` = no observado.
   */
  methods?: string[];
  /**
   * Propiedades que, al asignarse, reflejan a su atributo (probado por el
   * harness con un set/get sobre el elemento). `undefined` = reflect no probado
   * → no se verifica.
   */
  reflectingProperties?: string[];
}
