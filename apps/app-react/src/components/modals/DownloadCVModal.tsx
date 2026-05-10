// apps/app-react/src/components/modals/DownloadCVModal.tsx
import { LibButton, LibCheckbox, LibModal } from '@shibui-ui/ui/react';
import React, { useState } from 'react';

interface DownloadCVModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DownloadCVModal: React.FC<DownloadCVModalProps> = ({ isOpen, onClose }) => {

    const [selectedLangs, setSelectedLangs] = useState({ es: false, en: false });


    if (!isOpen) return null;

    return (
        <LibModal
            heading="Elige idioma"
            open
            _animate="scale"
            variant="default"
            onUiLibModalClose={onClose}
        >
            <div className="cv-options">
                <h3>Opciones de Currículum</h3>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px', // Ajusta este valor para más o menos separación
                    padding: '1rem 0'
                }}>
                    <LibCheckbox label="Español" checked={selectedLangs.es} onChange={(event: CustomEvent) => setSelectedLangs({ ...selectedLangs, es: event.detail.checked })}></LibCheckbox>
                    <LibCheckbox label="Ingles" checked={selectedLangs.en} onChange={(event: CustomEvent) => setSelectedLangs({ ...selectedLangs, en: event.detail.checked })}></LibCheckbox>
                </div>

                {/* Contenido del modal */}
            </div>
            <div slot="footer" style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
                width: '100%',
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <LibButton
                    variant="ghost"
                    onUiLibClick={onClose}
                >
                    Cancelar
                </LibButton>

                <LibButton
                    variant="primary"
                    disabled={!selectedLangs.es && !selectedLangs.en}
                    onUiLibClick={() => {
                        console.log("Acción: Confirmar descarga de CV");

                        const selected = Object.entries(selectedLangs)
                            .filter(([, checked]) => checked)
                            .map(([lang]) => lang === 'en' ? '/cv-alejandro-borbalan-en.pdf' : '/cv-alejandro-borbalan.pdf');

                        const downloadOneByOne = (urls: string[]) => {
                            urls.forEach((url, index) => {
                                // Creamos un delay creciente para cada archivo
                                setTimeout(() => {
                                    const link = document.createElement('a');
                                    link.href = url;
                                    // Forzamos el nombre para que el SO no se confunda
                                    link.download = url.split('/').pop() || 'cv.pdf';
                                    link.style.display = 'none';
                                    document.body.appendChild(link);
                                    link.click();

                                    // Limpiamos el DOM justo después
                                    setTimeout(() => {
                                        document.body.removeChild(link);
                                    }, 100);
                                }, index * 800); // 800ms es el "sweet spot" para que Chrome no bloquee
                            });
                        };
                        // Aquí dispararías la lógica de descarga
                        downloadOneByOne(selected);
                        setSelectedLangs({ en: false, es: false })
                        onClose(); // Cerramos tras confirmar
                    }}
                >
                    Confirmar
                </LibButton>
            </div>
        </LibModal>
    );
};