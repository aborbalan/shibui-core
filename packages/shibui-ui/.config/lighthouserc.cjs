module.exports = {
    ci: {
      collect: {
        // 1. Asegúrate de que esta ruta coincida con la carpeta de salida de tu storybook build
        url: ['https://lib-ui-b67c5.web.app/iframe.html?id=atoms-button--primary'],
        numberOfRuns: 1, // Bajamos a 1 para debuguear rápido
      },
      assert: {
        assertions: {
          'categories:performance': ['error', { minScore: 0.95 }],
          'categories:accessibility': ['error', { minScore: 1.0 }],
        },
      },
      upload: {
        target: 'temporary-public-storage', 
      },
    },
  };