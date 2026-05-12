import { useQuery } from "@tanstack/react-query";
import { aboutApi } from "../api/about.api";
import { queryKeys } from "../../../query-keys";

/**
 * Devuelve el payload completo: profile + experience + skills + education + languages.
 * Útil cuando necesitas todo a la vez (ej: página de perfil completo).
 */
export function useAbout() {
  return useQuery({
    queryKey: queryKeys.about.all,
    queryFn: aboutApi.getAll,
  });
}

/**
 * Solo datos de perfil personal.
 * Úsalo cuando la página solo necesita nombre, bio, email y redes.
 */
export function useProfile() {
  return useQuery({
    queryKey: queryKeys.about.profile,
    queryFn: aboutApi.getProfile,
  });
}

/**
 * Historial de experiencia laboral ordenado por recencia.
 */
export function useExperience() {
  return useQuery({
    queryKey: queryKeys.about.experience,
    queryFn: aboutApi.getExperience,
  });
}

/**
 * Skills agrupados por categoría (frontend, backend, architecture…).
 */
export function useSkills() {
  return useQuery({
    queryKey: queryKeys.about.skills,
    queryFn: aboutApi.getSkills,
  });
}

/**
 * Historial educativo ordenado por recencia.
 */
export function useEducation() {
  return useQuery({
    queryKey: queryKeys.about.education,
    queryFn: aboutApi.getEducation,
  });
}

/**
 * Idiomas con su nivel (Nativo, Profesional, etc.).
 */
export function useLanguages() {
  return useQuery({
    queryKey: queryKeys.about.languages,
    queryFn: aboutApi.getLanguages,
  });
}
