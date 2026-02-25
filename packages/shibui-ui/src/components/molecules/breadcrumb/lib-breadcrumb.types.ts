export interface BreadcrumbItem {
  label: string;
  href?: string; // Si no hay href, se asume que es el paso actual (deshabilitado)
  icon?: string; // Opcional, por si queremos un icono al inicio
}
