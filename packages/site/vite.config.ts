// import { joinComponentsRoot, joinPosix, joinTdesignVueNextRoot } from '@tdesign/internal-utils';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

import { VitePWA } from 'vite-plugin-pwa';
import pwaConfig from './configs/pwa';

import tdDocToVue from './plugins/td-doc-to-vue';

import { existsSync } from 'node:fs';
import { posix, dirname, win32 } from 'node:path';

const normalizePathRegExp = new RegExp(`\\${win32.sep}`, 'g');

/**
 *@description 归一化路径,将 windows 风格的路径转换为 posix 风格的路径
 */
const toPosixPath = (filename: string) => filename.replace(normalizePathRegExp, posix.sep);

/**
 *@description POSIX 风格的路径拼接
 */
const joinPosix = (...paths: string[]) => toPosixPath(posix.join(...paths));

const getWorkspaceRoot = () => {
  let dir = process.cwd();
  while (dir !== '/') {
    if (existsSync(`${dir}/pnpm-workspace.yaml`)) {
      return toPosixPath(dir);
    }
    dir = dirname(dir);
  }
  throw new Error('Could not find workspace root');
};

const getPackagesRoot = () => {
  return joinPosix(getWorkspaceRoot(), 'packages');
};

const getComponentsRoot = () => {
  return joinPosix(getPackagesRoot(), 'components');
};

const joinComponentsRoot = (...paths: string[]) => {
  return joinPosix(getComponentsRoot(), ...paths);
};

const getStylesRoot = () => {
  return joinPosix(getPackagesRoot(), 'styles');
};

const joinStylesRoot = (...paths: string[]) => {
  return joinPosix(getStylesRoot(), ...paths);
};

// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));

const publicPathMap: Record<string, string> = {
  preview: '/',
  production: '/vue-next/',
};

export default defineConfig(({ mode }) => {
  return {
    base: publicPathMap[mode],
    server: {
      port: 15488,
      host: '0.0.0.0',
      open: true,
    },
    resolve: {
      alias: {
        '@': joinPosix(__dirname, './'),
        // '@tdesign/vue-next': joinTdesignVueNextRoot(),
        '@wesley/components': joinComponentsRoot(),
        '@wesley/styles': joinStylesRoot(),
        // 'tdesign-vue-next/es': joinComponentsRoot(),
        // 'tdesign-vue-next': joinComponentsRoot(),
      },
    },
    plugins: [vue(), vueJsx(), tdDocToVue(), VitePWA(pwaConfig)],
  };
});
