import { expect } from "chai";

import { fixTextSpacing, mountWithRouterMock } from "../../../helpers";
import Booking from "@/classes/Booking";
import OverviewBox from "@/components/ui/Card.vue";
import PaymentOverview from "@/components/booking/overview/PaymentOverview.vue";

import FullBooking from "@/tests/unit/fixtures/instances/FullBooking";

describe("Payment Overview", function () {
  let paymentOverviewComponent;

  beforeAll(async () => {
    const bookingdata = FullBooking();

    const booking = Booking.fromAPIData(bookingdata);
    paymentOverviewComponent = await mountWithRouterMock(PaymentOverview, {
      propsData: {
        booking,
      },
    });
  });

  it("has overview box component", () => {
    expect(paymentOverviewComponent.findComponent(OverviewBox).exists()).to.be
      .true;
  });

  it("has correct booking status", async () => {
    await paymentOverviewComponent.vm;

    expect(fixTextSpacing(paymentOverviewComponent.text())).to.contain(
      "Paid using VISA ending 4441"
    );
  });

  it("has correct payment info", async () => {
    await paymentOverviewComponent.vm;
    const costRows = paymentOverviewComponent.findAll("tr");

    expect(costRows.length).to.eq(2);
    expect(fixTextSpacing(costRows.at(0).text())).to.eq("Total Paid : £12.65");
    expect(fixTextSpacing(costRows.at(1).text())).to.eq("On : Fri 8 May 2020");
  });
});
