import CoinTransaction from "../../model/user.model/reward/CoinTransaction.js";

export const getWallet = async (req, res) => {
  const history = await CoinTransaction.find({
    user: req.user._id,
  }).sort({ createdAt: -1 });

  res.json({
    coins: req.user.coins,
    history,
  });
};