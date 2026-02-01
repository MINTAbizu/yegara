import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },

    badges: [
  {
    name: { type: String },     // "Verified Seller"
    icon: { type: String },     // "✔️"
    color: { type: String },    // "bg-green-100 text-green-700"
    givenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",              // admin id
    },
    givenAt: {
      type: Date,
      default: Date.now,
    },
  },
],

     role: { type: String, enum: ["seller", "buyer", "pro", "admin"], default: "buyer" },
  // Add this field:
  chapaWallet: { type: String }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
