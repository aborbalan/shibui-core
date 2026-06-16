/* ============================================================
   hanko · Check de Contrato (F3)

   Conformance del ADR-001: lo que el manifest DECLARA debe
   coincidir con lo que el elemento vivo EXPONE. Compara un
   `ComponentContract` (declarado) contra un `ComponentRuntime`
   (observado) y emite las violaciones de conformidad.

   Regla de oro, aplicada en AMBOS sentidos:
     · el manifest no declara una faceta → no se verifica (no es fallo).
     · el harness no observó una faceta   → se OMITE (no es fallo).
     · declarado y el runtime lo contradice → VIOLACIÓN.

   Niveles (ADR-001):
     · conformance (def.) → lo declarado existe/coincide en runtime.
     · strict (opt-in)    → además, el runtime no expone API pública
                            NO declarada (completitud).

   Motor PURO: no toca el DOM. La observación la produce un harness
   (incremento 2, @vitest/browser). Ver docs/specs/checks-contract.md.
   ============================================================ */
import type { ComponentContract } from '../core/contract';
import type { ComponentRuntime } from '../core/runtime';

export type ContractLevel = 'conformance' | 'strict';

export type ContractFacet =
  | 'registration'
  | 'property'
  | 'attribute'
  | 'method'
  | 'reflect';

export interface ContractViolation {
  facet: ContractFacet;
  /** prop / atributo / método implicado; ausente en violaciones de registro. */
  member?: string;
  message: string;
}

/** Cuánto se verificó de verdad (transparencia de cobertura del sello). */
export interface ContractChecked {
  registration: boolean;
  properties: number;
  attributes: number;
  methods: number;
  reflect: number;
}

export interface ContractResult {
  tagName: string;
  level: ContractLevel;
  pass: boolean;
  violations: ContractViolation[];
  checked: ContractChecked;
  /** Facetas omitidas y por qué (declaración u observación ausente). */
  skipped: string[];
}

export interface ContractOptions {
  /** Nivel de exigencia. Por defecto `'conformance'`. */
  level?: ContractLevel;
}

/** Verifica la conformidad declarado ↔ runtime de un componente. */
export function contractCheck(
  component: ComponentContract,
  runtime: ComponentRuntime,
  options: ContractOptions = {},
): ContractResult {
  const level: ContractLevel = options.level ?? 'conformance';
  const violations: ContractViolation[] = [];
  const skipped: string[] = [];
  const checked: ContractChecked = {
    registration: false,
    properties: 0,
    attributes: 0,
    methods: 0,
    reflect: 0,
  };

  const result = (): ContractResult => ({
    tagName: component.tagName,
    level,
    pass: violations.length === 0,
    violations,
    checked,
    skipped,
  });

  // Guardia: la observación debe ser del mismo elemento.
  if (runtime.tagName !== component.tagName) {
    violations.push({
      facet: 'registration',
      message: `la observación de runtime ("${runtime.tagName}") no corresponde al componente "${component.tagName}"`,
    });
    return result();
  }

  // 1 · Registrabilidad — la parte runtime del Floor (diferida desde F2).
  checked.registration = true;
  if (!runtime.registered) {
    violations.push({
      facet: 'registration',
      message: `el tagName "${component.tagName}" no está registrado como custom element`,
    });
    skipped.push(
      'properties · attributes · methods · reflect (sin registro no hay elemento que inspeccionar)',
    );
    return result();
  }

  // 2 · Propiedades, atributos y reflect — condicionados a que el manifest los declare.
  if (component.properties === undefined) {
    skipped.push('properties · attributes · reflect (el manifest no declara propiedades)');
  } else {
    // propiedades declaradas ↔ presentes en el elemento
    if (runtime.properties === undefined) {
      skipped.push('properties (el runtime no observó propiedades)');
    } else {
      const present = new Set(runtime.properties);
      for (const p of component.properties) {
        checked.properties++;
        if (!present.has(p.property)) {
          violations.push({
            facet: 'property',
            member: p.property,
            message: `propiedad declarada "${p.property}" ausente en el elemento`,
          });
        }
      }
    }

    // atributos: solo las props que mapean un atributo
    const declaredAttrs = component.properties.filter((p) => p.attribute !== undefined);
    if (declaredAttrs.length > 0) {
      if (runtime.observedAttributes === undefined) {
        skipped.push('attributes (el runtime no observó observedAttributes)');
      } else {
        const observed = new Set(runtime.observedAttributes);
        for (const p of declaredAttrs) {
          checked.attributes++;
          if (!observed.has(p.attribute!)) {
            violations.push({
              facet: 'attribute',
              member: p.attribute!,
              message: `atributo declarado "${p.attribute}" (prop "${p.property}") no figura en observedAttributes`,
            });
          }
        }
      }
    }

    // reflect: solo las props con reflects:true, y solo si el harness lo probó
    const declaredReflect = component.properties.filter((p) => p.reflects);
    if (declaredReflect.length > 0) {
      if (runtime.reflectingProperties === undefined) {
        skipped.push('reflect (el harness no probó la reflexión prop⇄attribute)');
      } else {
        const reflecting = new Set(runtime.reflectingProperties);
        for (const p of declaredReflect) {
          checked.reflect++;
          if (!reflecting.has(p.property)) {
            violations.push({
              facet: 'reflect',
              member: p.property,
              message: `la prop "${p.property}" declara reflects:true pero no se refleja a su atributo en runtime`,
            });
          }
        }
      }
    }
  }

  // 3 · Métodos declarados ↔ presentes en el elemento.
  if (component.methods === undefined) {
    skipped.push('methods (el manifest no declara métodos)');
  } else if (runtime.methods === undefined) {
    skipped.push('methods (el runtime no observó métodos)');
  } else {
    const present = new Set(runtime.methods);
    for (const m of component.methods) {
      checked.methods++;
      if (!present.has(m.name)) {
        violations.push({
          facet: 'method',
          member: m.name,
          message: `método declarado "${m.name}" ausente en el elemento`,
        });
      }
    }
  }

  // 4 · Strict (opt-in) — completitud: el runtime no debe exponer API pública NO declarada.
  if (
    level === 'strict' &&
    component.properties !== undefined &&
    runtime.properties !== undefined
  ) {
    const declared = new Set(component.properties.map((p) => p.property));
    for (const name of runtime.properties) {
      if (!declared.has(name)) {
        violations.push({
          facet: 'property',
          member: name,
          message: `propiedad pública "${name}" presente en runtime pero no declarada en el manifest (strict)`,
        });
      }
    }
  }

  return result();
}
