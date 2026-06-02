import { getAllRoles } from "../models/roleModel.js";

export const getRoles = async (req, res) => {
  try {

    const roles = await getAllRoles();

    res.json(roles);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed get roles",
    });
  }
};