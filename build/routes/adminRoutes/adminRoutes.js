"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminController_1 = __importDefault(require("../../controller/adminController"));
const authMiddleware_1 = __importDefault(require("../../middleware/authMiddleware"));
const multer_1 = require("../../middleware/multer");
const router = require('express').Router();
// Admin Routes
router.route('/adminLogin').post(adminController_1.default.AdminLogin);
router.get('/adminDetails', authMiddleware_1.default.isAuthenticatedUser, adminController_1.default.FetchAdminDetails);
router.patch('/adminDetails', authMiddleware_1.default.isAuthenticatedUser, adminController_1.default.UpdateLoggedInAdminDetails);
router.patch('/adminPassword', authMiddleware_1.default.isAuthenticatedUser, adminController_1.default.ChangeAdminPassword);
// Staff Routes
router.post('/staff', authMiddleware_1.default.isAuthenticatedUser, multer_1.upload.single('profile'), adminController_1.default.RegisterStaff);
router.get('/staff', authMiddleware_1.default.isAuthenticatedUser, adminController_1.default.FetchStaffList);
router.get('/staff/:id', authMiddleware_1.default.isAuthenticatedUser, adminController_1.default.FetchSingleStaffDetails);
router.patch('/staff/:id', authMiddleware_1.default.isAuthenticatedUser, adminController_1.default.UpdateStaffDetails);
router.delete('/staff/:id', authMiddleware_1.default.isAuthenticatedUser, adminController_1.default.DeleteStaff);
// Customer Routes
router.get('/customer', authMiddleware_1.default.isAuthenticatedUser, adminController_1.default.FetchCustomerList);
router.delete('/customer/:id', authMiddleware_1.default.isAuthenticatedUser, adminController_1.default.DeleteCustomerDetails);
// Branch Routes
router.post('/branch', authMiddleware_1.default.isAuthenticatedUser, adminController_1.default.RegisterBranch);
router.get('/branch', authMiddleware_1.default.isAuthenticatedUser, adminController_1.default.FetchBranchList);
router.get('/branch/:id', authMiddleware_1.default.isAuthenticatedUser, adminController_1.default.FetchSingleBranchDetails);
router.patch('/branch/:id', authMiddleware_1.default.isAuthenticatedUser, adminController_1.default.UpdateBranchDetails);
router.delete('/branch/:id', authMiddleware_1.default.isAuthenticatedUser, adminController_1.default.DeleteBranch);
// Service Routes
router.post('/service', authMiddleware_1.default.isAuthenticatedUser, multer_1.upload.single('photo'), adminController_1.default.RegisterService);
router.get('/service', authMiddleware_1.default.isAuthenticatedUser, adminController_1.default.FetchServiceList);
router.get('/service/:id', authMiddleware_1.default.isAuthenticatedUser, adminController_1.default.FetchSingleServiceDetails);
router.patch('/service/:id', authMiddleware_1.default.isAuthenticatedUser, multer_1.upload.single('photo'), adminController_1.default.UpdateService);
router.delete('/service/:id', authMiddleware_1.default.isAuthenticatedUser, adminController_1.default.DeleteService);
// Appointment Routes
router.post('/appointment-service', authMiddleware_1.default.isAuthenticatedUser, adminController_1.default.RegisterAppoinemtService);
router.get('/appointment-service', authMiddleware_1.default.isAuthenticatedUser, adminController_1.default.FetchAppointmentServiceList);
router.get('/appointment-service/:id', authMiddleware_1.default.isAuthenticatedUser, adminController_1.default.FetchSingleAppointmentServiceDetails);
router.patch('/appointment-service/:id', authMiddleware_1.default.isAuthenticatedUser, adminController_1.default.UpdateAppointmentServiceDetails);
exports.default = router;
