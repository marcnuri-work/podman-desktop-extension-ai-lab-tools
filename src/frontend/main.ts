import { mount } from 'svelte';
import App from 'podman-desktop-extension-ai-lab-frontend/src/App.svelte';
import './styles/tailwind.css';

const target = document.getElementById('app');

let app;
if (target) {
  app = mount(App, { target });
}
export default app;
