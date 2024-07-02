// src/controllers/brandController.js
const Brand = require("../models/Brand");
const catchAsync = require("../utils/catchAsync");

exports.getAllBrands = catchAsync(async (req, res, next) => {
  const brands = await Brand.find();
  res.json(brands);
});

exports.getBrandById = catchAsync(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) return res.status(404).json({ message: "Brand not found" });
  res.json(brand);
});

exports.createBrand = catchAsync(async (req, res, next) => {
  const brand = new Brand(req.body);
  const newBrand = await brand.save();
  res.status(201).json(newBrand);
});

exports.updateBrand = catchAsync(async (req, res, next) => {
  const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updatedBrand)
    return res.status(404).json({ message: "Brand not found" });
  res.json(updatedBrand);
});

exports.deleteBrand = catchAsync(async (req, res, next) => {
  const deletedBrand = await Brand.findByIdAndDelete(req.params.id);
  if (!deletedBrand)
    return res.status(404).json({ message: "Brand not found" });
  res.json({ message: "Brand deleted" });
});
