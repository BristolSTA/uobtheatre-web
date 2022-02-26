<template>
  <div class="flex flex-col h-full justify-around items-center">
    <div class="text-center">
      <h1 class="text-6xl font-bold">Have your eTicket ready</h1>
      <h2 class="text-5xl">(showing the QR code)</h2>
    </div>
    <div class="flex gap-x-10">
      <span class="text-8xl"
        ><font-awesome-icon icon="mobile-alt" class="fa-2x"
      /></span>
      <span class="text-8xl"
        ><font-awesome-icon icon="long-arrow-alt-right" class="fa-2x"
      /></span>
      <qrcode-vue
        value="https://linktr.ee/BristolSTA"
        render-as="svg"
        level="L"
        class="h-full w-auto qrcode-responsive-height"
      />
    </div>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
export default {
  components: { QrcodeVue },
}
</script>
