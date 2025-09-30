import { render } from 'preact';
import { App } from './App.jsx';
import './styles/index.scss';
import { initializePWA } from './features/shared/utils/serviceWorker.js';
import './features/i18n/index.js';

// Renderizar aplicação
render(<App />, document.getElementById('app'));

// Inicializar PWA
initializePWA().then(() => {
  // console.log('PWA inicializado com sucesso');
}).catch((_error) => {
  // console.error('Erro ao inicializar PWA:', error);
});
