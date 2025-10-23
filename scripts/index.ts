import { buildComponents } from './build-components';
import { buildTypes } from './build-types';

async function build() {
  await buildComponents();
  await buildTypes();
}

build();
