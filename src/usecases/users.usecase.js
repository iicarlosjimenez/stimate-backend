const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');

const registerUser = async (userData) => {
  const { name, email, password, provider } = userData;
  const isProvider = provider != 'credentials'

  let user = await User.findOne({ email });
  if (user && !isProvider) {
    throw new Error('El usuario ya existe');
  }

  let hashedPassword = null;
  if (!isProvider && password) {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  }

  if (!user) {
    user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();
  }


  const token = jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h'
    }
  );

  return {
    user,
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

  const isPlanActive = false // TODO: buscar en payment

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return {
    id: user.id, 
    name: user.name,
    email: user.email,
    customer_ids: user.customer_ids,
    token,
    isPlanActive
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
