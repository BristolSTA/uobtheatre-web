import { mount } from "@vue/test-utils";
import { expect } from "chai";

import { generateMountOptions } from "../../helpers";
import GenericMutationResponse from "../../fixtures/support/GenericMutationResponse";
import GenericApolloResponse from "../../fixtures/support/GenericApolloResponse";
import { swal } from "@/utils";
import ChangeEmail from "@/components/user/ChangeEmail.vue";

describe("Change Email", () => {
  let component;
  beforeEach(() => {
    component = mount(
      ChangeEmail,
      generateMountOptions(["apollo"], {
        apollo: {
          mutationCallstack: [
            GenericApolloResponse(
              "sendSecondaryEmailActivation",
              GenericMutationResponse()
            ),
          ],
        },
      })
    );
  });

  it("can request email change", async () => {
    const stub = jest.spyOn(swal, "fire");
    const inputs = component.findAll("input");
    inputs.at(0).setValue("joe.bloggs@example.org");
    inputs.at(1).setValue("mypassword");
    await component.find("form").trigger("submit");

    await component.vm.$nextTick();
    expect(stub.mock.calls).length(1);
  });
});
