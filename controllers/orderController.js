const mongoose = require("mongoose");
const Order = require("../models/order");
const Part = require("../models/part");

const catchAsync = require("../utils/catchAsync");

// Function to generate unique serial numbers
const generateSerialNumbers = (quantity, prefix = "SN") => {
  const serialNumbers = [];
  for (let i = 0; i < quantity; i++) {
    serialNumbers.push({
      serialNumber: `${prefix}${Date.now()}${i}`,
      status: "inwarded",
    });
  }
  return serialNumbers;
};

exports.createOrder = catchAsync(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const order = new Order({
      type: req.body.type,
      date: req.body.date,
      totalAmount: req.body.totalAmount,
      totalQuantity: req.body.totalQuantity,
    });
    await order.save({ session });
    
    for (const item of req.body.parts) {
      const part = await Part.findById(item.part).session(session);
      
      let serialNumbers = [];
      if (req.body.type === "purchase") {
        // Generate and save serial numbers for the purchase order
        serialNumbers = generateSerialNumbers(item.quantity);
        part.quantity += item.quantity;
        part.serialNumbers.push(...serialNumbers);
      } else if (req.body.type === "sales") {
        // Assign available serial numbers for the sales order
        const availableSerialNumbers = part.serialNumbers
        .filter((sn) => sn.status === "inwarded")
        .slice(0, item.quantity);
        if (availableSerialNumbers.length < item.quantity) {
          throw new Error("Not enough inventory");
        }
        serialNumbers = availableSerialNumbers.map((sn) => sn.serialNumber);
        for (const sn of availableSerialNumbers) {
          sn.status = "sold";
        }
        part.quantity -= item.quantity;
      }

      await part.save({ session });
      
      const orderPart = new OrderPart({
        order: order._id,
        part: item.part,
        quantity: item.quantity,
        amount_single: item.amount_single,
        serialNumbers: serialNumbers.map((sn) => sn.serialNumber),
      });
      await orderPart.save({ session });
      // res.json("hello")
    }

    await session.commitTransaction();
    session.endSession();
    res.status(201).send(order);
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).send(e);
  }
});
