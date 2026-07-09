<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl">
    <Card>
      <template #title>About Demo Extension</template>
      <template #content>
        <div class="space-y-4">
          <p>
            This is the default starter extension for the ChurchTools extension
            boilerplate. It keeps the app shell intentionally small and uses the
            same Settings / Demo tab pattern as the extensions in the source
            monorepo.
          </p>
          <p>
            Use this page for extension information, setup notes, and links to
            internal docs. Put real feature UI into separate views and keep the
            shared wiring in <code>src/main.ts</code>.
          </p>
        </div>
      </template>
    </Card>

    <Card>
      <template #title>Extension Information</template>
      <template #content>
        <div
          class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 items-center max-w-2xl"
        >
          <span class="text-surface-500 dark:text-surface-400 text-sm">
            Name
          </span>
          <div>
            <Badge :value="extensionInfo.name" severity="contrast" />
          </div>

          <span class="text-surface-500 dark:text-surface-400 text-sm">
            Key
          </span>
          <div>
            <Badge :value="extensionKey" severity="secondary" />
          </div>

          <span class="text-surface-500 dark:text-surface-400 text-sm">
            Version
          </span>
          <div>
            <Badge :value="extensionInfo.version" severity="contrast" />
          </div>

          <span class="text-surface-500 dark:text-surface-400 text-sm">
            Git Commit
          </span>
          <div class="flex items-center gap-2">
            <Badge :value="'# ' + extensionInfo.gitHash" severity="secondary" />
            <Badge
              :value="'⎇ ' + extensionInfo.gitBranch"
              severity="secondary"
            />
          </div>

          <span class="text-surface-500 dark:text-surface-400 text-sm">
            Built
          </span>
          <div>
            <Badge
              :value="formatDate(extensionInfo.buildDate)"
              severity="secondary"
            />
          </div>

          <template
            v-if="extensionInfo.authorName || extensionInfo.authorEmail"
          >
            <span class="text-surface-500 dark:text-surface-400 text-sm">
              Author
            </span>
            <a
              v-if="extensionInfo.authorEmail"
              :href="'mailto:' + extensionInfo.authorEmail"
              class="flex items-center gap-2 text-sm group"
              target="_blank"
            >
              <i class="pi pi-envelope text-primary"></i>
              <span class="group-hover:underline">
                {{ extensionInfo.authorName }}
              </span>
            </a>
            <span v-else class="text-sm">{{ extensionInfo.authorName }}</span>
          </template>

          <template v-if="extensionInfo.repositoryUrl">
            <span class="text-surface-500 dark:text-surface-400 text-sm">
              Repository
            </span>
            <a
              :href="extensionInfo.repositoryUrl"
              target="_blank"
              class="flex items-center gap-2 text-xs font-mono group"
            >
              <i class="pi pi-github text-sm text-primary"></i>
              <span
                class="text-surface-500 dark:text-surface-400 group-hover:underline"
              >
                {{ extensionInfo.repositoryUrl }}
              </span>
            </a>
          </template>
        </div>
      </template>
    </Card>

    <Card>
      <template #title>Boilerplate Wiring</template>
      <template #content>
        <div class="space-y-4">
          <div
            v-for="item in wiringItems"
            :key="item.title"
            class="flex items-start gap-3 p-3 bg-surface-100 dark:bg-surface-800 rounded"
          >
            <i :class="['pi text-primary pt-1', item.icon]"></i>
            <div>
              <div class="font-semibold">{{ item.title }}</div>
              <div class="text-sm text-surface-600 dark:text-surface-400">
                {{ item.text }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <Card>
      <template #title>Shared Packages</template>
      <template #content>
        <div class="space-y-3">
          <div
            v-for="pkg in packages"
            :key="pkg.name"
            class="flex flex-col gap-1 border-b border-surface-100 pb-3 last:border-0 last:pb-0"
          >
            <div class="font-semibold">{{ pkg.name }}</div>
            <p class="text-sm text-surface-600 dark:text-surface-400">
              {{ pkg.description }}
            </p>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Badge from '@churchtools-extensions/prime-volt/Badge.vue';
import Card from '@churchtools-extensions/prime-volt/Card.vue';
import extensionInfo from 'virtual:extension-info';
import { KEY as extensionKey } from '../config';

const wiringItems = [
  {
    title: 'ChurchTools client',
    text: 'Base URL and optional development login are configured once in src/main.ts.',
    icon: 'pi-link',
  },
  {
    title: 'PrimeVue services',
    text: 'Toast, confirmation, tooltip, and styleclass services are already registered.',
    icon: 'pi-bolt',
  },
  {
    title: 'Release tooling',
    text: 'The package command creates a ChurchTools-installable ZIP in the releases folder.',
    icon: 'pi-box',
  },
];

const packages = [
  {
    name: '@churchtools-extensions/build-tools',
    description: 'Packaging, release helper, and build/version metadata.',
  },
  {
    name: '@churchtools-extensions/ct-utils',
    description: 'ChurchTools API types and low-level Custom Module helpers.',
  },
  {
    name: '@churchtools-extensions/persistance',
    description:
      'Small CRUD wrapper for extension data in Custom Module storage.',
  },
  {
    name: '@churchtools-extensions/prime-volt',
    description: 'Themed UI component wrappers used by the demo view.',
  },
];

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleString();
}
</script>
