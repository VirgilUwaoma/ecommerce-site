require("dotenv").config();
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../utilities/veriyToken");

// UPDATE USER
router.post("/:id", verifyTokenAndAuthorization, async function (req, res) {
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  }
});

// DELETE USER
router.delete(":id", verifyTokenAndAdmin, async function (req, res) {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "User has been deleted" });
  } catch (error) {
    res.status(500).json(err);
  }
});

module.exports = router;
