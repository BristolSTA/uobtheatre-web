import AudienceWarningsStage from "@/pages/production/_slug/book/_performanceId/warnings.vue";
import OverviewStage from "@/pages/production/_slug/book/_performanceId/overview.vue";
import PaymentStage from "@/pages/production/_slug/book/_performanceId/pay.vue";
import TicketSelectionStage from "@/pages/production/_slug/book/_performanceId/tickets.vue";
import PickPerformanceStage from "@/pages/production/_slug/book/index.vue";

const stages = [
  PickPerformanceStage,
  AudienceWarningsStage,
  TicketSelectionStage,
  OverviewStage,
  PaymentStage,
];

/**
 * @param {Object|Class} stageInfo The stage of which to find the index or the vue class
 * @returns {number} The index of the stage, or -1 if not in list
 */
export function getStageIndex(stageInfo) {
  if (!stageInfo) {
    return -1;
  }
  return stages.findIndex((stageComponent) => {
    return stageComponent.stageInfo === (stageInfo.stageInfo ?? stageInfo);
  });
}

/**
 * @param {Class|number} currentStage The current stage (vue component class or index)
 * @param {object} production Production Data Object
 * @param {object|null} booking Booking Data Object
 * @returns {BookingStage|null} Next booking stage
 */
export function getNextStage(currentStage, production, booking) {
  return stages.find((stageComponent, index) => {
    return (
      (!isNaN(currentStage)
        ? index > currentStage
        : index > getStageIndex(currentStage.stageInfo)) &&
      stageComponent.stageInfo.shouldBeUsed(production, booking)
    );
  });
}

/**
 * @param {Class|number} currentStage The current stage (vue component class or index)
 * @param {object} production Production Data Object
 * @param {object|null} booking Booking Data Object
 * @returns {BookingStage|null} Next booking stage
 */
export function getPreviousStage(currentStage, production, booking) {
  const currentStageIndex = isNaN(currentStage)
    ? getStageIndex(currentStage.stageInfo)
    : currentStage;
  const stagesInReverse = stages.slice().reverse();
  return stagesInReverse.find((stageComponent) => {
    return (
      getStageIndex(stageComponent) < currentStageIndex &&
      stageComponent.stageInfo.shouldBeUsed(production, booking) &&
      stageComponent.stageInfo.eligable(production, booking)
    );
  });
}

export default stages;
