const createError = require("http-errors");
const Project = require("../models/project.model");
const validator = require("../libs/validator");

// Create ??
async function store(project) {
  // validar datos requeridos y tipo de entrada de datos
  const projects = await Project.find({});

  return projects;
}

// Create
async function create(project) {
  if (
    !project.name_project ||
    !project.team_project ||
    project.team_project.length === 0
  ) {
    throw new Error("Faltan campos obligatorios");
  }

  try {
    const newProject = await Project.create(project);
    return newProject;
  } catch (error) {
    console.error("Error al crear proyecto:", error);
    throw new Error("No se pudo crear el proyecto");
  }
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

// Get All
async function getAll() {
  try {
    const projects = await Project.find();
    return projects;
  } catch (error) {
    console.log("Error fetching posts: ", error);
    throw error;
  }
}

// Get By Slug
async function getBySlug(slug) {
  try {
    const project = await Project.findOne({ slug });
    return project;
  } catch (error) {
    console.log("Error fetching post: ", error);
    throw error;
  }
}

// Delete
async function destroy(slug) {
  try {
    const projectDeleted = await Project.findOneAndDelete({ slug });
    return projectDeleted;
  } catch (error) {
    console.log("Error fetching post: ", error);
    throw error;
  }
}

// Update
async function update(slug, newProject) {
  try {
    const updatedProject = await Project.findOneAndUpdate(
      { slug },
      newProject,
      { new: true }
    );
    return updatedProject;
  } catch (error) {
    console.log("Error fetching post: ", error);
    throw error;
  }
}

module.exports = {
  store,
  index,
  update,
  destroy,
  getAll,
  getBySlug,
  create,
};
