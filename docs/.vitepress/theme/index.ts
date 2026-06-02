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
  enhanceApp(_ctx) {
    // HeroAnimation is no longer globally registered. It used to back
    // an inline `<HeroAnimation />` tag in the (now-removed) API
    // reference page. The animation still ships via
    // <HeroAnimationTeaser /> on the landing page only — that wrapper
    // imports HeroAnimation directly, no global registration needed.
    //
    // AsterPlayground is loaded dynamically in the playground page
    // to avoid SSR issues with CodeMirror.
  },
};
