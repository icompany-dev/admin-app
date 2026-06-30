<template>
  <div
    id="company-selected-sdn-bhd"
    :class="{ 'is-showing-documents': controller.showDocument }"
  >
    <div class="company-details">
      <div class="name-logo">
        <div
          class="logo"
          :class="{ 'no-logo': !controller.hasCompanyLogo }"
        >
          <img :src="controller.companyLogo" />
        </div>
        <div class="name-registration-numbers-actions">
          <div class="name-registration-number">
            <div class="company-name">{{ controller.company.value.getFullName() }}</div>
            <div class="registraiton-numbers">
              {{ controller.company.value.registrationNumberNew }}
              ({{ controller.company.value.registrationNumberOld }})
            </div>
          </div>
          <div class="actions-button-options">
            <div
              class="btn btn-pill btn-submit selected"
              @click="controller.onOptionsClicked()"
            >
              <span class="label">{{ controller.more }}</span>
              <i
                class="fa-solid fa-caret-down"
                :class="{ rotate: controller.isShowOptions.value }"
              ></i>
            </div>
            <div
              class="options"
              :class="{ show: controller.isShowOptions.value }"
            >
              <button
                class="btn btn-pill btn-submit"
                @click="controller.onEditClicked()"
              >
                {{ controller.edit }}
              </button>
              <button
                class="btn btn-pill btn-submit"
                @click="controller.onStrikeOffClicked()"
              >
                {{ controller.strikeOff }}
              </button>
              <button
                class="btn btn-pill btn-submit"
                @click="controller.onSwitchOutClicked()"
              >
                {{ controller.switchOut }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <TransitionGroup
        class="page-tabs"
        name="slide-left"
        tag="div"
      >
        <div
          class="page-tab"
          :class="{ selected: controller.isBusiness.value }"
          @click="controller.onBusinessClicked()"
        >
          {{ controller.business }}
        </div>
        <div
          class="page-tab"
          :class="{ selected: controller.isDirectors.value }"
          @click="controller.onDirectorsClicked()"
        >
          {{ controller.directors }}
        </div>
        <div
          class="page-tab"
          :class="{ selected: controller.isDocuments.value }"
          @click="controller.onDocumentsClicked()"
        >
          {{ controller.documents }}
        </div>
        <div
          class="page-tab"
          :class="{ selected: controller.isShareholders.value }"
          @click="controller.onShareholdersClicked()"
        >
          {{ controller.shareholders }}
        </div>
        <div
          class="page-tab"
          :class="{ selected: controller.isAccounting.value }"
          @click="controller.onAccountingClicked()"
        >
          {{ controller.accounting }}
        </div>
      </TransitionGroup>
      <TransitionGroup name="fade">
        <div
          class="application-contents"
          v-if="controller.isBusiness.value"
        >
          <ChangeOfNameApplication
            v-bind="controller.applicationProps"
            @applicationId="controller.onApplicationIdUpdated($event)"
            @documentSelected="controller.onDocumentTargetSelected($event)"
            @download="controller.onDownloadClicked()"
          />
        </div>
      </TransitionGroup>
    </div>
    <TransitionGroup name="slide-left">
      <div
        class="application-document-container"
        v-if="controller.showDocument"
      >
        <component
          ref="documentRef"
          :is="activeDocumentComponent"
          :company-id="controller.companyId.value"
          :view-type="'existing'"
          :application-id="controller.selectedApplicationId.value"
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
  import ChangeOfNameApplication from "@/components/Services/ChangeOfNameApplication.vue"
  import ChangeOfNameService from "@/components/CompanyServices/ChangeOfNameService.vue"
  import Section27Service from "@/components/CompanyServices/Section27Service.vue"
  import Section28Service from "@/components/CompanyServices/Section28Service.vue"
  import { SelectedSdnBhdController } from "~/scripts/components/companies/SelectedSdnBhdController"
  import { CompanyConstants } from "~/scripts/constants/Company"
  import { DocumentTargets } from "~/scripts/constants/DocumentTargets"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits([])

  const documentRef = ref(null)

  const controller = new SelectedSdnBhdController(props.companyId, emit)

  const componentMap: Record<string, any> = {
    [DocumentTargets.TARGET_AMENDMENT_NAME_RESOLUTIONS]: ChangeOfNameService,
    [DocumentTargets.TARGET_AMENDMENT_NAME_SECTION27]: Section27Service,
    [DocumentTargets.TARGET_AMENDMENT_NAME_SECTION28]: Section28Service,
  }

  const activeDocumentComponent = computed(() => {
    const target = controller.selectedDocumentTarget.value
    return target && componentMap[target] ? componentMap[target] : null
  })

  watch(
    () => props.companyId,
    (newVal) => [controller.setCompanyId(newVal)]
  )

  watch(documentRef, (newVal) => {
    controller.setDocumentRef(newVal)
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Companies/SelectedSdnBhd" as *;
</style>
