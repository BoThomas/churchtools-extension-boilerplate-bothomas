<template>
  <div class="min-h-screen flex flex-col">
    <div class="flex-1 p-4">
      <Tabs v-model:value="activeTab">
        <TabList>
          <Tab value="info">Info</Tab>
          <Tab value="components">Components</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="info">
            <SettingsView />
          </TabPanel>
          <TabPanel value="components">
            <DemoView />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </div>

  <Toast />
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';
import Tab from '@churchtools-extensions/prime-volt/Tab.vue';
import TabList from '@churchtools-extensions/prime-volt/TabList.vue';
import TabPanel from '@churchtools-extensions/prime-volt/TabPanel.vue';
import TabPanels from '@churchtools-extensions/prime-volt/TabPanels.vue';
import Tabs from '@churchtools-extensions/prime-volt/Tabs.vue';
import Toast from '@churchtools-extensions/prime-volt/Toast.vue';

const activeTab = ref('info');

const DemoView = defineAsyncComponent(() => import('./views/DemoView.vue'));
const SettingsView = defineAsyncComponent(
  () => import('./views/SettingsView.vue'),
);
</script>
