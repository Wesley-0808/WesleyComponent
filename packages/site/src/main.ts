import { createApp } from 'vue';
import Wc from '@wesley/components';
import TDesign from 'tdesign-vue-next';
import App from './App.vue';
import router from './router';

// import Stackblitz from './components/stackblitz/index.vue';
// import CodeSandbox from './components/codeSandbox/index.vue';
// import NewWindow from './components/newWindow/index.vue';
import BaseUsage from './components/base-usage.vue';

// import tdesign style
// import '@tdesign/components/style/index.js';
// import '@tdesign/common/style/web/docs.less';
import './main.less';
import 'tdesign-vue-next/es/style/index.css';

// import site webComponents
import '@tdesign/site-components';
import '@tdesign/site-components/lib/styles/style.css';
import '@tdesign/site-components/lib/styles/prism-theme.less';
import '@tdesign/site-components/lib/styles/prism-theme-dark.less';

// @ts-ignore
import { registerLocaleChange } from '@tdesign/site-components';

registerLocaleChange();

const app = createApp(App);

app.component('BaseUsage', BaseUsage);

app.use(TDesign).use(Wc).use(router).mount('#app');
