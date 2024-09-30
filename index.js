require('dotenv').config()

const server = require('./src/server')
const PORT = process.env.PORT ?? 8080

server.listen(PORT, () => {
   console.log(`Server is running on port: ${PORT}`);
})
