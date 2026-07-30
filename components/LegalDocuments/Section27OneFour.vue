<template>
  <div id="legal-document-section-27">
    <Paper
      :paper-orientation="PaperOrientation.Portrait"
      :additional-css-class="'legal-document section-27'"
      :is-include-logo="false"
      :show-page-number="true"
      :page-number="1"
    >
      <template #paperContent>
        <div class="document-title">
          COMPANIES ACT 2016
          <br />
          Section 27(1)(4)
          <br />
          APPLICATION AND RESERVATION FOR AVAILABILITY OF NAMES
        </div>
        <div class="document-section">
          <table>
            <thead>
              <tr>
                <td colspan="2">PARTICULARS OF APPLICATION</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Proposed Company Name</td>
                <td>{{ controller.proposedName() }}</td>
              </tr>
              <tr>
                <td>Lodging Ref No</td>
                <td>{{ controller.application.value.ssmTemplateReferenceNumber }}</td>
              </tr>
              <tr>
                <td>Purpose of Application</td>
                <td>N - NEW INCORPORATION</td>
              </tr>
              <tr>
                <td>Company Type</td>
                <td>S - LIMITED BY SHARES</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="document-section">
          <table>
            <thead>
              <tr>
                <td colspan="2">PARTICULARS OF APPLICANT</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Applicant Name</td>
                <td>
                  <span class="placeholder-value">To be determined by iCompany</span>
                </td>
              </tr>
              <tr>
                <td>Identification Number</td>
                <td>
                  <span class="placeholder-value">To be determined by iCompany</span>
                </td>
              </tr>
              <tr>
                <td>Address</td>
                <td>
                  <span class="placeholder-value">To be determined by iCompany</span>
                </td>
              </tr>
              <tr>
                <td>Email Address</td>
                <td>
                  <span class="placeholder-value">To be determined by iCompany</span>
                </td>
              </tr>
              <tr>
                <td>Mobile Phone Number</td>
                <td>
                  <span class="placeholder-value">To be determined by iCompany</span>
                </td>
              </tr>
              <tr>
                <td>Phone Number</td>
                <td>NIL</td>
              </tr>
              <tr>
                <td>Fax Number</td>
                <td>NIL</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="document-section">
          <table>
            <thead>
              <tr>
                <td colspan="2">CLARIFICATION</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1) Single letters included in the name stand for?</td>
                <td>NIL</td>
              </tr>
              <tr>
                <td>2) If the proposed name is not in Bahasa Malaysia or English, please clarify.</td>
                <td>NIL</td>
              </tr>
              <tr>
                <td>
                  3) If the proposed name contains a proper name, state whether it is the name of a director of the
                  company or the proposed company.
                </td>
                <td>NIL</td>
              </tr>
              <tr>
                <td>
                  4) If the proposed name is similar to that of a related or associated corporation **, state whether
                  written consent has been obtained from the said corporation (please attach consent).
                </td>
                <td>NIL</td>
              </tr>
              <tr>
                <td>
                  5) If the proposed name is a trademark, state whether consent has been obtained from the owner (please
                  attach consent).
                </td>
                <td>NIL</td>
              </tr>
              <tr>
                <td>
                  6) If proposed name is to be used for change of name of a corporation, please give the following :
                  <br />
                  <br />
                  Existing Company Name :
                  <br />
                  Company Number:
                </td>
                <td>
                  <br />
                  <br />
                  <br />
                  <br />
                  NIL
                  <br />
                  NIL
                </td>
              </tr>
              <tr>
                <td>7) Business Nature</td>
                <td>
                  {{ controller.applicationIncorporate.value.businessDescription }}
                </td>
              </tr>
              <tr>
                <td>8) Other Comments</td>
                <td>NIL</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Paper>
    <!-- <Paper :paper-orientation="PaperOrientation.Portrait" :additional-css-class="'legal-document section-27'"
      :is-include-logo="false" :show-page-number="true" :page-number="2">
      <template #paperContent>
        <div class="document-section">
          <table>
            <thead>
              <tr>
                <td colspan="5">PROMOTER</td>
              </tr>
            </thead>
            <tbody>
              <tr class="header">
                <td>Promoter Name/Body<br>Corporate</td>
                <td>Identification Type</td>
                <td>Identification<br>No/Registration No</td>
                <td>Date of Birth</td>
                <td>Email Address</td>
              </tr>
              <tr class="promoter">
                <td>
                  {{ controller.applicant.value.name }}
                </td>
                <td>
                  {{ controller.promoterIdentificationType() }}
                </td>
                <td>
                  {{ controller.applicant.value.detail?.identification }}
                </td>
                <td>
                  {{ controller.dateOfBirth() }}
                </td>
                <td>
                  {{ controller.applicant.value.email }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="document-section">
          <table>
            <thead>
              <tr>
                <td colspan="1">DECLARATION SECTION</td>
              </tr>
            </thead>
            <tbody>
              <tr class="declaration">
                <td>
                  <p>
                    I confirm that the facts and information stated in this document are true and to the best of my
                    knowledge.
                  </p>
                  <p>
                    Name : 
                    <span class="placeholder-value">
                      To be determined by iCompany
                    </span>
                    <br>
                    Date of Application : 
                    <span class="placeholder-value">
                      To be determined by iCompany
                    </span>
                    <br>
                    Designation :PROFESSIONAL
                  </p>
                  <p>
                    Attention:<br>
                    It is an offence under section 591 of the Companies Act 2016 to make or authorize the making of a
                    statement that a person knows is false or misleading and that person may be liable, upon conviction,
                    to imprisonment for a term not exceeding ten years or to a fine not exceeding RM3 million or to
                    both.
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="document-section">
          <table>
            <thead>
              <tr>
                <td colspan="2">LODGER INFORMATION</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Name</td>
                <td>
                  <span class="placeholder-value">
                    To be determined by iCompany
                  </span>
                </td>
              </tr>
              <tr>
                <td>Identification Number</td>
                <td>
                  <span class="placeholder-value">
                    To be determined by iCompany
                  </span>
                </td>
              </tr>
              <tr>
                <td>Prescribed Body Type</td>
                <td>Licensed Secretary (LS)</td>
              </tr>
              <tr>
                <td>License number/Membership Number</td>
                <td>
                  <span class="placeholder-value">
                    To be determined by iCompany
                  </span>
                </td>
              </tr>
              <tr>
                <td>Address</td>
                <td>
                  <span class="placeholder-value">
                    To be determined by iCompany
                  </span>
                </td>
              </tr>
              <tr>
                <td>Email Address</td>
                <td>
                  <span class="placeholder-value">
                    To be determined by iCompany
                  </span>
                </td>
              </tr>
              <tr>
                <td>Mobile Phone Number</td>
                <td>
                  <span class="placeholder-value">
                    To be determined by iCompany
                  </span>
                </td>
              </tr>
              <tr>
                <td>Phone Number</td>
                <td>
                  <span class="placeholder-value">
                    To be determined by iCompany
                  </span>
                </td>
              </tr>
              <tr>
                <td>Fax Number</td>
                <td>
                  <span class="placeholder-value">
                    To be determined by iCompany
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Paper> -->
  </div>
</template>

<script setup lang="ts">
  import Paper from "../Papers/Paper.vue"
  import { PaperOrientation } from "~/scripts/constants/Paper"
  import { Section27OneFourController } from "~/scripts/components/legal-documents/Section27OneFourController"

  const props = defineProps({
    applicationId: {
      type: String,
      required: true,
    },
    applicationIncorporateId: {
      type: String,
      required: true,
    },
  })

  const controller = new Section27OneFourController(props.applicationId, props.applicationIncorporateId)

  watch(
    () => props.applicationId,
    (newVal) => {
      controller.setApplicationId(newVal)
    }
  )

  watch(
    () => props.applicationIncorporateId,
    (newVal) => {
      controller.setIncorporationId(newVal ?? "")
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/Section27OneFour" as *;
</style>
