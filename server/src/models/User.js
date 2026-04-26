import mongoose from 'mongoose';

const MCGILL_EMAIL = /^[a-zA-Z0-9._%+-]+@(mail\.)?mcgill\.ca$/;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: MCGILL_EMAIL,
    },
    passwordHash: { type: String, required: true },
    displayName: { type: String, required: true, trim: true, minlength: 1, maxlength: 50 },
  },
  { timestamps: true }
);

userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id.toString(),
    email: this.email,
    displayName: this.displayName,
    createdAt: this.createdAt,
  };
};

export const User = mongoose.model('User', userSchema);
