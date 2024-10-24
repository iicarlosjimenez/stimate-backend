const express = require("express");
const utils = require("../libs/utils");
const createError = require("http-errors");
const validator = require("../libs/validator");
const { default: slugify } = require("slugify");
const projectUsecase = require("../usecases/projects.usecase");

const router = express.Router();
const data = require("../example-db-v1.json");

router.get("/", async (request, response) => {
  try {
    const projects = await projectUsecase.getAll();
    response.success({ projects: projects });
  } catch (error) {
    response.error(error.status, error.message);
  }
});

// store
router.post("/", async (request, response) => {
  try {
    const rules = {
      name_project: ["required"],
      areas_selected: ["required"],
    };
    const validate = validator(rules, request.body);

    if (!validate.validated)
      throw createError(400, JSON.stringify(validate.messages));

    const { name_project, areas_selected } = request.body;
    const code = await utils.generateCode({
      length: 6,
      options: ["letters", "caps", "numbers"],
    });
    const slug = `${slugify(`${name_project}`, {
      replacement: "-",
      lower: true,
    })}-${code}`;
    const status_project = "pending";
    const type_project = "normal";
    const team_project = areas_selected.map((area) => {
      return {
        team: area.text,
        hourly_rate: 0,
        work_hours_per_day: 0,
      };
    });
    const project = {
      slug,
      name_project,
      team_project,
      type_project,
      status_project,
    };
    const newProject = await projectUsecase.create(project);
    response.success({ projects: project });
  } catch (error) {
    response.error(error.status, error.message);
  }
});

// show
router.get("/:slug", async (request, response) => {
  try {
    const { slug } = request.params;
    const project = await projectUsecase.getBySlug(slug);
    response.success({ project: project });
  } catch (error) {
    response.error(error.status, error.message);
  }
});

module.exports = router;
