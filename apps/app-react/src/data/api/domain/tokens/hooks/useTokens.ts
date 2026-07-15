import { useQuery } from "@tanstack/react-query";
import { tokensApi, type TokenCategory } from "../api/tokens.api";
import { queryKeys } from "../../../query-keys";

/** Todos los design tokens disponibles en @shibui-ui/ui. */
export function useTokens() {
  return useQuery({
    queryKey: queryKeys.tokens.all,
    queryFn: tokensApi.getAll,
  });
}

/** Listado de categorías de tokens disponibles. */
export function useTokenCategories() {
  return useQuery({
    queryKey: queryKeys.tokens.categories,
    queryFn: tokensApi.getCategories,
  });
}

/** Tokens filtrados por categoría. */
export function useTokensByCategory(category: TokenCategory) {
  return useQuery({
    queryKey: queryKeys.tokens.byCategory(category),
    queryFn: () => tokensApi.getByCategory(category),
  });
}

/** Token individual por ID. */
export function useToken(id: string) {
  return useQuery({
    queryKey: queryKeys.tokens.detail(id),
    queryFn: () => tokensApi.getOne(id),
    enabled: !!id,
  });
}
