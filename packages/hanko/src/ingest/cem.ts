/* ============================================================
   hanko · Ingestión del CEM → modelo interno (F1)

   `ingestCem` es el BORDE DE INGESTIÓN del camino CEM: lee un
   Custom Elements Manifest y lo normaliza a `ContractSet`.
   Aquí (y solo aquí) se conoce el formato de cable; el resto del
   motor habla únicamente el modelo interno.

   Los adapters de formatos custom (caso especial) enchufarán en
   este mismo borde en el futuro, emitiendo `ContractSet`. No se
   construyen aún (generalizar desde el uso, no especular).

   Spec: docs/specs/ingest.md
   ============================================================ */
import type {
  ComponentContract,
  ContractSet,
  CssPartContract,
  CssPropContract,
  EventContract,
  PropertyContract,
  SlotContract,
} from '../core/contract';
import type {
  CemCssPart,
  CemCssProperty,
  CemDeclaration,
  CemEvent,
  CemMember,
  CemSlot,
  CustomElementsManifest,
} from './cem-types';
import { parseType } from './parse-type';

/** Normaliza un CEM ya parseado a `ContractSet` (índice por tagName). */
export function ingestCem(manifest: CustomElementsManifest): ContractSet {
  const components = new Map<string, ComponentContract>();
  for (const mod of manifest.modules ?? []) {
    const modulePath = mod.path ?? '';
    for (const decl of mod.declarations ?? []) {
      const component = toComponent(decl, modulePath);
      if (component !== null) components.set(component.tagName, component);
    }
  }
  return { components };
}

/** Una declaración → componente, o null si no es un custom element sellable. */
function toComponent(
  decl: CemDeclaration,
  modulePath: string,
): ComponentContract | null {
  // Filtro: solo clases custom-element con tagName son unidades de sellado.
  if (decl.kind !== 'class' || decl.customElement !== true || !decl.tagName) {
    return null;
  }

  const component: ComponentContract = {
    tagName: decl.tagName,
    modulePath,
    source: { kind: 'cem' },
  };
  if (decl.name !== undefined) component.className = decl.name;
  if (decl.description !== undefined) component.description = decl.description;

  // Semántica de presencia: faceta ausente en el CEM → undefined (no verificable);
  // presente → se mapea (puede quedar []).
  if (decl.members !== undefined) {
    component.properties = decl.members.filter(isPublicField).map(toProperty);
  }
  if (decl.events !== undefined) component.events = decl.events.map(toEvent);
  if (decl.slots !== undefined) component.slots = decl.slots.map(toSlot);
  if (decl.cssParts !== undefined) component.cssParts = decl.cssParts.map(toCssPart);
  if (decl.cssProperties !== undefined) {
    component.cssProps = decl.cssProperties.map(toCssProp);
  }
  // `methods` deferido a F3 (decisión del modelo): no se pueblan aún.

  return component;
}

/** Campos públicos de instancia (excluye métodos, privados/protegidos y estáticos). */
function isPublicField(m: CemMember): boolean {
  return (
    m.kind === 'field' &&
    m.privacy !== 'private' &&
    m.privacy !== 'protected' &&
    m.static !== true
  );
}

function toProperty(m: CemMember): PropertyContract {
  const prop: PropertyContract = {
    property: m.name,
    reflects: m.reflects === true,
    type: parseType(m.type?.text),
  };
  if (m.attribute !== undefined) prop.attribute = m.attribute;
  if (m.default !== undefined) prop.default = m.default;
  if (m.description !== undefined) prop.description = m.description;
  if (m.inheritedFrom?.name !== undefined) prop.inheritedFrom = m.inheritedFrom.name;
  return prop;
}

function toEvent(e: CemEvent): EventContract {
  const ev: EventContract = { name: e.name };
  if (e.type?.text !== undefined) ev.type = e.type.text;
  if (e.description !== undefined) ev.description = e.description;
  return ev;
}

function toSlot(s: CemSlot): SlotContract {
  const slot: SlotContract = { name: s.name ?? '' };
  if (s.description !== undefined) slot.description = s.description;
  return slot;
}

function toCssPart(p: CemCssPart): CssPartContract {
  const part: CssPartContract = { name: p.name };
  if (p.description !== undefined) part.description = p.description;
  return part;
}

function toCssProp(p: CemCssProperty): CssPropContract {
  const cssProp: CssPropContract = { name: p.name };
  if (p.default !== undefined) cssProp.default = p.default;
  if (p.description !== undefined) cssProp.description = p.description;
  return cssProp;
}
