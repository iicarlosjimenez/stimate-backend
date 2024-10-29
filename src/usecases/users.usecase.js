const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');

const registerUser = async (userData) => {
  const { name, email, password, isGoogleAuth } = userData;

  let user = await User.findOne({ email });
  if (user) {
    throw new Error('El usuario ya existe');
  }

  let hashedPassword = null;
  if (!isGoogleAuth && password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
  }
 
  user = new User({
    name: name,
    email,
    password: hashedPassword,
    isGoogleAuth: isGoogleAuth || false
});

    await user.save();

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { 
    message: 'Usuario creado exitosamente.',
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    token 
  };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Contraseña incorrecta');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { 
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    token 
  };
};

const getAllUsers = async () => {
  return await User.find();
};

const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  return user;
};

const updateUser = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  return user;
};

const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  return { message: 'Usuario eliminado exitosamente' };
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
