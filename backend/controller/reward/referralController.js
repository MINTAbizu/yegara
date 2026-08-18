// import User from "../../model/user.model/user.model.js";

// export const generateReferralLink = async (req, res) => {
//   const user = await User.findById(req.user._id);

//   // const url = `https://yourdomain.com/signup?ref=${user.referralCode}`;
//   const url = `myapp://signup?ref=${user.referralCode}`;

//   res.json({ url });
// };



import Referral from "../../model/user.model/reward/Referral.js";
import User from "../../model/user.model/user.model.js";

export const generateReferralLink = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("referralCode");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const code = user.referralCode;
    const clientUrl =
      process.env.CLIENT_URL ||
      req.get("origin") ||
      `${req.protocol}://${req.get("host")}`;
    const url = `${clientUrl.replace(/\/$/, "")}/r/${code}`;

    res.json({ code, url });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate referral link" });
  }
};

export const resolveReferralCode = async (req, res) => {
  try {
    const { code } = req.params;
    const user = await User.findOne({ referralCode: code }).select("_id name referralCode");

    if (!user) {
      return res.status(404).json({ message: "Referral link not found" });
    }

    await Referral.findOneAndUpdate(
      { referrer: user._id, code, milestone: "signup", referred: { $exists: false } },
      {
        $setOnInsert: {
          referrer: user._id,
          code,
          milestone: "signup",
          status: "pending",
        },
      },
      { upsert: true, new: true }
    );

    res.json({
      code: user.referralCode,
      referrerName: user.name,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to resolve referral link" });
  }
};
