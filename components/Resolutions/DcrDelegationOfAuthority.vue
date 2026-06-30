<template>
  <div id="dcr-delegation-of-authority">
    <Resolution
      v-bind="controller.resolutionProps"
      @total-page-changed="emit('totalPageChanged')"
    >
      <template #page1>
        <p>
          <b>RESOLVED:</b>
          <br />
          <b>DELEGATION OF AUTHORITY</b>
        </p>

        <p>
          WHEREAS Section 216 of the Companies Act 2016 permits the Board to delegate any of its powers to any committee
          of directors, a director, an employee of the Company, or any other person, subject to any limitations in the
          Act{{ controller.hasConstitution() ? "." : " or the Company's Constitution." }}
        </p>

        <p>THAT the Board delegates authority to the following person(s):</p>

        <div
          v-for="(delegateTo, index) in controller.getDelegateTosByPage(1)"
          :key="index"
          class="delegate-to-wrapper"
        >
          <table class="delegate-to-detail">
            <tbody>
              <tr>
                <td>Full Name</td>
                <td>:</td>
                <td>
                  <span
                    v-if="!controller.isDocumentEditable()"
                    :class="{ placeholder: controller.isInPreviewMode.value }"
                  >
                    {{ controller.delegateToName(delegateTo) }}
                  </span>
                  <div v-if="controller.isDocumentEditable()">
                    <select
                      :value="controller.getPersonSelection(delegateTo)"
                      @change="controller.handlePersonSelectionChanged(delegateTo, ($event.target as any).value)"
                      :disabled="props.isInPreviewMode"
                    >
                      <option
                        value=""
                        disabled
                      >
                        Select authorised person
                      </option>
                      <optgroup label="Directors">
                        <option
                          v-for="director in controller.directors.value"
                          :key="director.id"
                          :value="director.name.toUpperCase()"
                        >
                          {{ director.name.toUpperCase() }}
                        </option>
                      </optgroup>
                      <optgroup label="Shareholders">
                        <option
                          v-for="shareholder in controller.shareholders.value"
                          :key="shareholder.id"
                          :value="shareholder.name.toUpperCase()"
                        >
                          {{ shareholder.name.toUpperCase() }}
                        </option>
                      </optgroup>
                      <option :value="controller.thirdParty">Others</option>
                    </select>

                    <div v-if="controller.getPersonSelection(delegateTo) === controller.thirdParty">
                      <input
                        type="text"
                        v-model="delegateTo.name"
                        placeholder="Name"
                        @input="controller.handleNameChanged(delegateTo)"
                        :disabled="props.isInPreviewMode"
                        class="form-control form-control-sm text-uppercase mb-2"
                      />
                    </div>
                  </div>
                </td>
              </tr>
              <tr
                v-if="
                  controller.isDocumentEditable() && controller.getPersonSelection(delegateTo) === controller.thirdParty
                "
              >
                <td>Email</td>
                <td>:</td>
                <td>
                  <input
                    type="text"
                    v-model="delegateTo.email"
                    :disabled="props.isInPreviewMode"
                    class="form-control form-control-sm"
                  />
                </td>
              </tr>
              <tr
                v-if="
                  controller.isDocumentEditable() && controller.getPersonSelection(delegateTo) === controller.thirdParty
                "
              >
                <td>Phone No.</td>
                <td>:</td>
                <td>
                  <input
                    type="text"
                    v-model="delegateTo.phone"
                    :disabled="props.isInPreviewMode"
                    class="form-control form-control-sm"
                  />
                </td>
              </tr>
              <tr>
                <td>Designation</td>
                <td>:</td>
                <td>
                  <span
                    v-if="!controller.isDocumentEditable()"
                    :class="{ placeholder: controller.isInPreviewMode.value }"
                  >
                    {{ controller.delegateToDesignation(delegateTo) }}
                  </span>
                  <select
                    v-if="controller.isDocumentEditable()"
                    v-model="delegateTo.designation"
                    :disabled="props.isInPreviewMode"
                  >
                    <option value="">Select Designation</option>
                    <option
                      v-for="option in controller.getDesignationOptionsForDelegateTo(delegateTo)"
                      :key="option"
                      :value="option"
                    >
                      {{ option }}
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Scope of Authority</td>
                <td>:</td>
                <td>
                  <span
                    v-if="!controller.isDocumentEditable()"
                    :class="{ placeholder: controller.isInPreviewMode.value }"
                    v-html="controller.delegateToScopeOfAuthority(delegateTo)"
                  />
                  <div
                    v-if="controller.isDocumentEditable()"
                    class="scope-checkboxes"
                  >
                    <div
                      v-for="option in controller.scopeOfAuthorityOptions"
                      :key="option"
                      class="form-check"
                    >
                      <input
                        type="checkbox"
                        :id="`scope-${index}-${option}`"
                        :value="option"
                        v-model="delegateTo.scopeOfAuthority"
                        :disabled="props.isInPreviewMode"
                        @change="controller.updateSignatureSetup()"
                        class="form-check-input"
                      />
                      <label
                        :for="`scope-${index}-${option}`"
                        class="form-check-label"
                      >
                        {{ option }}
                      </label>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div
            v-if="controller.canRemoveDelegateTo()"
            class="remove-link"
            @click="controller.removeDelegateTo(index)"
          >
            <i class="fa-solid fa-xmark" />
            Remove
          </div>
        </div>

        <div
          v-if="controller.canAddMoreDelegateTos()"
          class="button-wrapper"
        >
          <div
            class="btn btn-sm btn-submit"
            @click="controller.onAddMoreClicked()"
          >
            Add More
          </div>
        </div>

        <p v-if="!controller.isDocumentOverflow()">
          THAT this delegated authority shall remain in force until revoked, varied, or superseded by a subsequent
          resolution of the Board.
        </p>

        <FurtherResolved v-if="!controller.isDocumentOverflow()" />
      </template>
      <template
        #page2
        v-if="controller.isDocumentOverflow()"
      >
        <div
          v-for="(delegateTo, index) in controller.getDelegateTosByPage(2)"
          :key="controller.getOriginalIndex(index, true)"
          class="delegate-to-wrapper"
        >
          <table class="delegate-to-detail">
            <tbody>
              <tr>
                <td>Full Name</td>
                <td>:</td>
                <td>
                  <span v-if="!controller.isDocumentEditable()">
                    {{ delegateTo.name.toUpperCase() }}
                  </span>
                  <div v-if="controller.isDocumentEditable()">
                    <select
                      :value="controller.getPersonSelection(delegateTo)"
                      @change="controller.handlePersonSelectionChanged(delegateTo, ($event.target as any).value)"
                      :disabled="props.isInPreviewMode"
                    >
                      <option
                        value=""
                        disabled
                      >
                        Select authorised person
                      </option>
                      <optgroup label="Directors">
                        <option
                          v-for="director in controller.directors.value"
                          :key="director.id"
                          :value="director.name.toUpperCase()"
                        >
                          {{ director.name.toUpperCase() }}
                        </option>
                      </optgroup>
                      <optgroup label="Shareholders">
                        <option
                          v-for="shareholder in controller.shareholders.value"
                          :key="shareholder.id"
                          :value="shareholder.name.toUpperCase()"
                        >
                          {{ shareholder.name.toUpperCase() }}
                        </option>
                      </optgroup>
                      <option :value="controller.thirdParty">Others</option>
                    </select>

                    <div v-if="controller.getPersonSelection(delegateTo) === controller.thirdParty">
                      <input
                        type="text"
                        v-model="delegateTo.name"
                        placeholder="Name"
                        @input="controller.handleNameChanged(delegateTo)"
                        :disabled="props.isInPreviewMode"
                        class="form-control form-control-sm text-uppercase mb-2"
                      />
                    </div>
                  </div>
                </td>
              </tr>
              <tr
                v-if="
                  controller.isDocumentEditable() && controller.getPersonSelection(delegateTo) === controller.thirdParty
                "
              >
                <td>Email</td>
                <td>:</td>
                <td>
                  <input
                    type="text"
                    v-model="delegateTo.email"
                    :disabled="props.isInPreviewMode"
                    class="form-control form-control-sm"
                  />
                </td>
              </tr>
              <tr
                v-if="
                  controller.isDocumentEditable() && controller.getPersonSelection(delegateTo) === controller.thirdParty
                "
              >
                <td>Phone No.</td>
                <td>:</td>
                <td>
                  <input
                    type="text"
                    v-model="delegateTo.phone"
                    :disabled="props.isInPreviewMode"
                    class="form-control form-control-sm"
                  />
                </td>
              </tr>
              <tr>
                <td>Designation</td>
                <td>:</td>
                <td>
                  <span v-if="!controller.isDocumentEditable()">
                    {{ delegateTo.designation }}
                  </span>
                  <select
                    v-if="controller.isDocumentEditable()"
                    v-model="delegateTo.designation"
                    :disabled="props.isInPreviewMode"
                  >
                    <option value="">Select Designation</option>
                    <option
                      v-for="option in controller.getDesignationOptionsForDelegateTo(delegateTo)"
                      :key="option"
                      :value="option"
                    >
                      {{ option }}
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Scope of Authority</td>
                <td>:</td>
                <td>
                  <div v-if="!controller.isDocumentEditable()">
                    <div
                      v-for="(val, index) in delegateTo.scopeOfAuthority"
                      :key="index"
                    >
                      {{ val }}
                    </div>
                  </div>
                  <div
                    v-if="controller.isDocumentEditable()"
                    class="scope-checkboxes"
                  >
                    <div
                      v-for="option in controller.scopeOfAuthorityOptions"
                      :key="option"
                      class="form-check"
                    >
                      <input
                        type="checkbox"
                        :id="`scope-${controller.getOriginalIndex(index, true)}-${option}`"
                        :value="option"
                        v-model="delegateTo.scopeOfAuthority"
                        :disabled="props.isInPreviewMode"
                        @change="controller.updateSignatureSetup()"
                        class="form-check-input"
                      />
                      <label
                        :for="`scope-${controller.getOriginalIndex(index, true)}-${option}`"
                        class="form-check-label"
                      >
                        {{ option }}
                      </label>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div
            v-if="controller.canRemoveDelegateTo()"
            class="remove-link"
            @click="controller.removeDelegateTo(controller.getOriginalIndex(index, true))"
          >
            <i class="fa-solid fa-xmark" />
            Remove
          </div>
        </div>

        <p v-if="controller.isDocumentOverflow()">
          THAT this delegated authority shall remain in force until revoked, varied, or superseded by a subsequent
          resolution of the Board.
        </p>
        <FurtherResolved v-if="controller.isDocumentOverflow()" />
      </template>
    </Resolution>

    <!-- <Teleport to="body">
      <DelegationWarning
        ref="delegationWarningPopupRef"
        target-type="delegation"
        target-id="new"
        @success="controller.addDelegateTo()"
      />
    </Teleport> -->
  </div>
</template>

<script setup lang="ts">
  import FurtherResolved from "./FurtherResolved.vue"
  import { StringUtil } from "~/scripts/utils/String"
  import Resolution from "./Resolution.vue"
  import { DcrDelegationOfAuthorityController } from "~/scripts/components/resolutions/DcrDelegationOfAuthorityController"
  // import DelegationWarning from "~/components/Popups/DelegationWarning.vue"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import type { CompanyDelegationOfAuthority } from "~/scripts/models/CompanyDelegationOfAuthority"

  const props = defineProps<IPropsResolutionDocument<CompanyDelegationOfAuthority>>()

  const emit = defineEmits(["startLoading", "doneLoading", "totalPageChanged"])

  const delegationWarningPopupRef = ref(null)

  const controller = new DcrDelegationOfAuthorityController(props, emit)

  watch(
    () => props.applicationId,
    (newVal) => {
      if (!StringUtil.isNullOrEmpty(newVal)) {
        controller.fetchApplication(newVal ?? "")
      }
    }
  )

  watch(
    () => props.isInPreviewMode,
    (newVal) => {
      controller.setIsInPreviewMode(newVal)
    }
  )

  watch(
    delegationWarningPopupRef,
    (newVal) => {
      controller.setDelegationWarningPopupRef(newVal)
    },
    { immediate: true }
  )

  watch(
    () => props.showWatermark,
    (newVal) => {
      controller.setShowWatermark(newVal)
    }
  )

  watch(
    () => props.watermarkText,
    (newVal) => {
      controller.setWatermarkText(newVal)
    }
  )

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/DelegationOfAuthority" as *;
</style>
