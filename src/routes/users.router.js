const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')
const userUsecase = require('../usecases/users.usecase');

router.post('/register', async (req, res) => {
  try {
    const result = await userUsecase.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userUsecase.loginUser(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await userUsecase.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/verificacion', async (request, response) => {
  try {
     const { token } = request.body;
     const { status, message } = await userUsecase.verifyToken(token);
     response.success({ status, message });
  }
catch (error) {
     response.error(error.status || 500, error.message)
  }
});

router.get('/:id', authMiddleware,  async (req, res) => {
  try {
    const user = await userUsecase.getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.put('/:id', authMiddleware,  async (req, res) => {
  try {
    const user = await userUsecase.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await userUsecase.deleteUser(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;