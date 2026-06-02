import DefaultTheme from 'vitepress/theme';
import CustomLayout from './CustomLayout.vue';
import HeroAnimation from '../components/HeroAnimation.vue';
// Aster brand layer must load BEFORE custom.css so VitePress's
// --vp-c-brand-* variables are already overridden when any custom
// rule references them. See ./aster-brand.css for the remap details.
import './aster-brand.css';
import './custom.css';

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
  enhanceApp({ app }) {
    // Register HeroAnimation globally so the REST API reference page
    // (docs/api/policies/evaluate.md) can embed it inline. The
    // animation's three cards (Policy / Workflow / Decision) match the
    // page's subject matter, giving the doc a visual hook on first
    // paint without forcing it into the landing hero.
    app.component('HeroAnimation', HeroAnimation);

    // AsterPlayground is loaded dynamically in the playground page
    // to avoid SSR issues with CodeMirror
  },
};
