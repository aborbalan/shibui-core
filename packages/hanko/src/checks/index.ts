/* Barrel del subsistema de checks. */
export { floorCheck, isValidCustomElementName } from './floor';
export type { FloorResult } from './floor';
export { contractCheck } from './contract';
export type {
  ContractResult,
  ContractViolation,
  ContractFacet,
  ContractLevel,
  ContractChecked,
  ContractOptions,
} from './contract';
export { a11yCheck } from './a11y';
export type {
  A11yObservation,
  A11yResult,
  A11yFinding,
  A11yOptions,
  AxeViolation,
  AxeImpact,
} from './a11y';
