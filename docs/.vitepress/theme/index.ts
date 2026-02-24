import DefaultTheme from 'vitepress/theme';
import './custom.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // AsterPlayground is loaded dynamically in the playground page
    // to avoid SSR issues with CodeMirror
  },
};
