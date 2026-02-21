import User from "../../model/user.model/user.model.js";

export const generateReferralLink = async (req, res) => {
  const user = await User.findById(req.user._id);

  const url = `https://yourdomain.com/signup?ref=${user.referralCode}`;

  res.json({ url });
};