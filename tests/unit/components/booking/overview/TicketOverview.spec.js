import { expect } from "chai";

import { fixTextSpacing, mountWithRouterMock } from "../../../helpers";
import Booking from "@/classes/Booking";
import OverviewBox from "@/components/ui/Card.vue";
import TicketsOverview from "@/components/booking/overview/TicketsOverview.vue";

import FullBooking from "@/tests/unit/fixtures/instances/FullBooking";

describe("Ticket Overview", function () {
  let ticketOverviewComponent;

  beforeAll(async () => {
    const bookingdata = FullBooking();

    const booking = Booking.fromAPIData(bookingdata);

    ticketOverviewComponent = await mountWithRouterMock(TicketsOverview, {
      propsData: {
        booking,
      },
    });
  });

  it("has overview box component", () => {
    expect(ticketOverviewComponent.findComponent(OverviewBox).exists()).to.be
      .true;
  });

  it("has correct header info", () => {
    expect(ticketOverviewComponent.text()).to.contain("Tickets");

    expect(ticketOverviewComponent.text()).to.contain(
      "All our tickets are fulfilled digitally"
    );
    expect(ticketOverviewComponent.text()).to.contain(
      "Display on your phone or print"
    );
  });

  it("have correct ticket info", () => {
    const seatGroupBoxes = ticketOverviewComponent.findAll("div.bg-sta-gray");

    expect(seatGroupBoxes.length).to.equal(2);

    expect(seatGroupBoxes.at(0).text()).to.contain("Best seats in the house");
    expect(fixTextSpacing(seatGroupBoxes.at(0).text())).to.contain("2 x Adult");
    expect(fixTextSpacing(seatGroupBoxes.at(0).text())).to.contain(
      "1 x Student"
    );

    expect(seatGroupBoxes.at(1).text()).to.contain("The Meh Seats");
    expect(fixTextSpacing(seatGroupBoxes.at(1).text())).to.contain(
      "1 x Student"
    );
  });
});
