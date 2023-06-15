<template>
  <header class="top-0 z-50 h-50px w-full flex flex-row place-items-center justify-between bg-cafe-600">
    <RouterLink class="icon-btn" to="/">
      <img :src="logo" alt="logo" class="h-12 pl-4">
    </RouterLink>
    <SvgSpinnersRingResize v-if="user.is_loading" class="mr-4 h-10 w-10" />
    <div v-else-if="!user.is_auth" class="m-2 font-bold btn-grass" @click="display.login_modal = !display.login_modal">
      Se connecter
    </div>
    <img v-else :src="user.pic_xsmall ? user.pic_xsmall : default_user_pic" alt="avatar" class="mr-4 h-10 w-10 cursor-pointer border border-cafe-100 rounded-full" @click="display_modal('profile')">
  </header>
  <ProfileModal v-if="display.profile_modal" />
  <LoginModal v-if="display.login_modal" />
</template>

<script setup lang="ts">
import logo from '@/assets/img/logo/kafo_logo_white.png'
import { use_user_store } from '@/stores/user'
import default_user_pic from '@/assets/img/default_user_pic.png'

const user = use_user_store()

function display_modal(modal_name: string) {
  switch (modal_name) {
    case 'profile':
      reset_display()
      display.profile_modal = true
      break
  }
}
</script>

<style scoped>
.menu-item{
  @apply cursor-pointer
}
</style>
