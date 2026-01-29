import Profile from "../../model/UserProfile/UserProfile.js";
import { uploadToCloudinary } from "../../config/cloudinaryUpload.js";

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

    // Upload avatar
    if (req.files?.avatar) {
      const avatarResult = await uploadToCloudinary(req.files.avatar[0].buffer, "yegara/avatar");
      profile.avatar = avatarResult.secure_url;
      profile.avatarPublicId = avatarResult.public_id;
    }

    // Upload background
    if (req.files?.backgroundImage) {
      const bgResult = await uploadToCloudinary(req.files.backgroundImage[0].buffer, "yegara/background");
      profile.backgroundImage = bgResult.secure_url;
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


export const ouruser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const profiles = await Profile.find()
      .populate("user", "_id")
      .skip(skip)
      .limit(limit);

    const totalProfiles = await Profile.countDocuments({ status: "approved" });

    res.json({
      users: profiles,
      totalUsers: totalProfiles,
      currentPage: page,
      totalPages: Math.ceil(totalProfiles / limit),
    });
  } catch (err) {
    console.error("getUsers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


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

export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", "name email");
    res.status(200).json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getApprovedProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({ status: "approved" }).populate("user", "name email");
    res.json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



//create a badge for a user from admin profile page 

// on the user profile page  display user profile if only user change her/s profile 
// don't display user profile  if not  image and background iamge 


// for  all product page  such that  digital and pyshical  and gift page add more futures  favourate   

export const assignBadge = async (req, res) => {
  try {
    const { name, icon, color } = req.body;

    if (!name || !icon) {
      return res.status(400).json({ message: "Badge name and icon required" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // prevent duplicate badge
    const alreadyExists = user.badges?.some(
      (b) => b.name === name
    );

    if (alreadyExists) {
      return res.status(400).json({ message: "Badge already assigned" });
    }

    user.badges.push({
      name,
      icon,
      color: color || "bg-green-100 text-green-700",
      givenBy: req.user._id, // admin
    });

    await user.save();

    res.json({
      message: "Badge assigned successfully",
      badges: user.badges,
    });
  } catch (err) {
    console.error("assignBadge error:", err);
    res.status(500).json({ message: "Server error" });
  }
};




