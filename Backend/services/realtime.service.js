const { getIO } = require("./socket");

const emitRealtimeEvent = ({ room, event, payload }) => {
  const io = getIO();

  if (!room || !event) {
    throw new Error("Room and event are required to emit a realtime event");
  }

  io.to(room).emit(event, payload);
};

module.exports = { emitRealtimeEvent };
