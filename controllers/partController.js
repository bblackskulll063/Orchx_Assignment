const mongoose = require("mongoose");
const Parts = require('../models/part');
const catchAsync = require('../utils/catchAsync');

// Get all parts
exports.getAllParts = catchAsync(async (req, res) => {
  const parts = await Parts.find().populate('brand warehouse');
  res.json(parts);
});

// Get a single part by ID
exports.getPartById = catchAsync(async (req, res) => {
  const part = await Parts.findById(req.params.id).populate('brand warehouse');
  if (!part) return res.status(404).json({ message: 'Part not found' });
  res.json(part);
});

// Create a new part
exports.createPart = catchAsync(async (req, res) => {
  const { name, brand, warehouse, quantity, price_single, description } = req.body;
  const part = new Parts({
    name,
    brand,
    warehouse,
    quantity,
    price_single,
    description,
  });

  if (req.file) {
    part.image = req.file.path; // Set the image path
  }

  const newPart = await part.save();
  res.status(201).json(newPart);
});

// Update a part by ID
exports.updatePart = catchAsync(async (req, res) => {
  const { name, brand, warehouse, quantity, price_single, description } = req.body;
  const part = await Parts.findById(req.params.id);

  if (!part) return res.status(404).json({ message: 'Part not found' });

  part.name = name || part.name;
  part.brand = brand || part.brand;
  part.warehouse = warehouse || part.warehouse;
  part.quantity = quantity || part.quantity;
  part.price_single = price_single || part.price_single;
  part.description = description || part.description;

  if (req.file) {
    part.image = req.file.path; // Update the image path
  }

  const updatedPart = await part.save();
  res.json(updatedPart);
});

// Delete a part by ID
exports.deletePart = catchAsync(async (req, res) => {
  const deletedPart = await Parts.findByIdAndDelete(req.params.id);
  if (!deletedPart) return res.status(404).json({ message: 'Part not found' });
  res.json({ message: 'Part deleted' });
});
