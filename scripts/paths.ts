import { existsSync } from 'node:fs';
import { posix, dirname, win32 } from 'node:path';

const normalizePathRegExp = new RegExp(`\\${win32.sep}`, 'g');

/**
 *@description 归一化路径,将 windows 风格的路径转换为 posix 风格的路径
 */
const toPosixPath = (filename: string) => filename.replace(normalizePathRegExp, posix.sep);

/**
 *@description POSIX 风格的路径解析,只能处理相对路径
 */
const resolvePosix = (...paths: string[]) => toPosixPath(posix.resolve(...paths));

/**
 *@description POSIX 风格的路径拼接
 */
const joinPosix = (...paths: string[]) => toPosixPath(posix.join(...paths));

export { resolvePosix, joinPosix };

/**
 * root 原本是使用 @pnpm/find-workspace-dir 获取的，但它的获取方式是异步的，导致部分地方使用时出现问题，比如 vitest 的 snapshot 测试，
 * 因此这里改成同步写，在本项目中不会出现问题，因为整个项目只有一个 pnpm-workspace.yaml 文件
 * @returns
 */
export const getWorkspaceRoot = () => {
  let dir = process.cwd();
  while (dir !== '/') {
    if (existsSync(`${dir}/pnpm-workspace.yaml`)) {
      return toPosixPath(dir);
    }
    dir = dirname(dir);
  }
  throw new Error('Could not find workspace root');
};

// packages
export const getPackagesRoot = () => {
  return joinPosix(getWorkspaceRoot(), 'packages');
};

// packages/components
export const getComponentsRoot = () => {
  return joinPosix(getPackagesRoot(), 'components');
};

export const getStylesRoot = () => {
  return joinPosix(getPackagesRoot(), 'styles');
};

// packages/tdesign-vue-next
export const getSiteRoot = () => {
  return joinPosix(getPackagesRoot(), 'site');
};

// joinPosix
export const joinWorkspaceRoot = (...paths: string[]) => {
  return joinPosix(getWorkspaceRoot(), ...paths);
};

export const joinPackagesRoot = (...paths: string[]) => {
  return joinPosix(getPackagesRoot(), ...paths);
};

export const joinComponentsRoot = (...paths: string[]) => {
  return joinPosix(getComponentsRoot(), ...paths);
};

export const joinStylesRoot = (...paths: string[]) => {
  return joinPosix(getStylesRoot(), ...paths);
};

export const joinSiteRoot = (...paths: string[]) => {
  return joinPosix(getSiteRoot(), ...paths);
};

/**
 * getRelativeWorkspaceRootPath
 * @description get the relative path from the workspaceRoot directory
 * @param absolutePath string
 * @returns string
 */
export const getRelativeWorkspaceRootPath = (absolutePath: string) => {
  const workspaceRoot = getWorkspaceRoot();
  if (!absolutePath.startsWith(workspaceRoot)) {
    throw new Error('path is not a workspaceRoot path');
  }
  return absolutePath.replace(workspaceRoot, '.');
};
