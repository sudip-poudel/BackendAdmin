import adminController from "../../controller/adminController";
import authMiddleware from "../../middleware/authMiddleware";
import { upload } from "../../middleware/multer";

import express from "express";
const router = express.Router();

// Admin Routes
router.route("/adminLogin").post(adminController.AdminLogin);
router.get(
  "/adminDetails",
  authMiddleware.isAuthenticatedUser,
  adminController.FetchAdminDetails,
);
router.patch(
  "/adminDetails",
  authMiddleware.isAuthenticatedUser,
  adminController.UpdateLoggedInAdminDetails,
);
router.patch(
  "/adminPassword",
  authMiddleware.isAuthenticatedUser,
  adminController.ChangeAdminPassword,
);

// Staff Routes
router.post(
  "/staff",
  authMiddleware.isAuthenticatedUser,
  upload.single("profile"),
  adminController.RegisterStaff,
);
router.get(
  "/staff",
  authMiddleware.isAuthenticatedUser,
  adminController.FetchStaffList,
);
router.get(
  "/staff/:id",
  authMiddleware.isAuthenticatedUser,
  adminController.FetchSingleStaffDetails,
);
router.patch(
  "/staff/:id",
  authMiddleware.isAuthenticatedUser,
  adminController.UpdateStaffDetails,
);
router.delete(
  "/staff/:id",
  authMiddleware.isAuthenticatedUser,
  adminController.DeleteStaff,
);

// Customer Routes
router.get(
  "/customer",
  authMiddleware.isAuthenticatedUser,
  adminController.FetchCustomerList,
);
router.delete(
  "/customer/:id",
  authMiddleware.isAuthenticatedUser,
  adminController.DeleteCustomerDetails,
);

// Branch Routes
router.post(
  "/branch",
  authMiddleware.isAuthenticatedUser,
  adminController.RegisterBranch,
);
router.get(
  "/branch",
  authMiddleware.isAuthenticatedUser,
  adminController.FetchBranchList,
);
router.get(
  "/branch/:id",
  authMiddleware.isAuthenticatedUser,
  adminController.FetchSingleBranchDetails,
);
router.patch(
  "/branch/:id",
  authMiddleware.isAuthenticatedUser,
  adminController.UpdateBranchDetails,
);
router.delete(
  "/branch/:id",
  authMiddleware.isAuthenticatedUser,
  adminController.DeleteBranch,
);

// Service Routes
router.post(
  "/service",
  authMiddleware.isAuthenticatedUser,
  upload.single("photo"),
  adminController.RegisterService,
);
router.get(
  "/service",
  authMiddleware.isAuthenticatedUser,
  adminController.FetchServiceList,
);
router.get(
  "/service/:id",
  authMiddleware.isAuthenticatedUser,
  adminController.FetchSingleServiceDetails,
);
router.patch(
  "/service/:id",
  authMiddleware.isAuthenticatedUser,
  upload.single("photo"),
  adminController.UpdateService,
);
router.delete(
  "/service/:id",
  authMiddleware.isAuthenticatedUser,
  adminController.DeleteService,
);

// Appointment Routes
router.post(
  "/appointment-service",
  authMiddleware.isAuthenticatedUser,
  adminController.RegisterAppoinemtService,
);
router.get(
  "/appointment-service",
  authMiddleware.isAuthenticatedUser,
  adminController.FetchAppointmentServiceList,
);
router.get(
  "/appointment-service/:id",
  authMiddleware.isAuthenticatedUser,
  adminController.FetchSingleAppointmentServiceDetails,
);
router.patch(
  "/appointment-service/:id",
  authMiddleware.isAuthenticatedUser,
  adminController.UpdateAppointmentServiceDetails,
);

// Appointment Routes
router.get(
  "/appointments",
  authMiddleware.isAuthenticatedUser,
  adminController.FetchBookings,
);
router.delete(
  "/appointments/:id",
  authMiddleware.isAuthenticatedUser,
  adminController.DeleteBooking,
);

router.get(
  "/payments",
  authMiddleware.isAuthenticatedUser,
  adminController.FetchPayments,
);

export default router;
