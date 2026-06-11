<template>
  <div
    id="company-selected-sdn-bhd"
    :class="{ 'is-showing-documents': controller.isShowApplicationDocuments.value }"
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
          <ChangeOfNameApplication v-bind="controller.applicationProps" />
        </div>
      </TransitionGroup>
    </div>
    <Transition name="slide-left">
      <div
        class="document-container"
        v-if="controller.isShowApplicationDocuments.value"
      ></div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
  import ChangeOfNameApplication from "@/components/Services/ChangeOfNameApplication.vue"
  import { SelectedSdnBhdController } from "~/scripts/components/companies/SelectedSdnBhdController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits([])

  const controller = new SelectedSdnBhdController(props.companyId, emit)

  watch(
    () => props.companyId,
    (newVal) => [controller.setCompanyId(newVal)]
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Companies/SelectedSdnBhd" as *;
</style>
