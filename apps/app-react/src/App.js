import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import MainLayout from "./components/layout/MainLayout";
import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { KitchenSink } from "./components/shared/KitchenSink";
import { HomePage } from "./components/main/home";
import { ComponentsPage } from "./components/main/components";
import { ICON_REGISTRY } from "@shibui/ui";
console.log(ICON_REGISTRY);

function App() {
  const wrapperRef = useRef(null);
  const [currentSection, setCurrentSection] = useState(() => {
    const hash = window.location.hash.replace("#", "");
    return ["perfil", "experiencia", "proyectos"].includes(hash)
      ? hash
      : "perfil";
  });
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (["perfil", "experiencia", "proyectos"].includes(hash)) {
        setCurrentSection(hash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);
  // Función para cambiar de sección y actualizar la URL
  const navigateTo = (section) => {
    window.location.hash = section;
    setCurrentSection(section);
  };
  return _jsx("div", {
    id: "wrap-const-full",
    ref: wrapperRef,
    style: {
      width: "100%",
      minHeight: "100vh",
    },
    children: _jsx(BrowserRouter, {
      children: _jsxs(Routes, {
        children: [
          _jsx(Route, {
            path: "/dev-kitchen-sink",
            element: _jsx(KitchenSink, {}),
          }),
          _jsx(Route, { path: "/home", element: _jsx(HomePage, {}) }),
          _jsx(Route, { path: "/about-me", element: _jsx(HomePage, {}) }),
          _jsx(Route, {
            path: "/components",
            element: _jsx(ComponentsPage, {}),
          }),
          _jsx(Route, {
            path: "/",
            element: _jsx(MainLayout, {
              activeTab: currentSection,
              onTabChange: navigateTo,
            }),
          }),
        ],
      }),
    }),
  });
}
export default App;
