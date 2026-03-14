# Agent Rules — Shibui UI

Reglas de comportamiento para agentes de IA trabajando en este proyecto.
Este fichero complementa `CLAUDE.md` (arquitectura y convenciones) y `CONTRIBUTING.md` (flujo de trabajo).

---

## Reglas de sesión

### Componentes nuevos
- Seguir siempre la estructura de 5 ficheros: `index.ts`, `.component.ts`, `.html.ts`, `.css`, `.stories.ts`
- Proponer siempre la Storybook story junto al componente, nunca por separado
- Usar tokens `--lib-*` para todos los valores visuales — nunca hardcodear colores ni espaciados
- Los tipos siempre desde `src/models/`, nunca definirlos inline
- Los efectos glass y spotlight son opcionales — no añadirlos salvo que se pida explícitamente

### Componentes existentes
- Pedir el fichero del componente antes de proponer cualquier cambio
- No proponer cambios sobre código que no se ha visto en la sesión actual

### Convenciones
- Si hay duda sobre convenciones de nombre, estructura o comportamiento — preguntar antes de asumir
- No instalar dependencias externas sin consulta explícita (regla de oro del proyecto)

---

## Cierre de tarea

Al finalizar cualquier componente o feature, ofrecer siempre los comandos de git con un mensaje de commit siguiendo Conventional Commits:

```bash
# Ejemplo de cierre
git add .
git commit -m "feat(lib-[nombre]): <descripción en imperativo>"
git push origin feature/lib-[nombre]
git checkout develop
git merge --no-ff feature/lib-[nombre]
git push origin develop
```

---

## Lo que el agente nunca debe hacer sin confirmación explícita

- Modificar `tokens.css` o cualquier fichero de estilos compartidos
- Modificar `vite.config.ts` o `tsconfig.json`
- Tocar ficheros de configuración en `.config/`
- Mergear o proponer cambios sobre `main`
- Crear una rama nueva sin que se haya cerrado la anterior
- Añadir una dependencia externa al `package.json`