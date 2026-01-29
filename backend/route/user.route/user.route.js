// import express from 'express';
// import {
//     createUser,
//     loginUser,
//     getUsers,
//     getUserById,
//     updateUser,
//     deleteUser,
    
//     googleLogin  // <-- import the new controller function
// } from '../../controller/user.controller/user.controller.js';
// import { protect } from '../../middleware/authMiddleware.js';




// const router = express.Router();

// router.post('/register', createUser);
// router.post('/login', loginUser);

// // ✅ New route for Google login

// router.post('/google', googleLogin);

// // Protected routes

// router.get('/', protect, getUsers);
// router.get('/:id', protect, getUserById);
// router.put('/:id', protect, updateUser);
// router.delete('/:id', protect, deleteUser);



// import User from "../../model/user.model/user.model.js";
// import KYC from "../../model/kyc/kyc.model.js";
// import Profile from "../../model/UserProfile/UserProfile.js";


// // router.get("/me", protect, async (req, res) => {
// //   try {
// //     const kyc = await KYC.findOne({ user: req.user._id });
// //     // profileApproved only when status === 'approved'
// //     const profileApproved = await Profile.findOne({ user: req.user._id, status: "approved" });
// //     // profileSubmitted if any profile record exists (pending or approved)
// //     const profileAny = await Profile.findOne({ user: req.user._id });

// //     res.json({
// //       _id: req.user._id,
// //       name: req.user.name,
// //       email: req.user.email,
// //       kycSubmitted: !!kyc,
// //       profileSubmitted: !!profileAny,
// //       profileApproved: !!profileApproved,
// //     });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "Server Error" });
// //   }
// // });
// router.get("/me", protect, async (req, res) => {
//   try {
//     const kyc = await KYC.findOne({ user: req.user._id });
//     const profileApproved = await Profile.findOne({ user: req.user._id, status: "approved" });
//     const profileAny = await Profile.findOne({ user: req.user._id });

//     res.json({
//       _id: req.user._id,
//       name: req.user.name,
//       email: req.user.email,
//       kycSubmitted: !!kyc,
//       profileSubmitted: !!profileAny,
//       profileApproved: !!profileApproved,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// });


// export default router;
import express from "express";
import {
  createUser,
  loginUser,
  googleLogin,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMe,
  ouruser
} from "../../controller/user.controller/user.controller.js";
import { protect, adminOnly } from "../../middleware/authMiddleware.js";
import { assignBadge } from "../../controller/profilecontroller/profile.controller.js";

const router = express.Router();

// Public
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);

// Protected
router.get("/me", protect, getMe);

// Admin (example)
router.get("/", protect, adminOnly, getUsers);
router.get("/ouruser", ouruser);

router.post(
  "/:id/badges",
  protect,
  // adminOnly,
  assignBadge
);


router.get("/:id", protect, adminOnly, getUserById);
router.put("/:id", protect, adminOnly, updateUser);
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;
