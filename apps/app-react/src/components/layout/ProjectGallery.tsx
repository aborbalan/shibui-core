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
    if (filter === 'All') return projectsData;
    return projectsData.filter(p => p.stack.includes(filter));
  }, [filter]);

  return (
      <header style={{ marginBottom: '2.5rem' }}>
        <lib-typography variant="h2" weight="bold">Proyectos Técnicos</lib-typography>
        <lib-typography variant="body" color="secondary">
          Una selección de arquitecturas, librerías y herramientas desarrolladas con enfoque agnóstico.
        </lib-typography>
      </header>
  );
};

export default ProjectGallery;