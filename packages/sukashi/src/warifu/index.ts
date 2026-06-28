// warifu — tablilla partida (割符): un motivo que solo se compone cuando un manifiesto cumple
// su condición. Puro y node-safe (opera sobre datos; no toca DOM ni importa hanko/shibui).
export {
  allSealed,
  manifestMatch,
  type SealManifest,
  type ManifestEntry,
  type SealPolicy,
} from './manifest';
export {
  seal,
  open,
  openWithManifest,
  sealBytes,
  openBytes,
  type Warifu,
} from './warifu';
export { manifestFromTrustReport, type TrustReportLike } from './hanko';
