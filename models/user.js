import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: false,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: true,
  },
  role: {
    type: String,
    required: true,
    default: 'user',
    enum: ['admin', 'user'],
  },
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function(password) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

const User = mongoose.model('User', userSchema);

export default User;

