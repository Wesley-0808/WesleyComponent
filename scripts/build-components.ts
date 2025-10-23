import { glob } from 'glob';
// @ts-ignore
import fs from 'fs-extra';

import { rollup, Plugin } from 'rollup';
import url from '@rollup/plugin-url';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import vuePlugin from 'rollup-plugin-vue';
import styles from 'rollup-plugin-styles';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
import analyzer from 'rollup-plugin-analyzer';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import ignoreImport from 'rollup-plugin-ignore-import';
// @ts-ignore
import { terser } from 'rollup-plugin-terser';
// @ts-ignore
import multiInput from 'rollup-plugin-multi-input';
// @ts-ignore
import staticImport from 'rollup-plugin-static-import';
import alias from '@rollup/plugin-alias';

import pkg from '../packages/site/package.json';
import { joinWorkspaceRoot, joinStylesRoot, joinComponentsRoot, joinSiteRoot } from './paths';

const name = 'wesley';
const esExternalDeps = Object.keys(pkg.dependencies || {});
const externalDeps = [...esExternalDeps, /@babel\/runtime/];
const externalPeerDeps = Object.keys(pkg.peerDependencies || {});
const DEFAULT_EXTENSIONS = ['.js', '.jsx', '.es6', '.es', '.mjs', '.cjs'];
const banner = `/**
 * ${name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author || ''}
 * @license ${pkg.license || ''}
 */
`;

const input = joinComponentsRoot('index-lib.ts');

const inputList = [
  joinComponentsRoot('**/*.ts'),
  joinComponentsRoot('**/*.tsx'),
  `!${joinComponentsRoot('**/demos')}`,
  `!${joinComponentsRoot('**/*.d.ts')}`,
  `!${joinComponentsRoot('**/type.ts')}`,
  `!${joinComponentsRoot('**/types.ts')}`,
  `!${joinComponentsRoot('**/__tests__')}`,
];

const getPlugins = ({
  cssBuildType,
  env,
  isProd,
}: {
  cssBuildType?: 'single' | 'multi' | 'source' | 'ignore';
  env?: string;
  isProd?: boolean;
} = {}) => {
  const plugins = [
    // alias({
    //   entries: [{ find: '@wesley/styles', replacement: joinStylesRoot() }],
    // }),
    nodeResolve({
      extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.tsx'],
    }) as unknown as Plugin,
    vuePlugin(),
    commonjs(),
    esbuild({
      target: 'esnext',
      minify: false,
      jsx: 'preserve',
    }),
    babel({
      babelHelpers: 'runtime',
      extensions: [...DEFAULT_EXTENSIONS, '.vue', '.ts', '.tsx'],
      configFile: joinWorkspaceRoot('babel.config.js'),
    }),
    json(),
    url(),
    replace({
      preventAssignment: true,
      values: {
        PKG_VERSION: JSON.stringify(pkg.version),
      },
    }),
  ];

  // css 打包到一个文件中
  if (cssBuildType === 'single') {
    plugins.push(
      postcss({
        extract: `${isProd ? `${name}.min` : name}.css`,
        minimize: isProd,
        sourceMap: true,
        extensions: ['.sass', '.scss', '.css', '.less'],
      }),
    );
  }
  // css 分别打包到各自的 style 下
  if (cssBuildType === 'multi') {
    plugins.push(
      (staticImport.default || staticImport)({
        baseDir: joinComponentsRoot(),
        include: [joinComponentsRoot('**/style/css.mjs')],
      }),
      ignoreImport({
        include: [joinComponentsRoot('**/style/*')],
        body: 'import "./style/css.mjs";',
      }),
      copy({
        targets: [
          {
            src: joinComponentsRoot('**/style/css.js'),
            dest: joinSiteRoot('es'),
            rename: (name, extension, fullPath) =>
              `${fullPath.replace(joinComponentsRoot(), '').slice(0, -6)}${name}.mjs`,
          },
        ],
        verbose: true,
      }),
    );
  }
  // 不打包 less，但保持引用
  if (cssBuildType === 'source') {
  }
  // 完全忽略 less
  if (cssBuildType === 'ignore') {
    plugins.push(
      ignoreImport({
        include: [joinComponentsRoot('**/style/index.js')],
      }),
    );
  }

  if (env) {
    plugins.push(
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': JSON.stringify(env),
        },
      }),
    );
  }

  if (isProd) {
    plugins.push(
      terser({
        output: {
          ascii_only: true,
        },
      }),
    );
  }
  return plugins;
};

export const buildEs = async () => {
  const buildCss = async () => {
    const bundle = await rollup({
      input: [joinComponentsRoot('**/style/index.js')],
      plugins: [multiInput({ relative: joinComponentsRoot() }), styles({ mode: 'extract' }), nodeResolve()],
    });
    bundle.write({
      banner,
      dir: joinSiteRoot('es/'),
      assetFileNames: '[name].css',
    });
  };

  const buildComp = async () => {
    // lodash会使ssr无法运行,@babel\runtime affix组件报错,tinycolor2 颜色组件报错,dayjs 日期组件报错
    const exception = ['tinycolor2', 'dayjs'];
    const esExternal = [...esExternalDeps, ...externalPeerDeps].filter((value) =>
      typeof value === 'string' ? !exception.includes(value) : true,
    );
    const bundle = await rollup({
      input: [...inputList, `!${joinComponentsRoot('index-lib.ts')}`],
      // 为了保留 style/css.js
      treeshake: false,
      external: esExternal,
      plugins: [multiInput({ relative: joinComponentsRoot() }), ...getPlugins({ cssBuildType: 'multi' })],
    });
    bundle.write({
      banner,
      dir: joinSiteRoot('es/'),
      format: 'esm',
      sourcemap: true,
      entryFileNames: '[name].mjs',
      chunkFileNames: '_chunks/dep-[hash].mjs',
    });
    const files = await glob(`${joinSiteRoot('es/**/style/index.js')}`);
    const rewrite = files.map(async (filePath) => {
      await fs.remove(filePath);
    });
    await Promise.all(rewrite);
  };
  await buildCss();
  await buildComp();
};

export const buildEsm = async () => {
  const bundle = await rollup({
    input: [...inputList, `!${joinComponentsRoot('index-lib.ts')}`],
    external: [...externalDeps, ...externalPeerDeps, /@wesley\/styles/],
    plugins: [
      multiInput({ relative: joinComponentsRoot() }),
      copy({
        targets: [
          {
            src: joinStylesRoot('tdesign-common-style/**/*.less'),
            dest: joinSiteRoot('esm/style'),
            rename: (_, __, fullPath) => `${fullPath.replace(joinStylesRoot(), '')}`,
          },
        ],
        verbose: true,
      }),
      copy({
        targets: [
          {
            src: joinComponentsRoot('style/index.js'),
            dest: joinSiteRoot('esm'),
            rename: (_, __, fullPath) => `${fullPath.replace(joinComponentsRoot(), '')}`,
          },
        ],
        verbose: true,
      }),
      ...getPlugins({ cssBuildType: 'source' }),
    ],
  });
  await bundle.write({
    banner,
    dir: joinSiteRoot('esm/'),
    format: 'esm',
    sourcemap: true,
    chunkFileNames: '_chunks/dep-[hash].js',
  });

  // TODO 这个可以提取成公共函数
  // 这里稍微有点性能问题
  const files = await glob(`${joinSiteRoot('esm/**/*.*')}`);
  const rewrite = files.map(async (filePath) => {
    const content = await fs.readFile(filePath, 'utf8');
    await fs.writeFile(filePath, content.replace(/@wesley\/styles/g, 'site/esm/style'), 'utf8');
  });
  await Promise.all(rewrite);
};

export const buildLib = async () => {
  const bundle = await rollup({
    input: inputList,
    external: [...externalDeps, ...externalPeerDeps],
    plugins: [multiInput({ relative: joinComponentsRoot() }), ...getPlugins({ cssBuildType: 'ignore' })],
  });
  await bundle.write({
    banner,
    dir: joinSiteRoot('lib/'),
    format: 'esm',
    sourcemap: true,
    chunkFileNames: '_chunks/dep-[hash].js',
  });
};

export const buildCjs = async () => {
  const cjsExternalException = ['lodash-es'];
  const cjsExternal = [...externalDeps, ...externalPeerDeps].filter((value) =>
    typeof value === 'string' ? !cjsExternalException.includes(value) : true,
  );
  const bundle = await rollup({
    input: inputList,
    external: cjsExternal,
    plugins: [multiInput({ relative: joinComponentsRoot() }), ...getPlugins({ cssBuildType: 'ignore' })],
  });
  await bundle.write({
    banner,
    dir: joinSiteRoot('cjs/'),
    format: 'cjs',
    sourcemap: true,
    exports: 'named',
    chunkFileNames: '_chunks/dep-[hash].js',
  });
};

export const buildUmd = async (isMin = false) => {
  const bundle = await rollup({
    input,
    external: externalPeerDeps,
    plugins: isMin
      ? getPlugins({
          cssBuildType: 'single',
          isProd: true,
          env: 'production',
        })
      : [
          analyzer({
            limit: 5,
            summaryOnly: true,
          }),
          ...getPlugins({
            cssBuildType: 'single',
            env: 'development',
          }),
        ],
  });
  await bundle.write({
    name: 'WesleyComponent',
    banner,
    format: 'umd',
    exports: 'named',
    globals: { vue: 'Vue' },
    sourcemap: true,
    file: joinSiteRoot(`dist/${name}${isMin ? '.min' : ''}.js`),
  });
};

export const deleteOutput = async () => {
  const removes = ['es', 'esm', 'lib', 'cjs', 'dist'].map(async (filePath) => await fs.remove(joinSiteRoot(filePath)));
  await Promise.all(removes);
};

// // 单独导出 reset.css 到 dist 目录，兼容旧版本样式
// export const buildResetCss = async () => {
//   const bundle = await rollup({
//     input: joinStylesRoot('style/web/_reset.less'),
//     plugins: [postcss({ extract: true })],
//   });
//   await bundle.write({
//     file: joinSiteRoot('dist/reset.css'),
//   });
// };

export const buildComponents = async () => {
  await deleteOutput();
  await buildEs();
  await buildEsm();
  await buildLib();
  await buildCjs();
  await buildUmd();
  await buildUmd(true);
};
