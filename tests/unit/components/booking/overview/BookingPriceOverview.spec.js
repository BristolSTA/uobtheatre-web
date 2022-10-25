import { expect } from "chai";

import { fixTextSpacing, mountWithRouterMock } from "../../../helpers";
import Booking from "@/classes/Booking";
import BookingPriceOverview from "@/components/booking/overview/BookingPriceOverview.vue";
import OverviewBox from "@/components/ui/Card.vue";

import FullBooking from "@/tests/unit/fixtures/instances/FullBooking";

describe("Booking Price Overview", function () {
  let bookingPriceOverviewComponent;

  beforeAll(async () => {
    const bookingdata = FullBooking();

    const booking = Booking.fromAPIData(bookingdata);
    bookingPriceOverviewComponent = await mountWithRouterMock(
      BookingPriceOverview,
      {
        propsData: {
          booking,
        },
      }
    );
  });

  it("has overview box component", () => {
    expect(bookingPriceOverviewComponent.findComponent(OverviewBox).exists()).to
      .be.true;
  });

  it("has correct costs info", () => {
    const costRows = bookingPriceOverviewComponent.findAll("tr");

    expect(costRows.length).to.eq(2);
    expect(fixTextSpacing(costRows.at(0).text())).to.eq(
      "Tickets Including any discounts : £4.90"
    );
    expect(fixTextSpacing(costRows.at(1).text())).to.eq("Booking Fee : £0.05");
    expect(
      fixTextSpacing(
        bookingPriceOverviewComponent.findComponent({ ref: "total" }).text()
      )
    ).to.eq("Order Total: £4.95");
  });
});
