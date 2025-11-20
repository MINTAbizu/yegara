import express from 'express';
import {
    createUser,
    loginUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getCurrentUser,
    googleLogin  // <-- import the new controller function
} from '../../controller/user.controller/user.controller.js';
import { protect } from '../../middleware/authMiddleware.js';




const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);

// ✅ New route for Google login

router.post('/google', googleLogin);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.get('/', protect, getUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);



import User from "../../model/user.model/user.model.js";
import KYC from "../../model/kyc/kyc.model.js";
import Profile from "../../model/UserProfile/UserProfile.js";


router.get("/me", protect, async (req, res) => {
  try {
    const kyc = await KYC.findOne({ user: req.user._id });
    const profile = await Profile.findOne({ user: req.user._id, status: "approved" });

    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      kycSubmitted: !!kyc,
      profileCompleted: !!profile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
