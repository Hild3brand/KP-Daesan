import {
  getAllStages,
} from "../models/stageModel.js";

export const getStages = async (req, res) => {
  try {

    const stages = await getAllStages();

    res.json(stages);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed get stages",
    });
  }
};