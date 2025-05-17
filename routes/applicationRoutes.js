// import express from "express";
// import {
//   employerGetAllApplications,
//   jobseekerDeleteApplication,
//   jobseekerGetAllApplications,
//   postApplication,
// } from "../controllers/applicationController.js";
// import { isAuthenticated } from "../middlewares/auth.js";

// const router = express.Router();

// router.post("/post", isAuthenticated, postApplication);
// router.get("/employer/getall", isAuthenticated, employerGetAllApplications);
// router.get("/jobseeker/getall", isAuthenticated, jobseekerGetAllApplications);
// router.delete("/delete/:id", isAuthenticated, jobseekerDeleteApplication);

// export default router;

import express from "express";
import {
  employerGetAllApplications,
  jobseekerDeleteApplication,
  jobseekerGetAllApplications,
  postApplication,
  sendAcceptanceEmail
} from "../controllers/applicationController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isAuthenticated, postApplication);
router.get("/employer/getall", isAuthenticated, employerGetAllApplications);
router.get("/jobseeker/getall", isAuthenticated, jobseekerGetAllApplications);
router.delete("/delete/:id", isAuthenticated, jobseekerDeleteApplication);
router.post("/send-acceptance-email", isAuthenticated, sendAcceptanceEmail);

export default router;