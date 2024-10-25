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
     CreateStatus = async (request, response) => {
        try {
            // Primero validamos la estructura principal
            const mainRules = {
                code: ["required", "string"],
                color: ["required", "string"],
                translations: ["required"]
            };

            const validateMain = validator(mainRules, request.body);
            if (!validateMain.validated) {
                throw new CreateError(400, validateMain.messages);
            }

            // Luego validamos las traducciones
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
    updateStatus = async (request, response) => {
        try {
            const { id } = request.params;
            
            if (!id) {
                throw new CreateError(400, "ID is required");
            }

            // Validamos que el status exista
            const existingStatus = await project_status.findById(id);
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

            const updatedStatus = await project_status.findByIdAndUpdate(
                id,
                request.body,
                { new: true } // Esto hace que retorne el documento actualizado
            );

            response.success(updatedStatus);
        } catch (error) {
            response.error(
                error.status || 500,
                error.messages || error.message || "Failed to update status"
            );
        }
    };
    deleteStatus = async (request, response) => {
        try {
            const { id } = request.params;
            
            if (!id) {
                throw new CreateError(400, "ID is required");
            }

            // Verificamos que el status exista
            const existingStatus = await project_status.findById(id);
            if (!existingStatus) {
                throw new CreateError(404, "Status not found");
            }

            await project_status.findByIdAndDelete(id);
            
            response.success({ message: "Status deleted successfully" });
        } catch (error) {
            response.error(
                error.status || 500,
                error.messages || error.message || "Failed to delete status"
            );
        }
    };
    getOneStatus = async (request, response) => {
        try {
            const { id } = request.params;
            
            if (!id) {
                throw new CreateError(400, "ID is required");
            }

            const status = await project_status.findById(id);
            
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
    };

}

module.exports = new statusUseCase();