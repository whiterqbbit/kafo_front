<template>
  <div class="mx-2 mt-3 h-fit w-13 flex flex-col place-items-center gap-1">
    <!-- <div
      class="sidebar-group-button"
      :class="[display.filter_modal ? 'activated' : 'desactivated']"
      @click="display.filter_modal = !display.filter_modal"
    >
      <button i-fa6-solid-user-group class="sidebar-button" />
    </div>
    <span class="name">Groupes</span> -->
    <div
      class="sidebar-group-button"
      :class="[display.filter_modal ? 'activated' : 'desactivated']"
      @click="display.filter_modal = !display.filter_modal"
    >
      <button i-fa6-solid-sliders class="sidebar-button" />
    </div>
    <span class="name">Filtres</span>
    <!-- <div
      class="sidebar-group-button"
      :class="[display.filter_modal ? 'activated' : 'desactivated']"
      @click="display.filter_modal = !display.filter_modal"
    >
      <button i-fa6-solid-compass class="sidebar-button" />
    </div>
    <span class="name">Découvrir</span> -->
    <div
      class="sidebar-group-button"
      :class="[display.chat_drawer ? 'activated' : 'desactivated']"
      @click="display.chat_drawer = !display.chat_drawer"
    >
      <button i-fa6-solid-comment class="sidebar-button" />
    </div>
    <span class="name">Chats</span>
  </div>
</template>

<style scoped>
.sidebar-group-button {
    @apply w-full aspect-square rounded-xl p-3 shadow-md;
}
.activated {
    @apply bg-cafe-600 text-white;
}

.desactivated {
    @apply bg-white text-cafe-600;
}
.name {
    @apply mb-1 font-normal text-sm;
}

.sidebar-button{
   @apply h-full w-full;
}
</style>
