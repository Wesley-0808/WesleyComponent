<p align="center">
  WesleyComponent
</p>

<p align="center">
  <a href="https://github.com/Tencent/wesley-component/blob/develop/LICENSE">
 <img src="https://img.shields.io/npm/l/wesley-component.svg?sanitize=true" alt="License">
  </a>
  <a href="https://www.npmjs.com/package/wesley-component">
 <img src="https://img.shields.io/npm/v/wesley-component.svg?sanitize=true" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/wesley-component">
 <img src="https://img.shields.io/npm/dm/wesley-component" alt="Downloads">
  </a>
</p>

Wesley Component is a Vue 3 high-level component library based on the TDesign component library, providing a variety of practical components and eliminating complex encapsulation processes

# 🎉 Features

- Base on [TDesign-Vue-Next](https://github.com/Tencent/tdesign-vue-next)
- Desktop application interaction
- High quality UI components for Vue 3.x
- Consistent API and UI with TDesign component libraries for other frameworks
- Dark mode and customizable theme
- Support tree-shaking

# 📦 Installation

```shell
npm i wesley-component
```

# ⚠️ Compatibility
- Only partially encapsulated components are provided, such as `Table`. If you want to use standard `Table`, you still need to use `tdesign`.
- The `tdesign` version number you are using must be consistent with the `tdesign` version number used in the `wesley-component`, otherwise it may result in your overlay style not being applied.

# 🔨 Usage

```js
import { createApp } from 'vue';
import { Button } from 'wesley-component';

import 'tdesign-vue-next/es/style/index.css';

import App from './app.vue';

const app = createApp(App);
app.use(Button);
```

# Browser Support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br> IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| ------- | ------- | ------- | ------- |
| Edge >=84  | Firefox >=83 | Chrome >=84 | Safari >=14.1 |

Read our [browser compatibility](https://github.com/Tencent/tdesign/wiki/Browser-Compatibility) for more details.


# License

The Apache 2.0 License. Please see [the license file](./LICENSE) for more information.
