// To override, set VITE_API_URL via Angular's define build option in angular.json
declare const __API_URL__: string;

export const environment = {
  apiUrl: (typeof __API_URL__ !== 'undefined' ? __API_URL__ : null) ?? 'http://localhost:3000',
};
