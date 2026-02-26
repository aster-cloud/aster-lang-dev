import DefaultTheme from 'vitepress/theme';
import CustomLayout from './CustomLayout.vue';
import './custom.css';

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
  enhanceApp({ app }) {
    // AsterPlayground is loaded dynamically in the playground page
    // to avoid SSR issues with CodeMirror
  },
};
