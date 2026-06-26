import { kasaneWeave, type Bitmap, type Layer } from '../core';
import { drawLayer, type Rgba } from '../render';
import { isAligned } from './geometry';

const DEFAULT_INK: Rgba = [10, 10, 10, 255];

function hexToRgba(hex: string): Rgba {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m || !m[1]) return DEFAULT_INK;
  const n = Number.parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 255];
}

// <shibui-sukashi> — apila capas de patrón con mix-blend-mode: multiply; la capa
// superior es arrastrable (mode="draggable") y, al encajar, revela el motivo.
// Recibe capas ya tejidas (.layers) o un motivo (.motif) que teje internamente.
export class ShibuiSukashi extends HTMLElement {
  static get observedAttributes(): readonly string[] {
    return ['mode', 'cell', 'ink'];
  }

  private readonly root: ShadowRoot;
  private readonly stage: HTMLDivElement;
  private canvases: HTMLCanvasElement[] = [];
  private _motif: Bitmap | null = null;
  private _layers: readonly Layer[] | null = null;

  private dx = 0;
  private dy = 0;
  private dragging = false;
  private sx = 0;
  private sy = 0;
  private ox = 0;
  private oy = 0;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = `
      :host { display: inline-block; }
      .stage { position: relative; background: #fff; overflow: hidden;
               border-radius: 6px; box-shadow: 0 0 0 1px rgba(0,0,0,.08); }
      canvas { position: absolute; inset: 0; image-rendering: pixelated; }
      canvas.top { transition: transform .35s cubic-bezier(.2,.8,.2,1); }
    `;
    this.stage = document.createElement('div');
    this.stage.className = 'stage';
    this.root.append(style, this.stage);
  }

  get motif(): Bitmap | null {
    return this._motif;
  }
  set motif(value: Bitmap | null) {
    this._motif = value;
    this._layers = null;
    this.rebuild();
  }

  get layers(): readonly Layer[] | null {
    return this._layers;
  }
  set layers(value: readonly Layer[] | null) {
    this._layers = value;
    this.rebuild();
  }

  get cell(): number {
    return Number(this.getAttribute('cell')) || 8;
  }
  get mode(): 'static' | 'draggable' {
    return this.getAttribute('mode') === 'draggable' ? 'draggable' : 'static';
  }
  private get ink(): Rgba {
    const attr = this.getAttribute('ink');
    return attr ? hexToRgba(attr) : DEFAULT_INK;
  }

  // Vuelve a tejer un motivo con nueva aleatoriedad (no afecta a .layers explícitas).
  reweave(): void {
    if (this._motif) this.rebuild();
  }

  connectedCallback(): void {
    this.rebuild();
  }

  attributeChangedCallback(): void {
    this.rebuild();
  }

  private resolveLayers(): readonly Layer[] | null {
    if (this._layers && this._layers.length) return this._layers;
    if (this._motif) return kasaneWeave(this._motif);
    return null;
  }

  private topCanvas(): HTMLCanvasElement | undefined {
    return this.canvases[this.canvases.length - 1];
  }

  private rebuild(): void {
    const layers = this.resolveLayers();
    this.stage.textContent = '';
    this.canvases = [];
    if (!layers || layers.length === 0) return;

    const cell = this.cell;
    const ink = this.ink;
    const first = layers[0];
    if (!first) return;
    this.stage.style.width = `${first.width * cell}px`;
    this.stage.style.height = `${first.height * cell}px`;

    layers.forEach((layer, i) => {
      const cv = document.createElement('canvas');
      cv.width = layer.width * cell;
      cv.height = layer.height * cell;
      const ctx = cv.getContext('2d');
      if (ctx) drawLayer(ctx, layer, { cell, ink, background: [255, 255, 255, 255] });
      if (i > 0) cv.style.mixBlendMode = 'multiply';
      this.stage.appendChild(cv);
      this.canvases.push(cv);
    });

    const top = this.topCanvas();
    if (top) top.classList.add('top');
    this.applyTransform();
    this.bindDrag();
  }

  private bindDrag(): void {
    const top = this.topCanvas();
    if (!top || this.mode !== 'draggable') return;
    top.style.cursor = 'grab';
    top.style.touchAction = 'none';
    top.addEventListener('pointerdown', this.onDown);
    top.addEventListener('pointermove', this.onMove);
    top.addEventListener('pointerup', this.onUp);
    top.addEventListener('pointercancel', this.onUp);
  }

  private applyTransform(): void {
    const top = this.topCanvas();
    if (top) top.style.transform = `translate(${this.dx}px, ${this.dy}px)`;
  }

  private notify(): void {
    this.dispatchEvent(
      new CustomEvent('sukashi-reveal', {
        detail: { aligned: isAligned(this.dx, this.dy, this.cell) },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private readonly onDown = (e: PointerEvent): void => {
    if (this.mode !== 'draggable') return;
    this.dragging = true;
    const top = this.topCanvas();
    if (top) {
      top.setPointerCapture(e.pointerId);
      top.style.cursor = 'grabbing';
      top.style.transition = 'none';
    }
    this.sx = e.clientX;
    this.sy = e.clientY;
    this.ox = this.dx;
    this.oy = this.dy;
  };

  private readonly onMove = (e: PointerEvent): void => {
    if (!this.dragging) return;
    this.dx = this.ox + (e.clientX - this.sx);
    this.dy = this.oy + (e.clientY - this.sy);
    this.applyTransform();
    this.notify();
  };

  private readonly onUp = (): void => {
    if (!this.dragging) return;
    this.dragging = false;
    const top = this.topCanvas();
    if (top) {
      top.style.cursor = 'grab';
      top.style.transition = '';
    }
    if (this.hasAttribute('snap') && isAligned(this.dx, this.dy, this.cell)) {
      this.dx = 0;
      this.dy = 0;
      this.applyTransform();
      this.notify();
    }
  };
}
