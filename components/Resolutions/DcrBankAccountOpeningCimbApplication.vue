<template>
  <div
    id="dcr-bank-account-opening-cimb-application"
    ref="documentRef"
  >
    <Paper
      :paper-orientation="PaperOrientation.Portrait"
      :is-loader="true"
      :show-page-number="false"
      v-if="!controller.showDocument"
    >
      <template #paperContent>
        <LoaderPrepare
          :label="controller.loaderLabel"
          :sublabel="controller.loaderSublabel"
        />
      </template>
    </Paper>
    <template v-if="controller.showDocument">
      <Paper
        :paper-orientation="PaperOrientation.Portrait"
        :show-page-number="false"
        additional-css-class="cimb-application-form-paper"
      >
        <template
          #paperMargins
          v-if="props.isShowTag"
        >
          <div
            class="paper-tag point-left is-resident"
            v-if="controller.isBooleanEmpty('isResident')"
          >
            <span>Insert Information</span>
          </div>

          <div
            class="paper-tag point-left is-bumiputra"
            v-if="controller.isBooleanEmpty('isBumiputraControlled')"
          >
            <span>Insert Information</span>
          </div>
        </template>
        <template #paperContent>
          <div class="document-page application-page-1">
            <div class="document-header">
              <div
                class="bank-logo"
                role="img"
                aria-label="CIMB"
              ></div>
              <div class="confidential">
                CONFIDENTIAL /
                <i>SULIT</i>
              </div>
            </div>
            <div class="application-introduction">
              <div class="introduction-main">
                <p class="document-title">
                  <b>BUSINESS ACCOUNT APPLICATION FORM /</b>
                  <br />
                  <i><b>BORANG PERMOHONAN AKAUN PERNIAGAAN</b></i>
                </p>
                <p class="introduction-text">
                  Please take a few minutes to tell us about yourself and your banking needs so that we can serve you
                  better. Please use CAPITAL letters and tick the boxes where applicable. You may type on this form and
                  print it out for submission to the bank for processing. / Sila ambil beberapa minit untuk memberitahu
                  kami tentang diri anda dan keperluan perbankan anda supaya kami dapat melayan anda dengan lebih baik.
                  Sila gunakan HURUF BESAR dan tandakan pada kotak-kotak dimana ia berkenaan. Anda boleh menaip pada
                  borang ini dan buat cetakan untuk diserahkan kepada Bank untuk pemprosesan.
                </p>
              </div>
              <div class="important-notice">
                <span class="notice-icon">!</span>
                <p>
                  <b>Important Notice: Please read and understand</b>
                  <br />
                  <b>the terms and conditions of the accounts and</b>
                  <br />
                  <b>services before you decide to apply and if</b>
                  <br />
                  <b>you do not understand any of the terms and</b>
                  <br />
                  <b>conditions, you may clarify with the Bank. /</b>
                  <br />
                  <i><b>Notis Penting: Sila baca dan fahami terma dan</b></i>
                  <br />
                  <i><b>syarat akaun dan perkhidmatan sebelum anda</b></i>
                  <br />
                  <i><b>membuat keputusan untuk memohon dan</b></i>
                  <br />
                  <i><b>jika anda tidak memahami mana-mana terma</b></i>
                  <br />
                  <i><b>dan syarat berikut, anda boleh mendapatkan</b></i>
                  <br />
                  <i><b>penjelasan daripada pihak Bank.</b></i>
                </p>
              </div>
            </div>
            <div class="document-section account-type">
              <div class="document-section-title">
                ACCOUNT TYPE (MANDATORY) /
                <i>JENIS AKAUN (WAJIB)</i>
              </div>
              <div class="document-section-content">
                <p class="account-intro">
                  I / We would like to apply for /
                  <i>Saya / Kami ingin memohon untuk</i>
                </p>
                <div class="account-options">
                  <div class="account-category">
                    <p class="category-heading">
                      <b>
                        Conventional /
                        <i>Konvensional</i>
                      </b>
                    </p>
                    <div class="conventional-options">
                      <div>
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="current-account"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isAccountTypeSelected('current-account')"
                            @change="controller.onAccountTypeClicked('current-account')"
                          />
                          <span>
                            *Current Account /
                            <i>Akaun Semasa</i>
                          </span>
                        </label>
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="foreign-current-account"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isAccountTypeSelected('foreign-current-account')"
                            @change="controller.onAccountTypeClicked('foreign-current-account')"
                          />
                          <span>
                            *Foreign Currency Current Account /
                            <i>Akaun Semasa Matawang Asing</i>
                          </span>
                        </label>
                      </div>
                      <div>
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="fixed-deposit"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isAccountTypeSelected('fixed-deposit')"
                            @change="controller.onAccountTypeClicked('fixed-deposit')"
                          />
                          <span>
                            *Fixed Deposit /
                            <i>Deposit Tetap</i>
                          </span>
                        </label>
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="foreign-fixed-deposit"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isAccountTypeSelected('foreign-fixed-deposit')"
                            @change="controller.onAccountTypeClicked('foreign-fixed-deposit')"
                          />
                          <span>
                            *Foreign Currency Fixed Deposit /
                            <i>Deposit Tetap Matawang Asing</i>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="account-category">
                    <p class="category-heading">
                      <b>
                        Islamic /
                        <i>Islamic</i>
                      </b>
                    </p>
                    <div class="islamic-options">
                      <div>
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="current-account-i"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isAccountTypeSelected('current-account-i')"
                            @change="controller.onAccountTypeClicked('current-account-i')"
                          />
                          <span>
                            *Current Account-i /
                            <i>Akaun Semasa-i</i>
                          </span>
                        </label>
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="foreign-current-i"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isAccountTypeSelected('foreign-current-i')"
                            @change="controller.onAccountTypeClicked('foreign-current-i')"
                          />
                          <span>
                            *Foreign Currency Current Account-i /
                            <br />
                            <i>Akaun Semasa Matawang Asing-i</i>
                          </span>
                        </label>
                      </div>
                      <div>
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="fixed-deposit-i"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isAccountTypeSelected('fixed-deposit-i')"
                            @change="controller.onAccountTypeClicked('fixed-deposit-i')"
                          />
                          <span>
                            *Fixed Deposit-i
                            <small>
                              <i>
                                (formerly known as Fixed Return Income
                                <br />
                                Account-i)
                              </i>
                            </small>
                            /
                            <i>
                              Deposit Tetap-i
                              <small>
                                (dahulunya dikenali sebagai Akaun
                                <br />
                                Pulangan Pendapatan Tetap-i)
                              </small>
                            </i>
                          </span>
                        </label>
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="foreign-fixed-i"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isAccountTypeSelected('foreign-fixed-i')"
                            @change="controller.onAccountTypeClicked('foreign-fixed-i')"
                          />
                          <span>
                            *Foreign Currency Fixed Deposit-i
                            <small>
                              <i>
                                (formerly known as Foreign
                                <br />
                                Currency Fixed Return Income Account-i)
                              </i>
                            </small>
                            /
                            <i>
                              Deposit Tetap Mata
                              <br />
                              Wang Asing-i
                              <small>
                                (dahulunya dikenali sebagai Akaun Pulangan
                                <br />
                                Pendapatan Tetap Mata Wang Asing-i)
                              </small>
                            </i>
                          </span>
                        </label>
                      </div>
                      <div>
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="daily-investment"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isAccountTypeSelected('daily-investment')"
                            @change="controller.onAccountTypeClicked('daily-investment')"
                          />
                          <span>
                            Daily Investment Account-i /
                            <br />
                            <i>Akaun Pelaburan Harian-i</i>
                          </span>
                        </label>
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="term-investment"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isAccountTypeSelected('term-investment')"
                            @change="controller.onAccountTypeClicked('term-investment')"
                          />
                          <span>
                            Term Investment Account-i /
                            <br />
                            <i>Akaun Pelaburan Jangka-i</i>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="account-other">
                    <label class="form-check">
                      <input
                        type="checkbox"
                        name="other-account"
                        :disabled="!controller.isDocumentEditable()"
                        :checked="controller.isAccountTypeSelected('other-account')"
                        @change="controller.onAccountTypeClicked('other-account')"
                      />
                      <span>
                        Others, please specify /
                        <i>Lain-lain, sila nyatakan</i>
                      </span>
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      name="other-account-description"
                      placeholder="ENTER VALUE"
                      :disabled="!controller.isDocumentEditable()"
                      v-model="controller.cimbBankApplicationDetails.value.otherAccountDescription"
                      @change="controller.onOtherDetailsChanged()"
                    />
                  </div>
                </div>
                <p class="deposit-note">
                  *Deposit products are protected by PIDM up to RM250,000 for each depositor. / *
                  <i>Produk deposit dilindungi oleh PIDM setakat RM250,000 untuk setiap pendeposit.</i>
                </p>
              </div>
            </div>
            <div class="document-section business-information">
              <div class="document-section-title">
                BUSINESS INFORMATION (MANDATORY) /
                <i>MAKLUMAT PERNIAGAAN (WAJIB)</i>
              </div>
              <div class="document-section-content">
                <div class="two-columns">
                  <div class="business-left">
                    <div class="business-type">
                      <p>
                        Type of Business (Please ✓ one) /
                        <i>Jenis Perniagaan (Sila ✓ satu)</i>
                      </p>
                      <div class="business-type-options">
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="business-type-1"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isBusinessTypeSelected('business-type-1')"
                            @change="controller.onBusinessTypeClicked('business-type-1')"
                          />
                          <span>
                            Sole Proprietor /
                            <i>Pemilikan Tunggal</i>
                          </span>
                        </label>
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="business-type-2"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isBusinessTypeSelected('business-type-2')"
                            @change="controller.onBusinessTypeClicked('business-type-2')"
                          />
                          <span>
                            Partnership /
                            <i>Perkongsian</i>
                          </span>
                        </label>
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="business-type-3"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isBusinessTypeSelected('business-type-3')"
                            @change="controller.onBusinessTypeClicked('business-type-3')"
                          />
                          <span>
                            Limited Liability Partnership /
                            <i>Perkongsian Liabiliti Terhad (“LLP”)</i>
                          </span>
                        </label>
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="business-type-4"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isBusinessTypeSelected('business-type-4')"
                            @change="controller.onBusinessTypeClicked('business-type-4')"
                          />
                          <span>
                            Professional Firm /
                            <i>Firma Profesional</i>
                          </span>
                        </label>
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="business-type-5"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isBusinessTypeSelected('business-type-5')"
                            @change="controller.onBusinessTypeClicked('business-type-5')"
                          />
                          <span>
                            Association / Club / Society /
                            <i>Persatuan / Kelab / Pertubuhan</i>
                          </span>
                        </label>
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="business-type-6"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isBusinessTypeSelected('company-sdn-bhd')"
                            @change="controller.onBusinessTypeClicked('company-sdn-bhd')"
                          />
                          <span>
                            Company (Sdn Bhd) /
                            <i>Syarikat (Sdn Bhd)</i>
                          </span>
                        </label>
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="business-type-7"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isBusinessTypeSelected('business-type-7')"
                            @change="controller.onBusinessTypeClicked('business-type-7')"
                          />
                          <span>
                            Company (Berhad) /
                            <i>Syarikat (Berhad)</i>
                          </span>
                        </label>
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="business-type-8"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isBusinessTypeSelected('business-type-8')"
                            @change="controller.onBusinessTypeClicked('business-type-8')"
                          />
                          <span>
                            Others, please specify /
                            <i>Lain-Lain, sila nyatakan</i>
                          </span>
                        </label>
                        <input
                          type="text"
                          class="form-control underlined"
                          name="other-business-type"
                          placeholder=""
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.cimbBankApplicationDetails.value.otherBusinessType"
                          @change="controller.onOtherDetailsChanged()"
                        />
                      </div>
                    </div>
                    <div class="form-group registered-name">
                      <p class="field-label">
                        Registered Name /
                        <i>Nama Berdaftar</i>
                      </p>
                      <div class="field-lines">
                        <input
                          type="text"
                          class="form-control"
                          name="registered-name-1"
                          placeholder="SAMPLE COMPANY SDN BHD"
                          autocomplete="off"
                          :value="controller.companyName()"
                          readonly
                        />
                        <input
                          type="text"
                          class="form-control"
                          name="registered-name-2"
                          placeholder=""
                          autocomplete="off"
                          readonly
                        />
                      </div>
                    </div>
                    <div class="form-group registration-number">
                      <p class="field-label">
                        Business Registration Number /
                        <i>Nombor Pendaftaran Perniagaan</i>
                      </p>
                      <div class="field-lines">
                        <input
                          type="text"
                          class="form-control"
                          name="registration-number"
                          placeholder="000000000000"
                          autocomplete="off"
                          :value="controller.registrationNumberNew()"
                          readonly
                        />
                      </div>
                    </div>
                    <div class="form-group country">
                      <p class="field-label">
                        Country of Registration /
                        <i>Negara Pendaftaran</i>
                      </p>
                      <div class="field-lines">
                        <input
                          type="text"
                          class="form-control"
                          name="country"
                          placeholder="MALAYSIA"
                          autocomplete="off"
                          :value="'MALAYSIA'"
                          readonly
                        />
                      </div>
                    </div>
                    <div class="form-group incorporation-date">
                      <p class="field-label">
                        Date of Incorporation /
                        <i>Tarikh Diperbadankan</i>
                      </p>
                      <div
                        class="date-fields"
                        style="width: 189px"
                      >
                        <input
                          type="text"
                          class="form-control"
                          name="incorporation-date-day"
                          placeholder="DD"
                          maxlength="2"
                          autocomplete="off"
                          :value="controller.getDayOfDate(controller.companyIncorporationDate)"
                          readonly
                        />
                        <span style="border-left: unset">/</span>
                        <input
                          type="text"
                          class="form-control"
                          name="incorporation-date-month"
                          placeholder="MM"
                          maxlength="2"
                          autocomplete="off"
                          :value="controller.getMonthOfDate(controller.companyIncorporationDate)"
                          readonly
                        />
                        <span style="border-left: unset">/</span>
                        <input
                          type="text"
                          class="form-control"
                          name="incorporation-date-year"
                          placeholder="YYYY"
                          maxlength="4"
                          autocomplete="off"
                          :value="controller.getYearOfDate(controller.companyIncorporationDate)"
                          readonly
                        />
                      </div>
                    </div>
                  </div>
                  <div class="business-right">
                    <div class="resident-group">
                      <p>
                        Resident /
                        <i>Pemastautin</i>
                        <br />
                        (Is this a Malaysia incorporated Business/Company/Others? /
                        <br />
                        <i>Adakah perniagaan in diperbadankan di Malaysia/syarikat dan</i>
                        <br />
                        <i>lain-lain?</i>
                        )
                      </p>
                      <div class="yes-no">
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="resident-yes"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isBooleanSelected('isResident', true)"
                            @change="controller.onBooleanClicked('isResident', true)"
                          />
                          <span>
                            Yes /
                            <i>Ya</i>
                          </span>
                        </label>
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="resident-no"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isBooleanSelected('isResident', false)"
                            @change="controller.onBooleanClicked('isResident', false)"
                          />
                          <span>
                            No /
                            <i>Tidak</i>
                          </span>
                        </label>
                      </div>
                    </div>
                    <div class="bumiputera-group">
                      <p>
                        Is this a Bumiputera-controlled Company? /
                        <i>Adakah ini sebuah</i>
                        <br />
                        <i>Syarikat Kawalan Bumiputra?</i>
                        <br />
                        (more than 25% shareholding owned by Bumiputera /
                        <i>lebih</i>
                        <br />
                        <i>daripada 25% pegangan saham dimiliki oleh Bumiputra</i>
                        )
                      </p>
                      <div class="yes-no">
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="bumiputera-yes"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isBooleanSelected('isBumiputraControlled', true)"
                            @change="controller.onBooleanClicked('isBumiputraControlled', true)"
                          />
                          <span>
                            Yes /
                            <i>Ya</i>
                          </span>
                        </label>
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="bumiputera-no"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isBooleanSelected('isBumiputraControlled', false)"
                            @change="controller.onBooleanClicked('isBumiputraControlled', false)"
                          />
                          <span>
                            No /
                            <i>Tidak</i>
                          </span>
                        </label>
                      </div>
                    </div>
                    <div class="form-group address-group">
                      <p class="field-label">
                        Registered Address /
                        <i>Alamat Berdaftar</i>
                      </p>
                      <!-- <pre>
                        {{ controller.company.value.registeredAddressLocation }}
                      </pre> -->
                      <div class="field-lines">
                        <input
                          type="text"
                          class="form-control"
                          name="registered-address-line-1"
                          autocomplete="off"
                          style="padding: 0px 5px; text-transform: uppercase"
                          :value="controller.company.value.registeredAddressLocation?.addressLine1"
                          readonly
                        />

                        <input
                          type="text"
                          class="form-control"
                          name="registered-address-line-2"
                          autocomplete="off"
                          style="padding: 0px 5px; text-transform: uppercase"
                          :value="controller.company.value.registeredAddressLocation?.addressLine2"
                          readonly
                        />
                        <input
                          type="text"
                          class="form-control"
                          name="registered-address-line-3"
                          autocomplete="off"
                          style="padding: 0px 5px; text-transform: uppercase"
                          :value="controller.company.value.registeredAddressLocation?.addressLine3"
                          readonly
                        />
                        <div class="postcode-row">
                          <input
                            type="text"
                            class="form-control"
                            name="registered-address-state"
                            autocomplete="off"
                            style="padding: 0px 5px; text-transform: uppercase"
                            :value="controller.company.value.registeredAddressLocation?.state?.name"
                            readonly
                          />
                          <span>
                            Postcode /
                            <i>Poskod</i>
                          </span>
                          <input
                            type="text"
                            class="form-control postcode"
                            name="registered-address-postcode"
                            placeholder="00000"
                            maxlength="5"
                            autocomplete="off"
                            style="width: 63pt; letter-spacing: 9pt"
                            :value="controller.company.value.registeredAddressLocation?.postcode"
                            readonly
                          />
                        </div>
                      </div>
                    </div>
                    <div class="form-group address-group">
                      <p class="field-label">
                        Business Operating Address (if different from Registered Address) /
                        <br />
                        <i>Alamat Perniagaan Beroperasi (jika berlainan dengan Alamat Berdaftar)</i>
                      </p>
                      <div class="field-lines">
                        <input
                          type="text"
                          class="form-control"
                          name="operating-address-line-1"
                          autocomplete="off"
                          style="padding: 0px 5px; text-transform: uppercase"
                          :value="controller.company.value.businessAddressLocation?.addressLine1"
                          readonly
                        />
                        <input
                          type="text"
                          class="form-control"
                          name="operating-address-line-2"
                          autocomplete="off"
                          style="padding: 0px 5px; text-transform: uppercase"
                          :value="controller.company.value.businessAddressLocation?.addressLine2"
                          readonly
                        />
                        <input
                          type="text"
                          class="form-control"
                          name="operating-address-line-3"
                          autocomplete="off"
                          style="padding: 0px 5px; text-transform: uppercase"
                          :value="controller.company.value.businessAddressLocation?.addressLine3"
                          readonly
                        />
                        <div class="postcode-row">
                          <input
                            type="text"
                            class="form-control"
                            name="operating-address-state"
                            autocomplete="off"
                            style="padding: 0px 5px; text-transform: uppercase"
                            :value="controller.company.value.businessAddressLocation?.state?.name"
                            readonly
                          />
                          <span>
                            Postcode /
                            <i>Poskod</i>
                          </span>
                          <input
                            type="text"
                            class="form-control postcode"
                            name="operating-address-postcode"
                            placeholder="00000"
                            maxlength="5"
                            autocomplete="off"
                            style="width: 63pt; letter-spacing: 9pt"
                            :value="controller.company.value.businessAddressLocation?.postcode"
                            readonly
                          />
                        </div>
                      </div>
                    </div>
                    <div class="form-group address-group">
                      <p class="field-label">
                        Mailing Address (if different from Registered Address) /
                        <i>
                          Alamat
                          <br />
                          Surat-Menyurat (jika berlainan dengan Alamat Berdaftar)
                        </i>
                      </p>
                      <div class="field-lines">
                        <input
                          type="text"
                          class="form-control"
                          name="mailing-address-line-1"
                          placeholder="SAMPLE ADDRESS"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.cimbBankApplicationDetails.value.otherMailingAddress.addressLine1"
                          @change="controller.onOtherDetailsChanged()"
                        />
                        <input
                          type="text"
                          class="form-control"
                          name="mailing-address-line-2"
                          placeholder="SAMPLE ADDRESS"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.cimbBankApplicationDetails.value.otherMailingAddress.addressLine2"
                          @change="controller.onOtherDetailsChanged()"
                        />
                        <input
                          type="text"
                          class="form-control"
                          name="mailing-address-line-3"
                          placeholder="SAMPLE ADDRESS"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.cimbBankApplicationDetails.value.otherMailingAddress.addressLine3"
                          @change="controller.onOtherDetailsChanged()"
                        />
                        <div class="postcode-row">
                          <input
                            type="text"
                            class="form-control"
                            name="mailing-address-state"
                            placeholder="STATE"
                            :disabled="!controller.isDocumentEditable()"
                            v-model="controller.cimbBankApplicationDetails.value.mailingAddressState"
                            @change="controller.onOtherDetailsChanged()"
                          />
                          <span>
                            Postcode /
                            <i>Poskod</i>
                          </span>
                          <input
                            type="text"
                            class="form-control postcode"
                            name="mailing-address-postcode"
                            placeholder="00000"
                            maxlength="5"
                            style="width: 63pt; letter-spacing: 9pt"
                            :disabled="!controller.isDocumentEditable()"
                            v-model="controller.cimbBankApplicationDetails.value.otherMailingAddress.addressPostcode"
                            @change="controller.onOtherDetailsChanged()"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="document-footer">
              <p>Version: BUSINESSACCOUNTAPPLICATIONFORM - DEC2023</p>
              <div class="footer-bottom">
                <p>CIMB BANK BERHAD 197201001799 | CIMB ISLAMIC BANK BERHAD 200401032872</p>
                <span>[Page 1]</span>
              </div>
            </div>
          </div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="PaperOrientation.Portrait"
        :show-page-number="false"
        additional-css-class="cimb-application-form-paper"
      >
        <template
          #paperMargins
          v-if="props.isShowTag"
        >
          <div
            class="paper-tag point-left contact-person"
            v-if="controller.isContactPersonIncomplete()"
          >
            <span>Insert Information</span>
          </div>
        </template>
        <template #paperContent>
          <div class="document-page application-page-2">
            <div class="document-header">
              <div
                class="bank-logo"
                role="img"
                aria-label="CIMB"
              ></div>
              <div class="confidential">
                CONFIDENTIAL /
                <i>SULIT</i>
              </div>
            </div>
            <div class="document-section business-information-continued">
              <div class="document-section-title">
                BUSINESS INFORMATION (MANDATORY)... CONTINUED /
                <i>
                  MAKLUMAT PERNIAGAAN (WAJIB)...
                  <br />
                  SAMBUNGAN
                </i>
              </div>
              <div class="document-section-content">
                <div class="two-columns business-continuation">
                  <div>
                    <div class="form-group office-contact">
                      <p class="field-label">
                        Office Contact Number /
                        <i>Nombor Telefon Pejabat</i>
                      </p>
                      <div class="field-lines">
                        <input
                          type="text"
                          class="form-control"
                          name="office-contact"
                          placeholder="0000000000"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.cimbBankApplicationDetails.value.officeContactNo"
                          @change="controller.onOtherDetailsChanged()"
                        />
                      </div>
                    </div>
                    <div class="form-group business-website">
                      <p class="field-label">
                        Business Website (URL) (mandatory for online business) /
                        <i>Laman</i>
                        <br />
                        <i>Web Perniagaan (URL) (wajib untuk perniagaan dalam talian)</i>
                      </p>
                      <div class="field-lines">
                        <input
                          type="text"
                          class="form-control"
                          name="business-website"
                          placeholder="WWW.EXAMPLE.COM"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.cimbBankApplicationDetails.value.companyWebsite"
                          @change="controller.onOtherDetailsChanged()"
                        />
                      </div>
                    </div>
                    <div class="form-group business-email">
                      <p class="field-label">
                        Business Email Address (if available) /
                        <i>Alamat Emel Perniagaan</i>
                        <br />
                        <i>(jika ada)</i>
                      </p>
                      <div class="field-lines">
                        <input
                          type="text"
                          class="form-control"
                          name="business-email"
                          placeholder="NAME@EXAMPLE.COM"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.cimbBankApplicationDetails.value.businessEmail"
                          @change="controller.onOtherDetailsChanged()"
                        />
                      </div>
                    </div>
                    <div class="form-group foreign-countries">
                      <p class="field-label">
                        Business with Foreign Countries (please specify country names)
                        <br />
                        /
                        <i>Perniagaan dengan Negara Asing (sila nyatakan nama negara)</i>
                      </p>
                      <div class="field-lines">
                        <input
                          type="text"
                          class="form-control"
                          name="foreign-countries-1"
                          placeholder="COUNTRY"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.cimbBankApplicationDetails.value.businessWithForeignCompany"
                          @change="controller.onOtherDetailsChanged()"
                        />
                        <input
                          type="text"
                          class="form-control"
                          name="foreign-countries-2"
                          placeholder="COUNTRY"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.cimbBankApplicationDetails.value.additionalForeignCountry"
                          @change="controller.onOtherDetailsChanged()"
                        />
                      </div>
                    </div>
                    <div class="form-group nature-of-business">
                      <p class="field-label">
                        Nature of Business / Industry /
                        <i>Jenis Perniagaan / Industri</i>
                      </p>
                      <div class="field-lines">
                        <input
                          type="text"
                          class="form-control"
                          name="nature-of-business-1"
                          placeholder="BUSINESS ACTIVITY"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.cimbBankApplicationDetails.value.natureOfBusiness"
                          @change="controller.onOtherDetailsChanged()"
                        />
                        <input
                          type="text"
                          class="form-control"
                          name="nature-of-business-2"
                          placeholder="BUSINESS ACTIVITY"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.cimbBankApplicationDetails.value.additionalNatureOfBusiness"
                          @change="controller.onOtherDetailsChanged()"
                        />
                      </div>
                    </div>
                    <div class="form-group expected-transactions">
                      <p class="field-label">
                        Expected Number of Transactions Per Month /
                        <i>Jangkaan Nombor</i>
                        <br />
                        <i>Transaksi Sebulan</i>
                      </p>
                      <div class="field-lines">
                        <input
                          type="text"
                          class="form-control"
                          name="expected-transactions"
                          placeholder="000"
                          :disabled="!controller.isDocumentEditable()"
                          :value="
                            controller.cimbBankApplicationDetails.value.expectedNumberOfTransactionsPerMonth ?? ''
                          "
                          @change="
                            controller.onNumberChanged(
                              'expectedNumberOfTransactionsPerMonth',
                              ($event.target as HTMLInputElement).value
                            )
                          "
                        />
                      </div>
                    </div>
                    <div class="form-group expected-amount">
                      <p class="field-label">
                        Expected Transaction Amount Per Month /
                        <i>Jangkaan Jumlah</i>
                        <br />
                        <i>Transaksi Sebulan</i>
                      </p>
                      <div class="field-lines">
                        <input
                          type="text"
                          class="form-control"
                          name="expected-amount"
                          placeholder="0.00"
                          :disabled="!controller.isDocumentEditable()"
                          :value="
                            controller.cimbBankApplicationDetails.value.expectedAmountOfTransactionsPerMonth ?? ''
                          "
                          @change="
                            controller.onNumberChanged(
                              'expectedAmountOfTransactionsPerMonth',
                              ($event.target as HTMLInputElement).value
                            )
                          "
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div class="form-group paid-up-capital">
                      <p class="field-label">
                        Paid Up Capital
                        <sup>1</sup>
                        /
                        <i>Modal Berbayar</i>
                        <i><sup>1</sup></i>
                      </p>
                      <div class="field-lines">
                        <input
                          type="text"
                          class="form-control"
                          name="paid-up-capital"
                          placeholder="0.00"
                          :disabled="!controller.isDocumentEditable()"
                          :value="controller.cimbBankApplicationDetails.value.paidUpCapital ?? ''"
                          @change="
                            controller.onNumberChanged('paidUpCapital', ($event.target as HTMLInputElement).value)
                          "
                        />
                      </div>
                    </div>
                    <div class="form-group annual-sales">
                      <p class="field-label">
                        Annual Sales /
                        <i>Jumlah Perolehan Urusniaga Tahunan</i>
                      </p>
                      <div class="field-lines">
                        <input
                          type="text"
                          class="form-control"
                          name="annual-sales"
                          placeholder="0.00"
                          :disabled="!controller.isDocumentEditable()"
                          :value="controller.cimbBankApplicationDetails.value.annualSales ?? ''"
                          @change="controller.onNumberChanged('annualSales', ($event.target as HTMLInputElement).value)"
                        />
                      </div>
                    </div>
                    <div class="form-group employee-count">
                      <p class="field-label">
                        Number of Employees /
                        <i>Bilangan Pekerja</i>
                      </p>
                      <div class="field-lines">
                        <input
                          type="text"
                          class="form-control"
                          name="employee-count"
                          placeholder="0"
                          :disabled="!controller.isDocumentEditable()"
                          :value="controller.cimbBankApplicationDetails.value.employeeCount ?? ''"
                          @change="
                            controller.onNumberChanged('employeeCount', ($event.target as HTMLInputElement).value)
                          "
                        />
                      </div>
                    </div>
                    <div class="government-owned">
                      <p>
                        Government Owned/State Government Owned
                        <sup>2</sup>
                        /
                        <i>Milik Kerajaan</i>
                        <br />
                        <i>/ Milik Kerajaan Negeri</i>
                        <i><sup>2</sup></i>
                      </p>
                      <div class="yes-no">
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="government-owned-yes"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isBooleanSelected('isGovernmentOwned', true)"
                            @change="controller.onBooleanClicked('isGovernmentOwned', true)"
                          />
                          <span>
                            Yes /
                            <i>Ya</i>
                          </span>
                        </label>
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="government-owned-no"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isBooleanSelected('isGovernmentOwned', false)"
                            @change="controller.onBooleanClicked('isGovernmentOwned', false)"
                          />
                          <span>
                            No /
                            <i>Tidak</i>
                          </span>
                        </label>
                      </div>
                    </div>
                    <div class="group-details">
                      <p>
                        If the company is a subsidiary of a Public Listed company listed
                        <br />
                        on the Main Board / Large Firms / MNCs / GLCs / MKDs / State
                        <br />
                        owned enterprises
                        <sup>3</sup>
                        , please indicate: /
                        <i>Jika syarikat ini adalah</i>
                        <br />
                        <i>subsidiari Syarikat Tersenarai Awam yang tersenarai di Papan</i>
                        <br />
                        <i>Utama / Firma Besar / MNC / GLC / MKD / Perusahaan milik</i>
                        <br />
                        <i>negeri</i>
                        <i><sup>3</sup></i>
                        <i>, sila nyatakan:</i>
                      </p>
                      <div class="form-group">
                        <p class="field-label">
                          Group Name /
                          <i>Nama Kumpulan</i>
                        </p>
                        <div class="field-lines">
                          <input
                            type="text"
                            class="form-control"
                            name="group-name-1"
                            placeholder="GROUP NAME"
                            :disabled="!controller.isDocumentEditable()"
                            v-model="controller.cimbBankApplicationDetails.value.groupName"
                            @change="controller.onOtherDetailsChanged()"
                          />
                          <input
                            type="text"
                            class="form-control"
                            name="group-name-2"
                            placeholder="GROUP NAME"
                            :disabled="!controller.isDocumentEditable()"
                            v-model="controller.cimbBankApplicationDetails.value.groupNameSecondLine"
                            @change="controller.onOtherDetailsChanged()"
                          />
                        </div>
                      </div>
                      <div class="form-group">
                        <p class="field-label">
                          Total Annual Sales (Group Level) /
                          <br />
                          <i>Jumlah Jualan Tahunan (Peringkat Kumpulan)</i>
                        </p>
                        <div class="field-lines">
                          <input
                            type="text"
                            class="form-control"
                            name="group-sales-1"
                            placeholder="0.00"
                            :disabled="!controller.isDocumentEditable()"
                            :value="controller.cimbBankApplicationDetails.value.totalGroupAnualSales ?? ''"
                            @change="
                              controller.onNumberChanged(
                                'totalGroupAnualSales',
                                ($event.target as HTMLInputElement).value
                              )
                            "
                          />
                          <input
                            type="text"
                            class="form-control"
                            name="group-sales-2"
                            placeholder="0.00"
                            :disabled="!controller.isDocumentEditable()"
                            v-model="controller.cimbBankApplicationDetails.value.groupSalesSecondLine"
                            @change="controller.onOtherDetailsChanged()"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="business-notes">
              <p>
                Note /
                <i>Nota</i>
                :
                <br />
                <sup>1</sup>
                Paid up capital refers to the actual amount of funds / capital injected into a company by the
                shareholders. /
                <i>Modal berbayar merujuk kepada jumlah</i>
                <br />
                <i>dana sebenar / Suntikan modal ke dalam syarikat oleh pemegang saham.</i>
                <br />
                <sup>2</sup>
                Government Owned / State Government Owned means Legal entity that is government owned either partially
                or wholly. /
                <i>Milik Kerajaan / Milik Kerajaan</i>
                <br />
                <i>Negeri merujuk membawa maksud entiti Sah yang dimiliki kerajaan secara penuh atau sebahagian.</i>
                <br />
                <sup>3</sup>
                Subsidiary of a Public Listed company listed on the Main Board means Legal entity that is owned by a
                public listed company. /
                <i>Subsidiari sebuah</i>
                <br />
                <i>
                  Syarikat Tersenarai Awam yang tersenarai di Papan Utama membawa maksud enitit Sah yang dimiliki oleh
                  sebuah Syarikat Tersenarai Awam.
                </i>
                <br />
                - Main Board refers to company which is listed in the Main Board of Bursa Malaysia or any other main
                Bourse in other countries. /
                <i>Papan Utama merujuk</i>
                <br />
                <i>
                  kepada syarikat yang tersenarai di Papan Utama Bursa Malaysia atau mana-mana Bursa utama di negara
                  lain.
                </i>
                <br />
                - Large Firms refers to companies with sales turnover more than RM50 million and more than 200 full-time
                employees. /
                <i>Firma Besar merujuk kepada</i>
                <br />
                <i>
                  syarikat-syarikat dengan jumlah jualan melebihi RM50 juta dan lebih 200 orang pekerja sepenuh masa.
                </i>
                <br />
                - Multi National Companies (“MNCs”) refer to corporations that own or have business activities in
                different countries. /
                <i>Syarikat Multinasional (“MNC”)</i>
                <br />
                <i>
                  merujuk kepada syarikat besar yang memiliki atau mempunyai aktiviti perniagaan di negara-negara
                  berlainan.
                </i>
                <br />
                - Government Linked Companies (“GLCs”) refer to companies in which the Malaysian Government has a direct
                controlling stake. /
                <i>Syarikat Berkaitan</i>
                <br />
                <i>
                  Kerajaan (“GLC”) merujuk kepada syarikat dimana Kerajaan Malaysia mempunyai kawalan secara langsung.
                </i>
                <br />
                - Menteri Kewangan Diperbadankan (“MKDs”) refers to a corporate body established under the Minister of
                Finance (Incorporation) Act 1957. /
                <i>Menteri</i>
                <br />
                <i>
                  Kewangan Diperbadankan (“MKD”) merujuk kepada badan korporat yang ditubuhkan dibawah Akta Menteri
                  Kewangan (Diperbadankan) 1957.
                </i>
                <br />
                - State-owned enterprises refer to legal entities that are partially or wholly owned by the Government.
                /
                <i>Perusahaan milik negeri merujuk kepada entiti</i>
                <br />
                <i>sah yang dimiliki sepenuhnya atau sebahagian oleh Kerajaan.</i>
              </p>
            </div>
            <div class="document-section contact-person">
              <div class="document-section-title">
                CONTACT PERSON (MANDATORY) /
                <i>ORANG UNTUK DIHUBUNGI (WAJIB)</i>
              </div>
              <div class="document-section-content">
                <div class="two-columns">
                  <div>
                    <div class="form-group">
                      <p class="field-label">
                        Contact Person’s Name /
                        <i>Nama Orang Untuk Dihubungi</i>
                      </p>
                      <div class="field-lines">
                        <input
                          type="text"
                          class="form-control"
                          name="contact-name-1"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.cimbBankApplicationDetails.value.contactPersonName"
                          @change="controller.onOtherDetailsChanged()"
                        />
                        <input
                          type="text"
                          class="form-control"
                          name="contact-name-2"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.cimbBankApplicationDetails.value.contactPersonNameSecondLine"
                          @change="controller.onOtherDetailsChanged()"
                        />
                      </div>
                    </div>
                    <div class="form-group">
                      <p class="field-label">
                        Contact Person’s Mobile Number /
                        <br />
                        <i>Nombor Telefon Bimbit Orang Untuk Dihubungi</i>
                      </p>
                      <div class="field-lines">
                        <input
                          type="text"
                          class="form-control"
                          name="contact-mobile"
                          placeholder="0000000000"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.cimbBankApplicationDetails.value.contactPersonNumber"
                          @change="controller.onOtherDetailsChanged()"
                          style="
                            letter-spacing: 8.6pt;
                            padding-left: 5pt;
                            background-size: calc((100% - 5.2pt) / 19) 100%;
                          "
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div class="form-group">
                      <p class="field-label">
                        Contact Person’s Designation /
                        <i>Jawatan Orang Untuk Dihubungi</i>
                      </p>
                      <div class="field-lines">
                        <input
                          type="text"
                          class="form-control"
                          name="contact-designation-1"
                          placeholder="DESIGNATION"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.cimbBankApplicationDetails.value.contactPersonDesignation"
                          @change="controller.onOtherDetailsChanged()"
                        />
                        <input
                          type="text"
                          class="form-control"
                          name="contact-designation-2"
                          placeholder="DESIGNATION"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.cimbBankApplicationDetails.value.contactPersonDesignationSecondLine"
                          @change="controller.onOtherDetailsChanged()"
                        />
                      </div>
                    </div>
                    <div class="form-group">
                      <p class="field-label">
                        Contact Person’s Email Address /
                        <br />
                        <i>Alamat Emel Orang Untuk Dihubungi</i>
                      </p>
                      <div class="field-lines">
                        <input
                          type="text"
                          class="form-control"
                          name="contact-email"
                          placeholder="NAME@EXAMPLE.COM"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.cimbBankApplicationDetails.value.contactPersonEmail"
                          @change="controller.onOtherDetailsChanged()"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="document-footer">
              <p>Version: BUSINESSACCOUNTAPPLICATIONFORM - DEC2023</p>
              <div class="footer-bottom">
                <p>CIMB BANK BERHAD 197201001799 | CIMB ISLAMIC BANK BERHAD 200401032872</p>
                <span>[Page 2]</span>
              </div>
            </div>
          </div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="PaperOrientation.Portrait"
        :show-page-number="false"
        additional-css-class="cimb-application-form-paper"
      >
        <template
          #paperMargins
          v-if="props.isShowTag"
        >
          <div
            class="paper-tag point-left business-owner"
            v-if="controller.isBusinessOwnersIncomplete()"
          >
            <span>Insert Information</span>
          </div>
        </template>
        <template #paperContent>
          <div class="document-page application-page-3">
            <div class="document-header">
              <div
                class="bank-logo"
                role="img"
                aria-label="CIMB"
              ></div>
              <div class="confidential">
                CONFIDENTIAL /
                <i>SULIT</i>
              </div>
            </div>
            <div class="document-section purpose-of-account">
              <div class="document-section-title">
                PURPOSE OF ACCOUNT (MANDATORY) /
                <i>TUJUAN PEMBUKAAN AKAUN (WAJIB)</i>
              </div>
              <div class="document-section-content">
                <p>
                  Please tick ✓ one or more of the following /
                  <i>Sila tanda satu atau lebih ✓ pada berikut</i>
                </p>
                <div class="choice-box">
                  <div class="choice-row">
                    <label class="form-check">
                      <input
                        type="checkbox"
                        name="purpose-0a"
                        :disabled="!controller.isDocumentEditable()"
                        :checked="controller.isPurposeOfAccountSelected('purpose-0a')"
                        @change="controller.onPurposeOfAccountClicked('purpose-0a')"
                      />
                      <span>
                        Bills / Utilities Payment /
                        <i>Bil-bil / Pembayaran Utiliti</i>
                      </span>
                    </label>
                    <label class="form-check">
                      <input
                        type="checkbox"
                        name="purpose-0b"
                        :disabled="!controller.isDocumentEditable()"
                        :checked="controller.isPurposeOfAccountSelected('purpose-0b')"
                        @change="controller.onPurposeOfAccountClicked('purpose-0b')"
                      />
                      <span>
                        Payment of Salaries / Allowances /
                        <i>Pembayaran Gaji / Elaun</i>
                      </span>
                    </label>
                  </div>
                  <div class="choice-row">
                    <label class="form-check">
                      <input
                        type="checkbox"
                        name="purpose-1a"
                        :disabled="!controller.isDocumentEditable()"
                        :checked="controller.isPurposeOfAccountSelected('purpose-1a')"
                        @change="controller.onPurposeOfAccountClicked('purpose-1a')"
                      />
                      <span>
                        Investment Proceeds /
                        <i>Pendapatan Pelaburan</i>
                      </span>
                    </label>
                    <label class="form-check">
                      <input
                        type="checkbox"
                        name="purpose-1b"
                        :disabled="!controller.isDocumentEditable()"
                        :checked="controller.isPurposeOfAccountSelected('purpose-1b')"
                        @change="controller.onPurposeOfAccountClicked('purpose-1b')"
                      />
                      <span>
                        Rental Payments /
                        <i>Pembayaran Sewa</i>
                      </span>
                    </label>
                  </div>
                  <div class="choice-row">
                    <label class="form-check">
                      <input
                        type="checkbox"
                        name="purpose-2a"
                        :disabled="!controller.isDocumentEditable()"
                        :checked="controller.isPurposeOfAccountSelected('purpose-2a')"
                        @change="controller.onPurposeOfAccountClicked('purpose-2a')"
                      />
                      <span>
                        Business Proceeds /
                        <i>Pendapatan Perniagaan</i>
                      </span>
                    </label>
                    <label class="form-check">
                      <input
                        type="checkbox"
                        name="purpose-2b"
                        :disabled="!controller.isDocumentEditable()"
                        :checked="controller.isPurposeOfAccountSelected('purpose-2b')"
                        @change="controller.onPurposeOfAccountClicked('purpose-2b')"
                      />
                      <span>
                        Rental Proceeds /
                        <i>Pendapatan Sewa</i>
                      </span>
                    </label>
                  </div>
                  <label class="form-check">
                    <input
                      type="checkbox"
                      name="purpose-remittances"
                      :disabled="!controller.isDocumentEditable()"
                      :checked="controller.isPurposeOfAccountSelected('purpose-remittances')"
                      @change="controller.onPurposeOfAccountClicked('purpose-remittances')"
                    />
                    <span>
                      Remittances / Payment Transfers /
                      <i>Penghantaran ke luar Negara / Pembayaran Pindahan</i>
                    </span>
                  </label>
                  <div
                    class="choice-row other-choice"
                    style="margin-bottom: 0px"
                  >
                    <label class="form-check">
                      <input
                        type="checkbox"
                        name="purpose-other"
                        :disabled="!controller.isDocumentEditable()"
                        :checked="controller.isPurposeOfAccountSelected('purpose-other')"
                        @change="controller.onPurposeOfAccountClicked('purpose-other')"
                      />
                      <span>
                        Others, please specify /
                        <i>Lain-Lain, sila nyatakan</i>
                      </span>
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      name="purpose-other-detail"
                      placeholder="ENTER VALUE"
                      :disabled="!controller.isDocumentEditable()"
                      v-model="controller.cimbBankApplicationDetails.value.purposeOfAccountOthers"
                      @change="controller.onOtherDetailsChanged()"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="document-section source-of-funds">
              <div class="document-section-title">
                SOURCE OF FUNDS (MANDATORY) /
                <i>SUMBER DANA (WAJIB)</i>
              </div>
              <div class="document-section-content">
                <p>
                  Initial deposit and subsequent inflow of funds into the account (please tick ✓ one or more of the
                  following) /
                  <i>Deposit pendahuluan dan</i>
                  <br />
                  <i>kemasukan dana seterusnya ke dalam akaun (sila tanda satu atau lebih</i>
                  ✓
                  <i>pada berikut)</i>
                </p>
                <div class="choice-box">
                  <div class="choice-row">
                    <label class="form-check">
                      <input
                        type="checkbox"
                        name="fund-0a"
                        :disabled="!controller.isDocumentEditable()"
                        :checked="controller.isSourceOfFundsSelected('fund-0a')"
                        @change="controller.onSourceOfFundsClicked('fund-0a')"
                      />
                      <span>
                        Rental Proceeds /
                        <i>Pendapatan Sewa</i>
                      </span>
                    </label>
                    <label class="form-check">
                      <input
                        type="checkbox"
                        name="fund-0b"
                        :disabled="!controller.isDocumentEditable()"
                        :checked="controller.isSourceOfFundsSelected('fund-0b')"
                        @change="controller.onSourceOfFundsClicked('fund-0b')"
                      />
                      <span>
                        Local Investment Proceeds /
                        <i>Pendapatan Pelaburan Tempatan</i>
                      </span>
                    </label>
                  </div>
                  <div class="choice-row">
                    <label class="form-check">
                      <input
                        type="checkbox"
                        name="fund-1a"
                        :disabled="!controller.isDocumentEditable()"
                        :checked="controller.isSourceOfFundsSelected('fund-1a')"
                        @change="controller.onSourceOfFundsClicked('fund-1a')"
                      />
                      <span>
                        Foreign Investment Proceeds /
                        <i>Pendapatan Pelaburan Asing</i>
                      </span>
                    </label>
                    <label class="form-check">
                      <input
                        type="checkbox"
                        name="fund-1b"
                        :disabled="!controller.isDocumentEditable()"
                        :checked="controller.isSourceOfFundsSelected('fund-1b')"
                        @change="controller.onSourceOfFundsClicked('fund-1b')"
                      />
                      <span>
                        Inheritance /
                        <i>Harta Pusaka</i>
                      </span>
                    </label>
                  </div>
                  <div class="choice-row">
                    <label class="form-check">
                      <input
                        type="checkbox"
                        name="fund-2a"
                        :disabled="!controller.isDocumentEditable()"
                        :checked="controller.isSourceOfFundsSelected('fund-2a')"
                        @change="controller.onSourceOfFundsClicked('fund-2a')"
                      />
                      <span>
                        Capital Gain from Sales of Assets /
                        <br />
                        <i>Perolehan Modal daripada Penjualan Aset</i>
                      </span>
                    </label>
                    <label class="form-check">
                      <input
                        type="checkbox"
                        name="fund-2b"
                        :disabled="!controller.isDocumentEditable()"
                        :checked="controller.isSourceOfFundsSelected('fund-2b')"
                        @change="controller.onSourceOfFundsClicked('fund-2b')"
                      />
                      <span>
                        Business Proceeds /
                        <i>Pendapatan Perniagaan</i>
                      </span>
                    </label>
                  </div>
                  <div class="choice-row">
                    <label class="form-check">
                      <input
                        type="checkbox"
                        name="fund-3a"
                        :disabled="!controller.isDocumentEditable()"
                        :checked="controller.isSourceOfFundsSelected('fund-3a')"
                        @change="controller.onSourceOfFundsClicked('fund-3a')"
                      />
                      <span>
                        Retirement Funds /
                        <i>Dana Persaraan</i>
                      </span>
                    </label>
                    <label class="form-check">
                      <input
                        type="checkbox"
                        name="fund-3b"
                        :disabled="!controller.isDocumentEditable()"
                        :checked="controller.isSourceOfFundsSelected('fund-3b')"
                        @change="controller.onSourceOfFundsClicked('fund-3b')"
                      />
                      <span>
                        Gift / Donations /
                        <i>Hadiah / Derma</i>
                      </span>
                    </label>
                  </div>
                  <div class="choice-row">
                    <label class="form-check">
                      <input
                        type="checkbox"
                        name="fund-4a"
                        :disabled="!controller.isDocumentEditable()"
                        :checked="controller.isSourceOfFundsSelected('fund-4a')"
                        @change="controller.onSourceOfFundsClicked('fund-4a')"
                      />
                      <span>
                        Political Funds /
                        <i>Dana Politik</i>
                      </span>
                    </label>
                    <label class="form-check">
                      <input
                        type="checkbox"
                        name="fund-4b"
                        :disabled="!controller.isDocumentEditable()"
                        :checked="controller.isSourceOfFundsSelected('fund-4b')"
                        @change="controller.onSourceOfFundsClicked('fund-4b')"
                      />
                      <span>
                        Membership Fees Collected /
                        <i>Kutipan Yuran Keahlian</i>
                      </span>
                    </label>
                  </div>
                  <div class="choice-row">
                    <label class="form-check">
                      <input
                        type="checkbox"
                        name="fund-5a"
                        :disabled="!controller.isDocumentEditable()"
                        :checked="controller.isSourceOfFundsSelected('fund-5a')"
                        @change="controller.onSourceOfFundsClicked('fund-5a')"
                      />
                      <span>
                        Charity Collections received from Donors /
                        <br />
                        <i>Kutipan Derma diterima daripada Penderma</i>
                      </span>
                    </label>
                    <label class="form-check">
                      <input
                        type="checkbox"
                        name="fund-5b"
                        :disabled="!controller.isDocumentEditable()"
                        :checked="controller.isSourceOfFundsSelected('fund-5b')"
                        @change="controller.onSourceOfFundsClicked('fund-5b')"
                      />
                      <span>
                        Proceeds from Credit Facility /
                        <br />
                        <i>Pendapatan daripada Kemudahan Kredit</i>
                      </span>
                    </label>
                  </div>
                  <div class="choice-row">
                    <label class="form-check">
                      <input
                        type="checkbox"
                        name="fund-6a"
                        :disabled="!controller.isDocumentEditable()"
                        :checked="controller.isSourceOfFundsSelected('fund-6a')"
                        @change="controller.onSourceOfFundsClicked('fund-6a')"
                      />
                      <span>
                        Family / Internal Funding from Relatives /
                        <br />
                        <i>Pembiayaan Sendirian oleh Saudara Mara / Keluarga</i>
                      </span>
                    </label>
                    <label class="form-check">
                      <input
                        type="checkbox"
                        name="fund-6b"
                        :disabled="!controller.isDocumentEditable()"
                        :checked="controller.isSourceOfFundsSelected('fund-6b')"
                        @change="controller.onSourceOfFundsClicked('fund-6b')"
                      />
                      <span>
                        Others, please specify /
                        <i>Lain-Lain, sila nyatakan</i>
                      </span>
                    </label>
                  </div>
                  <input
                    type="text"
                    class="form-control underlined funds-other"
                    name="source-of-funds-other"
                    placeholder=""
                    :disabled="!controller.isDocumentEditable()"
                    v-model="controller.cimbBankApplicationDetails.value.sourceOfFundOthers"
                    @change="controller.onOtherDetailsChanged()"
                  />
                </div>
              </div>
            </div>
            <div class="document-section business-owners">
              <div class="document-section-title">
                BUSINESS OWNER(S) INFORMATION /
                <i>MAKLUMAT PEMILIK (PEMILIK-PEMILIK)</i>
              </div>
              <div class="document-section-content">
                <p>
                  Please provide details of Directors / Ultimate Beneficial Owner* (individual) with more than 25%
                  shareholding of the business. /
                  <br />
                  <i>
                    Sila kemukakan butir-butir pengarah-pengarah / Pemegang Saham Utama* (individu) yang mempunyai lebih
                    25% pegangan saham
                  </i>
                  <br />
                  <i>dalam perniagaan.</i>
                </p>
                <table class="form-table owners-table">
                  <colgroup>
                    <col class="column-1" />
                    <col class="column-2" />
                    <col class="column-3" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>
                        Business Owner(s) / Partners Full Name (as per NRIC / Passport) /
                        <br />
                        <i>Nama Penuh (seperti dalam K/P Baharu / Pasport) Pemilik Perniagaan / Rakan Kongsi</i>
                      </th>
                      <th>
                        Mobile Number /
                        <i>Nombor Telefon Bimbit</i>
                        <br />
                        <br />
                        Email Address /
                        <i>Alamat Emel</i>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="i in 6">
                      <td>{{ i }}.</td>
                      <td>
                        <input
                          type="text"
                          class="form-control"
                          :name="`owner-${i - 1}-name`"
                          placeholder="SAMPLE NAME"
                          :list="`business-owner-name-${i - 1}`"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.businessOwnerAt(i - 1).name"
                          @change="controller.onBusinessOwnerNameChanged(i - 1)"
                          style="text-transform: uppercase; padding: 0px 5px; width: calc(100% - 10px)"
                        />
                        <datalist :id="`business-owner-name-${i - 1}`">
                          <option v-for="(name, j) in controller.directorDataListForBusinessOwner(i - 1)">
                            {{ name }}
                          </option>
                        </datalist>
                      </td>
                      <td>
                        <div class="stacked-inputs">
                          <input
                            type="text"
                            class="form-control"
                            :name="`owner-${i - 1}-mobile`"
                            placeholder="0000000000"
                            :disabled="!controller.isDocumentEditable()"
                            v-model="controller.businessOwnerAt(i - 1).phone"
                            @change="controller.onBusinessOwnerChanged()"
                            style="
                              padding-left: 5px;
                              letter-spacing: 8.3pt;
                              background-size: calc((100% - 5pt) / 14) 100%;
                            "
                          />
                          <input
                            type="text"
                            class="form-control"
                            :name="`owner-${i - 1}-email`"
                            placeholder="NAME@EXAMPLE.COM"
                            :disabled="!controller.isDocumentEditable()"
                            v-model="controller.businessOwnerAt(i - 1).email"
                            @change="controller.onBusinessOwnerChanged()"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p class="owner-note">
                  *Note: Ultimate Beneficial Owner refers to the natural person who ultimately owns or controls a legal
                  entity. / *
                  <i>Nota: Pemegang Saham Utama merujuk</i>
                  <br />
                  <i>kepada orang atau entiti sah yang memiliki saham mutlak.</i>
                </p>
              </div>
            </div>
            <div class="document-footer">
              <p>Version: BUSINESSACCOUNTAPPLICATIONFORM - DEC2023</p>
              <div class="footer-bottom">
                <p>CIMB BANK BERHAD 197201001799 | CIMB ISLAMIC BANK BERHAD 200401032872</p>
                <span>[Page 3]</span>
              </div>
            </div>
          </div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="PaperOrientation.Portrait"
        :show-page-number="false"
        additional-css-class="cimb-application-form-paper"
      >
        <template #paperContent>
          <div class="document-page application-page-4">
            <div class="document-header">
              <div
                class="bank-logo"
                role="img"
                aria-label="CIMB"
              ></div>
              <div class="confidential">
                CONFIDENTIAL /
                <i>SULIT</i>
              </div>
            </div>
            <div class="document-section online-banking">
              <div class="document-section-title">
                CIMB ONLINE BANKING APPLICATION (BIZCHANNEL@CIMB) /
                <i>
                  PERMOHONAN UNTUK PERBANKAN
                  <br />
                  DALAM TALIAN CIMB ONLINE (BIZCHANNEL@CIMB)
                </i>
              </div>
              <div class="document-section-content">
                <p class="registration-instructions">
                  <b>Registration: Please tick</b>
                  ✓
                  <b>ONE only (Option A, B, C or D) /</b>
                  <i><b>Pendaftaran: Sila tanda SATU</b></i>
                  ✓
                  <i><b>sahaja (Pilihan A, B, C atau D)</b></i>
                </p>
                <p class="existing-customer">
                  <b>Existing CIMB Online Banking Customer (Bizchannel@CIMB) : Option A /</b>
                  <br />
                  <i><b>Pelanggan Perbankan CIMB Online (Bizchannel@CIMB) Sedia Ada: Pilihan A</b></i>
                </p>
                <table class="form-table option-table option-a">
                  <colgroup>
                    <col class="column-1" />
                    <col class="column-2" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>
                        OPTION /
                        <br />
                        <i>PILIHAN</i>
                      </th>
                      <th>
                        APPLICATION DETAILS &amp; DESCRIPTION /
                        <br />
                        <i>PENERANGAN DAN BUTIRAN PERMOHONAN</i>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        A
                        <br />
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="bizchannel-option-a"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isApplicationChoiceSelected('A')"
                            @change="controller.onApplicationChoiceClicked('A')"
                          />
                          <span></span>
                        </label>
                      </td>
                      <td>
                        <p>
                          I / We would like to tag the newly opened Business Account to our Existing BizChannel Profile
                          <sup>1</sup>
                          . /
                          <i>Saya / Kami ingin</i>
                          <br />
                          <i>teg Akaun Perniagaan yang baharu dibuka ke Profil BizChannel sedia ada kami</i>
                          <i><sup>1</sup></i>
                          <i>.</i>
                        </p>
                        <p class="small-note">
                          Note:
                          <sup>1</sup>
                          Applicable to company with the same Business Registration Number only. /
                          <i>Nota:</i>
                          <i><sup>1</sup></i>
                          <i>Hanya untuk syarikat-syarikat yang</i>
                          <br />
                          <i>mempunyai Nombor Pendaftaran Perniagaan yang sama.</i>
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p class="new-customer">
                  <b>New to CIMB Online Banking(Bizchannel@CIMB) : Option B, C or D /</b>
                  <br />
                  <i><b>Pengguna Perbankan CIMB Online (BizChannel@CIMB) baharu: Pilihan B, C atau D</b></i>
                </p>
                <table class="form-table package-table">
                  <colgroup>
                    <col class="package-label" />
                    <col class="package-bizlite" />
                    <col class="package-standard" />
                    <col class="package-custom" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>
                        Service Package Info /
                        <br />
                        <i>Maklumat Pakej Perkhimatan</i>
                      </th>
                      <th>BIZLITE</th>
                      <th colspan="2">BIZCHANNEL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        Subscription Fee* /
                        <br />
                        <i>Yuran Langganan*</i>
                      </td>
                      <td>
                        No Monthly Fee (Waived) /
                        <br />
                        <i>Tiada Yuran Bulanan (Dikecualikan)</i>
                      </td>
                      <td colspan="2">
                        RM20.00 per user per month /
                        <br />
                        <i>RM20 setiap pengguna setiap bulan</i>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Number of User(s) /
                        <br />
                        <i>Bilangan Pengguna</i>
                      </td>
                      <td>
                        Maximum 5 users /
                        <br />
                        <i>Maksimum 5 pengguna</i>
                      </td>
                      <td colspan="2">
                        Unlimited /
                        <i>Tiada had</i>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Preferred Transaction
                        <br />
                        Limit /
                        <i>
                          Had Transaksi
                          <br />
                          yang dikehendaki
                        </i>
                      </td>
                      <td>
                        Up to RM100,000.00 per day /
                        <br />
                        <i>Sehingga RM100,000 setiap hari</i>
                      </td>
                      <td colspan="2">
                        Unlimited /
                        <i>Tiada had</i>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Bills / Statutory Payments
                        <br />
                        / Remittances /
                        <i>
                          Bil-bil /
                          <br />
                          Pembayaran Berkanun /
                          <br />
                          Penghantaran Wang
                        </i>
                      </td>
                      <td colspan="3">
                        Yes /
                        <i>Ya</i>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Fund Transfers / Payroll
                        <br />
                        / Salary Payments /
                        <br />
                        <i>
                          Pemindahan Dana /
                          <br />
                          Penggajian / Pembayaran Gaji
                        </i>
                      </td>
                      <td>
                        Single Fund Transfer / Payments
                        <br />
                        /
                        <i>
                          Pembayaran / Pemindahan
                          <br />
                          daripada Dana Tunggal
                        </i>
                      </td>
                      <td colspan="2">
                        Single + Bulk Transfers / Payments /
                        <br />
                        <i>Pembayaran / Pemindahan Pukal + Tunggal</i>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Transaction Authorisation /
                        <br />
                        <i>Pemberian Kuasa Transaksi</i>
                      </td>
                      <td>
                        Can be authorized by the same
                        <br />
                        person (maker/checker) /
                        <i>Boleh</i>
                        <br />
                        <i>diberi kuasa oleh orang yang sama</i>
                        <br />
                        <i>(pembuat / pemeriksa)</i>
                        <br />
                        OR /
                        <i>ATAU</i>
                        <br />
                        Any one (1) to approve /
                        <br />
                        <i>Mana-mana satu (1) untuk</i>
                        <br />
                        <i>meluluskan</i>
                      </td>
                      <td>
                        Any one (1) to approve /
                        <br />
                        <i>Mana-mana satu (1) untuk</i>
                        <br />
                        <i>meluluskan</i>
                      </td>
                      <td>
                        More than one (1) to approve
                        <br />
                        /
                        <i>Lebih daripada satu (1) untuk</i>
                        <br />
                        <i>meluluskan</i>
                        <br />
                        OR /
                        <i>ATAU</i>
                        <br />
                        Customised /
                        <i>Disesuaikan</i>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        To Register /
                        <br />
                        <i>Untuk Mendaftar</i>
                      </td>
                      <td>
                        Tick Option B below /
                        <br />
                        <i>Tanda Pilihan B di bawah</i>
                      </td>
                      <td>
                        Tick Option C below /
                        <br />
                        <i>Tanda Pilihan C di bawah</i>
                      </td>
                      <td>
                        Tick Option D below /
                        <br />
                        <i>Tanda Pilihan D di bawah</i>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="package-information">
                  <p>
                    For more details on the various packages, please visit www.cimb-bizchannel.com.my /
                    <br />
                    <i>Untuk maklumat lanjut mengenai pakej-pakej berlainan, sila layari www.cimb-bizchannel.com.my</i>
                  </p>
                  <div
                    class="package-qr"
                    role="img"
                    aria-label="Original package information QR code"
                  ></div>
                </div>
                <p class="package-terms">
                  *Terms and Conditions apply. /
                  <i>Tertakluk kepada Terma dan Syarat.</i>
                </p>
                <table class="form-table option-table option-b">
                  <colgroup>
                    <col class="column-1" />
                    <col class="column-2" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>
                        OPTION /
                        <br />
                        <i>PILIHAN</i>
                      </th>
                      <th>
                        APPLICATION DETAILS &amp; DESCRIPTION /
                        <br />
                        <i>PENERANGAN DAN BUTIRAN PERMOHONAN</i>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        B
                        <br />
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="bizchannel-option-b"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isApplicationChoiceSelected('B')"
                            @change="controller.onApplicationChoiceClicked('B')"
                          />
                          <span></span>
                        </label>
                      </td>
                      <td>
                        <p>
                          I / We would like to apply for
                          <b>BIZLITE</b>
                          . /
                          <i>Saya / Kami ingin memohon untuk</i>
                          <i><b>BIZLITE</b></i>
                          <i>.</i>
                        </p>
                        <div class="bizlite-register">
                          <p>
                            Please obtain your newly opened Business Account number and register online
                            <br />
                            via www.cimb-bizchannel.com.my /
                            <i>Sila dapatkan nombor Akaun Perniagaan yang</i>
                            <br />
                            <i>baharu dibuka dan daftar dalam talian melalui www.cimb-bizchannel.com.my</i>
                          </p>
                          <p>
                            OR /
                            <br />
                            <i>ATAU</i>
                          </p>
                          <p>
                            Scan this /
                            <br />
                            <i>Imbas disini</i>
                          </p>
                          <div
                            class="bizlite-qr"
                            role="img"
                            aria-label="Original BizLite registration QR code"
                          ></div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="document-footer">
              <p>Version: BUSINESSACCOUNTAPPLICATIONFORM - DEC2023</p>
              <div class="footer-bottom">
                <p>CIMB BANK BERHAD 197201001799 | CIMB ISLAMIC BANK BERHAD 200401032872</p>
                <span>[Page 4]</span>
              </div>
            </div>
          </div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="PaperOrientation.Portrait"
        :show-page-number="false"
        additional-css-class="cimb-application-form-paper"
      >
        <template #paperContent>
          <div class="document-page application-page-5">
            <div class="document-header">
              <div
                class="bank-logo"
                role="img"
                aria-label="CIMB"
              ></div>
              <div class="confidential">
                CONFIDENTIAL /
                <i>SULIT</i>
              </div>
            </div>
            <div class="document-section online-banking-continued">
              <div class="document-section-title">
                CIMB ONLINE BANKING APPLICATION (BIZCHANNEL@CIMB)... CONTINUED /
                <i>
                  PERMOHONAN UNTUK
                  <br />
                  PERBANKAN DALAM TALIAN CIMB ONLINE (BIZCHANNEL@CIMB)... SAMBUNGAN
                </i>
              </div>
              <div class="document-section-content">
                <table class="form-table option-table option-c">
                  <colgroup>
                    <col class="column-1" />
                    <col class="column-2" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>
                        OPTION /
                        <br />
                        <i>PILIHAN</i>
                      </th>
                      <th>
                        APPLICATION DETAILS &amp; DESCRIPTION /
                        <br />
                        <i>PENERANGAN DAN BUTIRAN PERMOHONAN</i>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        C
                        <br />
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="bizchannel-option-c"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isApplicationChoiceSelected('C')"
                            @change="controller.onApplicationChoiceClicked('C')"
                          />
                          <span></span>
                        </label>
                      </td>
                      <td>
                        <p class="option-description">
                          I / We would like to apply for
                          <b>BIZCHANNEL</b>
                          with
                          <b>Standard Authorised Users</b>
                          (any one (1) to approve). /
                          <i>Saya / Kami</i>
                          <br />
                          <i>ingin memohon untuk</i>
                          <i><b>BIZCHANNEL</b></i>
                          <i>dengan</i>
                          <i><b>Pengguna Diberi Kuasa Biasa</b></i>
                          <i>(mana-mana satu (1) untuk meluluskan).</i>
                        </p>
                        <p class="table-instructions">
                          Please fill in all the information required in the following table: /
                          <i>Sila isi semua maklumat yang diperlukan di bawah:</i>
                        </p>
                        <table class="form-table authorised-users-table">
                          <colgroup>
                            <col class="column-1" />
                            <col class="column-2" />
                            <col class="column-3" />
                          </colgroup>
                          <thead>
                            <tr>
                              <th>No</th>
                              <th>
                                Full Name of Authorised User(s)*
                                <br />
                                (as per NRIC / Passport) /
                                <i>
                                  Nama Penuh Pengguna
                                  <br />
                                  Diberi Kuasa* (seperti dalam K/P Baharu / Pasport)
                                </i>
                                <hr />
                                Mobile Number
                                <sup>1</sup>
                                /
                                <i>
                                  Nombor Telefon Bimbit
                                  <sup>1</sup>
                                </i>
                                <hr />
                                Email Address
                                <sup>1</sup>
                                /
                                <i>
                                  Alamat Emel
                                  <sup>1</sup>
                                </i>
                              </th>
                              <th>
                                Role /
                                <i>Peranan</i>
                                <br />
                                (Mandatory to (✓) One only /
                                <br />
                                <i>Wajib (✓) hanya Satu sahaja</i>
                                )
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="i in 4">
                              <td>{{ i }}.</td>
                              <td>
                                <div class="stacked-inputs user-information">
                                  <input
                                    type="text"
                                    class="form-control"
                                    :name="`user-${i - 1}-name`"
                                    placeholder="SAMPLE NAME"
                                    :disabled="!controller.isDocumentEditable()"
                                    v-model="controller.bizChannelUserAt(i - 1).name"
                                    @change="controller.onOtherDetailsChanged()"
                                  />
                                  <input
                                    type="text"
                                    class="form-control"
                                    :name="`user-${i - 1}-mobile`"
                                    placeholder="0000000000"
                                    :disabled="!controller.isDocumentEditable()"
                                    v-model="controller.bizChannelUserAt(i - 1).mobileNumber"
                                    @change="controller.onOtherDetailsChanged()"
                                  />
                                  <input
                                    type="text"
                                    class="form-control"
                                    :name="`user-${i - 1}-email`"
                                    placeholder="NAME@EXAMPLE.COM"
                                    :disabled="!controller.isDocumentEditable()"
                                    v-model="controller.bizChannelUserAt(i - 1).email"
                                    @change="controller.onOtherDetailsChanged()"
                                  />
                                </div>
                              </td>
                              <td>
                                <div class="role-grid">
                                  <label class="form-check">
                                    <input
                                      type="checkbox"
                                      :name="`user-${i - 1}-maker`"
                                      :disabled="!controller.isDocumentEditable()"
                                      :checked="controller.isBizChannelRoleSelected(i - 1, 'maker')"
                                      @change="controller.onBizChannelRoleClicked(i - 1, 'maker')"
                                    />
                                    <span>
                                      Maker
                                      <sup>2</sup>
                                      Only /
                                      <br />
                                      <i>
                                        Pembuat
                                        <sup>2</sup>
                                        Sahaja
                                      </i>
                                    </span>
                                  </label>
                                  <label class="form-check">
                                    <input
                                      type="checkbox"
                                      :name="`user-${i - 1}-approver`"
                                      :disabled="!controller.isDocumentEditable()"
                                      :checked="controller.isBizChannelRoleSelected(i - 1, 'approver')"
                                      @change="controller.onBizChannelRoleClicked(i - 1, 'approver')"
                                    />
                                    <span>
                                      Approver
                                      <sup>3</sup>
                                      /
                                      <br />
                                      <i>
                                        Pelulus
                                        <sup>3</sup>
                                      </i>
                                    </span>
                                  </label>
                                  <label class="form-check">
                                    <input
                                      type="checkbox"
                                      :name="`user-${i - 1}-fx`"
                                      :disabled="!controller.isDocumentEditable()"
                                      :checked="controller.isBizChannelRoleSelected(i - 1, 'maker-fx')"
                                      @change="controller.onBizChannelRoleClicked(i - 1, 'maker-fx')"
                                    />
                                    <span>
                                      Maker
                                      <sup>2</sup>
                                      + FX Rate Booker
                                      <sup>4</sup>
                                      /
                                      <br />
                                      <i>
                                        Pembuat
                                        <sup>2</sup>
                                        + Pewakil Kadar
                                        <br />
                                        Pertukaran Asing
                                        <sup>4</sup>
                                      </i>
                                    </span>
                                  </label>
                                  <label class="form-check">
                                    <input
                                      type="checkbox"
                                      :name="`user-${i - 1}-both`"
                                      :disabled="!controller.isDocumentEditable()"
                                      :checked="controller.isBizChannelRoleSelected(i - 1, 'maker-approver')"
                                      @change="controller.onBizChannelRoleClicked(i - 1, 'maker-approver')"
                                    />
                                    <span>
                                      Maker
                                      <sup>2</sup>
                                      + Approver
                                      <sup>3</sup>
                                      /
                                      <br />
                                      <i>
                                        Pembuat
                                        <sup>2</sup>
                                        + Pelulus
                                        <sup>3</sup>
                                      </i>
                                    </span>
                                  </label>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <p class="maintenance-note">
                          If there are any changes to the authorised users in future, please download the BizChannel
                          Maintenance Form from the Bank’s
                          <br />
                          website. /
                          <i>
                            Jika terdapat sebarang perubahan kepada pengguna yang diberi kuasa pada masa hadapan, sila
                            muat turun Borang
                          </i>
                          <br />
                          <i>Selenggara BizChannel dari laman web Bank.</i>
                        </p>
                        <p class="user-notes">
                          Note /
                          <i>Nota</i>
                          :
                          <br />
                          • All Authorised User(s) will be granted Inquiry role and able to view all account details. /
                          <i>Semua Pengguna Diberi Kuasa akan diberi</i>
                          <br />
                          <i>peranan Membuat Pertanyaan dan boleh melihat semua butiran akaun.</i>
                          <br />
                          • Users can be designated as a Maker or an
                          <sup>3</sup>
                          Approver or hold both roles. /
                          <i>Pengguna boleh ditentukan sebagai Pembuat atau</i>
                          <i><sup>3</sup></i>
                          <i>Pelulus</i>
                          <br />
                          <i>atau memegang kedua-dua peranan.</i>
                          <br />
                          •
                          <sup>1</sup>
                          Mobile number and Email address must be different for each user. /
                          <i>Nombor telefon bimbit dan alamat emel mestilah berbeza bagi</i>
                          <br />
                          <i>setiap pengguna.</i>
                          <br />
                          •
                          <sup>2</sup>
                          Maker is the user who initiates transactions. /
                          <i>Pembuat adalah pengguna yang membuat transaksi.</i>
                          <br />
                          •
                          <sup>3</sup>
                          Approver is the user who approves transactions. /
                          <i>Pelulus adalah pengguna yang meluluskan transaksi.</i>
                          <br />
                          • Each transaction must have a
                          <sup>2</sup>
                          Maker and a separate user as an
                          <sup>3</sup>
                          Authoriser. The Approver cannot initiate and approve the same
                          <br />
                          transaction. /
                          <i>Setiap transaksi perlu mempunyai sekurang kurangnya satu</i>
                          <i><sup>2</sup></i>
                          <i>Pembuat dan satu</i>
                          <i><sup>3</sup></i>
                          <i>Pelulus transaksi. Pelulus tidak boleh</i>
                          <br />
                          <i>membuat dan meluluskan transaksi yang sama.</i>
                          <br />
                          •
                          <sup>4</sup>
                          FX Rate Booker is the user who is authorised to perform the booking of foreign exchange
                          contract rates via BizChannel. (User(s)
                          <br />
                          without the FX Rate Booker role will only be able to view FX live rates via BizChannel). /
                          <i>Pewakil Kadar Pertukaran Asing adalah</i>
                          <br />
                          <i>
                            pengguna yang diberi kuasa untuk melakukan tempahan kadar kontrak bagi penukaran mata wang
                            asing melalui BizChannel.
                          </i>
                          <br />
                          <i>
                            (Pengguna yang tiada peranan Pewakil Kadar Pertukaran Asing hanya boleh melihat kadar
                            Pertukaran Asing secara langsung
                          </i>
                          <br />
                          <i>melalui BizChannel).</i>
                          <br />
                          • Users with the approver role will also be granted with the FX Rate Booker role. /
                          <i>Pengguna dengan peranan pelulus juga akan diberi</i>
                          <br />
                          <i>peranan Pewakil Kadar Pertukaran Asing.</i>
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="document-footer">
              <p>Version: BUSINESSACCOUNTAPPLICATIONFORM - DEC2023</p>
              <div class="footer-bottom">
                <p>CIMB BANK BERHAD 197201001799 | CIMB ISLAMIC BANK BERHAD 200401032872</p>
                <span>[Page 5]</span>
              </div>
            </div>
          </div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="PaperOrientation.Portrait"
        :show-page-number="false"
        additional-css-class="cimb-application-form-paper"
      >
        <template #paperContent>
          <div class="document-page application-page-6">
            <div class="document-header">
              <div
                class="bank-logo"
                role="img"
                aria-label="CIMB"
              ></div>
              <div class="confidential">
                CONFIDENTIAL /
                <i>SULIT</i>
              </div>
            </div>
            <div class="document-section online-banking-continued">
              <div class="document-section-title">
                CIMB ONLINE BANKING APPLICATION (BIZCHANNEL@CIMB)... CONTINUED /
                <i>
                  PERMOHONAN UNTUK
                  <br />
                  PERBANKAN DALAM TALIAN CIMB ONLINE (BIZCHANNEL@CIMB)... SAMBUNGAN
                </i>
              </div>
              <div class="document-section-content">
                <table class="form-table option-table option-d">
                  <colgroup>
                    <col class="column-1" />
                    <col class="column-2" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>
                        OPTION /
                        <br />
                        <i>PILIHAN</i>
                      </th>
                      <th>
                        APPLICATION DETAILS &amp; DESCRIPTION /
                        <br />
                        <i>PENERANGAN DAN BUTIRAN PERMOHONAN</i>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        D
                        <br />
                        <label class="form-check">
                          <input
                            type="checkbox"
                            name="bizchannel-option-d"
                            :disabled="!controller.isDocumentEditable()"
                            :checked="controller.isApplicationChoiceSelected('D')"
                            @change="controller.onApplicationChoiceClicked('D')"
                          />
                          <span></span>
                        </label>
                      </td>
                      <td>
                        <p class="option-description">
                          I / We would like to apply for
                          <b>BIZCHANNEL</b>
                          with
                          <b>Customised System Administrator</b>
                          (more than one (1) to approve
                          <br />
                          OR Customised). /
                          <i>Saya / Kami ingin memohon untuk</i>
                          <i><b>BIZCHANNEL</b></i>
                          <i>dengan</i>
                          <i><b>Fungsi Pentadbir Sistem</b></i>
                          <i>(lebih daripada</i>
                          <br />
                          <i>satu (1) untuk meluluskan atau mempunyai lebih daripada seorang (1) pelulus).</i>
                        </p>
                        <p class="table-instructions">
                          Please fill in all the information required in the following table: /
                          <i>Sila isi semua maklumat yang diperlukan di bawah:</i>
                        </p>
                        <table class="form-table administrators-table">
                          <colgroup>
                            <col class="column-1" />
                            <col class="column-2" />
                            <col class="column-3" />
                          </colgroup>
                          <thead>
                            <tr>
                              <th>No</th>
                              <th>
                                Full Name of Authorised User(s)* (as per NRIC / Passport) /
                                <br />
                                <i>
                                  Nama Penuh Pengguna Diberi Kuasa*
                                  <br />
                                  (seperti dalam K/P Baharu / Pasport)
                                </i>
                              </th>
                              <th>
                                Mobile Number
                                <sup>1</sup>
                                /
                                <i>
                                  Nombor Telefon Bimbit
                                  <sup>1</sup>
                                </i>
                                <hr />
                                Email Address
                                <sup>1</sup>
                                /
                                <i>
                                  Alamat Emel
                                  <sup>1</sup>
                                </i>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="i in 4">
                              <td>{{ i }}.</td>
                              <td>
                                <input
                                  type="text"
                                  class="form-control"
                                  :name="`administrator-${i - 1}-name`"
                                  placeholder="SAMPLE NAME"
                                  :disabled="!controller.isDocumentEditable()"
                                  v-model="controller.systemAdministratorAt(i - 1).name"
                                  @change="controller.onOtherDetailsChanged()"
                                />
                              </td>
                              <td>
                                <div class="stacked-inputs">
                                  <input
                                    type="text"
                                    class="form-control"
                                    :name="`administrator-${i - 1}-mobile`"
                                    placeholder="0000000000"
                                    :disabled="!controller.isDocumentEditable()"
                                    v-model="controller.systemAdministratorAt(i - 1).mobileNumber"
                                    @change="controller.onOtherDetailsChanged()"
                                  />
                                  <input
                                    type="text"
                                    class="form-control"
                                    :name="`administrator-${i - 1}-email`"
                                    placeholder="NAME@EXAMPLE.COM"
                                    :disabled="!controller.isDocumentEditable()"
                                    v-model="controller.systemAdministratorAt(i - 1).email"
                                    @change="controller.onOtherDetailsChanged()"
                                  />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <p class="administrator-notes">
                          Note /
                          <i>Nota</i>
                          :
                          <br />
                          • The Bank will set up the access for System Administrator/(s) of your company. /
                          <i>Pihak Bank akan menyediakan akses untuk</i>
                          <br />
                          <i>Pentadbir Sistem syarikat anda.</i>
                          <br />
                          • The System Administrator/(s) will then set up and customise account/(s) and services
                          available under the respective package
                          <br />
                          for the Authorised User/(s). /
                          <i>Fungsi Pentadbir Sistem ialah untuk menubuhkan sistem dengan memberi akses kepada semua</i>
                          <br />
                          <i>pengguna sistem yang dibenarkan mengikut peranan masing-masing.</i>
                          <br />
                          • Minimum two (2) System Administrators are required and these two cannot be the same person.
                          /
                          <i>Minimum dua (2) Pentadbir</i>
                          <br />
                          <i>Sistem diperlukan dan kedua-dua pentadbir sistem perlulah orang yang berbeza.</i>
                          <br />
                          •
                          <sup>1</sup>
                          Mobile number and Email address must be different for each system administrator. /
                          <i>Nombor telefon bimbit dan alamat emel</i>
                          <br />
                          <i>mestilah berbeza bagi setiap pentadbir sistem.</i>
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="document-section duitnow">
              <div class="document-section-title">
                DUITNOW ID REGISTRATION /
                <i>PENDAFTARAN UNTUK ID DUITNOW</i>
              </div>
              <div class="document-section-content">
                <p>
                  Please tick ✓ one only /
                  <i>Sila tanda satu sahaja</i>
                  ✓
                </p>
                <div class="duitnow-box">
                  <div class="duitnow-options">
                    <label class="form-check">
                      <input
                        type="checkbox"
                        name="duitnow-yes"
                        :disabled="!controller.isDocumentEditable()"
                        :checked="controller.isBooleanSelected('idDuitnowIDRegistration', true)"
                        @change="controller.onBooleanClicked('idDuitnowIDRegistration', true)"
                      />
                      <span>
                        Yes /
                        <i>Ya</i>
                      </span>
                    </label>
                    <label class="form-check">
                      <input
                        type="checkbox"
                        name="duitnow-no"
                        :disabled="!controller.isDocumentEditable()"
                        :checked="controller.isBooleanSelected('idDuitnowIDRegistration', false)"
                        @change="controller.onBooleanClicked('idDuitnowIDRegistration', false)"
                      />
                      <span>
                        No /
                        <i>Tidak</i>
                      </span>
                    </label>
                  </div>
                  <p>
                    With DuitNow, you can transfer funds instantly between participating banks in Malaysia using DuitNow
                    ID. DuitNow ID is your Business
                    <br />
                    Registration Number registered with Suruhanjaya Syarikat Malaysia (SSM). DuitNow ID can only be
                    linked to one bank account for
                    <br />
                    each Business Registration Number. National Addressing Database (NAD) Terms and Conditions apply. /
                    <i>Dengan penggunaan ID</i>
                    <br />
                    <i>
                      DuitNow, anda boleh membuat pemindahan dana secara segera diantara bank bank di Malaysia. ID
                      DuitNow anda adalah Nombor
                    </i>
                    <br />
                    <i>
                      Pendaftaran Perniagaan anda dengan Suruhanjaya Syarikat Malaysia (“SSM”). ID DuitNow hanya boleh
                      dipautkan ke satu akaun bank
                    </i>
                    <br />
                    <i>
                      sahaja untuk setiap Nombor Pendaftaran Perniagaan. Tertakluk kepada National Addressing Database
                      (NAD) Terma dan Syarat.
                    </i>
                  </p>
                </div>
              </div>
            </div>
            <div class="document-section cheque-book">
              <div class="document-section-title">
                CHEQUE BOOK /
                <i>BUKU CEK</i>
              </div>
              <div class="document-section-content">
                <p>
                  No cheque books will be issued upon account opening. You may apply for a cheque book through our CIMB
                  Online banking
                  <br />
                  (BizChannel@CIMB) upon activation of BizChannel@CIMB. /
                  <i>Tiada buku cek akan dikeluarkan semasa pembukaan akaun. Permohonan</i>
                  <br />
                  <i>
                    buku cek boleh dipohon melalui perbankan dalam talian CIMB Online (Bizchannel@CIMB) setelah
                    pengaktifan Bizchannel@CIMB.
                  </i>
                </p>
              </div>
            </div>
            <div class="document-footer">
              <p>Version: BUSINESSACCOUNTAPPLICATIONFORM - DEC2023</p>
              <div class="footer-bottom">
                <p>CIMB BANK BERHAD 197201001799 | CIMB ISLAMIC BANK BERHAD 200401032872</p>
                <span>[Page 6]</span>
              </div>
            </div>
          </div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="PaperOrientation.Portrait"
        :show-page-number="false"
        additional-css-class="cimb-application-form-paper"
      >
        <template
          #paperMargins
          v-if="props.isShowTag"
        >
          <div
            class="paper-tag point-left authorised-person-list"
            v-if="controller.isApplicantsIncomplete()"
          >
            <span>Insert Information</span>
          </div>
        </template>
        <template #paperContent>
          <div class="document-page application-page-7">
            <div class="document-header">
              <div
                class="bank-logo"
                role="img"
                aria-label="CIMB"
              ></div>
              <div class="confidential">
                CONFIDENTIAL /
                <i>SULIT</i>
              </div>
            </div>
            <div class="document-section applicant-signature-section">
              <div class="document-section-title">
                SIGNATURE OF APPLICANT(S) / AUTHORISED PERSON(S) /
                <br />
                <i>TANDATANGAN PEMOHON-PEMOHON / ORANG YANG DIBERI KUASA</i>
              </div>
              <div class="document-section-content">
                <div class="applicant-signatures">
                  <div
                    class="signature-block"
                    v-for="i in 6"
                  >
                    <div
                      class="signature-placeholder"
                      aria-label="Signature"
                      style="margin-bottom: 7px"
                    />
                    <div class="form-group">
                      <p class="field-label">
                        Full Name /
                        <i>Nama Penuh</i>
                      </p>
                      <div class="field-lines">
                        <input
                          type="text"
                          class="form-control"
                          :name="`applicant-${i - 1}-name-1`"
                          placeholder="SAMPLE NAME"
                          :list="`applicant-director-name-${i - 1}`"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.applicantAt(i - 1).nameLine1"
                          @change="controller.onApplicantNameChanged(i - 1)"
                        />
                        <datalist :id="`applicant-director-name-${i - 1}`">
                          <option
                            v-for="name in controller.directorDataListForApplicant(i - 1)"
                            :key="name"
                            :value="name"
                          >
                            {{ name }}
                          </option>
                        </datalist>
                        <input
                          type="text"
                          class="form-control"
                          :name="`applicant-${i - 1}-name-2`"
                          placeholder="SAMPLE NAME"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.applicantAt(i - 1).nameLine2"
                          @change="controller.onOtherDetailsChanged()"
                        />
                      </div>
                    </div>
                    <div
                      class="form-group"
                      style="margin-top: 7px"
                    >
                      <p class="field-label">
                        NRIC / Passport Number /
                        <i>Nombor K/P Baharu / Pasport</i>
                      </p>
                      <div class="field-lines">
                        <input
                          type="text"
                          class="form-control"
                          :name="`applicant-${i - 1}-identity`"
                          placeholder="000000-00-0000"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.applicantAt(i - 1).identification"
                          @change="controller.onOtherDetailsChanged()"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="application-date">
                  <span>
                    Application Date /
                    <i>Tarikh Permohonan</i>
                  </span>
                  <div class="date-fields">
                    <input
                      type="text"
                      class="form-control"
                      name="application-date-day"
                      placeholder="DD"
                      maxlength="2"
                      :disabled="!controller.isDocumentEditable()"
                      :value="controller.getDocumentDatePart('day')"
                      @change="controller.onDocumentDatePartChanged('day', ($event.target as HTMLInputElement).value)"
                    />
                    <span>/</span>
                    <input
                      type="text"
                      class="form-control"
                      name="application-date-month"
                      placeholder="MM"
                      maxlength="2"
                      :disabled="!controller.isDocumentEditable()"
                      :value="controller.getDocumentDatePart('month')"
                      @change="controller.onDocumentDatePartChanged('month', ($event.target as HTMLInputElement).value)"
                    />
                    <span>/</span>
                    <input
                      type="text"
                      class="form-control"
                      name="application-date-year"
                      placeholder="YYYY"
                      maxlength="4"
                      :disabled="!controller.isDocumentEditable()"
                      :value="controller.getDocumentDatePart('year')"
                      @change="controller.onDocumentDatePartChanged('year', ($event.target as HTMLInputElement).value)"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="document-section business-debit-card">
              <div class="document-section-title">
                SIGNATURE FOR BUSINESS DEBIT CARD /
                <i>TANDATANGAN KAD DEBIT PERNIAGAAN</i>
              </div>
              <div class="document-section-content">
                <p class="debit-acknowledgement">
                  For new Debit Card only /
                  <i>Untuk Kad Debit baharu sahaja</i>
                  <br />
                  I hereby acknowledge receipt of the Debit Card issued to me by CIMB Bank Berhad or CIMB Islamic Bank
                  Berhad. I have read, understood and
                  <br />
                  retained a copy of the Terms and Conditions governing the use of this new card and agree to be bound
                  by them. Please deduct the charges for this
                  <br />
                  new card from the account number provided above. /
                  <i>Saya mengaku menerima Kad Debit yang dikeluarkan kepada saya oleh CIMB Bank Berhad atau</i>
                  <br />
                  <i>
                    CIMB Islamic Bank Berhad. Saya juga telah membaca, memahami dan menyimpan salinan Terma-terma dan
                    Syarat-syarat penggunaan kad baharu ini
                  </i>
                  <br />
                  <i>
                    dan bersetuju untuk mematuhi segala syarat Tema dan Syarikat Perkhidmatan. Sila buat potongan
                    daripada nombor akaun yang tertera di atas untuk
                  </i>
                  <br />
                  <i>bayaran kad baharu ini.</i>
                </p>
                <div class="two-columns debit-signature">
                  <div>
                    <p class="field-label">
                      Signature /
                      <i>Tandatangan</i>
                    </p>
                    <div class="signature-placeholder"></div>
                  </div>
                  <div>
                    <div class="form-group">
                      <p class="field-label">
                        Full Name /
                        <i>Nama Penuh</i>
                      </p>
                      <div class="field-lines">
                        <input
                          type="text"
                          class="form-control"
                          name="debit-name-1"
                          placeholder="SAMPLE NAME"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.cimbBankApplicationDetails.value.debitCardHolderNameLine1"
                          @change="controller.onOtherDetailsChanged()"
                        />
                        <input
                          type="text"
                          class="form-control"
                          name="debit-name-2"
                          placeholder="SAMPLE NAME"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.cimbBankApplicationDetails.value.debitCardHolderNameLine2"
                          @change="controller.onOtherDetailsChanged()"
                        />
                      </div>
                    </div>
                    <div class="form-group">
                      <p class="field-label">
                        NRIC / Passport Number /
                        <i>Nombor K/P Baharu / Pasport</i>
                      </p>
                      <div class="field-lines">
                        <input
                          type="text"
                          class="form-control"
                          name="debit-identity"
                          placeholder="000000-00-0000"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.cimbBankApplicationDetails.value.debitCardHolderIdentification"
                          @change="controller.onOtherDetailsChanged()"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="document-footer">
              <p>Version: BUSINESSACCOUNTAPPLICATIONFORM - DEC2023</p>
              <div class="footer-bottom">
                <p>CIMB BANK BERHAD 197201001799 | CIMB ISLAMIC BANK BERHAD 200401032872</p>
                <span>[Page 11]</span>
              </div>
            </div>
          </div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="PaperOrientation.Portrait"
        :show-page-number="false"
        additional-css-class="cimb-application-form-paper"
      >
        <template
          #paperMargins
          v-if="props.isShowTag"
        >
          <div
            class="paper-tag point-left cimb-branch"
            v-if="controller.isBranchIncomplete()"
          >
            <span>Insert Information</span>
          </div>

          <div
            class="paper-tag point-left document-purpose"
            v-if="controller.isSignaturePurposeIncomplete()"
          >
            <span>Insert Information</span>
          </div>

          <div
            class="paper-tag point-left authorised-person-2"
            v-if="controller.isAccountSignatoriesIncomplete()"
          >
            <span>Insert Information</span>
          </div>
        </template>
        <template #paperContent>
          <div class="document-page application-page-8">
            <div class="document-header">
              <div
                class="bank-logo"
                role="img"
                aria-label="CIMB"
              ></div>
              <div class="confidential">
                CONFIDENTIAL /
                <i>SULIT</i>
              </div>
            </div>
            <div class="signature-form-title">
              <p>
                <b>Signature Form</b>
                <b>(of Authorised Signatories)</b>
                <b>For Business/Company/Associations/Others</b>
                <br />
                <i><b>Borang Tandatangan</b></i>
                <i><b>(Penandatangan yang Dibenarkan)</b></i>
                <i><b>Untuk Perniagaan/Syarikat/Persatuan/Lain-Lain</b></i>
              </p>
            </div>
            <table class="form-table signature-summary">
              <colgroup>
                <col class="column-1" />
                <col class="column-2" />
              </colgroup>
              <tbody>
                <tr>
                  <td>
                    Branch
                    <br />
                    <i>Cawangan</i>
                  </td>
                  <td>
                    <BranchDropdown
                      v-if="controller.isDocumentEditable()"
                      :bank-id="controller.bankId"
                      :selected-branch-id="controller.selectedBranchId.value"
                      :is-show-address="false"
                      :is-disabled="!controller.isDocumentEditable()"
                      @branchSelected="controller.onBranchSelected($event)"
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    Registered Name
                    <br />
                    <i>Nama Berdaftar</i>
                  </td>
                  <td>
                    <input
                      type="text"
                      class="form-control"
                      name="signature-company"
                      placeholder="SAMPLE COMPANY SDN BHD"
                      autocomplete="off"
                      :value="controller.companyName()"
                      readonly
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    Account Number
                    <br />
                    <i>Akaun Nombor</i>
                  </td>
                  <td>
                    <input
                      type="text"
                      class="form-control"
                      name="signature-account-number"
                      placeholder="000000000000"
                      :disabled="!controller.isDocumentEditable()"
                      v-model="controller.cimbBankApplicationDetails.value.signatureAccountNumber"
                      @change="controller.onOtherDetailsChanged()"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="signature-purpose">
              <p>
                Please tick (✓) one of the following options for the purpose of Signature Image.
                <br />
                <i>Please tick (</i>
                ✓
                <i>) one of the following options for the purpose of Signature Image.</i>
              </p>
              <div class="signature-purpose-options">
                <label class="form-check">
                  <input
                    type="checkbox"
                    name="signature-new-account"
                    :disabled="!controller.isDocumentEditable()"
                    :checked="controller.isSignaturePurposeSelected('new-account')"
                    @change="controller.onSignaturePurposeClicked('new-account')"
                  />
                  <span>
                    New Account
                    <br />
                    <i>Akaun Baru</i>
                  </span>
                </label>
                <label class="form-check">
                  <input
                    type="checkbox"
                    name="signature-add"
                    :disabled="!controller.isDocumentEditable()"
                    :checked="controller.isSignaturePurposeSelected('add')"
                    @change="controller.onSignaturePurposeClicked('add')"
                  />
                  <span>
                    Add Signature or Mandate
                    <br />
                    <i>Penambahan Tandatangan atau Mandat</i>
                  </span>
                </label>
                <label class="form-check">
                  <input
                    type="checkbox"
                    name="signature-update"
                    :disabled="!controller.isDocumentEditable()"
                    :checked="controller.isSignaturePurposeSelected('update')"
                    @change="controller.onSignaturePurposeClicked('update')"
                  />
                  <span>
                    For Signature Updates
                    <br />
                    <i>Untuk Kemaskini Tandatangan</i>
                  </span>
                </label>
                <label class="form-check">
                  <input
                    type="checkbox"
                    name="signature-condition"
                    :disabled="!controller.isDocumentEditable()"
                    :checked="controller.isSignaturePurposeSelected('condition')"
                    @change="controller.onSignaturePurposeClicked('condition')"
                  />
                  <span>
                    Change of Condition
                    <br />
                    <i>Perubahan Syarat</i>
                  </span>
                </label>
              </div>
            </div>
            <div class="signature-form-list">
              <div
                class="signature-form-row"
                v-for="i in 4"
              >
                <div class="signature-placeholder"></div>
                <table class="form-table signatory-details">
                  <colgroup>
                    <col class="detail-label" />
                    <col class="detail-value" />
                    <col class="detail-label-right" />
                    <col class="detail-value-right" />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td>
                        Full Name
                        <br />
                        <i>Nama Penuh</i>
                      </td>
                      <td>
                        <input
                          type="text"
                          class="form-control"
                          :name="`signatory-${i - 1}-name`"
                          placeholder="SAMPLE NAME"
                          :list="`account-signatory-director-name-${i - 1}`"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.accountSignatoryAt(i - 1).name"
                          @change="controller.onAccountSignatoryNameChanged(i - 1)"
                        />
                        <datalist :id="`account-signatory-director-name-${i - 1}`">
                          <option
                            v-for="name in controller.directorDataListForAccountSignatory(i - 1)"
                            :key="name"
                            :value="name"
                          >
                            {{ name }}
                          </option>
                        </datalist>
                      </td>
                      <td>
                        Date of Birth
                        <br />
                        <i>Tarikh Lahir</i>
                      </td>
                      <td>
                        <input
                          type="text"
                          class="form-control"
                          :name="`signatory-${i - 1}-birth`"
                          placeholder="DD/MM/YYYY"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.accountSignatoryAt(i - 1).dateOfBirth"
                          @change="controller.onOtherDetailsChanged()"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        NRIC
                        <br />
                        <i>Nombor K/P</i>
                      </td>
                      <td>
                        <input
                          type="text"
                          class="form-control"
                          :name="`signatory-${i - 1}-nric`"
                          placeholder="000000-00-0000"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.accountSignatoryAt(i - 1).nric"
                          @change="controller.onOtherDetailsChanged()"
                        />
                      </td>
                      <td>
                        Nationality
                        <br />
                        <i>Kewarganegaraan</i>
                      </td>
                      <td>
                        <input
                          type="text"
                          class="form-control"
                          :name="`signatory-${i - 1}-nationality`"
                          placeholder="NATIONALITY"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.accountSignatoryAt(i - 1).nationality"
                          @change="controller.onOtherDetailsChanged()"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Designation
                        <br />
                        <i>Jawatan</i>
                      </td>
                      <td>
                        <input
                          type="text"
                          class="form-control"
                          :name="`signatory-${i - 1}-designation`"
                          placeholder="DESIGNATION"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.accountSignatoryAt(i - 1).designation"
                          @change="controller.onOtherDetailsChanged()"
                        />
                      </td>
                      <td>
                        Passport Number
                        <br />
                        <i>Nombor Pasport</i>
                      </td>
                      <td>
                        <input
                          type="text"
                          class="form-control"
                          :name="`signatory-${i - 1}-passport`"
                          placeholder="PASSPORT"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.accountSignatoryAt(i - 1).passportNumber"
                          @change="controller.onOtherDetailsChanged()"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Residential Address
                        <br />
                        <i>Alamat Kediaman</i>
                      </td>
                      <td colspan="3">
                        <input
                          type="text"
                          class="form-control"
                          :name="`signatory-${i - 1}-address`"
                          placeholder="SAMPLE ADDRESS"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.accountSignatoryAt(i - 1).address"
                          @change="controller.onOtherDetailsChanged()"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Signing Group
                        <br />
                        <i>Kumpulan Penandatangan</i>
                      </td>
                      <td colspan="3">
                        <input
                          type="text"
                          class="form-control"
                          :name="`signatory-${i - 1}-group`"
                          placeholder="GROUP"
                          :disabled="!controller.isDocumentEditable()"
                          v-model="controller.accountSignatoryAt(i - 1).signingGroup"
                          @change="controller.onOtherDetailsChanged()"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="bank-use">
              <p class="bank-use-title">
                <b>
                  FOR BANK’S USE ONLY /
                  <i>UNTUK KEGUNAAN BANK SAHAJA</i>
                </b>
              </p>
              <div class="bank-use-details">
                <div>
                  <b>
                    Veriﬁed by (Name, Signature and Cage Number)
                    <br />
                    <i>Disahkan oleh (Nama, Tandatangan dan Nombor Cage)</i>
                  </b>
                </div>
                <div>
                  Date
                  <br />
                  <i>Tarikh</i>
                </div>
              </div>
            </div>
            <div class="document-footer">
              <p>Version: BUSINESSACCOUNTAPPLICATIONFORM - DEC2023</p>
              <div class="footer-bottom">
                <p>CIMB BANK BERHAD 197201001799 | CIMB ISLAMIC BANK BERHAD 200401032872</p>
                <span>[Page 12]</span>
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
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import { StringUtil } from "~/scripts/utils/String"
  import { PaperOrientation } from "~/scripts/constants/Paper"
  import { DcrBankAccountOpeningCimbApplicationController } from "~/scripts/components/resolutions/DcrBankAccountOpeningCimbApplicationController"

  const props = defineProps<IPropsResolutionDocument<CompanyBankAccountOpening>>()

  const emit = defineEmits(["startLoading", "doneLoading", "signed", "updated"])

  const documentRef = ref(null)
  const resolutionContent = ref(null)
  const nonDirectorBankSignatoryRef = ref(null)

  const controller = new DcrBankAccountOpeningCimbApplicationController(props, emit)

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

  watch(
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
    },
    { immediate: true }
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
    getPdfPages: controller.getPdfPages.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/DcrBankAccountOpeningCimbApplication" as *;
</style>
