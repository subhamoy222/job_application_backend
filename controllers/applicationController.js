// import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
// import ErrorHandler from "../middlewares/error.js";
// import { Application } from "../models/applicationSchema.js";
// import { Job } from "../models/jobSchema.js";
// import cloudinary from "cloudinary";
// import nodemailer from 'nodemailer';

// export const postApplication = catchAsyncErrors(async (req, res, next) => {
//   const { role } = req.user;
//   if (role === "Employer") {
//     return next(
//       new ErrorHandler("Employer not allowed to access this resource.", 400)
//     );
//   }
//   if (!req.files || Object.keys(req.files).length === 0) {
//     return next(new ErrorHandler("Resume File Required!", 400));
//   }

//   const { resume } = req.files;
//   const allowedFormats = ["image/png", "image/jpeg", "image/webp" ,"application/pdf"];
//   if (!allowedFormats.includes(resume.mimetype)) {
//     return next(
//       new ErrorHandler("Invalid file type. Please upload a PNG file.", 400)
//     );
//   }
//   const cloudinaryResponse = await cloudinary.uploader.upload(
//     resume.tempFilePath
//   );

//   if (!cloudinaryResponse || cloudinaryResponse.error) {
//     console.error(
//       "Cloudinary Error:",
//       cloudinaryResponse.error || "Unknown Cloudinary error"
//     );
//     return next(new ErrorHandler("Failed to upload Resume to Cloudinary", 500));
//   }
//   const { name, email, coverLetter, phone, address, jobId } = req.body;
//   const applicantID = {
//     user: req.user._id,
//     role: "Job Seeker",
//   };
//   if (!jobId) {
//     return next(new ErrorHandler("Job not found!", 404));
//   }
//   const jobDetails = await Job.findById(jobId);
//   if (!jobDetails) {
//     return next(new ErrorHandler("Job not found!", 404));
//   }

//   const employerID = {
//     user: jobDetails.postedBy,
//     role: "Employer",
//   };
//   if (
//     !name ||
//     !email ||
//     !coverLetter ||
//     !phone ||
//     !address ||
//     !applicantID ||
//     !employerID ||
//     !resume
//   ) {
//     return next(new ErrorHandler("Please fill all fields.", 400));
//   }
//   const application = await Application.create({
//     name,
//     email,
//     coverLetter,
//     phone,
//     address,
//     applicantID,
//     employerID,
//     resume: {
//       public_id: cloudinaryResponse.public_id,
//       url: cloudinaryResponse.secure_url,
//     },
//   });
//   res.status(200).json({
//     success: true,
//     message: "Application Submitted!",
//     application,
//   });
// });

// export const employerGetAllApplications = catchAsyncErrors(
//   async (req, res, next) => {
//     const { role } = req.user;
//     if (role === "Job Seeker") {
//       return next(
//         new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
//       );
//     }
//     const { _id } = req.user;
//     const applications = await Application.find({ "employerID.user": _id });
//     res.status(200).json({
//       success: true,
//       applications,
//     });
//   }
// );

// export const jobseekerGetAllApplications = catchAsyncErrors(
//   async (req, res, next) => {
//     const { role } = req.user;
//     if (role === "Employer") {
//       return next(
//         new ErrorHandler("Employer not allowed to access this resource.", 400)
//       );
//     }
//     const { _id } = req.user;
//     const applications = await Application.find({ "applicantID.user": _id });
//     res.status(200).json({
//       success: true,
//       applications,
//     });
//   }
// );
// export const jobseekerDeleteApplication = catchAsyncErrors(
//   async (req, res, next) => {
//     const { role } = req.user;
//     if (role === "Employer") {
//       return next(
//         new ErrorHandler("Employer not allowed to access this resource.", 400)
//       );
//     }

//     const { id } = req.params;
//     const application = await Application.findById(id);
//     if (!application) {
//       return next(new ErrorHandler("Application not found!", 404));
//     }

//     // Retrieve the public ID of the image stored in Cloudinary
//     const imagePublicId = application.imagePublicId;

//     // Delete the image from Cloudinary
//     if (imagePublicId) {
//       await cloudinary.uploader.destroy(imagePublicId);
//     }

//     // Delete the application from the database
//     await application.deleteOne();

//     res.status(200).json({
//       success: true,
//       message: "Application and associated image deleted successfully!",
//     });
//   }
// );


import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import cloudinary from "cloudinary";
import { sendMail } from "../utils/sendMail.js";

export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(
      new ErrorHandler("Employer not allowed to access this resource.", 400)
    );
  }
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Resume File Required!", 400));
  }

  const { resume } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp" ,"application/pdf"];
  if (!allowedFormats.includes(resume.mimetype)) {
    return next(
      new ErrorHandler("Invalid file type. Please upload a PNG file.", 400)
    );
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    resume.tempFilePath
  );

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(new ErrorHandler("Failed to upload Resume to Cloudinary", 500));
  }
  const { name, email, coverLetter, phone, address, jobId } = req.body;
  const applicantID = {
    user: req.user._id,
    role: "Job Seeker",
  };
  if (!jobId) {
    return next(new ErrorHandler("Job not found!", 404));
  }
  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) {
    return next(new ErrorHandler("Job not found!", 404));
  }

  const employerID = {
    user: jobDetails.postedBy,
    role: "Employer",
  };
  if (
    !name ||
    !email ||
    !coverLetter ||
    !phone ||
    !address ||
    !applicantID ||
    !employerID ||
    !resume
  ) {
    return next(new ErrorHandler("Please fill all fields.", 400));
  }
  const application = await Application.create({
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantID,
    employerID,
    resume: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
    status: "pending", // Adding default status
  });
  res.status(200).json({
    success: true,
    message: "Application Submitted!",
    application,
  });
});

export const employerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "employerID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "applicantID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerDeleteApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }

    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return next(new ErrorHandler("Application not found!", 404));
    }

    // Check if the application belongs to the job seeker making the request
    if (application.applicantID.user.toString() !== req.user._id.toString()) {
      return next(
        new ErrorHandler("You are not authorized to delete this application", 403)
      );
    }

    // Retrieve the public ID of the resume stored in Cloudinary
    const resumePublicId = application.resume.public_id;

    // Delete the resume from Cloudinary
    if (resumePublicId) {
      await cloudinary.uploader.destroy(resumePublicId);
    }

    // Delete the application from the database
    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: "Application and associated resume deleted successfully!",
    });
  }
);

// New function to send acceptance email to job seekers
export const sendAcceptanceEmail = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
      );
    }

    const { applicantId, applicantEmail, applicantName, subject, body } = req.body;

    if (!applicantId || !applicantEmail || !subject || !body) {
      return next(
        new ErrorHandler("Please provide all required fields", 400)
      );
    }

    // Find the application to update its status
    const application = await Application.findById(applicantId);
    
    if (!application) {
      return next(new ErrorHandler("Application not found!", 404));
    }

    // Check if the application belongs to the employer making the request
    if (application.employerID.user.toString() !== req.user._id.toString()) {
      return next(
        new ErrorHandler("You are not authorized to accept this application", 403)
      );
    }

    // Import the email sending utility
    const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #4a5568;">Job Application Status Update</h2>
      </div>
      <div style="color: #4a5568; line-height: 1.6;">
        ${body.replace(/\n/g, '<br>')}
      </div>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #718096; font-size: 12px; text-align: center;">
        &copy; ${new Date().getFullYear()} Job Portal. All rights reserved.
      </div>
    </div>
    `;
    
    // Send the email using the provided utility
    try {
      // Use the imported sendMail function
      await sendMail(
        applicantEmail,
        subject,
        body, // Plain text version
        emailHtml // HTML version
      );
      
      console.log(`Acceptance email sent to ${applicantEmail}`);
    } catch (error) {
      console.error("Error sending email:", error);
      return next(new ErrorHandler("Failed to send email. Please try again later.", 500));
    }

    // Update application status
    application.status = 'accepted';
    await application.save();

    res.status(200).json({
      success: true,
      message: `Acceptance email sent to ${applicantName} successfully!`,
    });
  }
);