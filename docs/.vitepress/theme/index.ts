import DefaultTheme from 'vitepress/theme';
import CustomLayout from './CustomLayout.vue';
// Aster brand layer must load BEFORE custom.css so VitePress's
// --vp-c-brand-* variables are already overridden when any custom
// rule references them. See ./aster-brand.css for the remap details.
import './aster-brand.css';
import './custom.css';

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
  enhanceApp({ app }) {
    // AsterPlayground is loaded dynamically in the playground page
    // to avoid SSR issues with CodeMirror
  },
};
