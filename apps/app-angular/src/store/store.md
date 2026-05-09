# 📂 Directorio: /store (Estado Global - NgRx)

Este directorio centraliza la gestión del estado complejo y reactivo de la aplicación utilizando el patrón **Redux**. Es el almacén de datos global que permite que diferentes partes de la app reaccionen a cambios de información de forma predecible.

---

## ⚡ Responsabilidades
La carpeta `/store` gestiona el flujo de datos unidireccional:

- **Actions:** Definición de los eventos únicos que pueden ocurrir (ej. `[Login] User Clicked Login`).
- **Reducers:** Funciones puras que especifican cómo cambia el estado de la aplicación en respuesta a una acción.
- **Selectors:** Funciones para consultar y transformar partes específicas del estado de forma eficiente y reactiva.
- **Effects:** Manejo de efectos secundarios, principalmente peticiones asíncronas a APIs, que ocurren tras disparar una acción.
- **State Models:** Definición de la estructura de los objetos que se guardan en el almacén.

## 🧱 Estructura Sugerida
Se recomienda organizar la carpeta por "features" o dominios de datos:

```text
/store
├── auth/                 # Estado de autenticación
│   ├── auth.actions.ts
│   ├── auth.reducer.ts
│   ├── auth.selectors.ts
│   └── auth.effects.ts
├── products/             # Estado de catálogo, carrito, etc.
└── app.state.ts          # Definición del Global State (Root)