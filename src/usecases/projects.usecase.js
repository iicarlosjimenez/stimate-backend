const createError = require("http-errors");
const Project = require("../models/project.model");
const validator = require("../libs/validator");

// Create
async function store(project) {
   // validar datos requeridos y tipo de entrada de datos
   const projects = await Project.find({});

   return projects;
}

// Read
async function index() {
   // Buscar por usuario
   const projects = await Project.find({});

   return projects;
}

// Update
async function update(project) {
   // validar datos requeridos y tipo de entrada de datos
   const projects = await Project.find({});

   return projects;
}

// Delete
async function destroy(project) {
   const projects = await Project.find({});

   return projects;
}
module.exports = {
   store,
   index,
   update,
   destroy
};
