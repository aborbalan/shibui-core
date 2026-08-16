/**
 * Nombres de los channels de Open Cells, en un solo sitio.
 *
 * Un channel es una cadena: dos literales casi iguales en dos ficheros distintos
 * son dos channels distintos y nada avisa. `open_cells_list_channels` del MCP del
 * fork detecta precisamente eso ("nombres casi idénticos"), pero es más barato no
 * dárselo a detectar.
 */
export const CH_KATACHI = 'ch-katachi';
export const CH_TRUST_REPORT = 'ch-trust-report';
export const CH_CATALOG = 'ch-catalog';
export const CH_DEPLOYS = 'ch-deploys';
