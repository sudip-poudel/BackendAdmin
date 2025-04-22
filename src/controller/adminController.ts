import {Request, Response} from 'express'
import { DataTypes, QueryTypes } from "sequelize";
const bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
var validator = require('validator');
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../database/connection';
import MulterRequest, { UserRequestInterface } from '../interface/interface';
import { DeleteFile } from '../service/FileDelete';
;

class AdminController{

    // This function handles authentication for admin users.
    async AdminLogin(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
    
        // Validate request body
        if (!email || !password) {
            res.status(400).json({
                message: "Please Provide Email Or Password"
            });
            return;
        }
    
        // Check if the user exists in the database
        const [isUserExists]: any = await sequelize.query(
            `SELECT password, role FROM users WHERE email = ?`,
            {
                type: QueryTypes.SELECT,
                replacements: [email]
            }
        );
    
        // If no user is found, return an error
        if (!isUserExists) {
            res.status(404).json({
                message: "Invalid Credentials"
            });
            return;
        }
    
        // Check if the user has the admin role
        if (isUserExists.role !== 'admin') {
            res.status(400).json({
                message: 'Unauthorized access'
            });
            return;
        }
    
        // Compare the provided password with the hashed password in the database
        const match = await bcrypt.compare(password, isUserExists.password);
        if (!match) {
            res.status(400).json({
                message: 'Invalid Credentials'
            });
            return;
        }
    
        // Fetch additional user details for the response
        const [fetchUserData]: any = await sequelize.query(
            `SELECT * FROM users WHERE email = ?`,
            {
                type: QueryTypes.SELECT,
                replacements: [email]
            }
        );
    
        // Generate a JWT token for authentication
        const jwtToken = jwt.sign({ userId: fetchUserData.id }, process.env.ADMIN_JWT_TOKEN);
    
        // Send the response with the generated token
        res.status(200).json({
            message: jwtToken
        });
    }

    // This function is for fetch logged in admin details
    async FetchAdminDetails(req: UserRequestInterface, res: Response): Promise<void> {
        // Extract the user ID from the request object
        const userId = req.userId;
    
        // Validate if the user ID is provided
        if (!userId) {
            res.status(400).json({
                message: "Please provide user ID"
            });
            return;
        }
    
        // Query the database to fetch user details based on the provided ID
        const [adminDetails] = await sequelize.query(`SELECT * FROM users WHERE id = ?`,{
            type: QueryTypes.SELECT, // Define query type as SELECT
            replacements: [userId], // Replace placeholder with userId
        });
    
        // Check if the user exists
        if (!adminDetails) {
            res.status(404).json({
                message: 'User not found'
            });
            return;
        }
    
        // Return the fetched user details as a response
        res.status(200).json({
            message: adminDetails
        });
    }

    // Update staff details based on the provided staff ID
    async UpdateLoggedInAdminDetails(req: UserRequestInterface, res: Response): Promise<void> {
        try {
            // Extract admin ID from request parameters
            const adminId = req.userId;

            // Extract admin details from request body
            const { name, email, phone, dateOfBirth, gender, address } = req.body;
            const time = new Date(); // Get the current timestamp for updatedAt field

            // Validate if admin ID is provided
            if (!adminId) {
                res.status(400).json({
                    message: "Please provide staff ID", // Return error if admin id is missing
                });
                return;
            }

            // Ensure all required fields are provided
            if (!name || !email || !phone || !dateOfBirth || !gender || !address) {
                res.status(400).json({
                    message: "Please fill all required fields", // Return error if any field is missing
                });
                return;
            }

            const isValidPhone =  validator.isInt(phone) && phone.length === 10; // Validate phone number
            if(!isValidPhone){
                res.status(400).json({
                    message: "Please provide a valid phone number", // Return error if any field is missing
                })
                return;
            }

            // Update admin details in the database
            await sequelize.query(`UPDATE users SET name = ?, email = ?, phoneNumber = ?, DOB = ?, gender = ?, address = ?, updatedAt = ?  WHERE id = ?`,{
                type: QueryTypes.UPDATE, // Define query type as UPDATE
                replacements: [name, email, phone, dateOfBirth, gender, address, time, adminId], // Provide updated values
            });

            // Return success response after updating admin details
            res.status(200).json({
                message: "Admin details updated successfully",
            });

        } catch (error) {
            // Handle any errors that may occur during execution
            res.status(500).json({
                message: "Internal server error while updating staff details",
            });
        }
    }

    // Change Logged In Admin Password 
    async ChangeAdminPassword(req: UserRequestInterface, res: Response): Promise<void> {
        try {
            // Extract admin ID from request parameters
            const adminId = req.userId;

            // Extract admin details from request body
            const { oldPassword, newPassword, cPassword } = req.body;
            const time = new Date(); // Get the current timestamp for updatedAt field

            // Validate if admin ID is provided
            if (!adminId) {
                res.status(400).json({
                    message: "Please provide admin ID", // Return error if admin id is missing
                });
                return;
            }

            // Ensure all required fields are provided
            if (!oldPassword || !newPassword) {
                res.status(400).json({
                    message: "Please fill all required fields", // Return error if any field is missing
                });
                return;
            }

            // Check if the new password and confirm password match
            if (newPassword !== cPassword) {
                res.status(400).json({
                    message: "Passwords do not match", // Return error if passwords do not match
                });
                return;
            }

            // Check if the user exists in the database
            const [isUserExists]: any = await sequelize.query(`SELECT password FROM users WHERE id = ?`,{
                    type: QueryTypes.SELECT,
                    replacements: [adminId]
                }
            );

            // Compare the provided password with the hashed password in the database
            const match = await bcrypt.compare(oldPassword, isUserExists.password);
            if (!match) {
                res.status(400).json({
                    message: 'Invalid Credentials'
                });
                return;
            }

            // Hash the new password before storing it
            const hashPassword = await bcrypt.hashSync(newPassword, 12);

            // Update admin details in the database
            await sequelize.query(`UPDATE users SET password = ?, updatedAt = ?  WHERE id = ?`,{
                type: QueryTypes.UPDATE, // Define query type as UPDATE
                replacements: [hashPassword, time, adminId], // Provide updated values
            });

            // Return success response after updating admin details
            res.status(200).json({
                message: "Admin password updated successfully",
            });

        } catch (error) {
            // Handle any errors that may occur during execution
            res.status(500).json({
                message: "Internal server error while updating staff details",
            });
        }
    }

    

    ///////////    STAFF CONTROLLER     ////////////

    // This function add staff members in the database.
    async RegisterStaff(req: Request, res: Response): Promise<void> {
        // Cast the request to include Multer file properties
        const multerReq = req as unknown as MulterRequest;
        const {name, email, phone, dateOfBirth, gender, address, status, password, branch } = req.body;


        console.log('branch sbdfjsbfdskhfdsbfdsfksd ', branch)

    
        
        // Generate a unique ID for the staff
        const id = uuidv4();
        const time = new Date();
        const role = 'Staff';
    
        // Extract the uploaded staff photo path
        const StaffPhoto = multerReq.file?.path;
        let staffPhotoPath = '';
    
        if (StaffPhoto) {
            // Modify the file path to store the correct URL
            const cutStaffFileURL = StaffPhoto.substring("src/uploads/".length);
            const newStaffFilePath = process.env.HOST_PATH + cutStaffFileURL;
            staffPhotoPath = newStaffFilePath;
    
            // Check if all required fields are provided
            if (!name || !email || !phone || !dateOfBirth || !gender || !address || !status || !password) {
                DeleteFile(staffPhotoPath); // Delete uploaded file if any field is missing
                res.status(200).json({
                    message: 'Please fill all required fields'
                });
                return;
            }

            const isValidPhone =  validator.isInt(phone) && phone.length === 10; // Validate phone number
            if(!isValidPhone){
                res.status(400).json({
                    message: "Please provide a valid phone number", // Return error if any field is missing
                })
                return;
            }
        } else {
            // Return error if no staff photo is uploaded
            res.status(400).json({
                message: "Please upload staff photo"
            });
            return;
        }
    
        // Check if the email already exists in the database
        const [isEmailExist] = await sequelize.query(
            `SELECT email FROM users WHERE email = ?`,
            {
                type: QueryTypes.SELECT,
                replacements: [email]
            }
        );
    
        if (isEmailExist) {
            res.status(400).json({
                message: "Email Already Exists"
            });
            return;
        }
    
        // Check if the phone number already exists in the database
        const [isPhoneExists] = await sequelize.query(`SELECT phoneNumber FROM users WHERE phoneNumber = ?`,{
                type: QueryTypes.SELECT,
                replacements: [phone] 
            }
        );
    
        if (isPhoneExists) {
            res.status(400).json({
                message: "Phone number already exists"
            });
            return;
        }
    
        // Hash the password before storing it
        const hashPassword = await bcrypt.hashSync(password, 12);
    
        // Insert staff details into the database
        await sequelize.query(`INSERT INTO users(id, name, email, password, phoneNumber, profilePicture, DOB, gender, address, role, status, createdAt, updatedAt, branch) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,{
            type: QueryTypes.INSERT,
            replacements: [id, name, email, hashPassword, phone, staffPhotoPath, dateOfBirth, gender, address, role, status, time, time, branch]
        });
    
        // Respond with success message
        res.status(200).json({
            message: "Staff Added Successfully"
        });
    }

    // Fetch Staff List from the database
    async FetchStaffList(req: Request, res: Response): Promise<void> {
        try {
            // Query the database to get all users with the role "Staff"
            const staffList = await sequelize.query(`SELECT * FROM users WHERE role = ?`,{
                    type: QueryTypes.SELECT, // Define query type as SELECT
                    replacements: ['Staff'], // Replace the placeholder with 'Staff'
                }
            );

            // Return the fetched staff list as a response
            res.status(200).json({
                message: staffList, // Sending staff list in response
            });

        } catch (error) {
            // Handle errors and return an appropriate response
            res.status(500).json({
                message: "Internal server error while fetching staff list"
            });
        }
    }

    // Fetch details of a single staff member by their ID
    async FetchSingleStaffDetails(req: Request, res: Response): Promise<void> {
        try {
            // Extract staff ID from request parameters
            const staffId = req.params.id;

            // Validate if staff ID is provided
            if (!staffId) {
                res.status(400).json({
                    message: 'Please provide staff ID', // Return error if ID is missing
                });
                return;
            }

            // Query the database to fetch staff details based on the provided ID
            const [staffDetails] = await sequelize.query(`SELECT * FROM users WHERE id = ?`,{
                type: QueryTypes.SELECT, // Define query type as SELECT
                replacements: [staffId], // Replace placeholder with staffId
            });

            // Check if the staff member exists
            if (!staffDetails) {
                res.status(404).json({
                    message: 'Staff member not found', // Return error if staff not found
                });
                return;
            }

            // Return the fetched staff details as a response
            res.status(200).json({
                message: staffDetails, // Send staff details in response
            });

        } catch (error) {
            // Handle any errors that may occur during execution
            res.status(500).json({
                message: "Internal server error while fetching staff details", 
            });
        }
    }

    // Update staff details based on the provided staff ID
    async UpdateStaffDetails(req: Request, res: Response): Promise<void> {
        try {
            // Extract staff ID from request parameters
            const staffId = req.params.id;

            // Extract staff details from request body
            const { name, email, phone, dateOfBirth, gender, address, status } = req.body;
            const time = new Date(); // Get the current timestamp for updatedAt field

            // Validate if staff ID is provided
            if (!staffId) {
                res.status(400).json({
                    message: "Please provide staff ID", // Return error if staffId is missing
                });
                return;
            }

            // Ensure all required fields are provided
            if (!name || !email || !phone || !dateOfBirth || !gender || !address || !status) {
                res.status(400).json({
                    message: "Please fill all required fields", // Return error if any field is missing
                });
                return;
            }

            const isValidPhone =  validator.isInt(phone) && phone.length === 10; // Validate phone number
            if(!isValidPhone){
                res.status(400).json({
                    message: "Please provide a valid phone number", // Return error if any field is missing
                })
                return;
            }

            // Update staff details in the database
            await sequelize.query(`UPDATE users SET name = ?, email = ?, phoneNumber = ?, DOB = ?, gender = ?, address = ?, status = ?, updatedAt = ?  WHERE id = ?`,{
                type: QueryTypes.UPDATE, // Define query type as UPDATE
                replacements: [name, email, phone, dateOfBirth, gender, address, status, time, staffId], // Provide updated values
            });

            // Return success response after updating staff details
            res.status(200).json({
                message: "Staff details updated successfully",
            });

        } catch (error) {
            // Handle any errors that may occur during execution
            res.status(500).json({
                message: "Internal server error while updating staff details",
            });
        }
    }

    // Delete a staff member by ID
    async DeleteStaff(req: Request, res: Response): Promise<void> {
        try {
            // Extract staff ID from request parameters
            const staffId = req.params.id;

            // Validate if staff ID is provided
            if (!staffId) {
                res.status(400).json({
                    message: "Please provide staff ID", // Return error if staff ID is missing
                });
                return;
            }

            // Fetch the staff's profile picture path before deletion
            const [oldStaffPhotoPath]: any = await sequelize.query(`SELECT profilePicture FROM users WHERE id = ?`, {
                type: QueryTypes.SELECT,
                replacements: [staffId],
            });

            // Check if staff exists before attempting to delete
            if (!oldStaffPhotoPath) {
                res.status(404).json({
                    message: "Staff not found", // Return 404 if no staff found
                });
                return;
            }

            // Delete the staff photo file from the server if it exists
            if (oldStaffPhotoPath.profilePicture) {
                DeleteFile(oldStaffPhotoPath.profilePicture); // Ensure correct field name
            }

            // Delete the staff record from the database
            await sequelize.query(`DELETE FROM users WHERE id = ?`, {
                type: QueryTypes.DELETE,
                replacements: [staffId],
            });

            // Query the database to get all users with the role "Staff"
            const staffList = await sequelize.query(`SELECT * FROM users WHERE role = ?`,{
                type: QueryTypes.SELECT, // Define query type as SELECT
                replacements: ['Staff'], // Replace the placeholder with 'Staff'
            }
        );

            // Return success response after deletion
            res.status(200).json({
                message: "Staff successfully deleted",
                staffList: staffList
            });

        } catch (error) {
            // Handle any errors that occur during execution
            res.status(500).json({
                message: "Internal server error while deleting staff"
            });
        }
    }

                ///////////    Customer CONTROLLER     ////////////
                /////////////////////////////////////////////////
    
    // Fetch Customer List from the database
    async FetchCustomerList(req: Request, res: Response): Promise<void> {
        try {
            // Query the database to get all users with the role "Customer"
            const CustomerList = await sequelize.query(`SELECT * FROM users WHERE role = ?`,{
                    type: QueryTypes.SELECT, // Define query type as SELECT
                    replacements: ['Customer'], // Replace the placeholder with 'Customer'
                }
            );

            // Return the fetched Customer list as a response
            res.status(200).json({
                message: CustomerList, // Sending Customer list in response
            });

        } catch (error) {
            // Handle errors and return an appropriate response
            res.status(500).json({
                message: "Internal server error while fetching staff list"
            });
        }
    }

    // Delete a staff member by ID
    async DeleteCustomerDetails(req: Request, res: Response): Promise<void> {
        try {
            // Extract Customer ID from request parameters
            const CustomerId = req.params.id;

            // Validate if Customer ID is provided
            if (!CustomerId) {
                res.status(400).json({
                    message: "Please provide staff ID", // Return error if Customer ID is missing
                });
                return;
            }

            // Fetch the Customer's profile picture path before deletion
            const [oldCustomerPhotoPath]: any = await sequelize.query(`SELECT profilePicture FROM users WHERE id = ?`, {
                type: QueryTypes.SELECT,
                replacements: [CustomerId],
            });

            // Check if Customer exists before attempting to delete
            if (!oldCustomerPhotoPath) {
                res.status(404).json({
                    message: "Customer not found", // Return 404 if no Customer found
                });
                return;
            }

            // Delete the Customer photo file from the server if it exists
            if (oldCustomerPhotoPath.profilePicture) {
                DeleteFile(oldCustomerPhotoPath.profilePicture); // Ensure correct field name
            }

            // Delete the Customer record from the database
            await sequelize.query(`DELETE FROM users WHERE id = ?`, {
                type: QueryTypes.DELETE,
                replacements: [CustomerId],
            });

            // Query the database to get all users with the role "Customer"
            const CustomerList = await sequelize.query(`SELECT * FROM users WHERE role = ?`,{
                type: QueryTypes.SELECT, // Define query type as SELECT
                replacements: ['Customer'], // Replace the placeholder with 'Customer'
            }
        );

            // Return success response after deletion
            res.status(200).json({
                message: "Customer successfully deleted",
                staffList: CustomerList
            });

        } catch (error) {
            // Handle any errors that occur during execution
            res.status(500).json({
                message: "Internal server error while deleting Customer"
            });
        }
    }
    


                ///////////    BRANCH CONTROLLER     ////////////
                /////////////////////////////////////////////////

    // This function add branch  in the database.
    async RegisterBranch(req: Request, res: Response): Promise<void> {
        const { branchName, email, phone, address, latitude, longitude } = req.body;
    
        // Generate a unique ID for the branch
        const id = uuidv4();
        const time = new Date();
    
        // Check if all required fields are provided
        if (!branchName || !email || !phone || !address || !latitude || !longitude) {
            res.status(400).json({
                message: "Please fill all required fields"
            });
            return;
        }
    
        const isValidPhone =  validator.isInt(phone) && phone.length === 10; // Validate phone number
        if(!isValidPhone){
            res.status(400).json({
                message: "Please provide a valid phone number", // Return error if any field is missing
            })
            return;
        }
    
        // Check if the email already exists in the database
        const [isEmailExist] = await sequelize.query(`SELECT email FROM branches WHERE email = ?`,{
            type: QueryTypes.SELECT,
            replacements: [email]
        });
    
        if (isEmailExist) {
            res.status(400).json({
                message: "Email Already Exists"
            });
            return;
        }
    
        // Check if the phone number already exists in the database
        const [isPhoneExists] = await sequelize.query(`SELECT phone FROM branches WHERE phone = ?`,{
                type: QueryTypes.SELECT,
                replacements: [phone] 
            }
        );
    
        if (isPhoneExists) {
            res.status(400).json({
                message: "Phone number already exists"
            });
            return;
        }
    
        // Insert branch details into the database
        await sequelize.query(`INSERT INTO branches(id, branchName, email, phone, address, latitude, longitude, createdAt, updatedAt) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,{
            type: QueryTypes.INSERT,
            replacements: [id, branchName, email, phone, address, latitude, longitude, time, time]
        });
    
        // Respond with success message
        res.status(200).json({
            message: "Branch Added Successfully"
        });
    }

    // Fetch Branch List from the database
    async FetchBranchList(req: Request, res: Response): Promise<void> {
        try {
            // Query the database to get all branches
            const branchList = await sequelize.query(`SELECT * FROM branches`,{
                    type: QueryTypes.SELECT, // Define query type as SELECT
                }
            );

            // Return the fetched branch list as a response
            res.status(200).json({
                message: branchList, // Sending branch list in response
            });

        } catch (error) {
            // Handle errors and return an appropriate response
            res.status(500).json({
                message: "Internal server error while fetching branch list"
            });
        }
    }

    // Fetch details of a single branch by their ID
    async FetchSingleBranchDetails(req: Request, res: Response): Promise<void> {
        try {
            // Extract branch ID from request parameters
            const branchId = req.params.id;

            // Validate if branch ID is provided
            if (!branchId) {
                res.status(400).json({
                    message: 'Please provide branch ID', // Return error if ID is missing
                });
                return;
            }

            // Query the database to fetch branch details based on the provided ID
            const [branchDetails] = await sequelize.query(`SELECT * FROM branches WHERE id = ?`,{
                type: QueryTypes.SELECT, // Define query type as SELECT
                replacements: [branchId], // Replace placeholder with branchId
            });

            // Check if the branch exists
            if (!branchDetails) {
                res.status(404).json({
                    message: 'Branch not found', // Return error if branch not found
                });
                return;
            }

            // Return the fetched branch details as a response
            res.status(200).json({
                message: branchDetails, // Send branch details in response
            });

        } catch (error) {
            // Handle any errors that may occur during execution
            res.status(500).json({
                message: "Internal server error while fetching branch details", 
            });
        }
    }

    // Update branch details based on the provided branch ID
    async UpdateBranchDetails(req: Request, res: Response): Promise<void> {
        try {
            // Extract branch ID from request parameters
            const branchId = req.params.id;

            // Extract branch details from request body
            const { branchName, email, phone, address, latitude, longitude } = req.body;
            const time = new Date(); // Get the current timestamp for updatedAt field

            // Validate if branch ID is provided
            if (!branchId) {
                res.status(400).json({
                    message: "Please provide branch ID", // Return error if branchId is missing
                });
                return;
            }

            // Ensure all required fields are provided
            if (!branchName || !email || !phone || !address || !latitude || !longitude) {
                res.status(400).json({
                    message: "Please fill all required fields", // Return error if any field is missing
                });
                return;
            }

            const isValidPhone =  validator.isInt(phone) && phone.length === 10; // Validate phone number
            if(!isValidPhone){
                res.status(400).json({
                    message: "Please provide a valid phone number", // Return error if any field is missing
                })
                return;
            }

            // Check branch id exists in the database
            const [isBranchExists]: any = await sequelize.query(`SELECT * FROM branches WHERE id = ?`,{
                type: QueryTypes.SELECT,
                replacements: [branchId]
            });

            // Return error if branch id does not exist
            if (!isBranchExists) {
                res.status(404).json({
                    message: "Branch not found"
                });
                return;
            }

            // Update branch details in the database
            await sequelize.query(`UPDATE branches SET branchName = ?, email = ?, phone = ?, address = ?, latitude = ?, longitude = ?, updatedAt = ?  WHERE id = ?`,{
                type: QueryTypes.UPDATE, // Define query type as UPDATE
                replacements: [branchName, email, phone, address, latitude, longitude, time, branchId], // Provide updated values
            });

            // Return success response after updating branch details
            res.status(200).json({
                message: "Branch details updated successfully",
            });

        } catch (error) {
            // Handle any errors that may occur during execution
            res.status(500).json({
                message: "Internal server error while updating branch details",
            });
        }
    }

    // Delete a branch by ID
    async DeleteBranch(req: Request, res: Response): Promise<void> {
        try {
            // Extract branch ID from request parameters
            const branchId = req.params.id;

            // Validate if branch ID is provided
            if (!branchId) {
                res.status(400).json({
                    message: "Please provide branch ID", // Return error if branch ID is missing
                });
                return;
            }

            // Delete the branch record from the database
            await sequelize.query(`DELETE FROM branches WHERE id = ?`, {
                type: QueryTypes.DELETE,
                replacements: [branchId],
            });

            // Query the database to get all branches
            const branchList = await sequelize.query(`SELECT * FROM branches`,{
                type: QueryTypes.SELECT, // Define query type as SELECT
            });

            // Return success response after deletion
            res.status(200).json({
                message: "Branch successfully deleted",
                branchList: branchList
            });

        } catch (error) {
            // Handle any errors that occur during execution
            res.status(500).json({
                message: "Internal server error while deleting branch"
            });
        }
    }


    ///////////    SERVICE CONTROLLER     ////////////
    /////////////////////////////////////////////////

    // This function add service  in the database.
    async RegisterService(req: Request, res: Response): Promise<void> {
        // Cast the request to include Multer file properties
        const multerReq = req as unknown as MulterRequest;
        const { service_name, description, service_design_type } = req.body;
        
        // Generate a unique ID for the staff
        const id = uuidv4();
        const time = new Date();
        const role = 'Staff';
    
        // Extract the uploaded service photo path
        const servicePhoto = multerReq.file?.path;
        let servicePhotoPath = '';
    
        if (servicePhoto) {
            // Modify the file path to store the correct URL
            const cutServicefFileURL = servicePhoto.substring("src/uploads/".length);
            const newServiceFilePath = process.env.HOST_PATH + cutServicefFileURL;
            servicePhotoPath = newServiceFilePath;
    
            // Check if all required fields are provided
            if (!service_name || !description || !service_design_type) {
                DeleteFile(servicePhotoPath); // Delete uploaded file if any field is missing
                res.status(200).json({
                    message: 'Please fill all required fields'
                });
                return;
            }         
        } else {
            // Return error if no service photo is uploaded
            res.status(400).json({
                message: "Please upload service photo"
            });
            return;
        }
    
        // Check if the service already exists in the database
        const [isServiceExist] = await sequelize.query(`SELECT service_name FROM services WHERE service_name = ?`,{
                type: QueryTypes.SELECT,
                replacements: [service_name]
            }
        );

        if (isServiceExist) {
            res.status(400).json({
                message: "Service Already Exists"
            });
            return;
        }

        // Insert service details into the database
        await sequelize.query(`INSERT INTO services(id, service_name, description, photo, createdAt, updatedAt, service_design_types) VALUES(?, ?, ?, ?, ?, ?, ?)`,{
            type: QueryTypes.INSERT,
            replacements: [id, service_name, description, servicePhotoPath, time, time, service_design_type]
        });


        // Respond with success message
        res.status(200).json({
            message: "Service Added Successfully"
        });
    }

    // Fetch Service List from the database
    async FetchServiceList(req: Request, res: Response): Promise<void> {
        try {
            // Query the database to get all services
            const serviceList = await sequelize.query(`SELECT * FROM services`,{
                    type: QueryTypes.SELECT, // Define query type as SELECT
                }
            );

            // Return the fetched service list as a response
            res.status(200).json({
                message: serviceList, // Sending service list in response
            });

        } catch (error) {
            // Handle errors and return an appropriate response
            res.status(500).json({
                message: "Internal server error while fetching service list"
            });
        }
    }

    // Fetch details of a single service by their ID
    async FetchSingleServiceDetails(req: Request, res: Response): Promise<void> {
        try {
            // Extract service ID from request parameters
            const serviceId = req.params.id;

            // Validate if service ID is provided
            if (!serviceId) {
                res.status(400).json({
                    message: 'Please provide service ID', // Return error if ID is missing
                });
                return;
            }

            // Query the database to fetch service details based on the provided ID
            const [serviceDetails] = await sequelize.query(`SELECT * FROM services WHERE id = ?`,{
                type: QueryTypes.SELECT, // Define query type as SELECT
                replacements: [serviceId], // Replace placeholder with serviceId
            });

            // Check if the service exists
            if (!serviceDetails) {
                res.status(404).json({
                    message: 'Service not found', // Return error if service not found
                });
                return;
            }

            // Return the fetched service details as a response
            res.status(200).json({
                message: serviceDetails, // Send service details in response
            });

        } catch (error) {
            // Handle any errors that may occur during execution
            res.status(500).json({
                message: "Internal server error while fetching service details", 
            });
        }
    }

    // Update service details based on the provided service ID using multer
    async UpdateService(req: Request, res: Response): Promise<void> {
        try {

            // Cast the request to include Multer file properties
            const multerReq = req as unknown as MulterRequest;

            // Generate a unique ID for the staff
            const id = uuidv4();
            const time = new Date();
            const role = 'Staff';

            // Extract service ID from request parameters
            const serviceId = req.params.id;

            // Extract service details from request body
            const { service_name, description } = req.body;

            // Validate if service ID is provided
            if (!serviceId) {
                res.status(400).json({
                    message: "Please provide service ID", // Return error if service ID is missing
                });
                return;
            }

            // Fetch the service's photo path before updating
            const [oldServicePhotoPath]: any = await sequelize.query(`SELECT photo FROM services WHERE id = ?`, {
                type: QueryTypes.SELECT,
                replacements: [serviceId],
            });

            // Extract the uploaded service photo path
            const servicePhoto = multerReq.file?.path;
            let servicePhotoPath = '';
        
            if (servicePhoto) {
                // Modify the file path to store the correct URL
                const cutServicefFileURL = servicePhoto.substring("src/uploads/".length);
                const newServiceFilePath = process.env.HOST_PATH + cutServicefFileURL;
                servicePhotoPath = newServiceFilePath;
        
                // Check if all required fields are provided
                if (!service_name || !description ) {
                    DeleteFile(servicePhotoPath); // Delete uploaded file if any field is missing
                    res.status(200).json({
                        message: 'Please fill all required fields'
                    });
                    return;
                }
            } else {
                // User did not upload a new photo, use the old photo path
                servicePhotoPath = oldServicePhotoPath.photo;
            }

            // Check if all required fields are provided
            if (!service_name  || !description) {
                res.status(400).json({
                    message: 'Please fill all required fields'
                });
                return;
            }

            // Check service name exists in the database where id is not equal to the current id
            const [isServiceExists]: any = await sequelize.query(`SELECT * FROM services WHERE service_name = ? AND id != ?`,{
                type: QueryTypes.SELECT,
                replacements: [service_name, serviceId]
            });

            // Return error if service name already exists
            if (isServiceExists) {
                res.status(400).json({
                    message: "Service name already exists"
                });
                return;
            }

            // Update service details in the database
            await sequelize.query(`UPDATE services SET service_name = ?, description = ?, photo = ?, updatedAt = ?  WHERE id = ?`,{
                type: QueryTypes.UPDATE, // Define query type as UPDATE
                replacements: [service_name, description, servicePhotoPath, time, serviceId], // Provide updated values
            });

            // Return success response after updating service details
            res.status(200).json({
                message: "Service details updated successfully",
            });
        } catch (error) {
            // Handle any errors that may occur during execution
            res.status(500).json({
                message: "Internal server error while updating service details",
            });
       }
    }

    // Delete a service by ID
    async DeleteService(req: Request, res: Response): Promise<void> {
        try {
            // Extract service ID from request parameters
            const serviceId = req.params.id;

            // Validate if service ID is provided
            if (!serviceId) {
                res.status(400).json({
                    message: "Please provide service ID", // Return error if service ID is missing
                });
                return;
            }

            // Fetch the service's photo path before deletion
            const [oldServicePhotoPath]: any = await sequelize.query(`SELECT photo FROM services WHERE id = ?`, {
                type: QueryTypes.SELECT,
                replacements: [serviceId],
            });

            // Check if service exists before attempting to delete
            if (!oldServicePhotoPath) {
                res.status(404).json({
                    message: "Service not found", // Return 404 if no service found
                });
                return;
            }

            // Delete the service photo file from the server if it exists
            if (oldServicePhotoPath.photo) {
                DeleteFile(oldServicePhotoPath.photo); // Ensure correct field name
            }

            // Delete the service record from the database
            await sequelize.query(`DELETE FROM services WHERE id = ?`, {
                type: QueryTypes.DELETE,
                replacements: [serviceId],
            });

            // Query the database to get all services
            const serviceList = await sequelize.query(`SELECT * FROM services`,{
                type: QueryTypes.SELECT, // Define query type as SELECT
            });

            // Return success response after deletion
            res.status(200).json({
                message: "Service successfully deleted",
                serviceList: serviceList
            });

        } catch (error) {
            // Handle any errors that occur during execution
            res.status(500).json({
                message: "Internal server error while deleting service"
            });
        }
    }


    ///////////    APPOINTMENT CONTROLLER     ////////////
    /////////////////////////////////////////////////

    // This function add appointment service in the database
    async RegisterAppoinemtService(req: Request, res: Response): Promise<void> {
        try {
            const {branchId, appointmentId, appointmentStatus} = req.body;
            const time = new Date();
            const id = uuidv4();

            // Check if all required fields are provided
            if (!branchId || !appointmentId || !appointmentStatus) {
                res.status(400).json({
                    message: "Please fill all required fields"
                });
                return;
            }

            // Check if the appointment alredy register for the branch in the database 
            const [isAppointmentExist] = await sequelize.query(`SELECT * FROM appointment_services WHERE branchId = ? AND serviceId = ?`,{
                type: QueryTypes.SELECT,
                replacements: [branchId, appointmentId]
            });

            if (isAppointmentExist) {
                res.status(400).json({
                    message: "Appointment Service Already register for this branch "
                });
                return;
            }


            console.log('herer222')

            // Insert appointment details into the database
            await sequelize.query(`INSERT INTO appointment_services(id, appointmentStatus, createdAt, updatedAt, branchId, serviceId ) VALUES(?, ?, ?, ?, ?, ?)`,{
                type: QueryTypes.INSERT,
                replacements: [id, appointmentStatus, time, time, branchId, appointmentId ]
            });

            // Respond with success message
            res.status(200).json({
                message: "Appointment Service Added Successfully"
            });
        } catch (error) {
            // Handle any errors that may occur during execution
            res.status(500).json({
                message: "Internal server error while adding appointment serviec"
            });
            
        }
       
    }

    // Fetch Appointment Servie List from the database
    async FetchAppointmentServiceList(req: Request, res: Response): Promise<void> {
        try {
            // Query the database to get all appointment services Join query to branches and services
            const appointmentServicesList = await sequelize.query(`SELECT a.id, a.appointmentStatus, b.id AS branchId, b.branchName, b.address, s.id AS serviceId, s.service_name, s.duration , s.price  FROM appointment_services a JOIN services s ON a.serviceId = s.id JOIN branches b ON a.branchId = b.id`,{
                type : QueryTypes.SELECT
            })

            // Return the fetched appointment service list as a response
            res.status(200).json({
                message: appointmentServicesList, // Sending appointment service list in response
            });

        } catch (error) {
            console.error("Error in RegisterAppoinemtService:", error);
            // Handle errors and return an appropriate response
            res.status(500).json({
                message: "Internal server error while fetching appointment service list"
            });
        }
    }

    // Fetch details of a single appointment service by their ID
    async FetchSingleAppointmentServiceDetails(req: Request, res: Response): Promise<void> {
        try {
            // Extract appointment service ID from request parameters
            const appointmentServiceId = req.params.id;

            // Validate if appointment service ID is provided
            if (!appointmentServiceId) {
                res.status(400).json({
                    message: 'Please provide appointment service ID', // Return error if ID is missing
                });
                return;
            }

            // Query the database to fetch appointment service details based on the provided ID
            const [appointmentServiceDetails] = await sequelize.query(`SELECT * FROM appointment_services WHERE id = ?`,{
                type: QueryTypes.SELECT, // Define query type as SELECT
                replacements: [appointmentServiceId], // Replace placeholder with appointmentServiceId
            });

            // Check if the appointment service exists
            if (!appointmentServiceDetails) {
                res.status(404).json({
                    message: 'Appointment service not found', // Return error if appointment service not found
                });
                return;
            }

            // Return the fetched appointment service details as a response
            res.status(200).json({
                message: appointmentServiceDetails, // Send appointment service details in response
            });

        } catch (error) {
            // Handle any errors that may occur during execution
            res.status(500).json({
                message: "Internal server error while fetching appointment service details", 
            });
        }
    }
    
    // Update appointment service details based on the provided appointment service ID
    async UpdateAppointmentServiceDetails(req: Request, res: Response): Promise<void> {
        try {
            // Extract appointment service ID from request parameters
            const appointmentServiceId = req.params.id;

            // Extract appointment service details from request body
            const {branchId, appointmentId,  appointmentStatus } = req.body;
            const time = new Date(); // Get the current timestamp for updatedAt field

            // Validate if appointment service ID is provided
            if (!appointmentServiceId) {
                res.status(400).json({
                    message: "Please provide appointment service ID", // Return error if appointmentServiceId is missing
                });
                return;
            }

            // Ensure all required fields are provided
            if (!branchId || !appointmentId || !appointmentStatus) {
                res.status(400).json({
                    message: "Please fill all required fields", // Return error if any field is missing
                });
                return;
            }

            // Check appointment service id exists in the database
            const [isAppointmentServiceExists]: any = await sequelize.query(`SELECT * FROM appointment_services WHERE id = ?`,{
                type: QueryTypes.SELECT,
                replacements: [appointmentServiceId]
            });

            // Return error if appointment service id does not exist
            if (!isAppointmentServiceExists) {
                res.status(404).json({
                    message: "Appointment service not found"
                });
                return;
            }

            // Update appointment service details in the database
            await sequelize.query(`UPDATE appointment_services SET branchId = ?, serviceId = ?, appointmentStatus = ?, updatedAt = ?  WHERE id = ?`,{
                type: QueryTypes.UPDATE, // Define query type as UPDATE
                replacements: [branchId, appointmentId, appointmentStatus, time, appointmentServiceId], // Provide updated values
            });

            // Return success response after updating appointment service details
            res.status(200).json({
                message: "Appointment service details updated successfully",
            });

           
        } catch (error) {
            // Handle any errors that may occur during execution
            res.status(500).json({
                message: "Internal server error while updating appointment service details",
            });
        }
    }
    

}

export default new AdminController