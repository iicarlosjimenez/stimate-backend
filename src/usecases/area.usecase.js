const CreateError = require("../libs/CreateError");
const validator = require("../libs/validator");
const areas = require("../models/area.model"); // Cambiado a mayúscula para el modelo

class AreaUseCase {
    index = async (request, response) => {
        try {
            const Area = await areas.find({}); // Cambiado 'area' por 'Area' y nombre de variable
            response.success(Area);
        } catch (error) {
            const code = error.status || 500;
            const message = error.message || "Error retrieving areas";
            response.error(code, message); // Modificado para pasar argumentos separados
        }
    }

    create = async (request, response) => {
        try {
            const mainRules = {
                name: ["required", "string"],
            };

            const validateMain = validator(mainRules, request.body);
            if (!validateMain.validated) {
                throw new CreateError(400, validateMain.messages);
            }

            const existingArea = await areas.findOne({ name: request.body.name });
            if (existingArea) {
                throw new CreateError(400, "An area with this name already exists");
            }

            const { name } = request.body;
            const NewArea = {
                name
            }
            const CreateArea = await areas.create(NewArea);
            response.success(CreateArea);
        } catch (error) {
            response.error(
                error.status || 500,
                error.messages || error.message || "Failed to create area"
            );
        }
    }

    update = async (request, response) => {
        try {
            const { id } = request.params;
            
            if (!id) {
                throw new CreateError(400, "id is required");
            }

            const existingArea = await areas.findById(id);
            if (!existingArea) {
                throw new CreateError(404, "Area not found");
            }

            const mainRules = {
                name: ["string"]
            };

            const validateMain = validator(mainRules, request.body);
            if (!validateMain.validated) {
                throw new CreateError(400, validateMain.messages);
            }

            if (request.body.name) {
                const existingName = await areas.findOne({ 
                    name: request.body.name,
                    _id: { $ne: id }
                });
                if (existingName) {
                    throw new CreateError(400, "An area with this name already exists");
                }
            }

            const updatedArea = await areas.findByIdAndUpdate(
                id,
                request.body,
                { new: true }
            );

            response.success(updatedArea);
        } catch (error) {
            response.error(
                error.status || 500,
                error.messages || error.message || "Failed to update area"
            );
        }
    }

    delete = async (request, response) => {
        try {
            const { id } = request.params;
            
            if (!id) {
                throw new CreateError(400, "id is required");
            }

            const existingArea = await areas.findById(id);
            if (!existingArea) {
                throw new CreateError(404, "Area not found");
            }

            await areas.findByIdAndDelete(id);
            
            response.success({ message: "Area deleted successfully" });
        } catch (error) {
            response.error(
                error.status || 500,
                error.messages || error.message || "Failed to delete area"
            );
        }
    }

    show = async (request, response) => {
        try {
            const { id } = request.params;
            
            if (!id) {
                throw new CreateError(400, "id is required");
            }

            const foundArea = await areas.findById(id);
            
            if (!foundArea) {
                throw new CreateError(404, "Area not found");
            }

            response.success(foundArea);
        } catch (error) {
            response.error(
                error.status || 500,
                error.messages || error.message || "Error retrieving area"
            );
        }
    }
}

module.exports = new AreaUseCase();