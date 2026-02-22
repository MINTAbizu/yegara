// import User from "../../model/user.model/user.model.js";

// export const generateReferralLink = async (req, res) => {
//   const user = await User.findById(req.user._id);

//   // const url = `https://yourdomain.com/signup?ref=${user.referralCode}`;
//   const url = `myapp://signup?ref=${user.referralCode}`;

//   res.json({ url });
// };



// controllers/referralController.js
import Referral from "../../model/user.model/reward/Referral.js";
import User from "../../model/user.model/user.model.js";
import { nanoid } from "nanoid";

export const generateReferralLink = async (req, res) => {
  try {
    const code = nanoid(8);

    await Referral.create({
      referrer: req.user._id,
      code,
      status: "pending",
    });

    const link = `https://yourapp.com/r/${code}`;
    res.json({ url: link });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate referral link" });
  }
};