<template>
  <div id="dcr-bank-account-opening-alliance-bank">
    <Paper
      :paper-orientation="PaperOrientation.Portrait"
      :is-loader="true"
      :show-page-number="false"
      v-if="controller.isLoading.value"
    >
      <template #paperContent>
        <LoaderPrepare
          :label="controller.loaderLabel"
          :sublabel="controller.loaderSublabel"
        />
      </template>
    </Paper>
    <template v-if="!controller.isLoading.value">
      <Paper
        :paper-orientation="PaperOrientation.Portrait"
        :show-page-number="false"
        :additional-css-class="controller.additionalCssClass"
      >
        <template
          #paperMargins
          v-if="props.isShowTag"
        >
          <div class="paper-tag point-left product-select"><span>Select Products</span></div>
          <div class="paper-tag point-left biz-smart"><span>Insert Information</span></div>
        </template>
        <template #paperContent>
          <div class="page-footer">
            <div class="left-side">Version 1.9</div>
            <div class="right-side">Page 1</div>
          </div>
          <div class="resolution-title">
            Certified Extract of Board Resolution for Subscription of Cash Management &
            <br />
            Electronic Banking Services
          </div>
          <div class="resolution-header">
            The Board of Directors of
            <span class="prefilled-input">{{ controller.companyName() }}</span>
            ["The Company"]
            <br />
            passed the following resolution on [Date]
            <span class="empty-input-field"></span>
          </div>
          <p>Resolved:</p>
          <div class="resolution-item">
            <div class="number">1.</div>
            <div class="content">
              <p>
                That the Company do hereby subscribe for the following services( indicated with a "
                <i class="fa-solid fa-check"></i>
                "):
              </p>
              <div class="split-container">
                <div class="form-checks-container">
                  <div class="form-check">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      :disabled="!controller.isDocumentEditable()"
                      :checked="controller.isProductSelected('biz-smart-inquiry')"
                      @click="controller.onProductClicked('biz-smart-inquiry')"
                    />
                    <span>Alliance BizSmart Inquiry Module</span>
                  </div>
                  <div class="form-check">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      :disabled="!controller.isDocumentEditable()"
                      :checked="controller.isProductSelected('biz-smart-transactional')"
                      @click="controller.onProductClicked('biz-smart-transactional')"
                    />
                    <span>Alliance BizSmart Transactional Module</span>
                  </div>
                </div>
                <div class="form-checks-container">
                  <div class="form-check">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      :disabled="!controller.isDocumentEditable()"
                      :checked="controller.isProductSelected('biz-xpress')"
                      @click="controller.onProductClicked('biz-xpress')"
                    />
                    <span>Biz-Xpress Card</span>
                  </div>
                  <div class="form-check">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      :disabled="!controller.isDocumentEditable()"
                      :checked="controller.isProductSelected('auto-sweeping')"
                      @click="controller.onProductClicked('auto-sweeping')"
                    />
                    <span>Auto Sweeping</span>
                  </div>
                </div>
              </div>
              <div class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  :disabled="!controller.isDocumentEditable()"
                  :checked="controller.isProductSelected('others')"
                  @click="controller.onProductClicked('others')"
                />
                <div>
                  Others (please specify)
                  <input
                    type="text"
                    class="form-control empty-input-field wide"
                    v-model="controller.allianceBankApplicationDetails.value.otherProductName"
                    @change="emit('updated')"
                  />
                </div>
              </div>
              <p>
                <small>(collectively, "the Services")</small>
              </p>
              <p>
                offered by Alliance Bank Malaysia Berhad and Alliance Islamic Bank Berhad (collectively and individually
                called “Bank”) to its customers, in such manner as indicated in the duly completed copies of the
                relevant application forms governing such services, the contents of which are duly noted and hereby
                approved.
              </p>
            </div>
          </div>
          <div class="resolution-item">
            <div class="number"></div>
            <div class="content">
              <b><u>For Alliance BizSmart</u></b>
            </div>
          </div>
          <div class="resolution-item">
            <div class="number">2.(a)</div>
            <div class="content">
              That the Director(s) and/or officer(s) specified below (“Authorised Representatives”) and acting in
              accordance with the mandate set out herein be and hereby be authorised for and on behalf of the Company to
              do the following for subscription to
              <b>Alliance BizSmart</b>
              :
              <table class="signatory-details">
                <thead>
                  <tr>
                    <th>Particulars of Authorised Representative</th>
                    <th>Specimen Signature</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(bizSmart, index) in controller.allianceBankApplicationDetails.value
                      .bizSmartAuthorisedRepresentatives"
                    :key="index"
                  >
                    <td class="authorised-representative">
                      <div
                        class="action-link remove"
                        @click="controller.onRemoveBizSmartAuthoriseRepresentatince(index)"
                      >
                        <i class="fa-regular fa-trash-alt"></i>
                      </div>
                      <div class="form-group">
                        <span class="label">Name:</span>
                        <input
                          type="text"
                          class="form-control"
                          v-model="bizSmart.name"
                          :list="`ob-name-${index}`"
                          placeholder="FULL NAME OF AUTHORISED REPRESENTATIVE"
                          :disabled="controller.isInPreviewMode.value"
                          @change="controller.onSignatoryNameChange(bizSmart)"
                        />
                        <datalist :id="`ob-name-${index}`">
                          <option v-for="(name, j) in controller.directorDataListForBizSmart(index)">
                            {{ name }}
                          </option>
                        </datalist>
                      </div>
                      <div class="split-section">
                        <div class="form-group">
                          <span class="label">Designation:</span>
                          <input
                            type="text"
                            class="form-control"
                            v-model="bizSmart.designation"
                            placeholder="DESIGNATION"
                            :disabled="controller.isInPreviewMode.value"
                            :readonly="controller.isBizSmartReadOnlyField(bizSmart)"
                            @change="emit('updated')"
                          />
                        </div>
                        <div class="form-group">
                          <span class="label">NRIC:</span>
                          <input
                            type="text"
                            class="form-control"
                            v-model="bizSmart.identification"
                            placeholder="NRIC NO"
                            :disabled="controller.isInPreviewMode.value"
                            :readonly="controller.isBizSmartReadOnlyField(bizSmart)"
                            @change="emit('updated')"
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        class="placeholder"
                        v-if="bizSmart.name"
                      >
                        Wet Ink Required
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <div class="form-checks-container horizontal">
                        <div>Mandate:</div>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isBizSmartMandate('any')"
                            @click="controller.onBizSmartMandateClicked('any')"
                          />
                          <span>
                            Any
                            <input
                              type="text"
                              class="form-control empty-input-field small"
                              :disabled="!controller.isDocumentEditable()"
                              :placeholder="`${controller.allianceBankApplicationDetails.value.bizSmartMandateCount}`"
                              v-model="controller.allianceBankApplicationDetails.value.bizSmartMandateCount"
                            />
                            of the above Directors/Officers:
                          </span>
                        </div>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isBizSmartMandate('all')"
                            @click="controller.onBizSmartMandateClicked('all')"
                          />
                          <span>All of the above Directors/Officers:</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      colspan="2"
                      class="add-more-signatory"
                    >
                      <span
                        class="action-link add-more"
                        @click="controller.onAddBizSmartAuthoriseRepresentative()"
                      >
                        Add Another Authorised Representative
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>
      </Paper>
      <Paper
        :paper-orientation="PaperOrientation.Portrait"
        :show-page-number="false"
        :additional-css-class="controller.additionalCssClass"
      >
        <template
          #paperMargins
          v-if="props.isShowTag"
        >
          <div class="paper-tag point-right maintenance"><span>Pick One</span></div>
          <div class="paper-tag point-left biz-xpress"><span>Insert Information</span></div>
        </template>
        <template #paperContent>
          <div class="page-footer">
            <div class="left-side">Version 1.9</div>
            <div class="right-side">Page 2</div>
          </div>
          <div class="resolution-item">
            <div class="number"></div>
            <div class="content">
              <p>
                <u>Mode of Profile Maintenance</u>
              </p>
              <div class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  v-model="controller.allianceBankApplicationDetails.value.isSelfManage"
                  @change="emit('updated')"
                />
                <div>
                  <p>To appoint the following: (Self Manage)</p>
                  <p>
                    Company hereby authorises the Authorised Representative to appoint the System Administrator (for
                    creation of Authorised User(s) of the Alliance BizSmart) and System Authoriser (for the approval of
                    the creation of Authorised User(s) of the Alliance BizSmart) identified in the Application Form. In
                    the event of the replacement of System Administrator and/or System Authoriser, the Company hereby
                    authorises the Authorised Representative to appoint such replacement personnel from time to time and
                    such replacement personnel shall be authorised to act as the System Administrator and/or the System
                    Authoriser, as the case may be.
                  </p>
                  <p>
                    The System Administrator and System Authoriser is/are authorised to appoint user(s) (“Authorised
                    Users”) for the respective Services, to revoke the appointment of the Authorised User(s) and to vary
                    the authority conferred on the Authorised User(s).
                  </p>
                </div>
              </div>
              <div class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  v-model="controller.allianceBankApplicationDetails.value.isBankManage"
                  @change="emit('updated')"
                />
                <div>
                  <p>To appoint and authorise the Bank to do the following: (Bank To Manage)</p>
                  <ol class="lower-alpha">
                    <li>
                      Authorisation to appoint users for the Services:
                      <br />
                      The Bank is authorised to appoint user(s) (“Authorised Users”) for the respective Services and to
                      revoke the appointment of the Authorised User(s) based on the written instruction given from time
                      to time by the Authorised Representatives of the Company.
                    </li>
                    <li>
                      Maintaining the transaction limits and signing conditions:
                      <br />
                      The Bank is authorised to maintain the transaction limit and signing condition that is specified
                      in the written instructions given from time to time by the Authorised Representatives of the
                      Company.
                    </li>
                  </ol>
                </div>
              </div>
              <p>
                That the Company acknowledges and agrees that through the appointment of Authorised User(s), the Company
                authorises the Authorised User(s) to access and/or use the Services on behalf of the Company, including
                but not limited to acceptance of terms and conditions, submission of forms or instructions, applications
                or documents electronically.
              </p>
            </div>
          </div>
          <div class="resolution-item">
            <div class="number"></div>
            <div class="content">
              <b><u>For Biz- Xpress Card and/or Auto Sweeping and/or other Services</u></b>
            </div>
          </div>
          <div class="resolution-item">
            <div class="number">2.(b)</div>
            <div class="content">
              <p>
                That the Director(s) and/or officer(s) specified below (“Authorised Representatives”) and acting in
                accordance with the mandate set out herein be and hereby be authorised for and on behalf of the Company
                to subscribe to
                <b>Biz-Xpress Card and/or Auto Sweeping and/or other Services indicated above</b>
                :
              </p>
              <table class="signatory-details">
                <thead>
                  <tr>
                    <th>Particulars of Authorised Representative</th>
                    <th>Specimen Signature</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(bizXpress, j) in controller.allianceBankApplicationDetails.value
                      .bizXpressAuthorisedRepresentatives"
                    :key="j"
                  >
                    <td class="authorised-representative">
                      <div
                        class="action-link remove"
                        @click="controller.onRemoveBizXpressAuthoriseRepresentatince(j)"
                      >
                        <i class="fa-regular fa-trash-alt" />
                      </div>
                      <div class="form-group">
                        <span class="label">Name:</span>
                        <input
                          type="text"
                          class="form-control"
                          v-model="bizXpress.name"
                          placeholder="FULL NAME OF AUTHORISED REPRESENTATIVE"
                          :list="`sign-name-${j}`"
                          :disabled="controller.isInPreviewMode.value"
                          @change="controller.onSignatoryNameChange(bizXpress)"
                        />
                        <datalist :id="`sign-name-${j}`">
                          <option v-for="(name, x) in controller.directorDataListForBizXpress(j)">
                            {{ name }}
                          </option>
                        </datalist>
                      </div>
                      <div class="split-section">
                        <div class="form-group">
                          <span class="label">Designation:</span>
                          <input
                            type="text"
                            class="form-control"
                            v-model="bizXpress.designation"
                            placeholder="DESIGNATION"
                            :disabled="controller.isInPreviewMode.value"
                            :readonly="controller.isBizXpressReadOnlyField(bizXpress)"
                            @change="emit('updated')"
                          />
                        </div>
                        <div class="form-group">
                          <span class="label">NRIC:</span>
                          <input
                            type="text"
                            class="form-control"
                            v-model="bizXpress.identification"
                            placeholder="NRIC NO."
                            :disabled="controller.isInPreviewMode.value"
                            :readonly="controller.isBizXpressReadOnlyField(bizXpress)"
                            @change="emit('updated')"
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        class="placeholder"
                        v-if="bizXpress.name && bizXpress.name.length > 0"
                      >
                        Wet Ink Required
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <div class="form-checks-container horizontal">
                        <div>Mandate:</div>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isBizXpressMandate('any')"
                            @click="controller.onBizXpressMandateClicked('any')"
                          />
                          <span>
                            Any
                            <input
                              type="text"
                              class="form-control empty-input-field small"
                              :disabled="!controller.isDocumentEditable()"
                              :placeholder="`${controller.allianceBankApplicationDetails.value.bizXpressMandateCount}`"
                              v-model="controller.allianceBankApplicationDetails.value.bizXpressMandateCount"
                            />
                            of the above Directors/Officers:
                          </span>
                        </div>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isBizXpressMandate('all')"
                            @click="controller.onBizXpressMandateClicked('all')"
                          />
                          <span>All of the above Directors/Officers:</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      colspan="2"
                      class="add-more-signatory"
                    >
                      <span
                        class="action-link add-more"
                        @click="controller.onAddBizXpressAuthoriseRepresentative()"
                      >
                        Add Another Authorised Representative
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>
      </Paper>
      <Paper
        :paper-orientation="PaperOrientation.Portrait"
        :show-page-number="false"
        :additional-css-class="controller.additionalCssClass"
      >
        <template #paperContent>
          <div class="page-footer">
            <div class="left-side">Version 1.9</div>
            <div class="right-side">Page 3</div>
          </div>
          <div class="resolution-item">
            <div class="number">3.</div>
            <div class="content">
              That the Company acknowledges and agrees that through the appointment of Authorised Representative(s), the
              company authorises the Authorised Representative(s) to subscribe to any of the Services offered by the
              Bank indicated above in accordance with the terms and conditions for such Services including any amendment
              and additions made thereto from time to time by the Bank and to accept, enter into and/or execute any and
              all agreements, indemnities, forms, applications, documents and terms and conditions in connection with
              the subscription, utilisation or termination of such Services and to issue all notices and instructions
              required by the Bank in connection with the Services.
            </div>
          </div>
          <div class="resolution-item">
            <div class="number">4.</div>
            <div class="content">
              That the Company hereby accepts and agrees to be bound by the terms and conditions of the Services.
            </div>
          </div>
          <div class="resolution-item">
            <div class="number">5.</div>
            <div class="content">
              That a certified true copy of this Resolution be furnished to the Bank and that this Resolution shall
              remain in force until notice in writing to the contrary is given to the Bank by the Company.
            </div>
          </div>
          <p>
            We, the undersigned below, as Directors or Director and Company Secretary of the Company hereby certify that
            the foregoing resolutions have been duly passed in accordance with the Articles of Association of the
            Company and entered in the minute book of the Company and are still in force and do not exceed the objects
            or powers of the Company or the powers of the Directors. We acknowledge that the Bank places full reliance
            on our certification of the foregoing resolutions and accepts our certification as conclusive evidence that
            this extract is a true and accurate record of the resolutions of the Board of Directors of the Company.
          </p>
          <p><br /></p>
          <p>
            Dated:
            <span class="empty-input-field"></span>
          </p>
          <div class="sign-off">Signed by:</div>
          <div class="signature-section">
            <div
              class="signature-input"
              v-for="(signatureName, i) in controller.getSignatureNamesOnPage(3)"
              :key="i"
            >
              <div class="signature-container">Wet Ink Required</div>
              <div class="signature-name">
                {{ i !== 1 ? "Director" : "Company Secretary" }}
                <br />
                Name: {{ signatureName }}
              </div>
            </div>
          </div>
        </template>
      </Paper>
      <Paper
        v-for="page in controller.additionalPages"
        :key="`additional-page-${page}`"
        :paper-orientation="PaperOrientation.Portrait"
        :show-page-number="false"
        :additional-css-class="controller.additionalCssClass"
      >
        <template #paperContent>
          <div class="page-footer">
            <div class="left-side">Version 1.9</div>
            <div class="right-side">Page {{ page }}</div>
          </div>
          <div class="signature-section">
            <div
              class="signature-input"
              v-for="(signatureName, i) in controller.getSignatureNamesOnPage(page)"
              :key="i"
            >
              <div class="signature-container">Wet Ink Required</div>
              <div class="signature-name">
                Director
                <br />
                Name: {{ signatureName }}
              </div>
            </div>
          </div>
        </template>
      </Paper>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Paper from "@/components/Papers/Paper.vue"
  import BranchDropdown from "@/components/Banks/BranchDropdown.vue"
  import type { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
  import { DcrBankAccountOpeningAllianceBankController } from "~/scripts/components/resolutions/DcrBankAccountOpeningAllianceBankController"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import { StringUtil } from "~/scripts/utils/String"
  import { PaperOrientation } from "~/scripts/constants/Paper"

  const props = defineProps<IPropsResolutionDocument<CompanyBankAccountOpening>>()

  const emit = defineEmits(["startLoading", "doneLoading", "signed", "updated"])

  const resolutionContent = ref(null)

  const controller = new DcrBankAccountOpeningAllianceBankController(props, emit)

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
      console.log(newVal)
      controller.setIsInPreviewMode(newVal)
      controller.setContent()
    }
  )

  watch(
    resolutionContent,
    (newVal) => {
      if (newVal) {
        controller.setResolutionContentRef(newVal)
      }
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

  watch(
    () => props.application,
    (newVal) => {
      if (!newVal) {
        return
      }

      controller.updateApplicationContent(newVal)
    },
    { deep: true }
  )

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
    isLoading: controller.isLoading.value,
    getAuthorisedPersonsForOnlineBanking: controller.getAuthorisedPersonsForOnlineBanking.bind(controller),
    getSignatoryType: controller.getSignatoryType.bind(controller),
    getSignatories: controller.getSignatories.bind(controller),
    getBranchId: controller.getBranchId.bind(controller),
    getOtherDetails: controller.getOtherDetails.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/DcrBankAccountOpeningAllianceBank" as *;
</style>
