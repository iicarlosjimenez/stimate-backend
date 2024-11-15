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

// Get All
async function getAll(user) {
  try {
    const projects = await Project.find({owner_id: user.id});
    return projects;
  } catch (error) {
    console.error("Error fetching posts: ", error);
    throw error;
  }
}

// Get By Slug
async function getBySlug(userId, slug) {
  try {
    const project = await Project.findOne({ slug, owner_id: userId  });
    return project;
  } catch (error) {
    console.error("Error fetching post: ", error);
    throw error;
  }
}

// Delete
async function destroy(userId, slug) {
  try {
    const projectDeleted = await Project.findOneAndDelete({ 
      slug,
      owner_id: userId
     });
    return projectDeleted;
  } catch (error) {
    console.error("Error fetching post: ", error);
    throw error;
  }
}

// Update
async function update(userId, slug, newProject) {
  try {
    const updatedProject = await Project.findOneAndUpdate(
      { slug, owner_id: userId  },
      newProject,
      { new: true }
    );
    return updatedProject;
  } catch (error) {
    console.error("Error fetching post: ", error);
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
