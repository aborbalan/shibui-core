import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// apps/app-react/src/components/modals/DownloadCVModal.tsx
import { LibButton, LibCheckbox, LibModal } from '@shibui/ui/react';
import { useState } from 'react';
export const DownloadCVModal = ({ isOpen, onClose }) => {
    const [selectedLangs, setSelectedLangs] = useState({ es: false, en: false });
    if (!isOpen)
        return null;
    return (_jsxs(LibModal, { heading: "Elige idioma", open: true, _animate: "scale", variant: "default", onUiLibModalClose: onClose, children: [_jsxs("div", { className: "cv-options", children: [_jsx("h3", { children: "Opciones de Curr\u00EDculum" }), _jsxs("div", { style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px', // Ajusta este valor para más o menos separación
                            padding: '1rem 0'
                        }, children: [_jsx(LibCheckbox, { label: "Espa\u00F1ol", checked: selectedLangs.es, onChange: (event) => setSelectedLangs({ ...selectedLangs, es: event.detail.checked }) }), _jsx(LibCheckbox, { label: "Ingles", checked: selectedLangs.en, onChange: (event) => setSelectedLangs({ ...selectedLangs, en: event.detail.checked }) })] })] }), _jsxs("div", { slot: "footer", style: {
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'flex-end',
                    width: '100%',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }, children: [_jsx(LibButton, { variant: "ghost", onUiLibClick: onClose, children: "Cancelar" }), _jsx(LibButton, { variant: "primary", disabled: !selectedLangs.es && !selectedLangs.en, onUiLibClick: () => {
                            console.log("Acción: Confirmar descarga de CV");
                            const selected = Object.entries(selectedLangs)
                                .filter(([, checked]) => checked)
                                .map(([lang]) => lang === 'en' ? '/cv-alejandro-borbalan-en.pdf' : '/cv-alejandro-borbalan.pdf');
                            const downloadOneByOne = (urls) => {
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
                            setSelectedLangs({ en: false, es: false });
                            onClose(); // Cerramos tras confirmar
                        }, children: "Confirmar" })] })] }));
};
