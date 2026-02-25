import { LitElement } from 'lit';
export declare class LibSidebar extends LitElement {
  header: string;
  render(): import('lit-html').TemplateResult<1>;
}
declare global {
  interface HTMLElementTagNameMap {
    'lib-sidebar': LibSidebar;
  }
}
