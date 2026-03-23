import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import projectsData from '../../data/projects.json';
const ProjectGallery = () => {
    const [filter, setFilter] = useState('All');
    const allTechnologies = useMemo(() => {
        const techs = projectsData.flatMap(p => p.stack);
        return ['All', ...Array.from(new Set(techs))];
    }, []);
    // Filtramos la lista según la selección
    const filteredProjects = useMemo(() => {
        if (filter === 'All')
            return projectsData;
        return projectsData.filter(p => p.stack.includes(filter));
    }, [filter]);
    return (_jsxs("header", { style: { marginBottom: '2.5rem' }, children: [_jsx("lib-typography", { variant: "h2", weight: "bold", children: "Proyectos T\u00E9cnicos" }), _jsx("lib-typography", { variant: "body", color: "secondary", children: "Una selecci\u00F3n de arquitecturas, librer\u00EDas y herramientas desarrolladas con enfoque agn\u00F3stico." })] }));
};
export default ProjectGallery;
