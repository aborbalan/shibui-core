import meData from '../../../data/me.json';
import experienceData from '../../../data/experience.json';

const ProfileSection = () => {
  return (
    <lib-stack gap="2.5rem">
      {/* CARD PRINCIPAL: Estilo LinkedIn Hero */}
      <lib-card padding="none" shadow="lg" border>
        {/* Banner decorativo con OKLCH */}
        <div style={{ 
          height: '160px', 
          background: 'linear-gradient(135deg, oklch(80% 0.1 250), oklch(65% 0.15 250))',
          borderRadius: '8px 8px 0 0' 
        }}></div>
        
        <div style={{ padding: '0 2rem 2rem 2rem', marginTop: '-60px' }}>
          <lib-grid columns="auto 1fr" gap="2rem" align="end">
            {/* Avatar con borde dinámico */}
            <lib-avatar 
  src={meData.image} 
  size="xl" 
  border 
  style={{ 
    '--lib-avatar-border-color': 'white', 
    '--lib-avatar-size': '150px' 
  } as React.CSSProperties}
></lib-avatar>
            
            <div style={{ paddingBottom: '1rem' }}>
              <lib-typography variant="h2" weight="bold">{meData.name}</lib-typography>
              <lib-typography variant="body-lg" color="secondary">{meData.label}</lib-typography>
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <lib-typography variant="caption" color="tertiary">
                  {meData.location.city}, {meData.location.country}
                </lib-typography>
                <lib-badge variant="success" text="Open to Work" size="sm"></lib-badge>
              </div>
            </div>
          </lib-grid>
        </div>
      </lib-card>

      {/* SECCIÓN SOBRE MÍ */}
      <lib-card padding="xl" border>
        <lib-typography variant="h4" margin-bottom="m">Acerca de</lib-typography>
        <lib-typography variant="body">
          {meData.about.professional}
        </lib-typography>
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {meData.interests.map(interest => (
            <lib-tag key={interest} variant="flat" size="sm">{interest}</lib-tag>
          ))}
        </div>
      </lib-card>

      {/* SECCIÓN EXPERIENCIA (Timeline) */}
      <section>
        <lib-typography variant="h4" margin-bottom="l" style={{ paddingLeft: '1rem' }}>Experiencia</lib-typography>
        <lib-stack gap="1rem">
          {experienceData.map(() => (
            <span></span>
          ))}
        </lib-stack>
      </section>
    </lib-stack>
  );
};

export default ProfileSection;