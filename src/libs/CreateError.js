class CreateError extends Error {
   constructor(status, messages) {
      super(Array.isArray(messages) ? messages.join(', ') : messages);
      this.status = status;
      this.messages = messages;
   }
}

module.exports = CreateError;
