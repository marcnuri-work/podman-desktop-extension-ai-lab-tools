import { mount } from 'svelte';
import App from '/@/App.svelte';
import './styles/tailwind.css';

const target = document.getElementById('app');

let app: { $set?: any; $on?: any };
if (target) {
  app = mount(App, { target });
}
export default app;
