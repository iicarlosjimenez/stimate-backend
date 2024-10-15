const bcrypt = require('bcryptjs');
const User = require('../models/User.model');

const registerUser = async (userData) => {
  const { name, email, password } = userData;

  // Verificar si el usuario ya existe
  let user = await User.findOne({ email });
  if (user) {
    throw new Error('El usuario ya existe');
  }

  // Hashear la contraseña
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Crear nuevo usuario
  user = new User({
    name,
    email,
    password: hashedPassword,
  });

  await user.save();
  return { message: 'Usuario creado exitosamente' };
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
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
