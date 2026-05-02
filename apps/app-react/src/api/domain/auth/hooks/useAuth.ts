import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi, type LoginPayload } from "../api/auth.api";
import { queryKeys } from "../../../query-keys";

// ─── useMe ────────────────────────────────────────────────────────────────────
/** Devuelve el perfil del usuario autenticado. Solo activo si hay token. */
export function useMe() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: authApi.me,
    // No ejecutar si no hay token en sesión
    enabled: !!sessionStorage.getItem("admin_auth_token"),
  });
}

// ─── useLogin ─────────────────────────────────────────────────────────────────
export function useLogin() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: () => {
      // Refrescar perfil tras login
      void qc.invalidateQueries({ queryKey: queryKeys.auth.all });
      navigate("/admin");
    },
  });
}

// ─── useLogout ────────────────────────────────────────────────────────────────
export function useLogout() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      // Limpiar toda la cache al cerrar sesión
      qc.clear();
      navigate("/");
    },
  });
}
