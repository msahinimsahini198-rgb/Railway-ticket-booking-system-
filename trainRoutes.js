const router = require("express").Router();
const Train = require("../models/Train");

router.get("/", async (req, res) => {
  const filter = {};
  if (req.query.source) filter.source = new RegExp(req.query.source, "i");
  if (req.query.destination) filter.destination = new RegExp(req.query.destination, "i");
  res.json(await Train.find(filter));
});

router.post("/", async (req, res) => res.status(201).json(await Train.create(req.body)));
router.put("/:id", async (req, res) => res.json(await Train.findByIdAndUpdate(req.params.id, req.body, { new: true })));
router.delete("/:id", async (req, res) => { await Train.findByIdAndDelete(req.params.id); res.json({ message: "Train deleted" }); });

module.exports = router;
