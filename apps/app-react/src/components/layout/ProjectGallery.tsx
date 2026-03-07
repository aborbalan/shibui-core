import projectsData from '../../data/projects.json';

const ProjectGallery = () => {
  return (
    <section id="projects">
      <lib-typography variant="h3" margin-bottom="xl">Proyectos Destacados</lib-typography>
      
      <lib-grid columns="1" tablet-columns="2" gap="1.5rem">
        {projectsData.map((project) => (
          <lib-card key={project.id} hoverable border>
            <lib-stack gap="1rem">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <lib-typography variant="h5" weight="bold">{project.title}</lib-typography>
                <lib-badge variant="info" text={project.category}></lib-badge>
              </div>
              
              <lib-typography variant="body-sm">{project.description}</lib-typography>
              
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {project.stack.map(tech => (
                  <lib-tag key={tech} size="sm" variant="outline">{tech}</lib-tag>
                ))}
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                <lib-button variant="ghost" size="xs">Saber más</lib-button>
              </div>
            </lib-stack>
          </lib-card>
        ))}
      </lib-grid>
    </section>
  );
};

export default ProjectGallery;