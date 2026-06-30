<template>
  <div id="mcr-tekun-application">
    <Paper
      :paper-orientation="controller.paperOrientation"
      :show-page-number="false"
      :additional-css-class="controller.additionalClass"
      :show-watermark="controller.showWatermark.value"
      :ear-mark-text="controller.watermarkText.value"
    >
      <template #paperMargins>
        <div
          v-if="controller.isPaid.value"
          class="paper-tag authorised-person-field"
          @click="emit('completeApplication', controller.application.value)"
        >
          <span>Complete This</span>
        </div>
      </template>
      <template #paperContent>
        <div class="document-header">
          {{ controller.companyName() }}
          <br />
          No. Pendaftaran Syarikat {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})
          <br />
          RESOLUSI PEMILIK SYARIKAT / PEMEGANG SAHAM
        </div>
        <div class="resolution-content">
          <p>
            <b>
              Ketetapan Syarikat melalui Mesyuarat Pemilik Syarikat / Pemegang Saham atau Resolusi Pekeliling bertarikh
              <span class="value-placeholder">Tarikh Resolusi</span>
              bertujuan untuk Pembiayaan Perniagaan dengan pihak TEKUN Nasional
            </b>
          </p>
          <table class="application-details">
            <tbody>
              <tr>
                <td>DI ANTARA</td>
                <td>
                  <b>TEKUN NASIONAL (471673-V)</b>
                  sebuah syarikat yang ditubuhkan di bawah Akta Syarikat 2016 adalah sebuah agensi di bawah Kementerian
                  Pembangunan Usahawan dan Koperasi yang beralamat di
                  <b>
                    Menara TEKUN, T5-01-01, Lingkaran Maju, Jalan Lingkaran Tengah 2, 57000 Bandar Tasik Selatan,
                    Wilayah Persekutuan Kuala Lumpur.
                  </b>
                </td>
              </tr>
              <tr>
                <td>DAN</td>
                <td>
                  <b>
                    {{ controller.companyName() }}
                    {{ controller.registrationNumberNew() }}
                    ({{ controller.registrationNumberOld() }})
                  </b>
                  sebuah syarikat yang ditubuhkan di bawah Akta Syarikat 2016 beralamat di
                  <b>{{ controller.companyAddress }}</b>
                  .
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            <b>Ahli-Ahli Pemegang Saham Syarikat bersetuju seperti berikut;</b>
          </p>
          <ol class="agreement-details">
            <li>
              Syarikat ini membuat permohonan pembiayaan dan menerima pembiayaan perniagaan daripada TEKUN Nasional.
            </li>
            <li>
              Kuasa diberikan kepada orang yang diberi kuasa sebagai wakil Pemilik Syarikat / Pemegang saham seperti
              nama yang dinyatakan berikut di bawah;
              <br />
              <br />
              <input
                type="text"
                class="form-control in-resolution"
                v-model="controller.authorisedPerson.value"
                @input="controller.onAuthorisedPersonChanged()"
                v-if="controller.isDocumentEditable()"
              />
              <span
                v-if="!controller.isDocumentEditable()"
                :class="{ 'value-placeholder': controller.isInPreviewMode.value }"
              >
                <b>{{ controller.authorisedPersonName }}</b>
              </span>
              seperti mana nama yang tertera di dalam borang permohonan pembiayaan TEKUN untuk melakukan perkara yang
              berikut;
              <ol class="authorised-details">
                <li>
                  Memohon, menerima dan menandatangani, semua dokumen berkaitan dengan perjanjian Pembiayaan TEKUN
                  Nasional atau bertindak atas sebarang arahan dan menerima sebarang resit atau dokumen lain yang
                  berkaitan dengan pembiayaan TEKUN Nasional sama ada akaun urusniaga atau hal ehwal Syarikat jika
                  ditandatangani bagi pihak Syarikat.
                </li>
                <li>
                  Membayar dan menuruti semua cek, deposit, resit, permintaan yang melibatkan pembayaran kepada TEKUN
                  Nasional.
                </li>
              </ol>
            </li>
            <li>
              Syarikat dengan ini memperakui bertanggungjawab sepenuhnya untuk membayar balik pembiayaan yang diluluskan
              oleh TEKUN Nasional seperti mana yang ditetapkan di dalam kontrak Pembiayaan TEKUN Nasional. Syarikat
              memperakui dan bersetuju sekiranya pihak Syarikat gagal untuk mematuhi sebarang terma-terma yang
              ditetapkan, maka setiap Pemilik Syarikat / Pemegang Saham akan bertanggungjawab sepenuhnya untuk membayar
              balik kesemua jumlah pembiayaan yang tertunggak kepada TEKUN Nasional walaupun telah tidak menjadi Pemilik
              Syarikat / Pemegang Saham Syarikat tersebut.
            </li>
            <li>
              Perlindungan takaful untuk jumlah pembiayaan yang diluluskan ini diisyaratkan ke atas nama wakil Syarikat
              yang dipersetujui.
            </li>
            <li>
              Syarikat memasitkan Pemohon pembiayaan atau wakil Pemilik Syarikat / Pemegang Saham Syarikat yang diberi
              kuasa mestilah menjadi salah seorang penandatangan akaun Syarikat yang berkaitan dengan pembiayaan ini.
            </li>
          </ol>
        </div>
      </template>
    </Paper>
    <Paper
      :paper-orientation="controller.paperOrientation"
      :show-page-number="false"
      :additional-css-class="controller.additionalClass"
      :show-watermark="controller.showWatermark.value"
      :ear-mark-text="controller.watermarkText.value"
    >
      <template #paperContent>
        <div class="resolution-content">
          <p>
            Dengan ini, kami sebagai Pemilik Syarikat / Pemegang Saham Syarikat bersetuju dengan Keputusan tersebut dan
            akan menunaikan segala janji dan ketetapan Resolusi ini.
          </p>
        </div>
        <div class="signature-section">
          <div
            class="signature-item"
            v-for="(signatureItem, index) in controller.signatures.value"
            :key="index"
          >
            <Signature
              :signature-item="signatureItem"
              :is-tinted="true"
              :tint-label="'Sign in Wet Ink'"
              @is-enlarged="controller.handleEnlargedSignaturePad($event)"
              @signed="emit('signed', $event)"
            />
          </div>
        </div>
        <div class="signature-section cosec-ctc">
          <div class="signature-item">
            <Signature
              :signature-item="controller.cosecCertification"
              :is-tinted="true"
              :tint-label="'CTC will be later'"
            />
          </div>
        </div>
      </template>
    </Paper>
  </div>
</template>

<script lang="ts" setup>
  import Paper from "../Papers/Paper.vue"
  import Signature from "../Signatures/Signature.vue"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import { McrTekunApplicationController } from "~/scripts/components/resolutions/McrTekunApplicationController"
  import type { CompanyLoanApplication } from "~/scripts/models/CompanyLoanApplication"

  const props = defineProps<IPropsResolutionDocument<CompanyLoanApplication>>()
  const emit = defineEmits([
    "startLoading",
    "doneLoading",
    "totalPageChanged",
    "applicationUpdated",
    "signed",
    "completeApplication",
  ])

  const controller = new McrTekunApplicationController(props, emit)

  watch(
    () => props.applicationId,
    (newVal) => {
      controller.setApplicationId(newVal)
    }
  )

  watch(
    () => props.isInPreviewMode,
    (newVal) => {
      controller.setIsInPreviewMode(newVal)
      controller.setContent()
    }
  )

  watch(
    () => controller.application.value,
    (newVal) => {
      if (newVal) {
        emit("applicationUpdated", newVal)
      }
    },
    { deep: true }
  )

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
  })
</script>
