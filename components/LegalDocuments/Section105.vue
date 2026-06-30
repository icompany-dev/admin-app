<template>
  <div id="legal-document-section-105">
    <div class="paper-wrapper">
      <div class="paper legal-document narrow-margin section-105 portrait">
        <div class="registration-number">
          Company No: {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})
        </div>
        <div class="document-header">
          <span>COMPANIES ACT 2016</span>
          <span>Section 105</span>
          <span>FORM OF TRANSFER OF SECURITIES</span>
        </div>
        <div class="section-105-content">
          <table class="section-105-table">
            <tbody>
              <tr>
                <td
                  class="col-50"
                  colspan="3"
                >
                  <div class="side-by-side">
                    <div>
                      1. Name of Company
                      <br />
                      (In Block Letters)
                    </div>
                    <div class="company-name">
                      {{ controller.companyName() }}
                    </div>
                  </div>
                </td>
                <td class="signature-column">
                  <div class="sign-off">Signature of Transferor (s)</div>
                  <div class="signature-container">
                    <Signature
                      :signature-item="controller.transferorSignatureItem.value"
                      @signed="emit('transferorSigned', $event)"
                    />
                    <Signature
                      v-if="controller.isTransferFromCompany()"
                      :signature-item="controller.transferorRepSignatureItem.value"
                      @signed="emit('transferorRepSigned', $event)"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td class="col-25">
                  2. Number of Units
                  <br />
                  (In Figures & Words)
                  <div class="input-data">
                    {{ controller.companyShareTransferDetail.value.unitsOfShare || "N/A" }}
                    <br />
                    {{ controller.numberToWords(controller.companyShareTransferDetail.value.unitsOfShare) }}
                  </div>
                </td>
                <td class="col-15">
                  Description Of Securities
                  <div class="input-data text-uppercase">
                    {{ controller.shareType() }}
                  </div>
                </td>
                <td class="col-10">
                  Certificate Number(s), if any
                  <div class="input-data">N/A</div>
                </td>
                <td
                  rowspan="4"
                  class="signature-column"
                >
                  <div
                    v-if="!controller.isSection105Completed()"
                    class="witness-watermark"
                  >
                    <div class="watermark">
                      To Be Witnessed By
                      <br />
                      <img
                        src="https://icompany-public.s3.ap-southeast-1.amazonaws.com/public/logo/icompany_long.png"
                        width="175"
                      />
                    </div>
                  </div>
                  Signed, sealed and delivered in the presence of :
                  <br />
                  Signature
                  <br />
                  Name
                  <br />
                  Address
                  <br />
                  Occupation
                  <br />
                  <br />
                  <br />
                  Signed, sealed and delivered in the presence of :
                  <br />
                  Signature
                  <br />
                  Name
                  <br />
                  Address
                  <br />
                  Occupation
                  <br />
                </td>
              </tr>
              <tr>
                <td class="col-25">
                  3. Name of Transferor(s):
                  <br />
                  (In Block Letters) (Hereinafter Called "Transferor")
                </td>
                <td
                  colspan="2"
                  class="col-25 input-data"
                >
                  {{ controller.companyShareTransferDetail.value.transferFromName }}
                </td>
              </tr>
              <tr>
                <td class="col-25">
                  4.
                  <span
                    class="input-label"
                    :class="{ 'line-through': !controller.isTransferFromIdentificationIC() }"
                  >
                    Identity Card
                  </span>
                  <span
                    class="input-label"
                    :class="{ 'line-through': !controller.isTransferFromIdentificationPassport() }"
                  >
                    / Passport
                  </span>
                  <span
                    class="input-label"
                    :class="{ 'line-through': !controller.isTransferFromCompany() }"
                  >
                    / Company No
                  </span>
                  :
                </td>
                <td
                  colspan="2"
                  class="col-25 input-data"
                >
                  {{ controller.companyShareTransferDetail.value.transferFromIdentification || "N/A" }}
                </td>
              </tr>
              <tr>
                <td class="col-25">
                  5. Name & Address of Transferee(s):
                  <br />
                  (In Block Letters)
                  <br />
                  (Hereinafter Called "Transferee")
                </td>
                <td
                  colspan="2"
                  class="col-25 input-data"
                >
                  {{ controller.companyShareTransferDetail.value.transferToName }}
                  <div v-html="controller.companyShareTransferDetail.value.transferToAddress" />
                </td>
              </tr>
              <tr>
                <td
                  class="col-50"
                  colspan="3"
                >
                  6. Particulars of Transferee (See Columns below) :
                </td>
                <td class="signture-column">
                  <div class="sign-off">Signature of Transferee</div>
                  <div class="signature-container">
                    <Signature
                      :signature-item="controller.transfereeSignatureItem.value"
                      @signed="emit('transfereeSigned', $event)"
                    />
                    <Signature
                      v-if="controller.isTransferToCompany()"
                      :signature-item="controller.transfereeRepSignatureItem.value"
                      @signed="emit('transfereeRepSigned', $event)"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td class="col-25">
                  <div class="input-label">(If Transferee is a Person)</div>
                  <br />
                  <div class="input-label">
                    §
                    <span
                      class="input-label"
                      :class="{ 'line-through': !controller.isTransferToIdentificationIC() }"
                    >
                      Identity Card
                    </span>
                    <span
                      class="input-label"
                      :class="{ 'line-through': !controller.isTransferToIdentificationPassport() }"
                    >
                      / Passport No.
                    </span>
                  </div>
                  <div
                    class="input-label"
                    :class="{
                      'fw-bold': controller.companyShareTransferDetail.value.transferToIdentification !== 'N/A',
                    }"
                  >
                    {{ controller.companyShareTransferDetail.value.transferToIdentification }}
                  </div>
                  <br />
                  <div class="input-label">Nationality</div>
                  <div
                    class="input"
                    :class="{ 'fw-bold': controller.companyShareTransferDetail.value.transferToNationality !== 'N/A' }"
                  >
                    {{ controller.companyShareTransferDetail.value.transferToNationality || "N/A" }}
                  </div>
                </td>
                <td
                  colspan="2"
                  class="col-25"
                >
                  <div class="input-label">(If Transferee is a Body Corporate)</div>
                  <br />
                  <div class="input-label">Company No. /Registration No.</div>
                  <div
                    class="input"
                    :class="{ bold: controller.companyShareTransferDetail.value.transferToType === 'representative' }"
                  >
                    {{ controller.companyShareTransferDetail.value.transferToIdentification }}
                    <span
                      v-if="controller.companyShareTransferDetail.value.transferToIncorporatedAt === 'MALAYSIA'"
                      class="input"
                    >
                      ({{ controller.companyShareTransferDetail.value.transferToIdentificationAdditional }})
                    </span>
                  </div>
                  <br />
                  <div class="input-label">Place of Incorporation</div>
                  <div
                    class="input"
                    :class="{ bold: controller.companyShareTransferDetail.value.transferToIncorporatedAt !== 'N/A' }"
                  >
                    {{ controller.companyShareTransferDetail.value.transferToIncorporatedAt || "N/A" }}
                  </div>
                </td>
                <td
                  colspan="1"
                  class="col-50"
                >
                  <div
                    v-if="!controller.isSection105Completed()"
                    class="witness-watermark"
                  >
                    <div class="watermark">
                      To Be Witnessed By
                      <br />
                      <img
                        src="https://icompany-public.s3.ap-southeast-1.amazonaws.com/public/logo/icompany_long.png"
                        width="175"
                      />
                    </div>
                  </div>
                  Signed, sealed and delivered in the presence of :
                  <br />
                  Signature
                  <br />
                  Name
                  <br />
                  Address
                  <br />
                  Occupation
                  <br />
                  <br />
                  <br />
                  Signed, sealed and delivered in the presence of :
                  <br />
                  Signature
                  <br />
                  Name
                  <br />
                  Address
                  <br />
                  Occupation
                  <br />
                </td>
              </tr>
              <tr>
                <td class="col-25">
                  <div class="input-label">Race (If Malaysian) :</div>
                  <br />
                  <div class="input-label">
                    <i
                      class="fa-square me-1"
                      :class="controller.isTransferToMalay() ? 'fa-solid' : 'fa-light'"
                    />
                    Malay
                    <br />
                  </div>
                  <div class="input-label">
                    <i
                      class="fa-square me-1"
                      :class="controller.isTransferToChinese() ? 'fa-solid' : 'fa-light'"
                    />
                    Chinese
                    <br />
                  </div>
                  <div class="input-label">
                    <i
                      class="fa-square me-1"
                      :class="controller.isTransferToIndian() ? 'fa-solid' : 'fa-light'"
                    />
                    Indian
                    <br />
                  </div>
                  <div class="input-label">
                    <i
                      class="fa-square me-1"
                      :class="controller.isTransferToRaceOthers() ? 'fa-solid' : 'fa-light'"
                    />
                    Others (Specify)
                    <br />
                  </div>
                  <div
                    class="input"
                    :class="{ bold: controller.isTransferToRaceOthers() }"
                  >
                    {{ controller.transferToOtherRaces() }}
                  </div>
                </td>
                <td
                  colspan="2"
                  class="col-25"
                >
                  Type of Body Corporate :
                  <br />
                  <br />
                  <div class="input-label">
                    <i
                      class="fa-square me-1"
                      :class="controller.isTransferToGovAgency() ? 'fa-solid' : 'fa-light'"
                    />
                    Government Agencies/ Institution/ Statutory Bodies
                  </div>
                  <div class="input-label">
                    <i
                      class="fa-square me-1"
                      :class="controller.isTransferToNatives() ? 'fa-solid' : 'fa-light'"
                    />
                    Controlled by Malaysians (Malays/Natives)
                  </div>
                  <div class="input-label">
                    <i
                      class="fa-square me-1"
                      :class="controller.isTransferToNonNatives() ? 'fa-solid' : 'fa-light'"
                    />
                    Controlled by Malaysians (Non-Malays/Non-Natives)
                  </div>
                  <div class="input-label">
                    <i
                      class="fa-square me-1"
                      :class="controller.isTransferToForeign() ? 'fa-solid' : 'fa-light'"
                    />
                    Controlled by Non-Malaysians
                  </div>
                </td>

                <td class="signature-column text-justify">
                  The consideration sum set forth in a transfer may differ from that which the first seller will receive
                  owing to sub-sales by the original buyer; the Stamp Act 1949 requires that in such cases the
                  consideration money paid by the sub-purchaser shall be the one inserted in the form, as regulating ad
                  valorem duty (Stamp Act 1949). Please refer to item 32 (b), First Schedule of the Stamp Act 1949 for
                  the stamp duty chargeable on sale of any stock, shares or marketable securities. If the Transferor or
                  Transferee is a body corporate, the execution of this instrument must be done in accordance with the
                  provision of the constitution of its incorporation.
                </td>
              </tr>
              <tr>
                <td colspan="4">
                  <span
                    class="input-label"
                    :class="{ 'line-through': controller.hasUserSigned() || controller.isSection105Completed() }"
                  >
                    ┼*I am/*We are nominee (s) of a person resident in ……………………………………... (country)
                  </span>
                </td>
              </tr>
              <tr>
                <td
                  colspan="4"
                  class="text-align-justify"
                >
                  7. In consideration of the sum herein mentioned,
                  <span
                    class="input-label"
                    :class="{ 'line-through': controller.isTransferToCompany() }"
                  >
                    *I/*
                  </span>
                  <span
                    class="input-label"
                    :class="{ 'line-through': controller.isTransferToIndividual() }"
                  >
                    We
                  </span>
                  , the Transferor, hereby transfer to the Transferee the securities referred to in paragraphs 1 and 2
                  hereof and
                  <span
                    class="input-label"
                    :class="{ 'line-through': controller.isTransferToCompany() }"
                  >
                    *I/*
                  </span>
                  <span
                    class="input-label"
                    :class="{ 'line-through': controller.isTransferToIndividual() }"
                  >
                    We
                  </span>
                  , the Transferee, hereby accept the transfer of the said securities.
                </td>
              </tr>
              <tr>
                <td
                  class="col-50"
                  colspan="3"
                >
                  Consideration Sum (in words): Ringgit Malaysia
                  <div class="input bold">
                    {{ controller.numberToWords(controller.companyShareTransferDetail.value.unitsOfShare) }} ONLY
                  </div>
                </td>

                <td
                  class="col-50"
                  colspan="1"
                >
                  Consideration Sum (In Malaysian Ringgit)
                  <div class="input bold">
                    RM{{ controller.companyShareTransferDetail.value.unitsOfShare.toFixed(2) }}
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="4">
                  8. Dated this day of
                  <span class="input-label text-muted"><i>(To be determined by iCompany)</i></span>
                </td>
              </tr>
              <tr v-if="controller.hasUserSigned() || controller.isSection105Completed()">
                <td
                  colspan="4"
                  class="footer"
                >
                  <i>
                    A husband must not witness the signature of his wife or vice versa.
                    <br />
                    * Strike out whichever is inapplicable.
                    <br />
                    ┼ Delete if inapplicable.
                    <br />
                    § Also state colour & type/Also state country.
                    <br />
                  </i>
                </td>
              </tr>

              <tr v-if="!controller.hasUserSigned() && !controller.isSection105Completed()">
                <td
                  colspan="4"
                  class="warning"
                >
                  <i>
                    iCompany Will be the Witness for this Section 105.
                    <br />
                    Relevant information will be strike out after affix signature.
                  </i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Signature from "../Signatures/Signature.vue"
  import { Section105Controller } from "~/scripts/components/legal-documents/Section105Controller"
  import { CompanyShareTransferDetail } from "~/scripts/models/CompanyShareTransferDetail"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    companyShareTransferDetail: {
      type: CompanyShareTransferDetail,
      required: true,
    },
    shareholderId: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(["transferorSigned", "transferorRepSigned", "transfereeSigned", "transfereeRepSigned"])

  const controller = new Section105Controller(
    props.companyId,
    props.companyShareTransferDetail,
    props.shareholderId,
    emit
  )

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )

  watch(
    () => props.companyShareTransferDetail,
    (newVal) => {
      controller.setCompanyShareTransferDetail(newVal)
    }
  )

  watch(
    () => props.shareholderId,
    (newVal) => {
      controller.setShareholderId(newVal)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/Section105" as *;
</style>
