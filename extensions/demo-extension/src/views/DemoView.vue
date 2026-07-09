<template>
  <div class="space-y-6 max-w-7xl">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <template #title>ChurchTools User</template>
        <template #content>
          <div class="space-y-4">
            <Message v-if="apiError" severity="warn" :closable="false">
              {{ apiError }}
            </Message>

            <div v-if="currentUser" class="flex items-start gap-3">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold"
              >
                {{ userInitials }}
              </div>
              <div class="space-y-1">
                <div class="text-lg font-semibold">{{ userName }}</div>
                <div class="text-sm text-surface-500">
                  Person ID: {{ currentUser.id }}
                </div>
                <a
                  v-if="currentUser.email"
                  :href="`mailto:${currentUser.email}`"
                  class="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <i class="pi pi-envelope"></i>
                  {{ currentUser.email }}
                </a>
              </div>
            </div>

            <div v-else class="text-sm text-surface-500">
              Click the button to call <code>/whoami</code> through the
              configured ChurchTools client.
            </div>

            <Button
              label="Load Current User"
              icon="pi pi-user"
              :loading="loadingUser"
              @click="loadCurrentUser"
            />
          </div>
        </template>
      </Card>

      <Card>
        <template #title>Group Search</template>
        <template #content>
          <div class="space-y-4">
            <div class="flex flex-col gap-2">
              <label for="group-search" class="font-medium text-sm">
                Search ChurchTools groups
              </label>
              <div class="flex gap-2">
                <InputText
                  id="group-search"
                  v-model="groupQuery"
                  placeholder="e.g. youth, worship, dinner"
                  class="w-full"
                  @keyup.enter="searchGroups"
                />
                <Button
                  icon="pi pi-search"
                  label="Search"
                  :loading="loadingGroups"
                  @click="searchGroups"
                />
              </div>
              <p class="text-xs text-surface-500">
                Uses <code>GET /groups</code> and filters locally, matching the
                pattern from the existing extensions.
              </p>
            </div>

            <DataTable
              v-if="groups.length > 0"
              :value="groups"
              paginator
              :rows="5"
              table-style="min-width: 34rem"
            >
              <Column field="id" header="ID" />
              <Column field="name" header="Name" />
              <Column header="Members">
                <template #body="{ data }">
                  {{ data.memberStatistics?.active ?? '—' }}
                </template>
              </Column>
            </DataTable>

            <Message
              v-else-if="searchedGroups"
              severity="secondary"
              :closable="false"
            >
              No groups found for "{{ groupQuery }}".
            </Message>
          </div>
        </template>
      </Card>
    </div>

    <Card>
      <template #title>KV Store Demo</template>
      <template #subtitle>
        Stores small notes in ChurchTools Custom Module data via
        <code>PersistanceCategory</code>.
      </template>
      <template #content>
        <div class="space-y-4">
          <Message v-if="kvError" severity="warn" :closable="false">
            {{ kvError }}
          </Message>

          <div class="grid gap-3 md:grid-cols-[1fr_auto]">
            <InputText
              v-model="noteText"
              placeholder="Write a small note and save it to ChurchTools KV storage"
              @keyup.enter="saveNote"
            />
            <Button
              label="Save Note"
              icon="pi pi-save"
              :disabled="!noteText.trim()"
              :loading="savingNote"
              @click="saveNote"
            />
          </div>

          <DataTable
            v-if="notes.length > 0"
            :value="notes"
            table-style="min-width: 42rem"
          >
            <Column field="value.text" header="Note" />
            <Column header="Created">
              <template #body="{ data }">
                {{ formatDate(data.value.createdAt) }}
              </template>
            </Column>
            <Column header="Created by">
              <template #body="{ data }">
                {{ data.value.createdByName || 'Unknown' }}
              </template>
            </Column>
            <Column header="Actions">
              <template #body="{ data }">
                <DangerButton
                  icon="pi pi-trash"
                  text
                  size="small"
                  @click="deleteNote(data.id)"
                />
              </template>
            </Column>
          </DataTable>

          <Message v-else severity="info" :closable="false">
            No KV notes yet. Save one above to create/list/delete data through
            the shared persistence package.
          </Message>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { churchtoolsClient } from '@churchtools/churchtools-client';
import { useToast } from 'primevue/usetoast';
import {
  PersistanceCategory,
  type CategoryValue,
} from '@churchtools-extensions/persistance';
import type { Group, Person } from '@churchtools-extensions/ct-utils/ct-types';
import { KEY } from '../config';
import Button from '@churchtools-extensions/prime-volt/Button.vue';
import Card from '@churchtools-extensions/prime-volt/Card.vue';
import DangerButton from '@churchtools-extensions/prime-volt/DangerButton.vue';
import DataTable from '@churchtools-extensions/prime-volt/DataTable.vue';
import InputText from '@churchtools-extensions/prime-volt/InputText.vue';
import Message from '@churchtools-extensions/prime-volt/Message.vue';
import Column from 'primevue/column';

type DemoNote = {
  text: string;
  createdAt: string;
  createdById?: number;
  createdByName?: string;
};

type ApiListResponse<T> = T[] | { data?: T[] };

const toast = useToast();

const currentUser = ref<Person | null>(null);
const loadingUser = ref(false);
const apiError = ref<string | null>(null);

const groupQuery = ref('');
const groups = ref<Group[]>([]);
const loadingGroups = ref(false);
const searchedGroups = ref(false);

const noteText = ref('');
const notes = ref<Array<CategoryValue<DemoNote>>>([]);
const notesCategory = ref<PersistanceCategory<DemoNote> | null>(null);
const loadingNotes = ref(false);
const savingNote = ref(false);
const kvError = ref<string | null>(null);

const userName = computed(() => {
  if (!currentUser.value) return 'Unknown user';
  return (
    [currentUser.value.firstName, currentUser.value.lastName]
      .filter(Boolean)
      .join(' ') || `Person ${currentUser.value.id}`
  );
});

const userInitials = computed(() =>
  userName.value
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase(),
);

function normalizeResponse<T>(response: ApiListResponse<T>): T[] {
  if (Array.isArray(response)) return response;
  return response.data ?? [];
}

async function loadCurrentUser() {
  loadingUser.value = true;
  apiError.value = null;

  try {
    currentUser.value = await churchtoolsClient.get<Person>('/whoami');
  } catch (error) {
    apiError.value = errorMessage(error, 'Could not load the current user.');
  } finally {
    loadingUser.value = false;
  }
}

async function searchGroups() {
  loadingGroups.value = true;
  searchedGroups.value = true;
  apiError.value = null;

  try {
    const response = await churchtoolsClient.get<ApiListResponse<Group>>(
      '/groups?include[]=memberStatistics',
    );
    const query = groupQuery.value.trim().toLowerCase();
    groups.value = normalizeResponse(response)
      .filter((group) => !query || group.name.toLowerCase().includes(query))
      .slice(0, 25);
  } catch (error) {
    groups.value = [];
    apiError.value = errorMessage(error, 'Could not search groups.');
  } finally {
    loadingGroups.value = false;
  }
}

async function ensureNotesCategory() {
  if (notesCategory.value) return notesCategory.value;

  notesCategory.value = (await PersistanceCategory.init({
    extensionkey: KEY,
    categoryShorty: 'demo-notes',
    categoryName: 'Demo Notes',
    categoryDescription: 'Small notes created by the boilerplate demo.',
  })) as PersistanceCategory<DemoNote>;

  return notesCategory.value;
}

async function loadNotes() {
  loadingNotes.value = true;
  kvError.value = null;

  try {
    const category = await ensureNotesCategory();
    notes.value = await category.list<DemoNote>();
  } catch (error) {
    notes.value = [];
    kvError.value = errorMessage(
      error,
      `Could not initialize KV storage for extension key "${KEY}". Install the extension as a ChurchTools Custom Module first, or use an existing module key while developing.`,
    );
  } finally {
    loadingNotes.value = false;
  }
}

async function saveNote() {
  const text = noteText.value.trim();
  if (!text) return;

  savingNote.value = true;
  kvError.value = null;

  try {
    const category = await ensureNotesCategory();
    await category.create<DemoNote>({
      text,
      createdAt: new Date().toISOString(),
      createdById: currentUser.value?.id,
      createdByName: currentUser.value ? userName.value : undefined,
    });
    noteText.value = '';
    await loadNotes();
    toast.add({
      severity: 'success',
      summary: 'Saved',
      detail: 'The note was saved to ChurchTools KV storage.',
      life: 3000,
    });
  } catch (error) {
    kvError.value = errorMessage(error, 'Could not save the note.');
  } finally {
    savingNote.value = false;
  }
}

async function deleteNote(id: number) {
  kvError.value = null;

  try {
    const category = await ensureNotesCategory();
    await category.delete(id);
    await loadNotes();
    toast.add({
      severity: 'success',
      summary: 'Deleted',
      detail: 'The note was removed from KV storage.',
      life: 3000,
    });
  } catch (error) {
    kvError.value = errorMessage(error, 'Could not delete the note.');
  }
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleString();
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

onMounted(() => {
  void loadCurrentUser();
  void loadNotes();
});
</script>
