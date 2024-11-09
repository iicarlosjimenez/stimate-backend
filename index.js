require("dotenv").config()

const server = require("./src/server")
const db = require("./src/libs/db")
const PORT = process.env.PORT ?? 8080

db.connect()
   .then(result => {
      server.listen(PORT, () => {
         console.assert(`Server is running on port: ${PORT}`);
      })
   })
   .catch(error => {
      console.error("DB connection error", error)
   })
