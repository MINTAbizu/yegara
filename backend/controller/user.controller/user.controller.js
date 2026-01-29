// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import User from '../../model/user.model/user.model.js';
// import { OAuth2Client } from 'google-auth-library';

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// // Create a new user
// export const createUser = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         const existingUser = await User.findOne({ email });
//         if (existingUser) return res.status(400).json({ message: 'User already exists' });

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = new User({ name, email, password: hashedPassword });
//         await user.save();

//         // Generate JWT
//         const token = jwt.sign(
//             { id: user._id, name: user.name, email: user.email },
//             process.env.JWT_SECRET || 'secretkey',
//             { expiresIn: '1d' }
//         );

//         res.status(201).json({
//             message: 'User created',
//             user: { id: user._id, name: user.name, email: user.email },
//             token
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error });
//     }
// };
// export const getCurrentUser = async (req, res) => {
//     try {
//         const user = await User.findById(req.user.id).select("-password");

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         res.status(200).json({
//             id: user._id,
//             name: user.name,
//             email: user.email
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error });
//     }
// };


// // ✅ Google login
// export const googleLogin = async (req, res) => {
//     const { tokenId } = req.body;

//     try {
//         const ticket = await client.verifyIdToken({
//             idToken: tokenId,
//             audience: process.env.GOOGLE_CLIENT_ID
//         });

//         const payload = ticket.getPayload();
//         const { email, name, sub: googleId } = payload;

//         // Check if user exists
//         let user = await User.findOne({ email });

//         if (!user) {
//             // Create new user
//             user = new User({
//                 name,
//                 email,
//                 password: googleId // optional: can hash
//             });
//             await user.save();
//         }

//         // Generate JWT
//         const token = jwt.sign(
//             { id: user._id, name: user.name, email: user.email },
//             process.env.JWT_SECRET || 'secretkey',
//             { expiresIn: '1d' }
//         );

//         res.status(200).json({
//             message: 'Google login successful',
//             user: { id: user._id, name: user.name, email: user.email },
//             token
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Google login failed', error });
//     }
// };
// // Login user
// export const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });
//         if (!user) return res.status(404).json({ message: 'User not found' });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//         const token = jwt.sign(
//             { id: user._id, name: user.name, email: user.email },
//             process.env.JWT_SECRET || 'secretkey',
//             { expiresIn: '1d' }
//         );

//         res.status(200).json({
//             message: 'Login successful',
//             user: { id: user._id, name: user.name, email: user.email },
//             token
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error });
//     }
// };

// // Get all users
// export const getUsers = async (req, res) => {
//     try {
//         const users = await User.find().select('-password');
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error });
//     }
// };

// // Get single user
// export const getUserById = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id).select('-password');
//         if (!user) return res.status(404).json({ message: 'User not found' });
//         res.status(200).json(user);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error });
//     }
// };

// // Update user
// export const updateUser = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;
//         const updateData = { name, email };

//         if (password) {
//             updateData.password = await bcrypt.hash(password, 10);
//         }

//         const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
//         if (!user) return res.status(404).json({ message: 'User not found' });

//         res.status(200).json({ message: 'User updated', user });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error });
//     }
// };

// // Delete user
// export const deleteUser = async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id);
//         if (!user) return res.status(404).json({ message: 'User not found' });

//         res.status(200).json({ message: 'User deleted' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error });
//     }
// };
// // 

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../model/user.model/user.model.js";
import KYC from "../../model/kyc/kyc.model.js";
import Profile from "../../model/UserProfile/UserProfile.js";
import { OAuth2Client } from "google-auth-library";

const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "1d";
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const strongPasswordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * Helper: generate JWT
 */
const genToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
};

/**
 * Create user (register)
 */
const ADMIN_EMAILS = ["admin@yegna.com", "super@yegna.com"];

export const createUser = async (req, res) => {
  try {
    const { name, email, password, secret } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email and password required" });

    // Strong password validation
    const strongPasswordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Weak password! Must include uppercase, lowercase, number, special char & 8+ length",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    // Assign role (admin only with secret key)
    let role = "buyer";
    if (secret && secret === process.env.ADMIN_SECRET_KEY) {
      role = "admin";
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role });
    await user.save();

    const token = genToken(user);
    res.status(201).json({
      message: role === "admin" ? "Admin registered" : "User registered",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error("createUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * Login user
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const strongPasswordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Weak password! Must include uppercase, lowercase, number, special char & 8+ length",
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = genToken(user);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,       // <<< FIX HERE
      },
      token,
    });

  } catch (err) {
    console.error("loginUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};





/**
 * Google login (id token from client)
 */
export const googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body;
    if (!tokenId) return res.status(400).json({ message: "tokenId required" });

    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;
    const googleId = payload.sub;

    let user = await User.findOne({ email });
    if (!user) {
      // create a user with a random password (or googleId hashed)
      user = new User({ name, email, password: googleId });
      await user.save();
    }

    const token = genToken(user);
    res.status(200).json({
      message: "Google login successful",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error("googleLogin error:", err);
    res.status(500).json({ message: "Google login failed", error: err.message });
  }
};

/**
 * Get current authenticated user (me)
 * Returns basic user data + flags about KYC/profile existence
 */
export const getMe = async (req, res) => {
  try {
    // protect middleware sets req.user to the user document
    const userDoc = req.user;
    if (!userDoc) return res.status(401).json({ message: "Not authenticated" });

    const kyc = await KYC.findOne({ user: userDoc._id });
    const profileApproved = await Profile.findOne({ user: userDoc._id, status: "approved" });
    const profileAny = await Profile.findOne({ user: userDoc._id });

    return res.json({
      _id: userDoc._id,
      name: userDoc.name,
      email: userDoc.email,
      badges: userDoc.badges || [],
      role: userDoc.role || "user",
      kycSubmitted: Boolean(kyc),
      profileSubmitted: Boolean(profileAny),
      profileApproved: Boolean(profileApproved),
    });
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Admin controllers (simple CRUD)
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("getUsers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const ouruser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments();

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















export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("getUserById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



export const updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const update = { name, email };
    if (password) update.password = await bcrypt.hash(password, 10);
    if (role) update.role = role;

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated", user });
  } catch (err) {
    console.error("updateUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("deleteUser error:", err);
    
    res.status(500).json({ message: "Server error" });
  }
};


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


// DELETE /api/users/:id/badges
export const removeBadge = async (req, res) => {
  try {
    const { badgeName } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.badges = user.badges.filter((b) => b.name !== badgeName);
    await user.save();

    res.json({ message: "Badge removed", badges: user.badges });
  } catch (err) {
    console.error("removeBadge error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
