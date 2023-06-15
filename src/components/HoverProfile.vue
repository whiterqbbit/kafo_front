<template>
  <div v-if="display.hover_profile_attendee" ref="hover_profile" class="hover-profile-container" :style="position_style">
    <div class="flex animate-zoom-in animate-duration-40 gap-3 rounded-3xl bg-white p-3 shadow-md">
      <div class="flex flex-col items-center gap-1">
        <img
          :src="display.hover_profile_attendee?.pic_xsmall ? display.hover_profile_attendee?.pic_small : default_user_pic"
          class="aspect-square h-25 w-25 rounded-full object-cover"
        >
        <div
          v-if="display.hover_profile_attendee.id !== use_user_store().id"
          class="flex p1 btn-cafe-light"
          @click="open_conversation"
        >
          <MaterialChatRounded class="h-6 w-6" />
          <div class="flex items-center text-xs">
            contacter
          </div>
        </div>
        <div v-else class="flex items-center text-xs">
          C'est vous
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <div v-if="display.hover_profile_attendee?.first_name" class="text-lg font-bold">
          {{ display.hover_profile_attendee?.first_name }}
        </div>
        <div v-if="display.hover_profile_attendee?.job_title">
          {{ display.hover_profile_attendee?.job_title }}
        </div>
        <div v-if="display.hover_profile_attendee?.bio" class="text-sm text-gray-500">
          {{ display.hover_profile_attendee?.bio }}
        </div>
        <div>
          <div v-if="display.hover_profile_attendee?.open_to_pause" class="text-xs font-bold">
            Dispo pour un café
          </div>
          <div v-if="display.hover_profile_attendee?.open_to_lunch" class="text-xs font-bold">
            Dispo pour casser une graine
          </div>
          <div v-if="display.hover_profile_attendee?.open_to_afterwork" class="text-xs font-bold">
            Dispo pour un afterwork
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import default_user_pic from '@/assets/img/default_user_pic.png'

const props = defineProps<{
  x: number
  y: number
}>()

const hover_profile = ref<HTMLElement | null>(null)
const position_style: Ref<{ left: string; top: string } | {}> = ref({})

onClickOutside(hover_profile, () => display.hover_profile = false)

const profile_dimensions = computed(() => {
  if (!hover_profile.value) return { width: 400, height: 400 }
  return {
    width: hover_profile.value.clientWidth,
    height: hover_profile.value.clientHeight,
  }
})

onMounted(() => position_style.value = get_position_style())

function get_position_style() {
  const padding = 10
  const left = props.x ? props.x + profile_dimensions.value.width / 2 + padding : 0
  const top = props.y ? props.y - profile_dimensions.value.height - padding : 0

  return {
    left: `${left}px`,
    top: `${top}px`,
  }
}

function open_conversation() {
  if (!display.hover_profile_attendee) return
  if (!use_chat_store().conversations?.find(c => c.contact.id === display.hover_profile_attendee?.id)) {
    use_chat_store().conversations?.push({
      contact: display.hover_profile_attendee,
      messages: [
        { message: 'Brisez la glace !', id: 0, user_id: 0 },
      ],
    })
    use_chat_store().selected_conversation = use_chat_store().conversations?.[-1] ?? null
  } else {
    use_chat_store().selected_conversation = use_chat_store().conversations?.find(c => c.contact.id === display.hover_profile_attendee?.id) ?? null
  }

  display.hover_profile = false
  display.chat_drawer = true
}
</script>

<style scoped>
.hover-profile-container {
    transform: translateX(-50%);
    @apply absolute place-items-center max-w-100
}
</style>
