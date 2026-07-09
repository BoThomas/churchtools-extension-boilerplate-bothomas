<template>
  <main class="min-h-screen bg-surface-50 p-4 text-surface-700">
    <div class="mx-auto flex max-w-6xl flex-col gap-4">
      <section
        class="rounded-2xl bg-gradient-to-r from-primary-700 to-primary-500 p-6 text-white shadow-md"
      >
        <div
          class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p class="text-sm font-semibold uppercase tracking-wide opacity-80">
              ChurchTools extension boilerplate
            </p>
            <h1 class="mt-2 text-3xl font-bold">Demo Extension</h1>
            <p class="mt-2 max-w-2xl text-primary-50">
              A small working app that shows the shared setup: Vue, Vite,
              ChurchTools client wiring, Tailwind styles, PrimeVue services, and
              the reusable Volt components.
            </p>
          </div>
          <div class="rounded-xl bg-white/15 p-4 text-sm backdrop-blur">
            <div><strong>Key:</strong> {{ extensionKey }}</div>
            <div><strong>Version:</strong> {{ extensionInfo.version }}</div>
            <div><strong>Build:</strong> {{ extensionInfo.gitHash }}</div>
          </div>
        </div>
      </section>

      <Message severity="info" :closable="false">
        Start by editing <code>extensions/demo-extension/src/App.vue</code>,
        then replace the extension key in
        <code>extensions/demo-extension/.env</code>.
      </Message>

      <Tabs v-model:value="activeTab">
        <TabList>
          <Tab value="overview">Overview</Tab>
          <Tab value="components">Components</Tab>
          <Tab value="data">Data pattern</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="overview">
            <div class="grid gap-4 md:grid-cols-3">
              <Card v-for="item in setupCards" :key="item.title">
                <template #title>{{ item.title }}</template>
                <template #subtitle>{{ item.subtitle }}</template>
                <template #content>
                  <p class="text-sm leading-6 text-surface-600">
                    {{ item.text }}
                  </p>
                </template>
              </Card>
            </div>
          </TabPanel>

          <TabPanel value="components">
            <div class="grid gap-4 lg:grid-cols-[1fr_22rem]">
              <Card>
                <template #title>Try a few shared UI components</template>
                <template #subtitle>
                  These are imported from
                  <code>@churchtools-extensions/prime-volt</code>.
                </template>
                <template #content>
                  <div class="flex flex-col gap-5">
                    <label class="flex flex-col gap-2 text-sm font-medium">
                      Greeting
                      <InputText
                        v-model="greeting"
                        placeholder="Hello ChurchTools"
                      />
                    </label>

                    <label class="flex flex-col gap-2 text-sm font-medium">
                      Audience
                      <Select
                        v-model="selectedAudience"
                        :options="audiences"
                        option-label="label"
                        option-value="value"
                        placeholder="Select an audience"
                      />
                    </label>

                    <label class="flex items-center gap-2 text-sm">
                      <Checkbox
                        v-model="showDetails"
                        binary
                        input-id="show-details"
                      />
                      <span>Show extra implementation hints</span>
                    </label>

                    <div class="flex flex-wrap gap-2">
                      <Button
                        icon="pi pi-check"
                        label="Show toast"
                        @click="showToast"
                      />
                      <SecondaryButton label="Reset" @click="resetDemo" />
                    </div>

                    <Message
                      v-if="showDetails"
                      severity="success"
                      :closable="false"
                    >
                      PrimeVue is configured once in <code>src/main.ts</code>.
                      Extensions can focus on features and import themed
                      components directly.
                    </Message>
                  </div>
                </template>
              </Card>

              <Card>
                <template #title>Live preview</template>
                <template #content>
                  <div class="space-y-4">
                    <div
                      class="rounded-lg border border-surface-200 bg-surface-50 p-4"
                    >
                      <p class="text-sm text-surface-500">Message</p>
                      <p class="mt-1 text-xl font-semibold text-surface-800">
                        {{ greeting }} {{ audienceLabel }}!
                      </p>
                    </div>
                    <div>
                      <div class="mb-2 flex justify-between text-sm">
                        <span>Bootstrap completeness</span>
                        <strong>{{ completeness }}%</strong>
                      </div>
                      <ProgressBar :value="completeness" />
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <Tag value="Vue 3" />
                      <Tag value="Vite" severity="success" />
                      <Tag value="ChurchTools" severity="info" />
                    </div>
                  </div>
                </template>
              </Card>
            </div>
          </TabPanel>

          <TabPanel value="data">
            <Card>
              <template #title>Recommended data setup</template>
              <template #subtitle>
                Use the shared persistence package when your extension needs
                Custom Module storage.
              </template>
              <template #content>
                <DataTable :value="dataRows" table-style="min-width: 42rem">
                  <Column field="package" header="Package" />
                  <Column field="use" header="Use" />
                  <Column field="example" header="Import" />
                </DataTable>
              </template>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </main>

  <Toast />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import extensionInfo from 'virtual:extension-info';
import { KEY as extensionKey } from './config';
import Button from '@churchtools-extensions/prime-volt/Button.vue';
import Card from '@churchtools-extensions/prime-volt/Card.vue';
import Checkbox from '@churchtools-extensions/prime-volt/Checkbox.vue';
import Column from 'primevue/column';
import DataTable from '@churchtools-extensions/prime-volt/DataTable.vue';
import InputText from '@churchtools-extensions/prime-volt/InputText.vue';
import Message from '@churchtools-extensions/prime-volt/Message.vue';
import ProgressBar from '@churchtools-extensions/prime-volt/ProgressBar.vue';
import SecondaryButton from '@churchtools-extensions/prime-volt/SecondaryButton.vue';
import Select from '@churchtools-extensions/prime-volt/Select.vue';
import Tab from '@churchtools-extensions/prime-volt/Tab.vue';
import TabList from '@churchtools-extensions/prime-volt/TabList.vue';
import TabPanel from '@churchtools-extensions/prime-volt/TabPanel.vue';
import TabPanels from '@churchtools-extensions/prime-volt/TabPanels.vue';
import Tabs from '@churchtools-extensions/prime-volt/Tabs.vue';
import Tag from '@churchtools-extensions/prime-volt/Tag.vue';
import Toast from '@churchtools-extensions/prime-volt/Toast.vue';

const toast = useToast();
const activeTab = ref('overview');
const greeting = ref('Hello');
const selectedAudience = ref('church');
const showDetails = ref(true);

const audiences = [
  { label: 'Church', value: 'church' },
  { label: 'Small group', value: 'small group' },
  { label: 'Team', value: 'team' },
];

const setupCards = [
  {
    title: 'Ready wiring',
    subtitle: 'Vue + Vite + TypeScript',
    text: 'The demo extension already includes app mounting, PrimeVue services, aliases, version info, and ChurchTools base URL handling.',
  },
  {
    title: 'Shared packages',
    subtitle: 'Utilities for every extension',
    text: 'The boilerplate keeps build-tools, ct-utils, persistance, prime-volt, and shared-styles as reusable workspace packages.',
  },
  {
    title: 'Release packaging',
    subtitle: 'Build ZIPs for ChurchTools',
    text: 'Run the package script to create installable ZIP files under releases/, or use the interactive release flow from the root.',
  },
];

const dataRows = [
  {
    package: 'ct-utils',
    use: 'Low-level ChurchTools API helpers and Custom Module KV functions.',
    example: '@churchtools-extensions/ct-utils/kv-store',
  },
  {
    package: 'persistance',
    use: 'Small CRUD wrapper around Custom Module data categories.',
    example: '@churchtools-extensions/persistance',
  },
  {
    package: 'prime-volt',
    use: 'Themed UI components that match the rest of this starter.',
    example: '@churchtools-extensions/prime-volt/Button.vue',
  },
];

const audienceLabel = computed(
  () =>
    audiences
      .find((audience) => audience.value === selectedAudience.value)
      ?.label.toLowerCase() ?? 'ChurchTools',
);

const completeness = computed(() => (showDetails.value ? 95 : 80));

function showToast() {
  toast.add({
    severity: 'success',
    summary: 'It works',
    detail: `${greeting.value} ${audienceLabel.value}!`,
    life: 3000,
  });
}

function resetDemo() {
  greeting.value = 'Hello';
  selectedAudience.value = 'church';
  showDetails.value = true;
}
</script>
