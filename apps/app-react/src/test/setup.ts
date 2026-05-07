import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./mocks/about/server";

// Arranca el servidor MSW antes de todos los tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

// Limpia los handlers después de cada test para evitar contaminación
afterEach(() => server.resetHandlers());

// Cierra el servidor al terminar
afterAll(() => server.close());
