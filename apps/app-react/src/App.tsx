import MainLayout from './components/layout/MainLayout';
import ProfileSection from './components/organisms/ProfileSection';
import ProjectGallery from './components/layout/ProjectGallery';
import { useEffect, useRef, useState } from 'react';

function App() {


  /**
   *CAMBIAR POR COMPONENTE BACKGROUND
   * @param canvas 
   * @param wrap 
   * @returns 
   */
   const initConstellation = (canvas: HTMLCanvasElement, wrap: HTMLElement) => {

    interface StarPoint {
      x: number;
      y: number;
      r: number;
      a: number;
      pa: number;
      ps: number;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    let w: number, h: number;
    let pts: StarPoint[] = [];
    let animationFrameId: number;
  
    const resize = () => {
      // Usamos window para asegurar que pillamos el viewport real
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      
      pts = [];
      // Densidad: 1 punto cada 15000px cuadrados 
      const count = Math.floor((w * h) / 15000); 
      
      for (let i = 0; i < count; i++) {
        pts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.5 + 0.5, // Radio de la estrella 
          a: Math.random() * 0.5 + 0.2, // Opacidad base 
          pa: Math.random() * Math.PI,  // Fase de parpadeo 
          ps: Math.random() * 0.02 + 0.005 // Velocidad de parpadeo 
        });
      }
      console.log(`Canvas inicializado: ${w}x${h}, Estrellas creadas: ${pts.length}`);
    };
  
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
  
      // 1. Dibujar Líneas (Conexiones) 
      ctx.lineWidth = 0.5;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
  
          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.15;
            // Forzamos el color 'washi-300' (D3C8BC) 
            ctx.strokeStyle = `rgba(211, 200, 188, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
  
      // 2. Dibujar Estrellas 
      pts.forEach(s => {
        s.pa += s.ps;
        const pulse = Math.sin(s.pa) * 0.3 + 0.7; // Efecto de latido 
        
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * pulse, 0, Math.PI * 2);
        // Aplicamos el color washi-300 con el pulso 
        ctx.fillStyle = `rgba(211, 200, 188, ${s.a * pulse})`;
        ctx.fill();
  
        // Brillo extra para estrellas potentes 
        if (s.a > 0.4) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3 * pulse, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(211, 200, 188, ${s.a * 0.06 * pulse})`;
          ctx.fill();
        }
      });
  
      animationFrameId = requestAnimationFrame(draw);
    };
  
    resize();
    draw();
  
    const ro = new ResizeObserver(() => resize());
    ro.observe(wrap);
  
    return () => {
      cancelAnimationFrame(animationFrameId);
      ro.disconnect();
    };
  };


  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [currentSection, setCurrentSection] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return ['perfil', 'experiencia', 'proyectos'].includes(hash) ? hash : 'perfil';
  });

  useEffect(() => {
    if (canvasRef.current && wrapperRef.current) {
      // Aquí llamaremos a la lógica de inicialización del archivo que pasaste
      initConstellation(canvasRef.current, wrapperRef.current);
    }
  }, []);

  useEffect(() => {
    if (canvasRef.current && wrapperRef.current) {
      const cleanup = initConstellation(canvasRef.current, wrapperRef.current);
      return cleanup; // React llamará a esto al desmontar el componente
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['perfil', 'experiencia', 'proyectos'].includes(hash)) {
        setCurrentSection(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Función para cambiar de sección y actualizar la URL
  const navigateTo = (section: string) => {
    window.location.hash = section;
    setCurrentSection(section);
  };



  return (

    <div id="wrap-const-full" ref={wrapperRef} style={{
      position: 'relative',
      minHeight: '100vh',
      backgroundColor: '#120E0A' // El color base 'washi-950' del CSS
    }}>

      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <MainLayout onOpenCV={() => setShowCVOptions(true)} activeTab={currentSection} onTabChange={navigateTo}>
          {/* Bloque 1: Perfil profesional (LinkedIn Style) */}
          {currentSection === 'perfil' && <ProfileSection />}
          {currentSection === 'proyectos' && <ProjectGallery />}
          {currentSection === 'experiencia' && <div style={{ padding: '2rem' }}>Sección Experiencia</div>}
        </MainLayout>
      </div>

    </div>

  );
}

export default App;