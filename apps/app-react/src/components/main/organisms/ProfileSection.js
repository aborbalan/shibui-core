import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import meData from '../../../data/me.json';
import experienceData from '../../../data/experience.json';
const ProfileSection = () => {
    return (_jsxs("lib-stack", { gap: "2.5rem", children: [_jsxs("lib-card", { padding: "none", shadow: "lg", border: true, children: [_jsx("div", { style: {
                            height: '160px',
                            background: 'linear-gradient(135deg, oklch(80% 0.1 250), oklch(65% 0.15 250))',
                            borderRadius: '8px 8px 0 0'
                        } }), _jsx("div", { style: { padding: '0 2rem 2rem 2rem', marginTop: '-60px' }, children: _jsxs("lib-grid", { columns: "auto 1fr", gap: "2rem", align: "end", children: [_jsx("lib-avatar", { src: meData.image, size: "xl", border: true, style: {
                                        '--lib-avatar-border-color': 'white',
                                        '--lib-avatar-size': '150px'
                                    } }), _jsxs("div", { style: { paddingBottom: '1rem' }, children: [_jsx("lib-typography", { variant: "h2", weight: "bold", children: meData.name }), _jsx("lib-typography", { variant: "body-lg", color: "secondary", children: meData.label }), _jsxs("div", { style: { marginTop: '0.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }, children: [_jsxs("lib-typography", { variant: "caption", color: "tertiary", children: [meData.location.city, ", ", meData.location.country] }), _jsx("lib-badge", { variant: "success", text: "Open to Work", size: "sm" })] })] })] }) })] }), _jsxs("lib-card", { padding: "xl", border: true, children: [_jsx("lib-typography", { variant: "h4", "margin-bottom": "m", children: "Acerca de" }), _jsx("lib-typography", { variant: "body", children: meData.about.professional }), _jsx("div", { style: { marginTop: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }, children: meData.interests.map(interest => (_jsx("lib-tag", { variant: "flat", size: "sm", children: interest }, interest))) })] }), _jsxs("section", { children: [_jsx("lib-typography", { variant: "h4", "margin-bottom": "l", style: { paddingLeft: '1rem' }, children: "Experiencia" }), _jsx("lib-stack", { gap: "1rem", children: experienceData.map(() => (_jsx("span", {}))) })] })] }));
};
export default ProfileSection;
