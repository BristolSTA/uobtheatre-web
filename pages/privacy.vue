<template>
  <div class="text-page container mx-auto">
    <h1 class="my-4 text-h1">
      Privacy Policy
    </h1>
    <p>
      It is our policy to respect your privacy regarding any information we may
      collect during your use of this website. Accordingly, we have developed
      this privacy policy to help you to understand how we collect, use,
      communicate, disclose and otherwise make use of personal information when
      using our Services. This policy sets out how we will process any personal
      data we collect from you, or which you provide to us, in the course of
      using our website or other services ("Services").
    </p>
    <h2>1. Information Stored and Processed</h2>
    <p>
      When you use our Services we may automatically collect data from you, or
      you might voluntarily provide us with data. The below sections describe
      data we collect, along with its purpose (our legitimate interest).
    </p>
    <div v-for="section in collectedData" :key="section.title" class="mb-6">
      <h3 class="text-xl">
        {{ section.title }}
      </h3>
      <table class="w-full">
        <thead>
          <table-head-item :text-left="false">
            Purpose
          </table-head-item>
          <table-head-item :text-left="false">
            Legal Basis
          </table-head-item>
          <table-head-item :text-left="false">
            Collected Data
          </table-head-item>
        </thead>
        <tbody>
          <table-row v-for="(row, index) in section.items" :key="index">
            <table-row-item>{{ row.purpose }}</table-row-item>
            <table-row-item>{{ row.basis }}</table-row-item>
            <table-row-item>
              <ul class="list-inside list-disc">
                <li v-for="(item, itemIndex) in row.data" :key="itemIndex">
                  {{ item }}
                </li>
              </ul>
            </table-row-item>
          </table-row>
        </tbody>
      </table>
    </div>
    <p>
      Online and in-person card or digital payments are processed by Squareup
      International Ltd. ("Square"). When paying online, all payments (including
      both credit/debit card, Google Pay or Apple Pay) are processed directly by
      Square. The input forms for these payment methods are hosted by Square,
      and as such card details are never collected or stored by us. For details
      on Square's privacy policy and terms, please visit
      <a
        href="https://squareup.com/gb/en/legal/general/ua"
        class="text-sta-orange hover:text-sta-orange"
      >https://squareup.com/gb/en/legal/general/ua</a>.
    </p>
    <h2>2. What we do with your data</h2>
    <p>
      We use your data for a variety of reasons, including those highlighted
      above. However, your data will always only be used for the purposes of
      providing our Services and will never be sold to 3rd parties.
    </p>
    <p>The main reasons we process your data are:</p>
    <ul class="list-inside list-disc">
      <li>To provide you with a personalised service;</li>
      <li>
        To improve out Services, and understand the behaviours of our users;
      </li>
      <li>To be able to deliver our Services effectively;</li>
      <li>To comply with legal obligations;</li>
      <li>
        For our legitimate business interests which include, but are not limited
        to, providing information on our shows and services and analysing the
        use of our websites and services to continually improve your customer
        experience and our business; or
      </li>
      <li>
        You have provided consent for us to collect and process your personal
        information
      </li>
    </ul>
    <p class="mt-3">
      Generally, your personal information is never distributed to third
      parties. However, there are certain cases where we may share personal
      information with external groups:
    </p>
    <ul class="list-inside list-disc">
      <li>
        Providing information about bookings made (including the name of the
        person who made the booking) to production teams to help them handle
        support queries and operate a Box Office service to control access to
        their performances
      </li>
    </ul>
    <h2>3. When we collect data</h2>
    <p>
      Generally, we collect your information when you decide to interact with
      us. This could include purchasing tickets online, in person at a box
      office, or when you sign up or send us an email. We also look at how our
      Services are used, so that we can offer the best possible experience.
    </p>
    <p>The main ways we collect information are:</p>
    <ul class="list-inside list-disc">
      <li>When you register or login to our Services;</li>
      <li>
        When you create, edit or pay for a booking, product or service online or
        in-person;
      </li>
      <li>
        When you contact us by any means, including email or contact form;
      </li>
      <li>When you fill in any forms;</li>
      <li>When you visit our Services (e.g. via Cookies).</li>
    </ul>
    <h2>4. Use of Data for direct marketing</h2>
    <p>
      The Data is used only by us and only for critical or mandatory
      notifications, such as purchase receipts or booking confirmation. We won't
      send unsolicited marketing emails unless you have explicity opted in to
      that service.
    </p>
    <h2>5. How we store your data</h2>
    <p>
      We keep your personal information for as long as we require for the
      purposes for which it was collected (see above). Once the relevant purpose
      has been satisfied we will securely delete or anonymise your personal
      information unless we are required to retain a copy of such information
      under applicable law.
    </p>
    <p>
      All personal information that you provide is stored on our secure servers
      or those of our suppliers which may be situated outside of the European
      Economic Area (“EEA”). Your information may also be processed by one of
      our suppliers for the purposes set out in this Privacy Policy. Where we
      transfer personal information outside of the EEA we will ensure that
      adequate contractual safeguards are in place (e.g. the European
      Commission’s standard data protection clauses or “model clauses”), to
      ensure the security of your personal information is maintained when it is
      processed by the third party.
    </p>
    <p>
      At all times we seek to take the necessary precautions to safeguard your
      data. This includes encrypting data sent from us to you and vice versa
      through methods such as Secure Socket Layer (SSL) end-to-end encryption,
      as well as encrypting any sensitive information.
    </p>
    <h2>6. Third Parties</h2>
    <p>
      Our Services may make use of multiple third parties to collect, store or
      process information on our behalf. These parties are listed below.
    </p>
    <ul class="ml-4 list-disc">
      <li>
        <h3 class="text-lg">
          Google
        </h3>
        <p>
          Collect and provide aggregated data on site performance, user
          profiles, behaviour and other analytical data
        </p>
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          class="text-sta-orange hover:text-sta-orange-dark transition-colors"
        >Privacy Policy</a>
      </li>
      <li>
        <h3 class="text-lg">
          Squareup International
        </h3>
        <p>
          Collect payment information and create payment charges for non-cash
          payment methods.
        </p>
        <a
          href="https://squareup.com/gb/en/legal/general/ua"
          target="_blank"
          class="text-sta-orange hover:text-sta-orange-dark transition-colors"
        >Privacy Policy</a>
      </li>
    </ul>
    <h2>7. Links to Other Web Sites</h2>
    <p>
      Our website may contain links to other websites of interest. However, once
      you have used these links to leave our site, you should note that we do
      not have any control over that other website. Therefore, we cannot be
      responsible for the protection and privacy of any information which you
      provide whilst visiting such sites and such sites are not governed by this
      privacy statement. You should exercise caution and look at the privacy
      statement applicable to the website in question.
    </p>
    <h2>8. Your rights over your personal data</h2>
    <p>Under various legislation, including UK GDPR, you have the right to:</p>
    <ul class="list-inside list-disc">
      <li>A copy of your personal information which we hold about you;</li>
      <li>
        Request that we correct any personal information that is inaccurate or
        out of date;
      </li>
      <li>
        Withdraw your consent to processing at any time if we have relied on
        your consent to process your personal information;
      </li>
      <li>
        Request, under certain circumstances, that your personal information is
        removed from our systems where it is no longer necessary for us to hold
        your personal information;
      </li>
      <li>
        Request in certain circumstances that we transmit your personal
        information that we hold elsewhere
      </li>
      <li>
        Object to us processing your personal information. In this instance, we
        will stop processing your personal information if we are relying on it
        for our own or someone else’s legitimate interests, processing it for
        direct marketing or processing it for research (unless such processing
        is necessary for the performance of a task carried out in the public
        interest); and
      </li>
      <li>
        Restrict the processing of your personal information, if you contest the
        accuracy of the personal information that we hold about you. This means
        we must stop any processing activities until we have verified the
        accuracy of the personal information, or we no longer need your personal
        information.
      </li>
    </ul>
    <p>
      Please make any requests under this policy to support@uobtheatre.com.
      Please note that you will be asked to prove your identity.
    </p>
  </div>
</template>

<script>
import TableHeadItem from '@/components/ui/Tables/TableHeadItem.vue'
import TableRow from '@/components/ui/Tables/TableRow.vue'
import TableRowItem from '@/components/ui/Tables/TableRowItem.vue'
export default {
  components: { TableRowItem, TableRow, TableHeadItem },
  data () {
    return {
      collectedData: [
        {
          title: 'Account Details',
          items: [
            {
              purpose:
                'Provision of a personalised experience and to enable us to provide a better service (e.g. fetching your tickets by taking your name, instead of a booking reference)',
              basis: 'Legitimate interests',
              data: ['Full Name']
            },
            {
              purpose: 'Password reset functionality',
              basis: 'Legitimate interests',
              data: ['Email Address']
            }
          ]
        },
        {
          title: 'Tickets and Bookings',
          items: [
            {
              purpose: 'Provision of payment receipt, and booking confirmation',
              basis: 'Legitimate interests',
              data: ['Email Address']
            },
            {
              purpose:
                'Operational statistics to indicate the number of remaining tickets to be checked in or collected',
              basis: 'Legitimate interests',
              data: ['Ticket Check In State']
            }
          ]
        }
      ]
    }
  },
  head: {
    title: 'Privacy Policy'
  }
}
</script>

<style lang="scss">
.text-page {
  h2 {
    @apply text-h2 mt-2 font-semibold;
  }

  p {
    @apply mb-4 md:text-justify;
  }
}
</style>
