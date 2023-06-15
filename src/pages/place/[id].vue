<template>
  <div id="main_container" class="w-full">
    <div class="bg-cafe-50">
      <Flicking
        v-if="preferences.is_mobile && pictures" class="flicking-container h-max-1/2 h-100"
        :options="{ renderOnlyVisible: false, horizontal: true, circular: true, autoResize: true }"
      >
        <div
          v-for="pic in pictures"
          :key="pic.medium.url"
          class="flicking-panel"
        >
          <img :src="pic.medium.url" class="h-full w-full object-cover">
        </div>
      </Flicking>
      <div class="flex flex-col gap-3 container">
        <RouterLink to="/map" class="fixed top-7% z-10 ml-1% w-fit rounded-xl bg-cafe-100 px-2 py-1 shadow-md transition-all md:top-25 hover:scale-105">
          Retour à la carte
        </RouterLink>
        <div id="floating_CTA" class="fixed bottom-3 hidden w-[95%] flex-row place-self-center justify-between rounded-xl bg-cafe-200 p-2 text-center shadow-lg">
          <div class="flex flex-col">
            <div>En ce moment</div>
            <div v-if="selected_place?.attendance">
              {{ selected_place?.attendance }}
            </div>
          </div>
          <div class="font-extra-bold rounded-xl bg-grass-500 p-4 text-cafe-100">
            Rejoindre
          </div>
        </div>

        <div id="galleries" class="max-h-1/2 overflow-hidden text-left text-3xl">
          <div v-if="!preferences.is_mobile" id="desktop_gallery" class="pswp-gallery relative h-150 flex gap-2 overflow-hidden rounded-2xl">
            <!-- button more images -->
            <div v-if="selected_place && pictures?.length > 5" class="absolute bottom-10 right-10 rounded-xl bg-cafe-100 px-3 py-1 text-base text-cafe-600 shadow-xl">
              <a
                :href="pictures[0]?.full.url"
                :data-pswp-width="pictures[0]?.full.width"
                :data-pswp-height="pictures[0]?.full.height"
              >Afficher toutes les photos
              </a>
            </div>
            <!-- left image -->
            <div v-if="pictures[0]?.full" class="w-full">
              <a
                :href="pictures[0]?.full.url"
                :data-pswp-width="pictures[0]?.full.width"
                :data-pswp-height="pictures[0]?.full.height"
              >
                <img id="miniature" :src="pictures[0]?.full.url" class="h-full w-full object-cover">
              </a>
            </div>
            <!-- right block -->
            <div v-if="pictures[1]?.full" class="h-full w-full flex flex-col gap-2">
              <!-- top row -->
              <div class="w-full flex flex-row gap-2 object-cover" :class="pictures[2]?.full ? 'h-1/2' : 'h-full'">
                <div class="w-full">
                  <a
                    :href="pictures[1]?.full.url"
                    :data-pswp-width="pictures[1]?.full.width"
                    :data-pswp-height="pictures[1]?.full.height"
                  >
                    <img id="miniature" :src="pictures[1]?.full.url" class="h-full w-full object-cover">
                  </a>
                </div>
                <div v-if="pictures[3]?.full" class="w-full">
                  <a
                    :href="pictures[3]?.full.url"
                    :data-pswp-width="pictures[3]?.full.width"
                    :data-pswp-height="pictures[3]?.full.height"
                  >
                    <img id="miniature" :src="pictures[3]?.full.url" class="h-full w-full object-cover">
                  </a>
                </div>
              </div>
              <!-- bottom row -->
              <div v-if="pictures[2]?.full" class="h-1/2 w-full flex flex-row gap-2 object-cover">
                <div class="w-full">
                  <a
                    :href="pictures[2]?.full.url"
                    :data-pswp-width="pictures[2]?.full.width"
                    :data-pswp-height="pictures[2]?.full.height"
                  >
                    <img id="miniature" :src="pictures[2]?.full.url" class="h-full w-full object-cover">
                  </a>
                </div>
                <div v-if="pictures[4]?.full" class="w-full">
                  <a
                    :href="pictures[4]?.full.url"
                    :data-pswp-width="pictures[4]?.full.width"
                    :data-pswp-height="pictures[4]?.full.height"
                  >
                    <img id="miniature" :src="pictures[4]?.full.url" class="h-full w-full object-cover">
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="title_group" class="flex flex-col gap-3">
          <div id="title" class="text-4xl font-black">
            {{ selected_place?.nom }}
          </div>
          <div id="subtitle" class="flex flex-col font-bold md:flex-row md:justify-between">
            <div v-if="selected_place?.attendance !== 0" id="attendance">
              <div class="flex flex-row items-center gap-5">
                <AvatarStack v-if="selected_place?.attendees" :attendees="selected_place?.attendees" class="ml-2 flex" />
                <div v-if="selected_place?.attendance">
                  {{ selected_place?.attendance }} {{ selected_place?.attendance === 1 ? 'personne y est en ce moment' : 'personnes y sont en ce moment' }}
                </div>
              </div>
            <!-- <div id="eta">
              Les minutes
            </div> -->
            </div>
          </div>
        </div>
        <TagsIcon v-if="selected_place && !preferences.is_mobile" :tags="selected_place?.tags" />
        <div id="main" class="flex flex-col gap-6 md:flex-row md:justify-between">
          <div id="lefty" class="max-w-2xl flex flex-col gap-6 md:w-1/2">
            <div id="description" class="flex flex-col gap-6 text-lg">
              <div class="flex flex-col gap-2">
                <div v-if="selected_place?.desc">
                  {{ selected_place?.desc }}
                </div>
                <div v-if="selected_place?.acces_wifi">
                  <span class="font-semibold">Acces wifi :</span> {{ selected_place?.acces_wifi }}
                </div>
              </div>
              <TagsIcon v-if="preferences.is_mobile && selected_place" :tags="selected_place?.tags" />
              <div v-if="selected_place?.adresse" id="location_container" class="flex flex-row items-center justify-between">
                <!-- Adresse et métro -->
                <div class="max-w-2/3 flex flex-col">
                  <div id="address">
                    {{ selected_place?.adresse }}
                  </div>
                  <div v-if="selected_place?.metro" class="flex items-center gap-2">
                    <img :src="subway_icon" class="h-6 w-6">
                    <span class="overflow-hidden text-ellipsis whitespace-nowrap">
                      {{ selected_place?.metro }}
                    </span>
                  </div>
                </div>

                <!-- Bouton lien itinéraire -->
                <a
                  class="flex flex-shrink-0 flex-row place-items-center gap-2 rounded-3xl px-4 py-2 font-bold text-cafe-100 btn-grass"
                  :href="`https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${selected_place?.nom}&destination_place_id=${selected_place?.google_place_id}&travelmode=walking`"
                  target="_blank"
                >
                  <div class="whitespace-nowrap text-xl">
                    Y aller !
                  </div>
                  <img class="h-6 w-6" :src="google_maps_icon">
                </a>
              </div>
            </div>
          </div>
          <JoinEventModal :place_id="props.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Flicking from '@egjs/vue3-flicking'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'
import type { UseSwipeDirection } from '@vueuse/core'
import subway_icon from '@/assets/img/icons/metro.png'
import google_maps_icon from '@/assets/img/google_maps_icon.png'

const props = defineProps({
  id: String,
})

// get the selected place from the store
const selected_place_id = Number(props.id)
const place_store = use_place_store()
place_store.selected_id = selected_place_id
const selected_place = computed(() => place_store.selected)
const pictures = computed(() => selected_place.value?.pictures || [])
let gallery_open = false

const router = useRouter()

const swipe_target = ref<HTMLElement | null>(null)
useSwipe(swipe_target, {
  passive: false,
  onSwipeEnd(e: TouchEvent, direction: UseSwipeDirection) {
    if (direction === 'left') {
      go_to_next_place()
    } else if (direction === 'right') {
      go_to_previous_place()
    }
  },
})

async function initialize_gallery() {
  if (selected_place.value?.pictures) {
    const lightbox = new PhotoSwipeLightbox({
      gallery: '#desktop_gallery',
      children: 'a',
      pswpModule: () => import('photoswipe'),
    })
    lightbox.init()
    lightbox.on('beforeOpen', () => {
      gallery_open = true
    })
    lightbox.on('close', () => {
      setTimeout(() => {
        gallery_open = false
      }, 100)
    })
  }
}

onMounted(() => {
  initialize_gallery()
})

function go_to_previous_place() {
  const previous_place = place_store.get_previous_place_id(selected_place_id)
  if (previous_place) router.push(`${previous_place}`)
}

function go_to_next_place() {
  const next_place = place_store.get_next_place_id(selected_place_id)
  if (next_place) router.push(`${next_place}`)
}

onKeyStroke('Escape', () => {
  if (!gallery_open) router.push('/map')
})

onKeyStroke('ArrowLeft', () => {
  if (!gallery_open) go_to_previous_place()
})

onKeyStroke('ArrowRight', () => {
  if (!gallery_open) go_to_next_place()
})
</script>

<style scoped>
@import 'photoswipe/dist/photoswipe.css';

.flicking-container {
  display: flex;
  overflow: hidden;
  width: 100%;
  @apply m-0
}

.flicking-panel {
  flex: none;
  width: 100%;
  height: 100%;
  @apply p-0
}
</style>
