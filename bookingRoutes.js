const router = require("express").Router();
const Booking = require("../models/Booking");
const Train = require("../models/Train");

const makePNR = () => String(Math.floor(1000000000 + Math.random() * 9000000000));

router.post("/", async (req, res) => {
  try {
    const { userId, trainId, passengers, journeyDate, classType, totalFare } = req.body;
    const train = await Train.findById(trainId);
    if (!train) return res.status(404).json({ message: "Train not found" });
    if (train.availableSeats < passengers.length) return res.status(400).json({ message: "Not enough seats" });

    train.availableSeats -= passengers.length;
    await train.save();

    const booking = await Booking.create({
      pnr: makePNR(), userId, trainId, passengers, journeyDate, classType, totalFare
    });
    res.status(201).json(await booking.populate("trainId"));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.get("/user/:userId", async (req, res) => {
  res.json(await Booking.find({ userId: req.params.userId }).populate("trainId"));
});

router.patch("/:id/cancel", async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  if (booking.status === "Cancelled") return res.json(booking);
  booking.status = "Cancelled";
  await booking.save();
  await Train.findByIdAndUpdate(booking.trainId, { $inc: { availableSeats: booking.passengers.length } });
  res.json(booking);
});

module.exports = router;
