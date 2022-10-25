import { RouterLinkStub } from "@vue/test-utils";
import { expect } from "chai";

import { mountWithRouterMock } from "../../../helpers";
import Booking from "@/classes/Booking";
import BookingSummaryOverview from "@/components/booking/overview/BookingSummaryOverview.vue";
import OverviewBox from "@/components/ui/Card.vue";

import FullBooking from "@/tests/unit/fixtures/instances/FullBooking";

describe("Booking Summary Overview", function () {
  let bookingSummaryOverviewComponent;

  beforeAll(async () => {
    const bookingdata = FullBooking();

    const booking = Booking.fromAPIData(bookingdata);

    bookingSummaryOverviewComponent = await mountWithRouterMock(
      BookingSummaryOverview,
      {
        propsData: {
          booking,
        },
      }
    );
  });

  it("has overview box component", () => {
    expect(bookingSummaryOverviewComponent.findComponent(OverviewBox).exists())
      .to.be.true;
  });

  it("has correct booking summary info", async () => {
    await bookingSummaryOverviewComponent.vm;

    expect(bookingSummaryOverviewComponent.text()).to.contain("Legally Ginger");
    expect(bookingSummaryOverviewComponent.text()).to.contain(
      "Monday 9 March 2020"
    );
    expect(bookingSummaryOverviewComponent.text()).to.contain(
      "Booking Ref: yOIYg6Co8vGR"
    );
  });
  it("has working links", async () => {
    await bookingSummaryOverviewComponent.vm;
    expect(
      bookingSummaryOverviewComponent.findAllComponents(RouterLinkStub).length
    ).to.equal(2);

    expect(
      bookingSummaryOverviewComponent
        .findAllComponents(RouterLinkStub)
        .at(0)
        .props("to")
    ).to.equal("/production/legally-ginger");

    expect(
      bookingSummaryOverviewComponent
        .findAllComponents(RouterLinkStub)
        .at(1)
        .props("to")
    ).to.equal("/user/booking/yOIYg6Co8vGR");
  });
});
