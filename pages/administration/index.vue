<template>
  <div>
    <h1 class="text-h1">Dashboard</h1>
    <!-- <div class="flex justify-around space-x-3">
      <div class="h-24 p-4 rounded bg-sta-orange">
        <span class="text-4xl font-semibold">3</span>
        <p>productions live</p>
      </div>
      <div class="h-24 p-4 rounded bg-sta-orange">
        <span class="text-4xl font-semibold">1</span>
        <p>society</p>
      </div>
      <div class="h-24 p-4 rounded bg-sta-orange">
        <span class="text-4xl font-semibold">40,000</span>
        <p>users</p>
      </div>
    </div> -->
    <div class="my-4 p-2 bg-sta-gray-dark">
      <p>Welcome to the UOB Theatre Administration Panel.</p>
      <p>
        Here you will find all the productions and societies you have access to,
        along with any other administration related content granted to you.
      </p>
      <p>
        If something doesn't look right, or you need help, please open a ticket
        on our service desk or ask a member of the STA.
      </p>
    </div>
    <div>
      <h3 class="text-h3">Quick Links</h3>
      <div class="flex flex-wrap gap-3">
        <nuxt-link to="/administration/productions">
          <div class="p-2 bg-sta-green">Your Live Productions</div>
        </nuxt-link>
        <nuxt-link to="/administration/tools/ticket-lookup">
          <div class="p-2 bg-sta-green">Ticket & Booking Lookup</div>
        </nuxt-link>
        <nuxt-link to="/administration/finance-reports">
          <div class="p-2 bg-sta-green">Finance Reporting</div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head: {
    title: 'Dashboard',
  },
};
</script>
