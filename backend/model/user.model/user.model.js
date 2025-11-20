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
     role: { type: String, enum: ["seller", "buyer", "admin"], default: "buyer" },
  // Add this field:
  chapaWallet: { type: String }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
