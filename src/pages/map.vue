<template>
  <!-- <pre v-if="display.cookie_modal" class="h-fit w-full">Cookies bien frèèèèè : {{ cookies.getAll() }}</pre> -->
  <div id="main_container" class="relative h-screen--45px flex flex-col overflow-hidden bg-cafe-25 md:h-screen--50px md:flex-row-reverse">
    <WelcomeModal v-if="stored_display.welcome_modal" />
    <div md="w-full" class="h-full flex items-center justify-center">
      <div class="relative h-full w-full">
        <FilterModal v-if="display.filter_modal" />
        <TheMap class="z-10" />
        <div class="relative z-10">
          <SearchBar v-if="!preferences.is_mobile && !display.filter_modal" class="fixed left-9/20 top-1/10 max-w-500px w-3/7" />
        </div>
      </div>
    </div>
    <div v-if="preferences.is_mobile" class="relative flex flex-col">
      <MobileList v-if="!display.filter_modal" class="absolute bottom-5 left-1/2 z-20 h-80 w-full -translate-x-1/2" />
    </div>
    <div v-else>
      <div class="flex flex-row overflow-hidden">
        <DesktopSidebar />
        <DesktopList />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { useCookies } from '@vueuse/integrations/useCookies'

// const cookies = useCookies()
const router = useRouter()
const place_db = computed(() => use_place_store().db_filtered)

onMounted(() => {
  use_map_store().update_markers(place_db, router)
})

watch(place_db, () => {
  use_map_store().update_markers(place_db, router)
}, { immediate: true })
</script>
