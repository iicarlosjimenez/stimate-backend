const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const privateKey = process.env.JWT_SECRET;
const sendEmail = require("../libs/email");

const registerUser = async (userData) => {
  const { name, email, password, provider } = userData;
  const isProvider = provider != "credentials"

  let user = await User.findOne({ email });

  // Si el usuario ya existe y es login con credenciales, lanzar error
  if (user && !isProvider) {
    throw new Error("El usuario ya existe");
  }

  let hashedPassword = null;
  // Si el usuario ya existe (caso Google), validar suscripción
  if (user && isProvider) {
    const toDay = new Date();
    if (user.end_subscription && user.end_subscription < toDay) {
      user.state_subscription = false;
    } else if (user.end_subscription && user.end_subscription >= toDay) {
      user.state_subscription = true;
    }
    await user.save();
  } 
  // Si el usuario no existe, crear uno nuevo
  else {
    if (!isProvider && password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }
  }

  if (!user) {
    // const token_verification = ... no sé como se tenga que generar un token para correo
    const token_verification = jwt.sign({ email }, privateKey, { expiresIn: "1h" });

    user = new User({
      name,
      email,
      password: hashedPassword,
      token_verification,
      isVerified: false,
      state_subscription: false,
      start_subscription: null,
      end_subscription: null
    });

    // Enviar email de verificación
    const to = user.email;
    const subject = "Stimate - Verificación de correo"
    const html = `<a href="${process.env.NEXT_PUBLIC_END_POINT}/verificacion/${token_verification}">Verificar correo</a>`
    await sendEmail({
        to,
        subject,
        html: html || ""
    });

    await user.save();
  }

  // Generar token JWT
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h"
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
    throw new Error("Usuario no encontrado");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error("Contraseña incorrecta");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const toDay = new Date()

  if (user.end_subscription && user.end_subscription < toDay ) {
    user.state_subscription = false
  } else if (user.end_subscription && user.end_subscription >= toDay ) {
      user.state_subscription = true
  }

  await user.save()

  return {
    id: user.id, 
    name: user.name,
    email: user.email,
    customer_ids: user.customer_ids,
    token,
    state_subscription: user.state_subscription,
  };
};

const getAllUsers = async () => {
  return await User.find();
};

const showUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  
  return user
}

const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("Usuario no encontrado");
  }
  return user;
};

const updateUser = async (userId, updateData) => {
  const {
    name,
    email,
    customer_ids,
    start_subscription,
    end_subscription
  } = updateData.user;

  const updateFields = {
    name,
    email,
    customer_ids,
    start_subscription: start_subscription ? new Date(start_subscription) : undefined,
    end_subscription: end_subscription ? new Date(end_subscription) : undefined
  };

  Object.keys(updateFields).forEach(key =>
    updateFields[key] === undefined && delete updateFields[key]
  );

  const user = await User.findByIdAndUpdate(
    userId, 
    updateFields, 
    { 
      new: true 
    }
  );

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  return user;
};

const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new Error("Usuario no encontrado");
  }
  return { message: "Usuario eliminado exitosamente" };
};

const verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const emailFromToken = decoded.email;

    const user = await User.findOne({ email: emailFromToken });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }


    if (user.email === emailFromToken) {
      user.isVerified = true;
      await user.save(); 

      return { status: "success", message: "Correo verificado exitosamente" };
    } else {
      throw new Error("Token no válido");
    }
  } catch (error) {
    return { status: "error", message: error.message };
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  showUserByEmail,
  getUserById,
  updateUser,
  deleteUser,
  verifyToken
};
