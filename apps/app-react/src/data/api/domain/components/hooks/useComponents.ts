import { useQuery } from "@tanstack/react-query";
import { componentsApi, examplesApi } from "../api/components.api";
import { queryKeys } from "../../../query-keys";

/** Todas las categorías con sus componentes embebidos. */
export function useCategoriesWithComponents() {
  return useQuery({
    queryKey: queryKeys.components.withCategories,
    queryFn: componentsApi.getCategoriesWithComponents,
  });
}

/**
 * Componente individual por slug, derivado del caché de categorías.
 * Reutiliza la misma query key que useCategoriesWithComponents para no
 * hacer una petición extra, y aplica select() para extraer el componente.
 */
export function useComponentBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.components.withCategories,
    queryFn: componentsApi.getCategoriesWithComponents,
    select: (categories) =>
      categories.flatMap((cat) => cat.components).find((c) => c.slug === slug),
    enabled: !!slug,
  });
}

/** Ejemplos de uso de un componente. */
export function useComponentExamples(componentId: string) {
  return useQuery({
    queryKey: queryKeys.components.examples(componentId),
    queryFn: () => examplesApi.getByComponent(componentId),
    enabled: !!componentId,
  });
}
