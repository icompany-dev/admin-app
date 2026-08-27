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
              <Director
                v-bind="controller.getPropsInvitationDetail(director)"
                @removed="controller.fetchApplication()"
              />
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
              <Shareholder v-bind="controller.getPropsInvitationDetail(shareholder)" />
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
      <div class="switch-application-details">
        <ServiceApplication
          v-bind="controller.serviceApplicationProps"
          @paymentNodeSelected="controller.onPaymentStepClicked()"
        >
          <template #application>
            <ApplicationNode
              v-bind="controller.notifyPreviousCosecNodeProps"
              v-if="controller.hasNotifyPreviousCosecResolution"
              @click="controller.onNotifyPreviousCosecStepClicked()"
            >
              <template #nodeContent>
                <div class="application-container">
                  <div class="node-title">{{ controller.notifyPreviousCosecLabel }}</div>
                  <div class="node-subtitle">({{ controller.notifyPreviousCosecSublabel }})</div>
                  <div class="application-details">
                    <span class="application-label">
                      {{ controller.companySecretaryLabel }}
                    </span>
                    <div class="human-details">
                      <span class="human-detail">
                        {{ controller.companySecretaryName }}
                      </span>
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
              </template>
              <template #nodeOptions></template>
              <template #nodeActions>
                <div
                  class="btn btn-pill btn-submit center"
                  :class="{ 'is-loading': controller.isUpdatingNotifyPreviousCosec.value }"
                  @click="controller.onDocumentReceivedClicked()"
                >
                  <span class="label">{{ controller.documentReceivedLabel }}</span>
                </div>
              </template>
            </ApplicationNode>
            <ApplicationNode
              v-bind="controller.directorsResolutionNodeProps"
              @click="controller.onShowDirectorsResolutionClicked()"
            >
              <template #nodeContent>
                <div class="application-container">
                  <div class="node-title">{{ controller.directorsResolutionLabel }}</div>
                  <div class="node-subtitle">({{ controller.directorsResolutionSublabel }})</div>
                </div>
              </template>
              <template #nodeOptions>
                <button
                  class="btn btn-primary btn-pill"
                  :class="{ 'is-loading': controller.isGeneratingDCR.value }"
                  :disabled="controller.isGeneratingDCR.value"
                  @click="controller.onGenerateDcrClicked()"
                >
                  {{ controller.generateLabel }}
                </button>
              </template>
              <template #nodeActions></template>
            </ApplicationNode>
            <ApplicationNode
              v-bind="controller.section236NodeProps"
              @click="controller.onShowSection236Clicked()"
            >
              <template #nodeContent>
                <div class="application-container">
                  <div class="node-title">{{ controller.section236Label }}</div>
                  <div class="node-subtitle">({{ controller.section236Sublabel }})</div>
                </div>
              </template>
              <template #nodeOptions>
                <button
                  class="btn btn-primary btn-pill"
                  :class="{ 'is-loading': controller.isGeneratingSection236.value }"
                  :disabled="controller.isGeneratingSection236.value"
                  @click="controller.onGenerateSection236Clicked()"
                >
                  {{ controller.generateLabel }}
                </button>
              </template>
              <template #nodeActions></template>
            </ApplicationNode>
            <ApplicationNode
              v-bind="controller.submitToSSMNodeProps"
              @click="controller.onShowSubmissionClicked()"
            >
              <template #nodeContent>
                <div class="application-container">
                  <div class="node-title">{{ controller.submitToSSMLabel }}</div>
                  <div class="node-subtitle">({{ controller.submitToSSMSublabel }})</div>
                </div>
              </template>
              <template #nodeOptions>
                <button
                  class="btn btn-primary btn-pill"
                  @click="controller.onUploadSection58Clicked()"
                >
                  {{ controller.uploadSection58Label }}
                </button>
              </template>
              <template #nodeActions>
                <div
                  class="btn btn-pill btn-submit center"
                  @click="controller.onSubmitToSSMClicked()"
                >
                  <span class="label">{{ controller.submittedLabel }}</span>
                </div>
              </template>
            </ApplicationNode>
            <ApplicationNode
              v-bind="controller.completedProcessApplicationNode"
              @click="controller.onShowCompletedClicked()"
            >
              <template #nodeContent>
                <div class="application-container">
                  <div class="node-title">{{ controller.completedProcessLabel }}</div>
                  <div class="node-subtitle">({{ controller.completedProcessSublabel }})</div>
                </div>
              </template>
              <template #nodeOptions></template>
              <template #nodeActions>
                <div
                  class="btn btn-pill btn-submit center"
                  :class="{ 'is-loading': controller.isCompletingProcess.value }"
                  @click="controller.onCompleteProcessClicked()"
                >
                  <span class="label">{{ controller.completedLabel }}</span>
                </div>
              </template>
            </ApplicationNode>
          </template>
        </ServiceApplication>
        <div class="document-display">
          <component
            ref="documentRef"
            :is="activeDocumentComponent"
            :application-id="controller.applicationId.value"
            :application-switch-id="controller.applicationId.value"
            :target-id="controller.paymentOrderId.value"
            :company-name="controller.application.value.companyName"
            :registration-number-new="controller.application.value.registrationNumberNew"
            :registration-number-old="controller.application.value.registrationNumberOld"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import ApplicationNode from "@/components/Services/ApplicationNode.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Director from "@/components/Invitations/Director.vue"
  import LetterToExistingCosecService from "@/components/CompanyServices/LetterToExistingCosecService.vue"
  import ReceiptInvoiceService from "@/components/CompanyServices/ReceiptInvoiceService.vue"
  import SearchableDropdown from "@/components/Forms/SearchableDropdown.vue"
  import Section236ThreeService from "@/components/CompanyServices/Section236ThreeService.vue"
  import ServiceApplication from "@/components/Services/ServiceApplication.vue"
  import Shareholder from "@/components/Invitations/Shareholder.vue"
  import SwitchAppointCompanySecretary from "@/components/CompanyServices/SwitchAppointCompanySecretary.vue"
  import UploadFile from "@/components/Popups/UploadFile.vue"
  import { ApplicationController } from "~/scripts/components/switches/ApplicationController"
  import type { IPropsSwitchApplication } from "~/scripts/props/PropsSwitchApplication"
  import { DocumentTargets } from "~/scripts/constants/DocumentTargets"

  const props = defineProps<IPropsSwitchApplication>()

  const emit = defineEmits([])

  const componentMap: Record<string, any> = {
    [DocumentTargets.TARGET_RECEIPT]: ReceiptInvoiceService,
    [DocumentTargets.TARGET_SWITCH_LETTER_TO_COSEC]: LetterToExistingCosecService,
    [DocumentTargets.TARGET_SWITCH_RESO]: SwitchAppointCompanySecretary,
    [DocumentTargets.TARGET_SECTION_236]: Section236ThreeService,
  }

  const controller = new ApplicationController(props, emit)

  const documentRef = ref(null)

  const activeDocumentComponent = computed(() => {
    const target = controller.selectedDocumentTarget.value
    return target && componentMap[target] ? componentMap[target] : null
  })

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    }
  )

  watch(documentRef, (newVal) => {
    controller.setDocumentRef(newVal)
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Switches/Application" as *;
</style>
