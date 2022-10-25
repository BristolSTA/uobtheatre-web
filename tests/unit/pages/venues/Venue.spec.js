import { expect } from "chai";

import FakeVenue from "../../fixtures/Venue";

import {
  fixTextSpacing,
  generateMountOptions,
  mountWithRouterMock,
} from "../../helpers";
import GenericApolloResponse from "../../fixtures/support/GenericApolloResponse";
import Venue from "@/pages/venue/_slug/index.vue";

describe("Venue page", function () {
  let venuePageComponent;
  let address;

  beforeEach(async () => {
    venuePageComponent = await mountWithRouterMock(
      Venue,
      generateMountOptions(["apollo"], {
        apollo: {
          queryCallstack: [GenericApolloResponse("venue", FakeVenue())],
        },
      }),
      {
        params: {
          slug: "anson-theatre",
        },
      }
    );
  });

  it("fetches the venue", async () => {
    await venuePageComponent.vm.$nextTick();
    expect(venuePageComponent.vm.venue.name).to.eq("Anson Theatre");
    expect(venuePageComponent.text()).to.contain("Anson Theatre");
    expect(venuePageComponent.text()).to.contain("not the anson rooms");
    expect(fixTextSpacing(venuePageComponent.text())).to.contain(
      "Capacity: Max 420"
    );

    expect(
      venuePageComponent
        .findComponent({
          ref: "image",
        })
        .attributes("src")
    ).to.equal("http://pathto.example/venue-image.png");

    expect(venuePageComponent.findComponent({ ref: "venue-map" }).exists()).to
      .be.true;
  });

  describe("venue address", () => {
    let addressContainer;
    beforeEach(async () => {
      await venuePageComponent.vm.$nextTick();
      addressContainer = venuePageComponent.findComponent({ ref: "address" });
    });

    // building number and name
    it("has the correct address", () => {
      expect(fixTextSpacing(addressContainer.text())).to.contain(
        "Wills Memorial Building 69 Queens Road"
      );
      expect(addressContainer.text()).to.contain("London");
      expect(addressContainer.text()).to.contain("BS69 420");
    });

    // no building number
    it("has the correct address", async () => {
      await venuePageComponent.setData({
        venue: {
          address: Object.assign({}, address, {
            buildingName: "Wills Memorial Building",
            buildingNumber: null,
          }),
        },
      });
      expect(fixTextSpacing(addressContainer.text())).to.contain(
        "Wills Memorial Building Queens Road"
      );
    });

    // no building name
    it("has the correct address", async () => {
      await venuePageComponent.setData({
        venue: {
          address: Object.assign({}, address, {
            buildingName: null,
            buildingNumber: "69",
          }),
        },
      });
      expect(fixTextSpacing(addressContainer.text())).to.contain(
        "69 Queens Road"
      );
    });

    // no building name or number
    it("has the correct address", async () => {
      await venuePageComponent.setData({
        venue: {
          address: Object.assign({}, address, {
            buildingName: null,
            buildingNumber: null,
          }),
        },
      });
      expect(fixTextSpacing(addressContainer.text())).to.contain("Queens Road");
    });
  });

  it("checks map doesnt exist with invalid lat or long", async () => {
    await venuePageComponent.setData({
      venue: { address: { latitude: null } },
    });

    expect(venuePageComponent.findComponent({ ref: "venue-map" }).exists()).to
      .be.false;
  });

  it("handles invalid venue", async () => {
    const errorFn = jest.fn();
    venuePageComponent = await mountWithRouterMock(
      Venue,
      generateMountOptions(["apollo"], {
        apollo: {
          queryCallstack: [GenericApolloResponse("venue")],
        },
      }),
      {
        error: errorFn,
        params: {
          slug: "anson-theatre-allowed",
        },
      }
    );
    expect(errorFn.mock.calls.length).to.eq(1);
    expect(errorFn.mock.calls[0][0]).to.include({ statusCode: 404 });
  });
});
