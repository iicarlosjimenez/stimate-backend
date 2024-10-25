const CreateError = require("../libs/CreateError");
const validator = require("../libs/validator");
const project_status  = require("../models/project_status.model")

const data = require("../example-db-v1.json")
class statusUseCase {
    index = async (request, response) => {
        try {
           response.success({ message: "Project Status" })
        } catch (error) {
           const code = error.status
           const message = error.messages
     
           response.error({ code, message })
        }
     }
     getStatus = async (request, response) => {
        try {
            const status = await project_status.find()
           response.success(status)
        } catch (error) {
           response.error({ code: error.status, message: error.messages });
        }
     }
     CreateStatus = async (request, response) => {
        try {
            const rules= {
                code: ["required"],
                color: ["required"]
            }
            const validate = validator(rules, request.body);
            if (!validate.validated)
                throw createError(400, JSON.stringify(validate.messages));
            const { code,color } = request.body
            const translations = [
                {
                    "es": "Pendiente",
                    "en": "Pending"
                 }
            ]

            const Status = {
                code,
                color,
                translations
            }
            const add = await project_status.create(Status)
            response.send(add)
        } catch (error) {
           response.error({ code: error.status, message: error.messages });
        }
     }
}

module.exports = new statusUseCase();