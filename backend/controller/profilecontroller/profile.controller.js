import Profile from "../../model/UserProfile/UserProfile.js";
// import cloudinary from "../../config/cloudinary.js";
// User submits profile


// User submits profile
import Profile from "../../model/UserProfile/UserProfile.js";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload.js";


export const createProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const existingProfile = await Profile.findOne({ user: req.user._id });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "You have already created a profile!",
        profile: existingProfile
      });
    }

    const { about, region, shopLocation, telegram, field } = req.body;

    const profile = new Profile({
      user: req.user._id,
      about,
      region,
      shopLocation,
      telegram,
      field,
    });

    if (req.files?.avatar) {
      const avatarResult = await uploadToCloudinary(req.files.avatar[0].buffer, "yegara/avatar");
      profile.avatar = avatarResult.secure_url; // <-- MUST be secure_url
      profile.avatarPublicId = avatarResult.public_id;
    }

    if (req.files?.backgroundImage) {
      const bgResult = await uploadToCloudinary(req.files.backgroundImage[0].buffer, "yegara/background");
      profile.backgroundImage = bgResult.secure_url; // <-- MUST be secure_url
      profile.backgroundPublicId = bgResult.public_id;
    }

    await profile.save();

    res.status(201).json({
      success: true,
      message: "Profile created successfully!",
      profile
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Public: Get all approved profiles
export const getApprovedProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({ status: "approved" }).populate("user", "name");
    res.status(200).json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update profile status
export const updateProfileStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const profile = await Profile.findById(req.params.id);

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    profile.status = status;
    await profile.save();

    res.status(200).json({ message: "Profile status updated", profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET all profiles
// export const getAllProfiles = async (req, res) => {
//   try {
//     const profiles = await Profile.find().populate("user", "name email");
//     res.status(200).json(profiles);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// };





// Public: Get all approved profiles
// export const getApprovedProfiles = async (req, res) => {
//   try {
//     const profiles = await Profile.find({ status: "approved" }).populate("user", "name");
//     res.status(200).json(profiles);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// profile.controller.js


// Approve or Reject Profile
// export const updateProfileStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body; // "Approved" or "Rejected"

//     if (!["Approved", "Rejected"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status" });
//     }

//     const profile = await Profile.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     ).populate("user", "name email");

//     if (!profile) return res.status(404).json({ message: "Profile not found" });

//     res.status(200).json({ message: `Profile ${status.toLowerCase()} successfully`, profile });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };



// // PATCH /api/profile/:id/status
// export const updateProfileStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const profile = await Profile.findById(req.params.id);

//     if (!profile) return res.status(404).json({ message: "Profile not found" });

//     profile.status = status; // approved or rejected
//     await profile.save();

//     res.status(200).json({ message: "Profile status updated", profile });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// GET all profiles
export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", "name email");
    res.status(200).json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};



import Profile from "../../model/UserProfile/UserProfile.js";

export const ouruser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await Profile.find({ status: "approved" })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await Profile.countDocuments({ status: "approved" });

    res.json({
      users,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (err) {
    console.error("getUsers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
