const CreateError = require("../libs/CreateError");
const validator = require("../libs/validator");
const project_status  = require("../models/project_status.model")
class statusUseCase {
    index = async (request, response) => {
        try {
            const status = await project_status.find({})
           response.success(status)
        } catch (error) {
            const code = error.status || 500; // Asegúrate de tener un código de estado
            const message = error.message || "Error retrieving status"; // Mensaje por defecto
            response.error({ code, message });
        }
     }
     create = async (request, response) => {
        try {
            const mainRules = {
                code: ["required", "string"],
                color: ["required", "string"],
                translations: ["required"]
            };

            const validateMain = validator(mainRules, request.body);
            if (!validateMain.validated) {
                throw new CreateError(400, validateMain.messages);
            }

            // Verificar si ya existe un status con ese código
            const existingStatus = await project_status.findOne({ code: request.body.code });
            if (existingStatus) {
                throw new CreateError(400, "A status with this code already exists");
            }

            const translationsRules = {
                es: ["required", "string"],
                en: ["required", "string"]
            };

            const validateTranslations = validator(translationsRules, request.body.translations);
            if (!validateTranslations.validated) {
                throw new CreateError(400, validateTranslations.messages);
            }

            const { code, color, translations } = request.body;
            const Status = {
                code,
                color,
                translations,
            };
            const add = await project_status.create(Status);
            response.success(add);
        } catch (error) {
            response.error(
                error.status || 500,
                error.messages || error.message || "Failed to create status"
            );
        }
    }
    update = async (request, response) => {
        try {
            const { code } = request.params;
            
            if (!code) {
                throw new CreateError(400, "Code is required");
            }

            // Validamos que el status exista
            const existingStatus = await project_status.findOne({ code });
            if (!existingStatus) {
                throw new CreateError(404, "Status not found");
            }

            // Validamos los campos que vienen en el body
            const mainRules = {
                code: ["string"],
                color: ["string"],
                translations: []
            };

            const validateMain = validator(mainRules, request.body);
            if (!validateMain.validated) {
                throw new CreateError(400, validateMain.messages);
            }

            // Si se intenta actualizar el código, verificar que no exista
            if (request.body.code && request.body.code !== code) {
                const codeExists = await project_status.findOne({ code: request.body.code });
                if (codeExists) {
                    throw new CreateError(400, "A status with this code already exists");
                }
            }

            // Si vienen traducciones, las validamos
            if (request.body.translations) {
                const translationsRules = {
                    es: ["string"],
                    en: ["string"]
                };

                const validateTranslations = validator(translationsRules, request.body.translations);
                if (!validateTranslations.validated) {
                    throw new CreateError(400, validateTranslations.messages);
                }
            }

            const updatedStatus = await project_status.findOneAndUpdate(
                { code },
                request.body,
                { new: true }
            );

            response.success(updatedStatus);
        } catch (error) {
            response.error(
                error.status || 500,
                error.messages || error.message || "Failed to update status"
            );
        }
    }

    delete = async (request, response) => {
        try {
            const { code } = request.params;
            
            if (!code) {
                throw new CreateError(400, "Code is required");
            }

            // Verificamos que el status exista
            const existingStatus = await project_status.findOne({ code });
            if (!existingStatus) {
                throw new CreateError(404, "Status not found");
            }

            await project_status.findOneAndDelete({ code });
            
            response.success({ message: "Status deleted successfully" });
        } catch (error) {
            response.error(
                error.status || 500,
                error.messages || error.message || "Failed to delete status"
            );
        }
    }
    show = async (request, response) => {
        try {
            const { code } = request.params;
            
            if (!code) {
                throw new CreateError(400, "Code is required");
            }

            const status = await project_status.findOne({ code });
            
            if (!status) {
                throw new CreateError(404, "Status not found");
            }

            response.success(status);
        } catch (error) {
            response.error(
                error.status || 500,
                error.messages || error.message || "Error retrieving status"
            );
        }
    }

}

module.exports = new statusUseCase();