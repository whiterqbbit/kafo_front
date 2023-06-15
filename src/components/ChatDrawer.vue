<template>
  <div class="fixed right-0 top-50px z-40 h-screen--50px max-w-full w-full flex overflow-auto border-cafe-400 bg-cafe-50 p-3 shadow-md sm:w-fit sm:animate-fade-in-right sm:animate-duration-130">
    <!-- liste des chatrooms -->
    <div v-if="conversations" class="flex flex-col gap-5 p-2">
      <button class="absolute right-0 top-5 z-20 h-7 w-7 rounded-3xl hover:scale-105" icon="pi pi-times" @click="display.chat_drawer = false">
        <img :src="svg_close">
      </button>
      <div v-if="!preferences.is_mobile || selected_conversation === null" class="pr-4 text-center text-lg font-bold">
        Conversations
      </div>
      <div>
        <div
          v-for="(conversation, index) in conversations"
          :key="index"
          class="flex place-items-center gap-3 rounded-xl p-2 font-bold"
          :class="conversation.contact?.id === selected_conversation?.contact?.id ? 'bg-cafe-600 text-cafe-50' : 'cursor-pointer'"
          @click="use_chat_store().selected_conversation = conversation"
        >
          <img
            v-if="conversation?.contact" :src="conversation?.contact?.pic_xsmall ? conversation?.contact?.pic_xsmall : default_user_pic"
            class="aspect-square h-10 w-10 rounded-full object-cover"
          >
          <span v-if="conversation?.contact?.first_name && !preferences.is_mobile || selected_conversation === null">
            {{ conversation?.contact?.first_name }}
          </span>
        </div>
      </div>
    </div>
    <!-- messages -->
    <div v-if="selected_conversation" class="relative w-full flex flex-col animate-slide-in-right animate-duration-130 gap-2 border-cafe-400 p-2 sm:w-70 sm:border-l-2">
      <button class="absolute left-2 top-2 rounded-3xl p-0 p-x-1 text-xl font-bold btn-cafe-light" icon="pi pi-times" @click="use_chat_store().selected_conversation = null">
        &lt;&lt;
      </button>
      <div class="sm:pt:0 border-t-2 border-color-cafe-400 pt-5 text-center text-lg font-bold sm:border-t-0">
        {{ selected_conversation.contact.first_name }}
      </div>
      <div
        ref="message_container"
        class="w-full flex flex-col place-self-end gap-2 overflow-auto"
      >
        <div
          v-for="message in selected_conversation.messages"
          :key="message.id"
          class="w-full flex flex-col"
        >
          <div
            class="w-max-4/5 w-fit flex rounded-xl p-2"
            :class="message.user_id === user_store.id ? 'bg-grass-500 text-cafe-50 rounded-br-none place-self-end' : 'bg-cafe-300 rounded-bl-none'"
          >
            {{ message.message }}
          </div>
          <div
            v-if="message.created_at"
            class="text-xs text-cafe-400"
            :class="message.user_id === user_store.id ? 'text-right' : 'text-left'"
          >
            {{ format_timestamp(message.created_at) }}
          </div>
        </div>
      </div>
      <div class="max-w-55 flex gap-1">
        <ATextarea
          v-model="new_message"
          class="w-full flex grow--1 rounded-xl text-sm text-cafe-600 shadow-inner placeholder-cafe-400"
          placeholder="Votre message..."
          auto-size
          :loading="use_chat_store().send_message_loading"
          @keyup.enter="send_message()"
        />
        <button
          v-if="new_message"
          class="w-full flex rounded-xl p-0 p-x-1 text-xl font-bold btn-grass"
          :disabled="use_chat_store().send_message_loading"
          @click="send_message()"
        >
          <MaterialSymbolsSend class="h10 w-10 p-1" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import default_user_pic from '@/assets/img/default_user_pic.png'
import svg_close from '@/assets/svg/icon/MingcuteCloseFill.svg'

const user_store = use_user_store()
const conversations = computed(() => use_chat_store().conversations)
const selected_conversation = computed(() => use_chat_store().selected_conversation)
const new_message = ref('')
const message_container = ref<HTMLElement | null>(null)

onMounted(() => scroll_to_bottom)

function format_timestamp(timestamp: Date) {
  if (!timestamp) return ''
  const message_date = new Date(timestamp)

  const today = new Date()
  const is_today: Boolean = message_date.getDate() === today.getDate()
                          && message_date.getMonth() === today.getMonth()
                          && message_date.getFullYear() === today.getFullYear()

  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const is_yesterday: Boolean = message_date.getDate() === yesterday.getDate()
                            && message_date.getMonth() === yesterday.getMonth()
                            && message_date.getFullYear() === yesterday.getFullYear()

  const time_string = message_date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })

  if (is_today) {
    return time_string
  } else if (is_yesterday) {
    return `Hier à ${time_string}`
  } else {
    return `Le ${message_date.toLocaleDateString()} à ${time_string}`
  }
}

watch(selected_conversation, () => nextTick(scroll_to_bottom), { immediate: true })

async function send_message() {
  use_chat_store().send_message_loading = true
  if (!selected_conversation?.value?.contact.id) return
  await use_chat_store().send_message(new_message.value, selected_conversation?.value?.contact.id)
  new_message.value = ''
  use_chat_store().send_message_loading = false
  nextTick(scroll_to_bottom)
}

function scroll_to_bottom() {
  if (!message_container.value) return
  message_container.value.scrollTop = message_container.value.scrollHeight
}
</script>
