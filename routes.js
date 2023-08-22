import express, { request } from "express";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { stationController } from "./controllers/station-controller.js";
import { aboutController } from "./controllers/about-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { userController } from "./controllers/user-controller.js";
import { userStore } from "./models/user-store.js";
import { readingStore } from "./models/reading-store.js";

export const router = express.Router();

router.get("/", accountsController.index);
router.get("/login", accountsController.login);
router.get("/signup", accountsController.signup);
router.get("/logout", accountsController.logout);
router.post("/register", accountsController.register);
router.post("/authenticate", accountsController.authenticate);

router.get("/dashboard", dashboardController.index);
router.post("/dashboard/addstation", dashboardController.addStation);
router.get("/station/:id", stationController.index);
router.post("/station/:id/addreading", stationController.addReading);
router.post("/station/:id/generatereading", stationController.generateReading);
router.get("/about", aboutController.index);

router.get("/user", userController.index);
router.put("/user/:id/edit", async (req, res) => {
  const userId = req.params.id;
  const updatedUserData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  };
  try {
    const updatedUser = await userStore.updateUserInfo(userId, updatedUserData);
    res.json(updatedUser);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.delete("/station/:id/deletestation", dashboardController.deleteStation);
// router.delete("/station/:stationId/deletereading/:readingId", readingStore.getReadingById);

router.delete("/station/:stationid/deletereading/:_id", stationController.deleteReading);

// router.post("/updateToggle", stationController.updateToggle);
