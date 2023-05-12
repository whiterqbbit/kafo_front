<template>
  <div v-if="selected_clubs" class="flex flex-wrap gap-2">
    <div 
      v-for="club in selected_clubs" 
      :key="club.uuid || 'fallback'"
      class="rounded-full bg-grass-500 px-2 py-0.5 text-sm text-white w-fit cursor-pointer"
      @click="toggle_selected_club(club)"
    >
      {{club.nom}}
    </div>
  </div>
  <div class="flex flex-wrap justify-between gap-2 px-1 py-2 max-h-30 overflow-auto border border-1 border-cafe-400 rounded-lg">
    <div
      v-for="club in filtered_clubs"
      :key="club.uuid || 'fallback'"
      class="rounded-full bg-cafe-500 px-2 py-0.5 text-sm text-white cursor-pointer"
      @click="toggle_selected_club(club)"
    >
      {{ club.nom }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFuse } from '@vueuse/integrations/useFuse'
import type { Club } from '@/stores/xano.d.ts'

const props = defineProps<{
  clubs: Club[]
  search_input: string
}>()

const clubs: Ref<Club[] | []> = ref([...props.clubs])
const selected_clubs : Ref<Club[] | []> = ref([])
const searchResults: Ref<{ item: Club }[] | null> = ref(null)

watch(
  () => props.search_input,
  (search_input) => {
    const { results } = useFuse(search_input, clubs, { fuseOptions: { keys: ['nom'] } })
    searchResults.value = results.value
  },
  { immediate: true },
)

const filtered_clubs = computed(() => {
  // Define a function called "excludeSelected" that takes a club as an argument
  // and returns true if the club is NOT in the "selected_clubs" list.
  const is_not_selected = (club) => !selected_clubs.value.some(selected => selected.uuid === club.uuid)

  // Create a new array called "available_clubs" by filtering out the clubs
  // in the "clubs" list that are in the "selected_clubs" list.
  const available_clubs = clubs.value.filter(club => is_not_selected(club))
  console.log('available_clubs', available_clubs)

  // If there's a search input, return the filtered clubs based on the search results.
  if (props.search_input) {
    // Get the search results and extract only the club items.
    const filteredResults = searchResults.value?.map(result => result.item)

    // Return the filtered clubs, excluding the clubs in the "selected_clubs" list.
    return filteredResults.filter(club => is_not_selected(club))
  } else {
    // If there's no search input, return the available clubs
    // that are not in the "selected_clubs" list.
    return available_clubs;
  }
})

function toggle_selected_club(club: Club) {
  console.log('toggle_selected_club')
  if (!selected_clubs.value.some(selected_club => selected_club.uuid === club.uuid)) {
    selected_clubs.value = [...selected_clubs.value, club]
  } else {
    selected_clubs.value = selected_clubs.value.filter(selected_club => selected_club.uuid !== club.uuid)
  }
}
</script>