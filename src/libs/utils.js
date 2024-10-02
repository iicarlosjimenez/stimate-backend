/**
 * Genera una clave aleatoria con prefijo y sufijo opcionales.
 * @param {Object} options - Opciones para generar la clave.
 * @param {string} [options.prefix=''] - Prefijo para la clave generada.
 * @param {string} [options.sufix=''] - Sufijo para la clave generada.
 * @param {string} options.chars - Caracteres a utilizar para generar la clave.
 * @param {number} options.length - Longitud de la clave a generar.
 * @returns {string} La clave generada.
 */
function keygen({ chars, length, prefix = '', sufix = '' }) {
  return `${prefix}${randChar(chars, length)}${sufix}`;
}

/**
 * Genera una cadena aleatoria de caracteres.
 * @param {string} chars - Caracteres a utilizar para generar la cadena aleatoria.
 * @param {number} [length=16] - Longitud de la cadena a generar. Por defecto es 16.
 * @returns {string} La cadena aleatoria generada.
 */
function randChar(chars, length = 16) {
  const randchars = [];
  const rand = (min = 0, max = 1000) => Math.floor(Math.random() * (max - min) + min);

  for (let i = 0; i < length; i++) {
    randchars.push(chars[rand(0, chars.length)]);
  }

  return randchars.join('');
}

/**
 * Genera un código aleatorio basado en las opciones proporcionadas.
 * @param {Object} data - El objeto que contiene las opciones y la longitud.
 * @param {string[]} data.options - Array de opciones para generar el código ('letters', 'caps', 'numbers', 'especials').
 * @param {number} [data.length=16] - La longitud del código a generar. Por defecto es 16.
 * @param {string} [data.prefix=''] - Prefijo para la clave generada.
 * @param {string} [data.sufix=''] - Sufijo para la clave generada.
 * @returns {Promise<string>} Una promesa que se resuelve con el código generado o una cadena vacía si no se seleccionaron opciones.
 */
async function generateCode({ options, length = 16, prefix = '', sufix = '' }) {
  let chars = "";
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const caps = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "1234567890";
  const especials = "!#$%&*,.:;?";

  options.forEach((option) => {
    if (option == "letters") chars += letters;
    if (option == "caps") chars += caps;
    if (option == "numbers") chars += numbers;
    if (option == "especials") chars += especials;
  });

  if (chars.length < 1) return "";

  return keygen({ prefix, sufix, chars, length: length });
}

module.exports = {
  generateCode
}
