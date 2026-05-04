import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from '#app'
import { useCookie, useNuxtApp } from '#imports'
import _ from 'lodash'

interface Portfolio {
  title: string
  cta: string
  title_color: string
  image: {
    url: string
  }
}

export class AuthLayoutController {
  // --- Reactive State ---
  swapping = ref(false)
  interval = ref<NodeJS.Timeout | null>(null)
  ads_background = ref<string | null>(null)
  ads_title = ref<string | null>(null)
  ads_cta = ref<string | null>(null)
  ads_color = ref<string | null>(null)
  submitted = ref(false)
  loading = ref(false)
  portfolios = reactive<Portfolio[]>([])
  time = ref(new Date())
  model = reactive({
    title: null as string | null,
    content: '',
  })

  private nuxtApp: any
  private route: any
  private cookies: any
  private toast: any
  private store: any

  private refs: any = {
    feedback: {
      toggleShow: (val: boolean) => console.log('feedback toggleShow', val),
    },
    loggedout: {
      toggleShow: (val: boolean) => console.log('loggedout toggleShow', val),
    },
    discover: {
      toggleShow: (val: boolean) => console.log('discover toggleShow', val),
    },
  }

  constructor() {
    this.nuxtApp = useNuxtApp()
    this.route = useRoute()
    this.cookies = useCookie
    this.toast = this.nuxtApp.$toast
    this.store = this.nuxtApp.$store

    this.setupLifecycleHooks()
  }

  // TODO (Bahiyah): Replace when translation is already available
  private composeLocale(key: string): string {
    console.log(`composeLocale: ${key}`)
    return `Translated: ${key}`
  }

  // TODO (Bahiyah): Replace when error message handler is already available
  private getErrorMsg(error: any) {
    console.error('Error:', error)
    this.toast?.error('An error occurred.')
  }

  open = () => {
    console.log('open modal cta')
  }

  close = () => {
    console.log('close modal cta')
  }

  toggleFeedback = (value: boolean) => {
    if (_.get(this.refs, 'feedback')) {
      this.refs.feedback.toggleShow(value)
    }
  }

  toggleLoggedOut = (value: boolean) => {
    if (_.get(this.refs, 'loggedout')) {
      this.refs.loggedout.toggleShow(value)
    }
  }

  toggleDiscover = (value: boolean) => {
    if (_.size(this.portfolios)) {
      this.refs.discover.toggleShow(value)
    }
  }

  toggleTitle = (value: string) => {
    if (this.model.title === value) {
      this.model.title = null
    } else {
      this.model.title = value
    }
  }

  submitFeedback = async () => {
    if (this.loading.value) {
      return
    }
    if (this.model.title === null) {
      return this.toast?.error(this.composeLocale('toast.feedback.noRating'))
    }
    if (_.trim(this.model.content) === '') {
      return this.toast?.error(this.composeLocale('toast.feedback.noFeedback'))
    }

    this.loading.value = true
    const data = this.model
    try {
      await this.store?.dispatch('feedbacks/store', { data })
      this.submitted.value = true
      this.cookies('feedback', { path: '/', maxAge: 60 * 60 * 24 * 7 }).value =
        true
    } catch (error) {
      this.getErrorMsg(error)
    } finally {
      this.loading.value = false
    }
  }

  private setupLifecycleHooks() {
    onMounted(async () => {
      const loggedoutCookie = this.cookies('loggedout').value
      if (loggedoutCookie && loggedoutCookie.status) {
        this.toggleLoggedOut(true)
        this.time.value = loggedoutCookie.time
        this.cookies('loggedout', {
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        }).value = { status: false, time: null }
      }

      const feedbackCookie = this.cookies('feedback').value
      if (_.isUndefined(feedbackCookie)) {
        this.cookies('feedback', {
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        }).value = false
        this.submitted.value = false
      } else {
        this.submitted.value = feedbackCookie
      }

      if (typeof window !== 'undefined' && (window as any).fbq) {
        ;(window as any).fbq('trackCustom', 'PageViewCosec')
      }
    })

    onBeforeUnmount(() => {
      if (this.interval.value) {
        clearInterval(this.interval.value)
      }
    })
  }

  public getExposedProperties() {
    return {
      swapping: this.swapping,
      ads_background: this.ads_background,
      ads_title: this.ads_title,
      ads_cta: this.ads_cta,
      ads_color: this.ads_color,
      submitted: this.submitted,
      loading: this.loading,
      portfolios: this.portfolios,
      time: this.time,
      model: this.model,
      open: this.open,
      close: this.close,
      toggleFeedback: this.toggleFeedback,
      toggleLoggedOut: this.toggleLoggedOut,
      toggleDiscover: this.toggleDiscover,
      toggleTitle: this.toggleTitle,
      submitFeedback: this.submitFeedback,
    }
  }
}
