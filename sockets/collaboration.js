
const setupCollaborationSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Join a presentation room
    socket.on("join_presentation", (presentationId) => {
      socket.join(presentationId);
      console.log(`User joined presentation ${presentationId}`);
    });

    // Broadcast slide changes
    socket.on("edit_slide", (data) => {
      const { presentationId, slideId, content } = data;
      socket.to(presentationId).emit("slide_updated", { slideId, content });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = setupCollaborationSocket;
