import BaseEnum from "./BaseEnum";

export default class extends BaseEnum {
  nameMap = {
    IN_PROGRESS: "In Progress",
    CANCELLED: "Cancelled",
    PAID: "Paid",
  };
}
