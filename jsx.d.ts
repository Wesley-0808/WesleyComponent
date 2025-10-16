import { NativeElements, IntrinsicElementAttributes } from '@vue/runtime-dom';
export * from '@vue/runtime-dom';

declare global {
  namespace JSX {
    type IntrinsicElements = NativeElements;

    type IntrinsicAttributes = IntrinsicElementAttributes;
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    // todo
    [x: string]: any;
  }
}
