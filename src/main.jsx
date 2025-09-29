import { render } from 'preact';
import { App } from './App.jsx';
import './styles/index.scss';
import { initializePWA } from './utils/serviceWorker.js';
import './i18n/index.js';

// Renderizar aplicação
render(<App />, document.getElementById('app'));

// Inicializar PWA
initializePWA().then(() => {
  console.log('PWA inicializado com sucesso');
}).catch((error) => {
  console.error('Erro ao inicializar PWA:', error);
});
