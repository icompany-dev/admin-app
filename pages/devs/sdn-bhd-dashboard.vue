<template>
  <div class="page-test">
    <SdnBhdDashboard :company-id="COMPANY_ID" />
  </div>
</template>

<script setup lang="ts">
  import SdnBhdDashboard from "@/components/Companies/SdnBhdDashboard.vue"

  const COMPANY_ID = "c3412b50-0b30-48cf-b63b-baac7227dd78" //Lorem IpsumConsulting
</script>
