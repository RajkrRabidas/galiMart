const express = require("express");

const {getIO} = require("../services/socket");

const router = express.Router();

router.post("/emit", (req, res) => {
   if (req.headers["x-internal-key"] !== process.env.INTERNAL_KEY) {
    return res.status(403).json({
      message: "Forbidden",
    });
  } 

    const { event, paymentData, room } = req.body;

    if(!event || !paymentData || !room){
        return res.status(400).json({
            message: "Missing required fields",
        });
    }

    const io = getIO();
    console.log("Emitting event:", event, "to room:", room);
    io.to(room).emit(event, paymentData);
    res.json({ message: "Event emitted successfully" });
});

module.exports = router;