import { defineStore } from 'pinia'
import { useCookies } from '@vueuse/integrations/useCookies'
import type { Conversation, Message } from './xano'

export const use_chat_store = defineStore('chat', () => {
  const user_store = use_user_store()
  const chat_loading = ref(false)
  const send_message_loading = ref(false)
  const chat_error = ref<string | null>(null)
  const messages: Ref<Message[] | null> = ref([])
  const selected_conversation: Ref<Conversation | null> = ref(null)
  const interval_id: Ref<NodeJS.Timeout | null> = ref(null)
  const xano_chat_url = `${import.meta.env.VITE_XANO_API_URL}/api:EW8LvnML/chat`

  const conversations = computed(() => {
    if (!messages.value) return null
    const dms: Conversation[] = []
    messages.value.forEach((message: Message) => {
      if (!message) return
      const friend = message.user_id === user_store.id ? message.receiver : message.user
      if (!friend) return
      if (!dms.some(dm => dm.contact.id === friend.id)) dms.push({ contact: friend, messages: [message] })
      else dms.find(dm => dm.contact.id === friend.id)?.messages.push(message)
    })

    const selected_conversation_id = selected_conversation?.value?.contact.id
    selected_conversation.value = dms?.find(c => c.contact.id === selected_conversation_id) || null
    return dms
  })

  async function get_all_messages() {
    if (!user_store.is_auth) return
    const user_auth_cookie = useCookies(['user']).get('token')

    try {
      const response = await fetch(xano_chat_url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user_auth_cookie}`,
        },
      })
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}. Failed to fetch all messages.`)
      const data = await response.json() as Message[] | null

      messages.value = data
      messages.value?.sort((a, b) => {
        if (!a || !b || !a.created_at || !b.created_at) return 0
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      })
    } catch (error) {
      const typed_error = error as Error
      console.error(typed_error.message)
    }
  }

  watch(() => display.chat_drawer, (new_val) => {
    if (new_val === true) {
      interval_id.value = setInterval(() => {
      }, 1000)
    } else if (new_val === false && interval_id.value !== undefined) {
      clearInterval(interval_id.value!)
    }
  }, { immediate: true })

  async function send_message(message: string, receiver_id: number) {
    try {
      const user_auth_cookie = useCookies(['user']).get('token')

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
