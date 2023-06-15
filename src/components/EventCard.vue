<template>
  <div class="w-full flex rounded-xl bg-cafe-400 p-1">
    <ADialog
      v-if="confirmation_modal.session"
      v-model="confirmation_modal.display"
      :title="confirmation_modal.is_joining ? 'Vous avez rejoint la session !' : 'Vous avez quitté la session !'"
      :subtitle="`${get_relative_date_from_date(day)} de ${convert_to_hour_format(confirmation_modal?.session?.start)} à ${convert_to_hour_format(confirmation_modal.session.end)}`"
      :text="confirmation_modal.is_joining ? 'Votre venue est notifié aux membres de Kafo, mais n\'est pas une réservation !' : ''"
    >
      <div class="m-4 flex flex-col gap-4">
        <!-- <ACheckbox
      v-model="confirmation_modal.is_joining"
      class="text-sm"
      label="Me notifier si quelqu'un rejoint la session"
      /> -->
        <div class="flex gap-4">
          <ABtn @click="confirmation_modal.display = false">
            Retour
          </ABtn>
          <ABtn v-if="confirmation_modal.is_joining" variant="light" icon="i-bx-calendar">
            <a :href="confirmation_modal.calendar_link" target="_blank">Google Calendar</a>
          </ABtn>
        </div>
      </div>
    </ADialog>
    <div class="w-1/4 flex flex-col p-3 text-cafe-50">
      <span class="text-xl font-bold">
        {{ get_day_from_date(day) }} {{ get_month_name_from_date(day) }}
      </span>
      <span class="text-sm font-bold">
        {{ get_relative_date_from_date(day) }}
      </span>
    </div>
    <div v-if="events_of_the_day" class="w-3/4 flex flex-col gap-1">
      <div
        v-for="session in events_of_the_day"
        :key="session.id || 'Fallback'"
        class="w-full flex flex-col gap-1 rounded-xl bg-cafe-100 p-3"
      >
        <div v-if="session.in_current_slot" class="text-xl font-bold uppercase">
          En ce moment
        </div>
        <div>
          {{ convert_to_hour_format(session.start) }} - {{ convert_to_hour_format(session.end) }}
        </div>
        <div v-if="session.user_id?.length && !session.in_current_slot" class="my-2 mt-5 max-h-80 flex flex-col gap-4 overflow-auto">
          <AvatarStack :attendees="session.user_id" />
        </div>
        <div v-else-if="session.user_id?.length">
          <div
            v-for="user in session.user_id" :key="user.id || 'fallback-key'"
            class="flex cursor-pointer items-center gap-3 rounded-xl p-1.5"
            :class="user_store.id === user.id ? 'bg-cafe-300' : '' "
            @click="toggle_hover_profile(user)"
          >
            <img :src="user.pic_xsmall ? user.pic_xsmall : default_user_pic" class="aspect-square h-15 rounded-full object-cover">
            <div>
              <div class="text-lg font-bold">
                {{ user.incognito ? 'Personne incognito' : user.first_name }}
              </div>
              <div>{{ user.job_title }}</div>
            </div>
          </div>
        </div>
        <button class="w-full p-2 font-bold btn-grass" @click="submit_to_event(session)">
          <div v-if="!is_loading.get(session.id)">
            {{ event_store?.is_user_in_event(session.id) ? 'Quitter' : 'Rejoindre' }}
          </div>
          <ThreeDotsSpinner v-else class="mx-auto" />
        </button>
      </div>
    </div>
    <div v-else class="flex-co w-3/4 flex place-items-center justify-center rounded-xl bg-cafe-600 p-3">
      <div class="font-bold uppercase text-cafe-100">
        Indisponible
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { convert_date, convert_to_hour_format, get_day_from_date, get_month_name_from_date, get_relative_date_from_date, is_slot_current } from '@/utils/date_utils'
import default_user_pic from '@/assets/img/default_user_pic.png'
import type { Session } from '@/stores/xano'

const props = defineProps({
  day: {
    type: Date,
    required: false,
    default: null,
  },
})

const event_store = use_event_store()
const user_store = use_user_store()
const place_store = use_place_store()

const day = ref(props.day ?? new Date())
const is_loading = ref(new Map())
const confirmation_modal = reactive({
  session: null as Session | null,
  is_joining: false,
  display: false,
  calendar_link: '',
})

// Creates an array of the session of the day and add useful variables to each session
const events_of_the_day = computed(() => {
  if (!event_store.selected_place_events) {
    return null
  }

  let events = event_store.selected_place_events?.filter((session) => {
    if (!session.jour) return false
    const event_date = new Date(session.jour)
    if (
      event_date.getDate() === day.value.getDate()
      && event_date.getMonth() === day.value.getMonth()
      && event_date.getFullYear() === day.value.getFullYear()
    ) {
      session.in_current_slot = is_slot_current(session.start, session.end)

      let date_relative_to_today = get_relative_date_from_date(day.value)
      if ((date_relative_to_today === 'Aujourd\'hui') && session.in_current_slot) {
        date_relative_to_today = 'En ce moment'
      }
      session.relative_to_now = date_relative_to_today
      return true
    }
    return false
  })

  events = events.sort((a, b) => a.start < b.start ? -1 : 1)
  if (events?.length) return events
  return null
})

async function submit_to_event(session: Session) {
  if (!user_store.id) {
    display.login_modal = true
    return false
  }
  is_loading.value.set(session.id, true)
  try {
    const res = await event_store.submit_events(session.id)
    if (res.ok) {
      confirmation_modal.session = session
      confirmation_modal.is_joining = res.subscribe
      confirmation_modal.display = true
      const converted_start = convert_date(session.start)
      const converted_end = convert_date(session.end)
      const place_name = place_store?.db?.find(place => place.id === session.coffee_id)?.nom
      const place_adresse = place_store?.db?.find(place => place.id === session.coffee_id)?.adresse
      confirmation_modal.calendar_link = `https://calendar.google.com/calendar/u/0/r/eventedit?dates=${converted_start}/${converted_end}&text=${place_name}&location=${place_adresse}`
    }
  } catch (error) {
    console.error(error)
  } finally {
    is_loading.value.set(session.id, false)
  }
}
</script>
