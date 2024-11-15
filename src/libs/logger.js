const fs = require('fs');
const path = require('path');

const logToFile = (message) => {
   // Crear formato de fecha: YYYY-MM-DD HH:mm:ss
   const date = new Date().toISOString().replace('T', ' ');

   // Formar la línea de log
   const logLine = `[${date}] ${message}\n`;

   // Asegurarse de que existe el directorio logs
   const logDir = path.join(__dirname, '../logs');
   if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
   }

   // Escribir al archivo
   fs.appendFileSync(path.join(logDir, 'webhook.log'), logLine);
};

module.exports = { logToFile };