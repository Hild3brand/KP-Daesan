import {
  buildRememberingExercisePrompt,
} from "./buildRememberingExercisePrompt.js";

import {
  buildUnderstandingExercisePrompt,
} from "./buildUnderstandingExercisePrompt.js";

import {
  buildApplyingExercisePrompt,
} from "./buildApplyingExercisePrompt.js";

export const getExercisePromptByStage = ({
  stageName,
  stageCode,
  skillName,
  focusArea,
  materialChunk,
  studentErrorProfile,
  numQuestion,
}) => {

  // ======================================
  // NORMALIZE STAGE
  // ======================================

  const normalizedStage =
    stageCode
      ?.toUpperCase()
      ?.trim();

  // ======================================
  // PREFIX
  // ======================================

  const prefix =
    normalizedStage
      ?.charAt(0);

  // ======================================
  // DEBUG
  // ======================================

  console.log(
    "STAGE:",
    normalizedStage
  );

  console.log(
    "QUESTION COUNT:",
    numQuestion
  );

  // ======================================
  // COMMON PAYLOAD
  // ======================================

  const commonPayload = {
    stageName,
    stageCode:
      normalizedStage,
    skillName,
    focusArea,
    materialChunk,
    studentErrorProfile,
    numQuestion,
  };

  // ======================================
  // STAGE SWITCH
  // ======================================

  switch (prefix) {

    // ======================================
    // REMEMBERING
    // ======================================

    case "R":

      return buildRememberingExercisePrompt(
        commonPayload
      );

    // ======================================
    // UNDERSTANDING
    // ======================================

    case "U":

      return buildUnderstandingExercisePrompt(
        commonPayload
      );

    // ======================================
    // APPLYING
    // ======================================

    case "A":

      return buildApplyingExercisePrompt(
        commonPayload
      );

    // ======================================
    // DEFAULT
    // ======================================

    default:

      return buildRememberingExercisePrompt(
        commonPayload
      );
  }
};