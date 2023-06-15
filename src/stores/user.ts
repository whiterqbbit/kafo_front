import { defineStore } from 'pinia'
import { useCookies } from '@vueuse/integrations/useCookies'
import type { Club, User } from './xano.d'

const cookies = useCookies(['user'])

export const use_user_store = defineStore('user', () => {
  const is_auth = ref(false)
  const user_coords = ref<{ lat: number; lng: number } | null>(null)
  const bio = ref('')
  const clubs = ref<Array<Club>>([])
  const domaine = ref('')
  const email = ref('')
  const family_name = ref('')
  const first_name = ref('')
  const highlighted_pins = ref<Array<number>>([])
  const highlighted_users = ref<Array<number>>([])
  const id = ref<number | null >(null)
  const incognito = ref<boolean | null >(null)
  const is_inboarded = ref<boolean | null >(null)
  const job_title = ref('')
  const open_to_afterwork = ref<boolean | null >(null)
  const open_to_lunch = ref<boolean | null >(null)
  const open_to_pause = ref<boolean | null >(null)
  const pic_medium = ref('')
  const pic_small = ref('')
  const pic_xsmall = ref('')
  const role = ref('')
  const type = ref('')
  const is_loading = ref(false)

  const computed_open_to_afterwork = computed({
    get: () => !!open_to_afterwork.value,
    set: (value: boolean) => {
      open_to_afterwork.value = value
      edit_user({ open_to_afterwork: value })
    },
  })

  const computed_open_to_lunch = computed({
    get: () => !!open_to_lunch.value,
    set: (value: boolean) => {
      open_to_lunch.value = value
      edit_user({ open_to_lunch: value })
    },
  })

  const computed_open_to_pause = computed({
    get: () => !!open_to_pause.value,
    set: (value: boolean) => {
      open_to_pause.value = value
      edit_user({ open_to_pause: value })
    },
  })

  async function edit_user(user_infos: User) {
    try {
      const xano_edit_user_url = `${import.meta.env.VITE_XANO_API_URL}/api:EW8LvnML/self/edit_details`
      const response = await fetch(xano_edit_user_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get('token')}`,
        },
        body: JSON.stringify({ ...user_infos }),
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.message)

      update_user(data)
    } catch (error) {
      console.error('Error during edit_user:', error)
      throw error
    }
  }

  async function suggestion(form: { email: string; message: string; category: { name: string } }): Promise<void> {
    try {
      const xano_suggestion_url = `${import.meta.env.VITE_XANO_API_URL}/api:5e9BgwVw/suggestion`
      const response = await fetch(xano_suggestion_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            from_email: form.email,
            category: form.category.name,
            body: form.message,
          },
        ),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error during suggestion:', error)
      throw error
    }
  }

  async function login(email: string, password: string): Promise<void> {
    is_loading.value = true
    try {
      const xano_login_url = `${import.meta.env.VITE_XANO_API_URL}/api:EW8LvnML/auth/login`
      const response = await fetch(xano_login_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            email,
            password,
          },
        ),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message)
      }

      const data = await response.json()
      cookies.set('token', data.authToken)
      me()
    } catch (error) {
      console.error('Error during login:', error)

      const typed_error = error as Error
      switch (typed_error.message) {
        case 'Invalid Credentials.':
          typed_error.message = 'Identifiants incorrects.'
          break
        case 'Missing param: password':
          typed_error.message = 'Veuillez entrer un mot de passe.'
          break
        case 'Missing param: field_value':
          typed_error.message = 'Veuillez remplir tous les champs.'
          break
      }

      throw typed_error
    }
    is_loading.value = false
  }

  async function signup(infos: { name: string; first_name: string; job_title: string; bio: string; email: string; password: string }) {
    const { name, first_name, job_title, bio, email, password } = infos

    try {
      const xano_signup_url = `${import.meta.env.VITE_XANO_API_URL}/api:EW8LvnML/auth/signup`
      const response = await fetch(xano_signup_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            email,
            password,
            name: first_name,
            nom_de_famille: name,
            bio,
            job_title,
          },
        ),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message)
      }

      const data = await response.json()
      cookies.set('token', data.authToken)
      me()
    } catch (error) {
      console.error('Error during signup:', error)
      const typed_error = error as Error

      switch (typed_error.message) {
        case 'Missing param: nom_de_famille':
          typed_error.message = 'Veuillez entrer un nom de famille.'
          break
        case 'This account is already in use.':
          typed_error.message = 'Ce compte est déjà utilisé.'
          break
        case 'Missing param: field_value':
          typed_error.message = 'Veuillez remplir tous les champs.'
          break
        case 'Input does not meet minimum length requirement of 8 characters':
          typed_error.message = 'Le mot de passe doit contenir 8 caractères minimum.'
          break
        case 'Weak password detected. Please use at least 1 numbers.':
          typed_error.message = 'Le mot de passe est trop faible, veuillez entrer au moins un chiffre.'
          break
      }

      throw typed_error
    }
  }

  async function remove_club(club: Club) {
    clubs.value = clubs.value.filter(club_to_parse => club_to_parse.uuid !== club.uuid)
    try {
      const xano_sub_club_url = `${import.meta.env.VITE_XANO_API_URL}/api:EW8LvnML/self/edit_details`
      const response = await fetch(xano_sub_club_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get('token')}`,
        },
        body: JSON.stringify(
          {
            uuid: club.uuid,
            subscribe: false,
          },
        ),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error during edit_user:', error)
      throw error
    }
  }

  async function add_club(club: Club) {
    clubs.value.push(club)
    try {
      const xano_sub_club_url = `${import.meta.env.VITE_XANO_API_URL}/api:EW8LvnML/self/edit_details`
      const response = await fetch(xano_sub_club_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get('token')}`,
        },
        body: JSON.stringify(
          {
            uuid: club.uuid,
            subscribe: true,
          },
        ),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error during edit_user:', error)
      throw error
    }
  }

  const env = import.meta.env.VITE_ENV

  let redirect_uri: string
  switch (env) {
    case 'development':
      redirect_uri = import.meta.env.VITE_REDIR_DEV
      break
    case 'staging':
      redirect_uri = import.meta.env.VITE_REDIR_STAGING
      break
    case 'production':
      redirect_uri = import.meta.env.VITE_REDIR_PROD
      break
    default:
      console.error('Unknown environment:', env)
      break
  }

  async function linkedin_init() {
    is_loading.value = true
    try {
      const xano_linkedin_init_url = `${import.meta.env.VITE_XANO_API_URL}/api:UpsZVD6L/oauth/linkedin/init`
      const response = await fetch(`${xano_linkedin_init_url}?redirect_uri=${encodeURIComponent(redirect_uri)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) throw new Error(`HTTP error ${response.status}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error during linkedin init:', error)
    }
    is_loading.value = false
  }

  async function linkedin_continue(code: string | null): Promise<void> {
    is_loading.value = true
    try {
      const xano_linkedin_continue_url = `${import.meta.env.VITE_XANO_API_URL}/api:UpsZVD6L/oauth/linkedin/continue`
      const response = await fetch(`${xano_linkedin_continue_url}?code=${code}&redirect_uri=${redirect_uri}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) throw new Error(`HTTP error ${response.status}`)
      const data = await response.json()
      cookies.set('token', data.authToken)
      me()
    } catch (error) {
      console.error('Error during linkedin continue:', error)
    }
    is_loading.value = false
  }

  function logout(): void {
    reset_user()
    cookies.set('token', '')
  }

  async function me(): Promise<void> {
    const user_auth_cookie = cookies.get('token')
    const chat_store = use_chat_store()
    if (!user_auth_cookie) {
      console.error('No user auth cookie')
      return
    }

    is_loading.value = true
    try {
      const xano_me_url = `${import.meta.env.VITE_XANO_API_URL}/api:EW8LvnML/auth/me`
      const response = await fetch(xano_me_url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user_auth_cookie}`,
        },
      })
      const data: User = await response.json()
      update_user(data)
    } catch (error) {
      console.error(error)
    }
    chat_store.get_all_messages()
    is_loading.value = false
  }

  function reset_user() {
    is_auth.value = false
    bio.value = ''
    clubs.value = []
    domaine.value = ''
    email.value = ''
    family_name.value = ''
    first_name.value = ''
    highlighted_pins.value = []
    highlighted_users.value = []
    id.value = null
    incognito.value = false
    is_inboarded.value = false
    job_title.value = ''
    open_to_afterwork.value = false
    open_to_lunch.value = false
    open_to_pause.value = false
    pic_medium.value = ''
    pic_small.value = ''
    pic_xsmall.value = ''
    role.value = ''
    type.value = ''
  }

  function update_user(data: User | null) {
    if (data === null) {
      reset_user()
      return
    }
    is_auth.value = data !== null
    bio.value = data?.bio ?? bio.value
    clubs.value = data?.clubs ?? clubs.value
    domaine.value = data?.domaine ?? domaine.value
    email.value = data?.email ?? email.value
    family_name.value = data?.family_name ?? family_name.value
    first_name.value = data?.first_name ?? first_name.value
    highlighted_pins.value = data?.highlighted_pins ?? highlighted_pins.value
    highlighted_users.value = data?.highlighted_users ?? highlighted_users.value
    id.value = data?.id ?? id.value
    incognito.value = data?.incognito ?? incognito.value
    is_inboarded.value = data?.is_inboarded ?? is_inboarded.value
    job_title.value = data?.job_title ?? job_title.value
    open_to_afterwork.value = data?.open_to_afterwork ?? open_to_afterwork.value
    open_to_lunch.value = data?.open_to_lunch ?? open_to_lunch.value
    open_to_pause.value = data?.open_to_pause ?? open_to_pause.value
    pic_medium.value = data?.pic_medium ?? pic_medium.value
    pic_small.value = data?.pic_small ?? pic_small.value
    pic_xsmall.value = data?.pic_xsmall ?? pic_xsmall.value
    role.value = data?.role ?? role.value
    type.value = data?.type ?? type.value
  }

  return {
    add_club,
    remove_club,
    is_auth,
    is_loading,
    bio,
    clubs,
    user_coords,
    domaine,
    email,
    edit_user,
    family_name,
    first_name,
    highlighted_pins,
    highlighted_users,
    id,
    incognito,
    is_inboarded,
    job_title,
    open_to_afterwork,
    open_to_lunch,
    open_to_pause,
    computed_open_to_afterwork,
    computed_open_to_lunch,
    computed_open_to_pause,
    pic_medium,
    pic_small,
    pic_xsmall,
    role,
    suggestion,
    type,
    linkedin_init,
    linkedin_continue,
    login,
    signup,
    logout,
    me,
  }
},
)
