import { App } from 'vue';
import * as components from './components';

export function install(app: App, config?: Record<string, unknown>): void {
  Object.keys(components).forEach((key) => {
    if (/directive/i.test(key)) return;
    // @ts-ignore
    /plugin/i.test(key) ? app.use(components[key]) : app.use(components[key], config);
  });
}

export * from './components';
export default {
  install,
  version: '', // eslint-disable-line
};
