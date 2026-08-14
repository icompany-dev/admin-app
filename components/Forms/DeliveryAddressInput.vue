<template>
  <div class="delivery-address-input big-form">
    <div class="form-row full">
      <div class="input-container">
        <label>{{ controller.recipientLabel() }}:</label>
        <input type="text" v-model="controller.name.value" class="form-control" @change="emit('updateName')">
      </div>
    </div>
    <div class="form-row half">
      <div class="input-container">
        <label>{{ controller.emailLabel() }}:</label>
        <input type="text" v-model="controller.email.value" class="form-control email" @change="emit('updateEmail')">
      </div>
      <div class="input-container">
        <label>{{ controller.phoneLabel() }}:</label>
        <input type="text" v-model="controller.phone.value" class="form-control" @change="emit('updatePhone')">
      </div>
    </div>
    <div class="form-row full">
      <div class="input-container">
        <label>{{ controller.addressLine1Label() }}:</label>
        <input type="text" v-model="controller.addressLine1.value" class="form-control"
          :disabled="controller.isFieldDisabled()">
      </div>
    </div>
    <div class="form-row full">
      <div class="input-container">
        <label>{{ controller.addressLine2Label() }}:</label>
        <input type="text" v-model="controller.addressLine2.value" class="form-control"
          :disabled="controller.isFieldDisabled()">
      </div>
    </div>
    <div class="form-row one-third">
      <div class="input-container">
        <label>
          <span>{{ controller.postcodeLabel() }}: <span class="note-marker">*</span></span>
        </label>
        <input type="text" v-model="controller.postcode.value" class="form-control"
          :disabled="controller.isFieldDisabled()" @change="controller.onPostcodeInput()">
      </div>
      <div class="input-container">
        <label>{{ controller.cityLabel() }}:</label>
        <input type="text" v-model="controller.cityName.value" class="form-control"
          :disabled="controller.isFieldDisabled()" @change="emit('updateCity')">
      </div>
      <div class="input-container">
        <label>{{ controller.stateLabel() }}:</label>
        <input type="text" v-model="controller.stateName.value" class="form-control"
          :disabled="controller.isFieldDisabled()" @change="emit('updateState')">
      </div>
    </div>
    <div class="form-row half">
      <div class="input-container">
        <label>
          <span>{{ controller.countryLabel() }}: <span class="note-marker">**</span></span>
        </label>
        <input type="text" v-model="controller.countryName.value" class="form-control"
          :disabled="controller.isFieldDisabled()" @change="emit('updateCountry')">
      </div>
      <div class="input-container">
        <div class="checkbox-input">
          <input type="checkbox" v-model="controller.isSameAsResidential.value"
            @change="controller.onSameAsResidentialAddressChecked()">
          <div class="checkbox-label">
            <label>{{ controller.sameAsResidentialLabel() }}</label>
            <small>{{ controller.sameAsResidentialSubnote() }}</small>
          </div>
        </div>
      </div>
    </div>
    <div class="notes">
      <div class="note">
        <span class="note-marker">*</span>
        <span class="note-label">{{ controller.addressAutoComplete() }}</span>
      </div>
      <div class="note">
        <span class="note-marker">**</span>
        <span class="note-label" v-html="controller.shippingNotice()" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DeliveryAddressInputController } from '~/scripts/components/forms/DeliveryAddressInputController'
import { Location } from '~/scripts/models/Location';
import { User } from '~/scripts/models/User';

const props = defineProps({
  currentUser: {
    type: User,
    required: true
  },
  location: {
    type: Location,
    default: null
  }
})

const emit = defineEmits(['updateAddressLine1', 'updateAddressLine2', 'updateState', 'updateCity', 'updatePostcode', 'updateCountry', 'updateName', 'updateEmail', 'updatePhone'])

const controller = new DeliveryAddressInputController(props.currentUser, emit, props.location)

watch(() => props.currentUser, (newVal) => {
  controller.setCurrentUser(newVal)
}, { deep: true })

defineExpose({
  getAddress: controller.getDeliveryAddress.bind(controller)
})
</script>