import { mount } from "@vue/test-utils";
import { expect } from "chai";

import PerformanceSeatGroup from "../../fixtures/PerformanceSeatGroup";
import Ticket from "@/classes/Ticket";
import ConcessionType from "@/components/booking/ConcessionType.vue";

describe("Concession Type", () => {
  let concessionTypeComponent;
  beforeEach(() => {
    concessionTypeComponent = mount(ConcessionType, {
      propsData: {
        concessionTypeEdge: PerformanceSeatGroup().concessionTypes[0],
        maxAddAllowed: 10,
        currentTickets: [new Ticket(1, 1), new Ticket(1, 1), new Ticket(1, 2)], // Assumes that seat_group filtering already done as required
      },
    });
  });

  it("displays name", () => {
    expect(concessionTypeComponent.find("p.font-semibold").text()).to.eq(
      "Adult"
    );
  });

  it("displays description", () => {
    expect(concessionTypeComponent.find("p.text-sm").text()).to.eq(
      "People over 18 years of age"
    );
  });

  it("displays price in pounds to 2 d.p.", () => {
    expect(concessionTypeComponent.text()).to.contain("£10.00");
  });

  it("emits an event on adding a ticket", async () => {
    expect(concessionTypeComponent.emitted()["add-ticket"]).to.be.not.ok;
    await concessionTypeComponent.findAll("button").at(1).trigger("click");
    expect(concessionTypeComponent.emitted()["add-ticket"]).to.be.ok;
  });

  it("disables removing a ticket if current quantity 0", async () => {
    await concessionTypeComponent.setProps({
      currentTickets: [],
    });
    const button = concessionTypeComponent.findAll("button").at(0);
    expect(button.attributes("disabled")).to.eq("disabled");
    await button.trigger("click");
    expect(concessionTypeComponent.emitted()["remove-ticket"]).to.be.not.ok;
  });

  it("emits an event on removing ticket", async () => {
    expect(concessionTypeComponent.emitted()["remove-ticket"]).to.be.not.ok;
    await concessionTypeComponent.findAll("button").at(0).trigger("click");
    expect(concessionTypeComponent.emitted()["remove-ticket"]).to.be.ok;
  });

  it("emits an event on changing quantity", async () => {
    await concessionTypeComponent.find("input").setValue(4);
    expect(concessionTypeComponent.emitted()["set-tickets"][0][0]).to.eq("4");
  });

  it("doesnt emit quantity if NaN", async () => {
    await concessionTypeComponent.find("input").setValue("nAn");
    expect(concessionTypeComponent.emitted()["set-tickets"]).to.not.be.ok;
  });

  it("displays the current quantity of this ticket", async () => {
    const input = concessionTypeComponent.find("input");
    expect(input.element.value).to.eq("2");

    await concessionTypeComponent.setProps({
      currentTickets: [],
    });

    expect(input.element.value).to.eq("0");
  });
  it("disables add ticket button if not allowed", async () => {
    await concessionTypeComponent.setProps({
      maxAddAllowed: 0,
    });

    const button = concessionTypeComponent.findAll("button").at(1); // Add buttton
    expect(button.attributes().disabled).to.be.ok;
    await button.trigger("click");
    expect(concessionTypeComponent.emitted()["add-ticket"]).to.be.not.ok;
  });
  it("wont emit set tickets if value over allowed value", async () => {
    await concessionTypeComponent.setProps({
      maxAddAllowed: 0,
    });
    await concessionTypeComponent.find("input").setValue(4);
    expect(concessionTypeComponent.emitted()["set-tickets"]).not.to.be.ok;

    await concessionTypeComponent.setProps({
      maxAddAllowed: 3,
    });
    await concessionTypeComponent.find("input").setValue(6); // Currently have 2 tickets of this type. 3 more can be added, so by changing to 6, this should fail
    expect(concessionTypeComponent.emitted()["set-tickets"]).not.to.be.ok;
  });
});
