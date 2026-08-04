<template>
  <div id="switches-application">
    <div
      class="loader-container"
      v-if="controller.isLoading.value"
    >
      <LoaderPrepare
        :label="controller.loaderLabel"
        :sublabel="controller.loaderSublabel"
      />
    </div>
    <template v-if="!controller.isLoading.value">
      <div class="switch-application-summary">
        <div class="company-name-details">
          <span
            class="company-name"
            :class="{ placeholder: !controller.application.value.hasCompletedName() }"
          >
            {{ controller.application.value.companyName }}
          </span>
          <span
            class="name-completed"
            v-if="controller.application.value.hasCompletedName()"
          >
            <i class="fa-solid fa-circle-check" />
          </span>
        </div>
        <div
          class="registration-number"
          :class="{ placeholder: !controller.application.value.hasCompletedRegistrationNumber() }"
        >
          {{ controller.application.value.companyRegistrationNumber }}
        </div>
        <div class="incorporated-date">{{ controller.dateOfIncorporationLabel }}: {{ controller.incorporatedAt }}</div>
        <div class="summary-items">
          <div class="summary-item">
            <div class="summary-item-title">
              {{ controller.applicantLabel }}
            </div>
            <div class="summary-item-content human-details">
              <span class="human-detail">
                <b>{{ controller.applicantName }}</b>
              </span>
              <span class="human-detail">
                <i class="fa-regular fa-envelope" />
                {{ controller.applicantEmail }}
              </span>
              <span class="human-detail">
                <i class="fa-brands fa-whatsapp" />
                {{ controller.applicantPhone }}
              </span>
            </div>
          </div>
          <div class="summary-item">
            <div class="summary-item-title">
              {{ controller.directorLabel }}
            </div>
            <div
              class="summary-item-content human-details"
              v-for="(director, index) in controller.directorDetails"
            >
              <span class="human-detail">
                <b>{{ director.name }}</b>
              </span>
              <span class="human-detail">
                <i class="fa-regular fa-envelope" />
                {{ director.email }}
              </span>
              <span class="human-detail">
                <i class="fa-brands fa-whatsapp" />
                {{ director.user.phone }}
              </span>
            </div>
          </div>
          <div class="summary-item">
            <div class="summary-item-title">
              {{ controller.shareholderLabel }}
            </div>
            <div
              class="summary-item-content human-details"
              v-for="(shareholder, index) in controller.shareholderDetails"
            >
              <span class="human-detail">
                <b>{{ shareholder.name }}</b>
              </span>
              <span class="human-detail">
                <i class="fa-regular fa-envelope" />
                {{ shareholder.email }}
              </span>
              <span class="human-detail">
                <i class="fa-brands fa-whatsapp" />
                {{ shareholder.user.phone }}
              </span>
              <span class="human-detail">{{ controller.totalSharesLabel }}: {{ shareholder.totalShares }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="switch-application-summary">
        <div class="application-items">
          <div class="application-item">
            <div class="application-item-title">
              {{ controller.businessNatureLabel }}
              <div class="action-icons">
                <i
                  v-if="controller.isEditingDescription.value && !controller.isUpdatingDescription.value"
                  class="fa-regular fa-xmark clickable cancel"
                  @click="controller.onCancelEditBusinessDescriptionClicked()"
                />
                <i
                  v-if="controller.isEditingDescription.value && !controller.isUpdatingDescription.value"
                  class="fa-regular fa-save clickable save"
                  @click="controller.onSaveBusinessDescriptionClicked()"
                />
                <i
                  v-if="!controller.isEditingDescription.value"
                  class="fa-regular fa-edit clickable edit"
                  @click="controller.onEditBusinessDescriptionClicked()"
                />
                <i
                  v-if="controller.isUpdatingDescription.value"
                  class="fa-regular fa-spin fa-spinner edit"
                />
              </div>
            </div>
            <div class="application-item-content">
              <template v-if="controller.isEditingDescription.value">
                <textarea
                  class="form-control"
                  v-model="controller.application.value.businessDescription"
                />
              </template>
              <template v-if="!controller.isEditingDescription.value">
                {{ controller.application.value.businessDescription }}
              </template>
            </div>
            <div class="application-item-title">
              {{ controller.msicCodeLabel }}
            </div>
            <div class="application-item-content">
              <template v-if="controller.isEditingDescription.value">
                <SearchableDropdown
                  :is-searchable="true"
                  :options="controller.firstMsicCodeOptions"
                  :selected-item-name="controller.firstSelectedMsicCodeName"
                  :label-key="'label'"
                  :value-key="'id'"
                  @search="controller.onMsicCodeSearched($event, 0)"
                  @selected="controller.onMsicCodeSelected($event, 0)"
                />
                <SearchableDropdown
                  :is-searchable="true"
                  :options="controller.secondMsicCodeOptions"
                  :selected-item-name="controller.secondSelectedMsicCodeName"
                  :label-key="'label'"
                  :value-key="'id'"
                  @search="controller.onMsicCodeSearched($event, 1)"
                  @selected="controller.onMsicCodeSelected($event, 1)"
                />
                <SearchableDropdown
                  :is-searchable="true"
                  :options="controller.thirdMsicCodeOptions"
                  :selected-item-name="controller.thirdSelectedMsicCodeName"
                  :label-key="'label'"
                  :value-key="'id'"
                  @search="controller.onMsicCodeSearched($event, 2)"
                  @selected="controller.onMsicCodeSelected($event, 2)"
                />
              </template>
              <span
                v-if="!controller.isEditingDescription.value"
                v-html="controller.msicCodesList"
              />
            </div>
          </div>
          <div class="application-item">
            <div class="application-item-title">
              {{ controller.businessAddressLabel }}
            </div>
            <div
              class="application-item-content"
              v-html="controller.businessAddress"
            />
          </div>
          <div class="application-item">
            <div class="application-item-title">
              {{ controller.companySecretaryLabel }}
            </div>
            <div class="application-item-content">
              <b>{{ controller.companySecretaryName }}</b>
              <br />
              {{ controller.companySecretaryFirmName }}
              <div
                class="address"
                v-html="controller.companySecretaryFirmAddress"
              />
              <div class="human-details">
                <span class="human-detail">
                  <i class="fa-regular fa-envelope" />
                  {{ controller.companySecretaryEmail }}
                </span>
                <span class="human-detail">
                  <i class="fa-brands fa-whatsapp" />
                  {{ controller.companySecretaryPhone }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import ApplicationNode from "@/components/Services/ApplicationNode.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import ReceiptInvoiceService from "@/components/CompanyServices/ReceiptInvoiceService.vue"
  import SearchableDropdown from "@/components/Forms/SearchableDropdown.vue"
  import ServiceApplication from "@/components/Services/ServiceApplication.vue"
  import UploadFile from "@/components/Popups/UploadFile.vue"
  import { ApplicationController } from "~/scripts/components/switches/ApplicationController"
  import type { IPropsSwitchApplication } from "~/scripts/props/PropsSwitchApplication"
  import { DocumentTargets } from "~/scripts/constants/DocumentTargets"

  const props = defineProps<IPropsSwitchApplication>()

  const emit = defineEmits([])

  const componentMap: Record<string, any> = {
    [DocumentTargets.TARGET_RECEIPT]: ReceiptInvoiceService,
  }

  const controller = new ApplicationController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Switches/Application" as *;
</style>
