const express = require("express");

const checkAuth = require ("../middleware/check-auth");
const extractFile = require ("../middleware/importfile");
const scheduleController = require("../controllers/schedule");

const router = express.Router();

// Applying to try to callback image on the request body
router.post( "", checkAuth, extractFile, scheduleController.scheduleCreate);

router.put("/:id",checkAuth, extractFile, scheduleController.scheduleUpdate);

router.get("", scheduleController.fetchingSchedules);

router.get("/:id", scheduleController.scheduleFindId);

router.delete("/:id", checkAuth, scheduleController.deleteSchedule);

module.exports = router;
