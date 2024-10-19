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
    const team_project = areas_selected.map((area) => {
      return {
        team: area,
        hourly_rate: 0,
        work_hours_per_day: 0,
      };
    });
    const operating_expenses = [
      {
        cost_name: "Renta",
        total_per_month: 120,
      },
      {
        cost_name: "Luz",
        total_per_month: 163,
      },
      {
        cost_name: "Agua",
        total_per_month: 400,
      },
      {
        cost_name: "Internet",
        total_per_month: 630,
      },
      {
        cost_name: "Mobiliario (computadora, impresora, etc.)",
        total_per_month: 710,
      },
      {
        cost_name: "Jira",
        total_per_month: 815,
      },
    ];
    const associated_costs = [
      {
        cost_name: "Logotipo",
        price_unity: 700,
        quantity: 1,
        type_recurring: "nrc",
        description: "",
      },
      {
        cost_name: "Dominio",
        price_unity: 800,
        quantity: 1,
        type_recurring: "arc",
        description: "cuponera.store",
      },
      {
        cost_name: "Hosting",
        price_unity: 100,
        quantity: 12,
        type_recurring: "mrc",
        description:
          "Almacenamiento de la página web y Seguridad SSL. 100 GB de Almacenamiento",
      },
      {
        cost_name: "Licencia Software/Librería",
        price_unity: 0,
        quantity: 0,
        type_recurring: "nrc",
        description:
          "En nugget algunas licencias son de paga. Como por ejemplo ConvertAPI",
      },
      {
        cost_name: "Equipo de cómputo/celular/tablet",
        price_unity: 0,
        quantity: 0,
        type_recurring: "nrc",
        description:
          "En algunos lugares en necesario compra de equipo de computo para el funcionamiento del sistema. pearPod E-321, 512GB SSD, 16GB de RAM, Procesador Potnt",
      },
    ];
    const sale_comission = 0.1;
    const profit = 0.15;
    const tax = 0.16;
    const notes =
      "<ul><li>El costo ya incluye el IVA.</li><li>El hosting solo almacena la página web.</li><li>Es costo no incluye almacenamiento de documentos ni bases de datos.</li><li>El dominio se debe de <strong>renovar</strong> al terminar el año (el precio puede variar al culminar el año).</li><li>Se requiere de un 50% de <strong>anticipado</strong>. El otro 50% al entregar la página en producción.</li><li>El <strong>tiempo de entrega</strong> es de 2 meses a partir de la fecha de pago del anticipo (favor de notificar al <strong>EMISOR</strong> en caso de requerir factura).</li><li>El costo no incluye cambios en el logotipo ni de la página web.</li><li>Se contemplan las siguientes secciones a desarrollar: <strong>Menú principal, Hero, Catálogo, Proyectos, Beneficios, Contacto, Pie de página</strong>.</li><li>La función de Contacto será por WhatsApp (no automatizado) o por Correo (pendiente a la solicitud del cliente).</li><li>No incluye <strong>branding page</strong>, <strong>identidad completa de la empresa</strong> (colores, tipografía, uso de marca, etc.), <strong>difusión de redes sociales</strong>, ni <strong>mantenimiento del software</strong>.</li></ul><p><strong>Datos de depósito:</strong></p><ul><li><strong>Nombre del titular:</strong> Juan Perez</li><li><strong>CLABE Interbancaria:</strong> 012345678901234567</li><li><strong>Banco:</strong> Grandote</li></ul>";

    const project = {
      slug,
      name_project,
      status_project,
      team_project,
      operating_expenses,
      associated_costs,
      sale_comission,
      profit,
      tax,
      notes,
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
