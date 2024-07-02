const mongoose = require("mongoose");
const Order = require("../models/Order");
const Part = require("../models/Part");
const SerialNumber = require("../models/SerialNumber");
const OrderPart = require("../models/OrderParts"); // Assuming you have this model
const catchAsync = require("../utils/catchAsync");

// Function to generate unique serial numbers
const generateSerialNumbers = (quantity, partId) => {
  const serialNumbers = [];
  const prefix = "SN";
  for (let i = 0; i < quantity; i++) {
    serialNumbers.push({
      serialNumber: `${prefix}${Date.now()}${i}`,
      status: "inwarded",
      partId: partId,
    });
  }
  return serialNumbers;
};

exports.createOrder = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const order = new Order({
      type: req.body.type,
      date: req.body.date ?? new Date(),
      totalAmount: req.body.totalAmount,
      totalQuantity: req.body.totalQuantity,
    });
    await order.save({ session });

    for (const item of req.body.parts) {
      const part = await Part.findById(item.part).session(session);

      let serialNumbers = [];
      if (req.body.type === "purchase") {
        // Generate and save serial numbers for the purchase order
        serialNumbers = generateSerialNumbers(item.quantity, part._id);
        part.quantity += item.quantity;
        serialNumbers = await SerialNumber.create(serialNumbers, { session });
      } else if (req.body.type === "sales") {
        // Assign available serial numbers for the sales order
        const availableSerialNumbers = await SerialNumber.find({
          partId: item.part,
          status: "inwarded",
        })
          .limit(item.quantity)
          .session(session);

        if (availableSerialNumbers.length < item.quantity) {
          throw new Error("Not enough inventory");
        }

        const serialNumberIds = availableSerialNumbers.map((sn) => sn._id);
        await SerialNumber.updateMany(
          { _id: { $in: serialNumberIds } },
          { $set: { status: "sold" } },
          { session }
        );

        part.quantity -= item.quantity;
        serialNumbers = serialNumberIds;
      }
      await part.save({ session });

      const orderPart = new OrderPart({
        order: order._id,
        part: item.part,
        quantity: item.quantity,
        amount_single: item.amount_single,
        serialNumbers: serialNumbers.map((sn) => sn.toString()), // Ensure serialNumbers are saved as strings
      });
      await orderPart.save({ session });
    }

    await session.commitTransaction();
    session.endSession();
    res.status(201).send(order);
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    next(e); // Pass the error to the global error handler
  }
});
