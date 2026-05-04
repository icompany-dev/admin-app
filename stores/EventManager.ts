//NOTE: This pinia store manages the states for the app
// 1. States here are use to communicate between the component on global scale
// 2. Imagine `broadcast` and `subscribe`, and the concept of event bus and event grids
// 3. There will be components or layouts that will 'broadcast' the message -- set
// 4. There will be components that will 'subscribe' to the message - get
// 5. The messages are specific to their purpose. Should never be used for other things.
import { defineStore } from "pinia"
import { PaymentCart } from "~/scripts/models/PaymentCart"

export const useEventManagerStore = defineStore("eventManager", () => {
  const makePayment = ref<boolean>(false)
  const entityTypeToMakePayment = ref<string | null>(null)
  const entityIdToMakePayment = ref<string | null>(null)
  const paymentCart = ref<PaymentCart | null>(null)

  const isHandlePostPayment = ref<boolean>(false)
  const isPaymentSuccessful = ref<boolean>(false)
  const paymentTarget = ref<string | null>(null)
  const paymentTargetId = ref<string | null>(null)
  const paymentOrderId = ref<string | null>(null)
  const isUpdatePaymentCart = ref<boolean>(false)

  const isItemRemovedFromCart = ref<boolean>(false)

  const isDocumentActive = ref<boolean>(false)
  const isDocumentPreview = ref<boolean>(false)
  const isHeaderSearchHidden = ref<boolean>(false)
  const hasColorModeChanged = ref<boolean>(false)

  const isAllotingPreferenceShare = ref<boolean>(false)

  const isPopupShowing = ref<boolean>(false)

  const isOpenSearchBar = ref<boolean>(false)
  const searchBarText = ref<string | null>(null)
  const isSetSearchInputInFocus = ref<boolean>(false)
  const canSelectCompany = ref<boolean | null>(null)

  const isSidebarOpen = ref<boolean>(false)
  const isSidebarOpenFull = ref<boolean>(false)

  const isShowWelcomeAfterEKYC = ref<boolean>(false)
  const isShowUserProfilePostEKYC = ref<boolean>(false)
  const isShowUserProfile = ref<boolean>(false)
  const isShowUserPortfolio = ref<boolean>(false)
  const isShowUserPreferences = ref<boolean>(false)

  const isDisablePage = ref<boolean>(false)

  const selectedAuditorPartnerId = ref<string | null>(null)

  const documentToView = ref<string | null>(null)

  const isShowGlossary = ref<boolean>(false)
  const glossarySearchText = ref<string | null>(null)

  function setMakePayment(value: boolean): void {
    makePayment.value = value
  }

  function setEntityTypeToMakePayment(value: string): void {
    entityTypeToMakePayment.value = value
  }

  function setEntityIdToMakePayment(entityId: string): void {
    entityIdToMakePayment.value = entityId
  }

  function setPaymentCart(value: PaymentCart | null): void {
    paymentCart.value = value
  }

  function resetMakePaymentValues(): void {
    makePayment.value = false
    entityTypeToMakePayment.value = null
    entityIdToMakePayment.value = null
    paymentCart.value = null
  }

  function setIsHandlePostPayment(value: boolean): void {
    isHandlePostPayment.value = value
  }

  function setIsPaymentSuccessful(value: boolean): void {
    isPaymentSuccessful.value = value
  }

  function setPaymentTarget(value: string): void {
    paymentTarget.value = value
  }

  function setPaymentTargetId(value: string): void {
    paymentTargetId.value = value
  }

  function setPaymentOrderId(value: string): void {
    paymentOrderId.value = value
  }

  function setIsUpdatePaymentCart(value: boolean): void {
    isUpdatePaymentCart.value = value
  }

  function setIsItemRemovedFromCart(value: boolean): void {
    isItemRemovedFromCart.value = value
  }

  function resetHandlePostPaymentValues(): void {
    isHandlePostPayment.value = false
    isPaymentSuccessful.value = false
    paymentTarget.value = null
    paymentTargetId.value = null
    paymentOrderId.value = null
  }

  function setIsDocumentActive(value: boolean): void {
    isDocumentActive.value = value
  }

  function setIsDocumentPreview(value: boolean): void {
    isDocumentPreview.value = value
  }

  function setIsHeaderSearchHidden(value: boolean): void {
    isHeaderSearchHidden.value = value
  }

  function setHasColorModeChanged(value: boolean): void {
    hasColorModeChanged.value = value
  }

  function setIsAllotingPreferenceShare(value: boolean): void {
    isAllotingPreferenceShare.value = value
  }

  function setIsPopupShowing(value: boolean): void {
    isPopupShowing.value = value
  }

  function setIsOpenSearchBar(value: boolean): void {
    isOpenSearchBar.value = value
  }

  function setIsSidebarOpen(value: boolean): void {
    isSidebarOpen.value = value
  }

  function setIsSidebarOpenFull(value: boolean): void {
    isSidebarOpenFull.value = value
  }

  function setIsShowWelcomeAfterEKYC(value: boolean): void {
    isShowWelcomeAfterEKYC.value = value
  }

  function setIsShowUserProfilePostEKYC(value: boolean): void {
    isShowUserProfilePostEKYC.value = value
  }

  function setIsShowUserProfile(value: boolean): void {
    isShowUserProfile.value = value
  }

  function setIsShowUserPortfolio(value: boolean): void {
    isShowUserPortfolio.value = value
  }

  function setIsShowUserPreferences(value: boolean): void {
    isShowUserPreferences.value = value
  }

  function setIsDisablePage(value: boolean): void {
    isDisablePage.value = value
  }

  function setSelectedAuditorPartnerId(value: string | null): void {
    selectedAuditorPartnerId.value = value
  }

  function setDocumentToView(value: string | null): void {
    documentToView.value = value
  }

  function setIsShowGlossary(value: boolean): void {
    isShowGlossary.value = value
  }

  function setGlossarySearchText(value: string | null): void {
    glossarySearchText.value = value
  }

  function setIsSetSearchInputInFocus(value: boolean): void {
    isSetSearchInputInFocus.value = value
  }

  function setSearchBarText(value: string | null): void {
    searchBarText.value = value
  }

  function setCanSelectCompany(value: boolean | null): void {
    canSelectCompany.value = value
  }

  return {
    makePayment,
    entityTypeToMakePayment,
    entityIdToMakePayment,
    paymentCart,
    isHandlePostPayment,
    isPaymentSuccessful,
    paymentTarget,
    paymentTargetId,
    paymentOrderId,
    isUpdatePaymentCart,
    isItemRemovedFromCart,
    isDocumentActive,
    isDocumentPreview,
    isHeaderSearchHidden,
    hasColorModeChanged,
    isAllotingPreferenceShare,
    isPopupShowing,
    isOpenSearchBar,
    isSidebarOpen,
    isSidebarOpenFull,
    isShowWelcomeAfterEKYC,
    isShowUserProfilePostEKYC,
    isShowUserProfile,
    isShowUserPortfolio,
    isShowUserPreferences,
    isDisablePage,
    selectedAuditorPartnerId,
    documentToView,
    isShowGlossary,
    glossarySearchText,
    isSetSearchInputInFocus,
    searchBarText,
    canSelectCompany,
    setMakePayment,
    setEntityTypeToMakePayment,
    setEntityIdToMakePayment,
    setPaymentCart,
    resetMakePaymentValues,
    setIsHandlePostPayment,
    setIsPaymentSuccessful,
    setPaymentTarget,
    setPaymentTargetId,
    setPaymentOrderId,
    setIsUpdatePaymentCart,
    setIsItemRemovedFromCart,
    resetHandlePostPaymentValues,
    setIsDocumentActive,
    setIsDocumentPreview,
    setIsHeaderSearchHidden,
    setHasColorModeChanged,
    setIsAllotingPreferenceShare,
    setIsPopupShowing,
    setIsOpenSearchBar,
    setIsSidebarOpen,
    setIsSidebarOpenFull,
    setIsShowWelcomeAfterEKYC,
    setIsShowUserProfilePostEKYC,
    setIsShowUserProfile,
    setIsShowUserPortfolio,
    setIsShowUserPreferences,
    setIsDisablePage,
    setSelectedAuditorPartnerId,
    setDocumentToView,
    setIsShowGlossary,
    setGlossarySearchText,
    setIsSetSearchInputInFocus,
    setSearchBarText,
    setCanSelectCompany,
  }
})
