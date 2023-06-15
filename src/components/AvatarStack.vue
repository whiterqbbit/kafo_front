<template>
  <div class="avatar-container flex">
    <div
      v-for="attendee in props.attendees"
      :key="attendee.id || 'fallback'"
      class="attendee-img h-10 w-10 rounded-full bg-cafe-100"
      @click="toggle_hover_profile(attendee)"
    >
      <img :src="attendee?.pic_xsmall ? attendee?.pic_xsmall : default_user_pic" class="h-full w-full rounded-full object-cover">
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/stores/xano.d.ts'
import default_user_pic from '@/assets/img/default_user_pic.png'

const props = defineProps<{
  attendees: User[]
}>()
</script>

<style scoped>
.attendee-img {
  position: relative;
  margin-right: -10px;
  z-index: 6;
}
</style>
