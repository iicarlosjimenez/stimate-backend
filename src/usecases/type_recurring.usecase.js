const CreateError = require("../libs/CreateError");
const validator = require("../libs/validator");
const type_recurring = require("../models/type_recurring.model");
class type_recurringUseCase {
    index = async (request, response) => {
        try {
            const types = await type_recurring.find({})
           response.success(types)
        } catch (error) {
            const code = error.status || 500; // Asegúrate de tener un código de estado
            const message = error.message || "Error retrieving type"; // Mensaje por defecto
            response.error({ code, message });
        }
     }
     create = async (request, response) => {
        try {
            const mainRules = {
                code: ["required", "string"],
                translations: ["required"]
            };

            const validateMain = validator(mainRules, request.body);
            if (!validateMain.validated) {
                throw new CreateError(400, validateMain.messages);
            }

            // Verificar si ya existe un tipo con ese código
            const existingtype = await type_recurring.findOne({ code: request.body.code });
            if (existingtype) {
                throw new CreateError(400, "A type with this code already exists");
            }

            const translationsRules = {
                es: ["required", "string"],
                en: ["required", "string"]
            };

            const validateTranslations = validator(translationsRules, request.body.translations);
            if (!validateTranslations.validated) {
                throw new CreateError(400, validateTranslations.messages);
            }

            const { code, translations } = request.body;
            const recurring = {
                code,
                translations,
            };
            const add = await type_recurring.create(recurring);
            response.success(add);
        } catch (error) {
            response.error(
                error.status || 500,
                error.messages || error.message || "Failed to create type"
            );
        }
    }
    update = async (request, response) => {
        try {
            const { code } = request.params;
            
            if (!code) {
                throw new CreateError(400, "Code is required");
            }

            // Validamos que el tipo exista
            const existingtype = await type_recurring.findOne({ code });
            if (!existingtype) {
                throw new CreateError(404, "type not found");
            }

            // Validamos los campos que vienen en el body
            const mainRules = {
                code: ["string"],
                translations: []
            };

            const validateMain = validator(mainRules, request.body);
            if (!validateMain.validated) {
                throw new CreateError(400, validateMain.messages);
            }

            // Si se intenta actualizar el código, verificar que no exista
            if (request.body.code && request.body.code !== code) {
                const codeExists = await type_recurring.findOne({ code: request.body.code });
                if (codeExists) {
                    throw new CreateError(400, "A type with this code already exists");
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

            const updatedtype = await type_recurring.findOneAndUpdate(
                { code },
                request.body,
                { new: true }
            );

            response.success(updatedtype);
        } catch (error) {
            response.error(
                error.status || 500,
                error.messages || error.message || "Failed to update type"
            );
        }
    }

    delete = async (request, response) => {
        try {
            const { code } = request.params;
            
            if (!code) {
                throw new CreateError(400, "Code is required");
            }

            // Verificamos que el tipo exista
            const existingtype = await type_recurring.findOne({ code });
            if (!existingtype) {
                throw new CreateError(404, "type not found");
            }

            await type_recurring.findOneAndDelete({ code });
            
            response.success({ message: "type deleted successfully" });
        } catch (error) {
            response.error(
                error.status || 500,
                error.messages || error.message || "Failed to delete type"
            );
        }
    }
    show = async (request, response) => {
        try {
            const { code } = request.params;
            
            if (!code) {
                throw new CreateError(400, "Code is required");
            }

            const type = await type_recurring.findOne({ code });
            
            if (!type) {
                throw new CreateError(404, "type not found");
            }

            response.success(type);
        } catch (error) {
            response.error(
                error.status || 500,
                error.messages || error.message || "Error retrieving type"
            );
        }
    }

}

module.exports = new type_recurringUseCase();