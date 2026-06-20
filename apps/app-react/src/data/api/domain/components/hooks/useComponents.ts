import { useQuery, useQueryClient } from "@tanstack/react-query";
import { componentsApi, examplesApi } from "../api/components.api";
import type { CategoryWithComponentsDto } from "../api/components.api";
import { queryKeys } from "../../../query-keys";

/** Todas las categorías con sus componentes embebidos. */
export function useCategoriesWithComponents() {
  return useQuery({
    queryKey: queryKeys.components.withCategories,
    queryFn: componentsApi.getCategoriesWithComponents,
  });
}

/**
 * Componente individual por slug.
 *
 * Llama al endpoint `slug`, que es la única vía que incluye el bloque `api`
 * (props/slots/events); el listado `with-components` lo omite por peso.
 * Usa `initialData` derivada del caché de categorías para pintar al instante
 * los campos base y luego hidratar `api` cuando resuelve la petición.
 */
export function useComponentBySlug(slug: string) {
  const qc = useQueryClient();
  return useQuery({
    queryKey: queryKeys.components.bySlug(slug),
    queryFn: () => componentsApi.getBySlug(slug),
    enabled: !!slug,
    initialData: () =>
      qc
        .getQueryData<CategoryWithComponentsDto[]>(
          queryKeys.components.withCategories
        )
        ?.flatMap((cat) => cat.components)
        .find((c) => c.slug === slug),
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
