// src/controllers/warehouseController.js
const Warehouse = require("../models/Warehouse");
const catchAsync = require("../utils/catchAsync");

exports.getAllWarehouses = catchAsync(async (req, res, next) => {
  const warehouses = await Warehouse.find();
  res.json(warehouses);
});

exports.getWarehouseById = catchAsync(async (req, res, next) => {
  const warehouse = await Warehouse.findById(req.params.id);
  if (!warehouse)
    return res.status(404).json({ message: "Warehouse not found" });
  res.json(warehouse);
});

exports.createWarehouse = catchAsync(async (req, res, next) => {
  const warehouse = new Warehouse(req.body);
  const newWarehouse = await warehouse.save();
  res.status(201).json(newWarehouse);
});

exports.updateWarehouse = catchAsync(async (req, res, next) => {
  const updatedWarehouse = await Warehouse.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  if (!updatedWarehouse)
    return res.status(404).json({ message: "Warehouse not found" });
  res.json(updatedWarehouse);
});

exports.deleteWarehouse = catchAsync(async (req, res, next) => {
  const deletedWarehouse = await Warehouse.findByIdAndDelete(req.params.id);
  if (!deletedWarehouse)
    return res.status(404).json({ message: "Warehouse not found" });
  res.json({ message: "Warehouse deleted" });
});
