import { defineStore } from 'pinia'
import { useCookies } from '@vueuse/integrations/useCookies'
import type { Chat, Conversation } from './xano'

export const use_chat_store = defineStore('chat', () => {
  const user_store = use_user_store()
  const chat_loading = ref(false)
  const send_message_loading = ref(false)
  const chat_error = ref<string | null>(null)
  const messages: Ref<Chat[] | null> = ref([])
  const selected_conversation: Ref<Conversation | null> = ref(null)
  const intervalId: Ref<NodeJS.Timeout | null> = ref(null)

  const conversations = computed(() => {
    if (!messages.value) return null
    const dms: Conversation[] = []
    messages.value.forEach((message: Chat) => {
      if (!message) return
      const friend = message.user_id === user_store.id ? message.receiver : message.user
      if (!friend) return
      if (!dms.some(dm => dm.contact.id === friend.id)) dms.push({ contact: friend, messages: [message] })
      else dms.find(dm => dm.contact.id === friend.id)?.messages.push(message)
    })

    const selected_conversation_id = selected_conversation?.value?.contact.id
    console.log('selected_conversation_id', selected_conversation_id)
    selected_conversation.value = dms?.find(c => c.contact.id === selected_conversation_id) || null
    return dms
  })

  async function get_all_messages() {
    if (!user_store.is_auth) {
      return
    }
    const cookies = useCookies(['user'])
    const user_auth_cookie = cookies.get('token')
    try {
      const xano_chat_url = `${import.meta.env.VITE_XANO_API_URL}/api:EW8LvnML/chat`
      const response = await fetch(xano_chat_url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user_auth_cookie}`,
        },
      })
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}. Failed to fetch all messages.`)
      const data = await response.json() as Chat[] | null

      messages.value = data
      messages.value?.sort((a, b) => {
        if (!a || !b) return 0
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      })
    } catch (error) {
      const typed_error = error as Error
      console.error(typed_error.message)
    }
  }

  watch(() => display.chat_shutter, (newVal, oldVal) => {
    if (newVal === true) {
      // Start fetching messages every second when display.chat_shutter becomes true
      intervalId.value = setInterval(() => {
        get_all_messages()
      }, 5000)
    } else if (newVal === false && intervalId.value !== undefined) {
      // Stop fetching messages when display.chat_shutter becomes false
      clearInterval(intervalId.value!)
    }
  }, { immediate: true })

  async function send_message(message: string, receiver_id: number) {
    try {
      const cookies = useCookies(['user'])
      const user_auth_cookie = cookies.get('token')
      const xano_chat_url = `${import.meta.env.VITE_XANO_API_URL}/api:EW8LvnML/chat`
      const response = await fetch(xano_chat_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user_auth_cookie}`,
        },
        body: JSON.stringify({
          message,
          receiver_id,
        }),
      })
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}. Failed to fetch all messages.`)
      get_all_messages()
    } catch (error) {
      const typed_error = error as Error
      console.error(typed_error.message)
    }
  }

  return {
    send_message,
    messages,
    get_all_messages,
    chat_loading,
    chat_error,
    conversations,
    selected_conversation,
    send_message_loading,
  }
})
