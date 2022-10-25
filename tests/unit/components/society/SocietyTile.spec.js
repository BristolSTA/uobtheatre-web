import { mount } from "@vue/test-utils";
import { expect } from "chai";

import { generateMountOptions, RouterLinkStub } from "../../helpers";
import SocietyTile from "@/components/society/SocietyTile.vue";

describe("Society Tile", () => {
  let societyTileComponent;
  beforeAll(() => {
    societyTileComponent = mount(
      SocietyTile,
      generateMountOptions(["router"], {
        propsData: {
          society: {
            name: "Dramsoc",
            slug: "dramsoc",
            logo: {
              url: "example.org/logo.png",
            },
          },
        },
      })
    );
  });

  it("links to society page", () => {
    const link = societyTileComponent.findComponent(RouterLinkStub);
    expect(link.props("to")).to.eq("/society/dramsoc");
  });
  it("has logo", () => {
    expect(societyTileComponent.find("img").attributes("src")).to.eq(
      "example.org/logo.png"
    );
  });
  it("has society name", () => {
    expect(societyTileComponent.text()).to.contain("Dramsoc");
  });
});
