const express = require('express');
const router = express.Router();
const userUsecase = require('../usecases/user.usercase');

router.post('/register', async (req, res) => {
  try {
    const result = await userUsecase.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/',  async (req, res) => {
  try {
    const users = await userUsecase.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id',  async (req, res) => {
  try {
    const user = await userUsecase.getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.put('/:id',  async (req, res) => {
  try {
    const user = await userUsecase.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id',  async (req, res) => {
  try {
    const result = await userUsecase.deleteUser(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;