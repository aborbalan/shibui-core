<script lang="ts">
  const PROFILE = {
    name:     'Alejandro Borbalán Dueñas',
    title:    'Programador Front-End · Especialista en Sistemas de Diseño',
    location: 'Zaragoza, España',
    email:    'aborbalan.duenas@gmail.com',
    bio:      'Programador Front-End enfocado en la creación de interfaces de alto rendimiento y sistemas de diseño escalables. Creador de Lib-UI, librería de Web Components agnósticos construidos con Lit y TypeScript. Más allá del código, encuentro el equilibrio en las artes marciales y el running.',
    socials: [
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/alejandro-borbal%C3%A1n-due%C3%B1as-a20142167/' },
      { label: 'GitHub',   url: 'https://github.com/aborbalan' },
    ],
  };

  const EXPERIENCE = [
    { id:'exp-0001', role:'Programador Sénior',         company:'Nettrim Technology',   location:'Zaragoza, España',              startDate:'2021-11', endDate:null,      description:'Liderazgo técnico en proyectos complejos, aplicando arquitectura hexagonal para garantizar la escalabilidad y el desacoplamiento del dominio.',   tags:['Angular','React.js','TypeScript','RxJS','Arquitectura Hexagonal','Astro.js'], order:0 },
    { id:'exp-0002', role:'Programador',                company:'10Labs',               location:'Zaragoza, Aragón, España',       startDate:'2020-11', endDate:'2021-11', description:'Desarrollo de soluciones robustas y mantenibles utilizando TypeScript y ecosistemas modernos de JS.',                                            tags:['Angular','TypeScript','Express.js','Ionic'],                                 order:1 },
    { id:'exp-0003', role:'Desarrollador de Front-End', company:'Deloitte España',      location:'Zaragoza y alrededores, España', startDate:'2019-10', endDate:'2020-08', description:'Consultoría tecnológica para grandes clientes, enfocada en la calidad del código y rendimiento en el cliente.',                                      tags:['Angular','TypeScript','JavaScript'],                                         order:2 },
    { id:'exp-0004', role:'Aprendiz en Prácticas',      company:'YL-Verkot Oy',        location:'Tampere, Finlandia',             startDate:'2019-03', endDate:'2019-06', description:'Experiencia internacional trabajando con estándares web y aproximación inicial a Web Components.',                                                    tags:['JavaScript','Angular','Python','Express.js','Web Components'],               order:3 },
    { id:'exp-0005', role:'Programador',                company:'Indra',                location:'Zaragoza, España',              startDate:'2018-07', endDate:'2019-01', description:'',                                                                                                                                                      tags:['PL/1','Java'],                                                              order:4 },
    { id:'exp-0006', role:'Programador',                company:'Hiberus Tecnología',   location:'Zaragoza, España',              startDate:'2017-08', endDate:'2018-06', description:'',                                                                                                                                                      tags:['JavaScript','Angular'],                                                     order:5 },
  ];

  const SKILLS = [
    { category:'frontend',     label:'Front-End',   skills:[{id:'sk-01',name:'Angular',order:0},{id:'sk-02',name:'React',order:1},{id:'sk-03',name:'TypeScript',order:2},{id:'sk-04',name:'RxJS',order:3},{id:'sk-05',name:'Astro.js',order:4},{id:'sk-06',name:'Lit',order:5},{id:'sk-07',name:'CSS / OKLCH',order:6}] },
    { category:'architecture', label:'Arquitectura',skills:[{id:'sk-10',name:'Hexagonal Architecture',order:0},{id:'sk-11',name:'Atomic Design',order:1},{id:'sk-12',name:'Monorepo',order:2},{id:'sk-13',name:'Web Components',order:3}] },
    { category:'backend',      label:'Back-End',    skills:[{id:'sk-20',name:'Express.js',order:0},{id:'sk-21',name:'Node.js',order:1},{id:'sk-22',name:'Java',order:2},{id:'sk-23',name:'Python',order:3}] },
    { category:'expanding',    label:'Aprendiendo', skills:[{id:'sk-30',name:'Ionic',order:0},{id:'sk-31',name:'PL/1',order:1}] },
  ];

  const EDUCATION = [
    { id:'edu-0001', degree:'Grado Superior', field:'Desarrollo de Aplicaciones Multiplataforma (DAM)', institution:'IES Santiago Hernández', startYear:2018, endYear:2019, order:0 },
  ];

  const LANGUAGES = [
    { id:'lang-0001', name:'Español', level:'Nativo',      order:0 },
    { id:'lang-0002', name:'Inglés',  level:'Profesional', order:1 },
  ];

  const CATEGORY_VARIANT: Record<string,'default'|'accent'|'info'|'strong'|'warning'> = {
    frontend: 'accent', expanding: 'warning', backend: 'info', architecture: 'default', testing: 'strong',
  };
  const CATEGORY_KANJI: Record<string,string> = {
    frontend:'前', expanding:'拡', backend:'後', architecture:'構', testing:'試',
  };
  const LEVEL_VARIANT: Record<string,'default'|'accent'|'info'|'strong'> = {
    Nativo:'accent', Profesional:'info', Intermedio:'default', Básico:'strong',
  };

  function formatDate(ym: string): string {
    const [year, month] = ym.split('-');
    return new Date(Number(year), Number(month) - 1).toLocaleDateString('es-ES', { month:'short', year:'numeric' });
  }
  function formatDuration(start: string, end: string | null): string {
    const s = new Date(start.replace('-','/') + '/01');
    const e = end ? new Date(end.replace('-','/') + '/01') : new Date();
    const months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
    const y = Math.floor(months / 12), r = months % 12;
    return [y > 0 ? `${y} año${y>1?'s':''}` : '', r > 0 ? `${r} mes${r>1?'es':''}` : ''].filter(Boolean).join(' ');
  }
</script>

<div class="about-page">

  <!-- ── ProfileHero ─────────────────────────────────────────────────────── -->
  <section class="profile-hero">
    <div class="avatar-col">
      <div class="avatar-wrapper">
        <lib-avatar name={PROFILE.name} size="xl" shape="squircle" style="--lib-avatar-size:96px;"></lib-avatar>
        <div class="open-indicator"></div>
      </div>
      <div class="social-links">
        {#each PROFILE.socials as social}
          <lib-button variant="ghost" size="sm" onui-lib-click={() => window.open(social.url, '_blank')}>
            <span class="social-label">{social.label}</span>
          </lib-button>
        {/each}
      </div>
    </div>

    <div class="content-col">
      <div class="eyebrow-row">
        <lib-eyebrow tone="accent" size="sm">Perfil · About Me</lib-eyebrow>
        <lib-badge variant="success" dot>Open to Work</lib-badge>
      </div>

      <lib-display-heading tag="h1" size="md" surface="dark" line1={PROFILE.name} accent={PROFILE.title}></lib-display-heading>

      <div class="location">
        <span class="location-icon">⌖</span>
        <span class="location-text">{PROFILE.location}</span>
      </div>

      <p class="bio">{PROFILE.bio}</p>

      <a class="email-link" href="mailto:{PROFILE.email}">{PROFILE.email}</a>
    </div>
  </section>

  <lib-divider style-variant="hairline" style="margin:0;"></lib-divider>

  <!-- ── ExperienceSection ───────────────────────────────────────────────── -->
  <section class="exp-section">
    <div class="section-header">
      <lib-eyebrow tone="accent" size="sm" style="display:inline-flex;margin-bottom:var(--lib-space-md);">Experiencia · Work History</lib-eyebrow>
      <lib-display-heading tag="h2" size="sm" surface="dark" line1="Trayectoria" accent="profesional"></lib-display-heading>
    </div>

    <lib-timeline>
      {#each EXPERIENCE.sort((a,b) => a.order - b.order) as item}
        <lib-timeline-item status={item.endDate === null ? 'current' : 'done'}>
          <div class="tl-content">
            <div class="meta-row">
              <div>
                <p class="company-name">{item.company}</p>
                <h3 class="role">{item.role}</h3>
                <p class="loc">⌖ {item.location}</p>
              </div>
              <div class="dates-block">
                <p class="date-range">{formatDate(item.startDate)} — {item.endDate ? formatDate(item.endDate) : 'Actualidad'}</p>
                <p class="duration">{formatDuration(item.startDate, item.endDate)}</p>
              </div>
            </div>
            {#if item.description}
              <p class="description">{item.description}</p>
            {/if}
            {#if item.tags.length > 0}
              <div class="tags">
                {#each item.tags as tag}
                  <lib-badge variant="strong">{tag}</lib-badge>
                {/each}
              </div>
            {/if}
          </div>
        </lib-timeline-item>
      {/each}
    </lib-timeline>
  </section>

  <lib-divider style-variant="hairline" style="margin:0;"></lib-divider>

  <!-- ── SkillsSection ───────────────────────────────────────────────────── -->
  <section class="skills-section">
    <div class="section-header">
      <lib-eyebrow tone="accent" size="sm" style="display:inline-flex;margin-bottom:var(--lib-space-md);">Skills · Stack técnico</lib-eyebrow>
      <lib-display-heading tag="h2" size="sm" surface="dark" line1="Herramientas" accent="del oficio"></lib-display-heading>
    </div>

    <div class="skills-grid">
      {#each SKILLS as group}
        {@const variant = CATEGORY_VARIANT[group.category] ?? 'strong'}
        {@const kanji   = CATEGORY_KANJI[group.category]  ?? '技'}
        <div class="skill-group">
          <div class="group-header">
            <span class="group-kanji">{kanji}</span>
            <span class="group-label">{group.label}</span>
          </div>
          <div class="skill-badges">
            {#each [...group.skills].sort((a,b) => a.order - b.order) as skill}
              <lib-badge variant={variant}>{skill.name}</lib-badge>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </section>

  <lib-divider style-variant="hairline" style="margin:0;"></lib-divider>

  <!-- ── EducationSection ────────────────────────────────────────────────── -->
  <section class="edu-section">
    <!-- Educación -->
    <div class="edu-col">
      <lib-eyebrow tone="accent" size="sm" style="display:inline-flex;margin-bottom:1rem;">Educación · Formation</lib-eyebrow>
      <h2 class="edu-heading">Base <em>académica</em></h2>
      {#each EDUCATION.sort((a,b) => a.order - b.order) as edu}
        <div class="edu-item">
          <p class="edu-years">{edu.startYear} — {edu.endYear}</p>
          <h4 class="edu-degree">{edu.degree}</h4>
          <p class="edu-field">{edu.field}</p>
          <p class="edu-inst">{edu.institution}</p>
        </div>
      {/each}
    </div>

    <!-- Idiomas -->
    <div class="edu-col">
      <lib-eyebrow tone="accent" size="sm" style="display:inline-flex;margin-bottom:1rem;">Idiomas · Languages</lib-eyebrow>
      <h2 class="edu-heading">Comunicación <em>global</em></h2>
      {#each LANGUAGES.sort((a,b) => a.order - b.order) as lang}
        {@const v = LEVEL_VARIANT[lang.level] ?? 'strong'}
        <div class="lang-item">
          <span class="lang-name">{lang.name}</span>
          <lib-badge variant={v}>{lang.level}</lib-badge>
        </div>
      {/each}
    </div>
  </section>

</div>

<style>
  .about-page {
    max-width: 900px;
    margin: 0 auto;
    padding: clamp(1.5rem,5vw,5rem);
    padding-top: calc(80px + clamp(1.5rem,3vw,3rem));
  }

  /* ProfileHero */
  .profile-hero {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: clamp(2rem,4vw,4rem);
    align-items: start;
    padding: clamp(3rem,6vh,5rem) 0;
    border-bottom: 1px solid var(--border-subtle);
  }
  .avatar-col { display:flex; flex-direction:column; align-items:center; gap:1rem; }
  .avatar-wrapper { position:relative; }
  .open-indicator {
    position:absolute; bottom:-4px; right:-4px;
    width:18px; height:18px; border-radius:50%;
    background: var(--color-success);
    border: 2px solid var(--color-washi-950);
    box-shadow: 0 0 8px color-mix(in oklch, var(--color-success), transparent 40%);
  }
  .social-links { display:flex; gap:.5rem; }
  .social-label { font-family:var(--lib-font-mono); font-size:.6rem; letter-spacing:.16em; text-transform:uppercase; }
  .content-col { display:flex; flex-direction:column; gap:1.25rem; }
  .eyebrow-row { display:flex; align-items:center; gap:1rem; flex-wrap:wrap; }
  .location { display:flex; align-items:center; gap:.4rem; }
  .location-icon { color:var(--text-muted); font-size:.75rem; }
  .location-text { font-family:var(--lib-font-mono); font-size:.65rem; letter-spacing:.14em; color:var(--text-muted); text-transform:uppercase; }
  .bio { font-family:var(--lib-font-body); font-size:clamp(.875rem,1.4vw,1rem); color:var(--text-secondary); line-height:var(--leading-relaxed); max-width:600px; margin:0; }
  .email-link { font-family:var(--lib-font-mono); font-size:.72rem; letter-spacing:.1em; color:var(--text-link); text-decoration:none; align-self:flex-start; border-bottom:1px solid var(--border-default); padding-bottom:1px; transition:color .2s,border-color .2s; }
  .email-link:hover { color:var(--text-accent); border-color:var(--text-accent); }

  /* ExperienceSection */
  .exp-section { padding:clamp(2.5rem,5vh,4rem) 0; }
  .section-header { margin-bottom:var(--lib-space-2xl); }
  .tl-content { display:flex; flex-direction:column; gap:.75rem; padding-bottom:2rem; }
  .meta-row { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; flex-wrap:wrap; }
  .company-name { font-family:var(--lib-font-mono); font-size:.6rem; letter-spacing:.22em; text-transform:uppercase; color:color-mix(in oklch, var(--color-kaki-500), transparent 45%); margin:0 0 .2rem; }
  .role { font-family:var(--lib-font-display); font-size:clamp(1.1rem,2vw,1.5rem); font-weight:var(--weight-regular); letter-spacing:-.01em; color:var(--text-primary); margin:0; }
  .loc { font-family:var(--lib-font-mono); font-size:.6rem; letter-spacing:.12em; color:var(--text-muted); margin:.25rem 0 0; }
  .dates-block { text-align:right; flex-shrink:0; }
  .date-range { font-family:var(--lib-font-mono); font-size:.65rem; letter-spacing:.1em; color:var(--text-secondary); margin:0; }
  .duration { font-family:var(--lib-font-mono); font-size:.6rem; letter-spacing:.08em; color:var(--text-muted); margin:.2rem 0 0; }
  .description { font-family:var(--lib-font-body); font-size:.875rem; color:var(--text-secondary); line-height:var(--leading-relaxed); margin:0; max-width:560px; }
  .tags { display:flex; gap:.4rem; flex-wrap:wrap; }

  /* SkillsSection */
  .skills-section { padding:clamp(2.5rem,5vh,4rem) 0; }
  .skills-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:1px; background:var(--border-subtle); }
  .skill-group { background:var(--color-washi-950); padding:var(--lib-space-lg) var(--lib-space-xl); display:flex; flex-direction:column; gap:var(--lib-space-md); }
  .group-header { display:flex; align-items:center; gap:var(--lib-space-md); }
  .group-kanji { font-family:var(--lib-font-display); font-size:1.8rem; font-weight:var(--weight-light); color:color-mix(in oklch, var(--color-kaki-500), transparent 75%); line-height:1; flex-shrink:0; }
  .group-label { font-family:var(--lib-font-mono); font-size:.6rem; letter-spacing:.22em; text-transform:uppercase; color:color-mix(in oklch, var(--color-kaki-500), transparent 50%); }
  .skill-badges { display:flex; gap:.4rem; flex-wrap:wrap; }

  /* EducationSection */
  .edu-section { padding:clamp(2.5rem,5vh,4rem) 0; display:grid; grid-template-columns:1fr 1fr; gap:clamp(2rem,5vw,4rem); }
  .edu-col { display:flex; flex-direction:column; gap:1.75rem; }
  .edu-heading { font-family:var(--lib-font-display); font-size:clamp(1.6rem,3vw,2.4rem); font-weight:var(--weight-light); letter-spacing:-.02em; line-height:1.15; color:var(--text-primary); margin:0; }
  .edu-heading em { font-style:italic; color:var(--color-kaki-400); }
  .edu-item { display:flex; flex-direction:column; gap:.35rem; padding-left:1rem; border-left:1px solid color-mix(in oklch, var(--color-kaki-500), transparent 75%); }
  .edu-years { font-family:var(--lib-font-mono); font-size:.6rem; letter-spacing:.18em; text-transform:uppercase; color:color-mix(in oklch, var(--color-kaki-500), transparent 50%); margin:0; }
  .edu-degree { font-family:var(--lib-font-display); font-size:1.15rem; font-weight:var(--weight-regular); color:var(--text-primary); margin:0; letter-spacing:-.01em; }
  .edu-field { font-family:var(--lib-font-body); font-size:.82rem; color:var(--text-secondary); line-height:1.6; margin:0; }
  .edu-inst { font-family:var(--lib-font-mono); font-size:.6rem; letter-spacing:.12em; color:var(--text-muted); margin:0; }
  .lang-item { display:flex; align-items:center; justify-content:space-between; padding:.75rem 1rem; background:color-mix(in oklch, var(--text-primary), transparent 98%); border:1px solid var(--border-subtle); }
  .lang-name { font-family:var(--lib-font-display); font-size:1.1rem; font-weight:var(--weight-light); color:var(--text-secondary); letter-spacing:-.01em; }
</style>
