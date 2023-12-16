const router = require("express").Router();
let Order = require("../models/order.model");
let Count = require("../models/count.model");
const mongoose = require("mongoose");

//Get all orders
router.route("/").get((req, res) => {
  Order.find()
    .then((orders) => {
      orders.forEach((order) => {
        order.bigBoxes = [];
      });
      console.log(orders);
      res.status(200).json({
        success: true,
        msg: "Orders fetched successfully.",
        length: orders.length,
        data: orders,
      });
    })
    .catch((err) =>
      res.status(400).json({
        success: false,
        msg: "Error fetching the orders: ." + err,
      })
    );
});

//Get order by Id
router.route("/:id").get((req, res) => {
  Order.findById(req.params.id)
    .then((order) => {
      if (order != null) {
        res.status(200).json({
          success: true,
          msg: "Order fetched successfully.",
          data: order,
        });
      } else {
        res.status(400).json({
          success: false,
          msg: "Order not found",
          data: order,
        });
      }
    })
    .catch((err) =>
      res.status(400).json({
        success: false,
        msg: "Error fetching the order: ." + err,
      })
    );
});

//Get Orders by customer name or id
router.route("/customerId/:id").get((req, res) => {
  Order.find({ customerId: req.params.id })
    .then((orders) => {
      orders.forEach((order) => {
        order.bigBoxes = [];
      });
      console.log(orders);
      res.status(200).json({
        success: true,
        msg: "Orders fetched successfully.",
        length: orders.length,
        data: orders,
      });
    })
    .catch((err) =>
      res.status(400).json({
        success: false,
        msg: "Error fetching the order: ." + err,
      })
    );
});
//Get order by barCode
router.route("/barCode/:code").get((req, res) => {
  var code = req.params.code;
  var orderCode = code.substring(0, code.indexOf("-"));

  Order.find({ barCode: orderCode })
    .then((order) => {
      //check if the barcode is present in that order.
      if (order.length != 0) {
        var item = getBarCodeItem(order[0], code);
        if (item != null) {
          res.status(200).json({
            success: true,
            msg: "Order fetched successfully.",
            data: { order: item },
          });
        } else {
          res.status(200).json({
            success: true,
            msg: "Barcode not found.",
            data: { order: [] },
          });
        }
      } else {
        res.status(200).json({
          success: true,
          msg: "Barcode not found.",
          data: { order: [] },
        });
      }
    })
    .catch((err) =>
      res.status(400).json({
        success: false,
        msg: "Error fetching the order: ." + err,
      })
    );
});

function getBarCodeItem(order, code) {
  var item = JSON.parse(JSON.stringify(order));
  for (let i = 0; i < order.bigBoxes.length; i++) {
    let bb = order.bigBoxes[i];
    if (code == bb.barCode) {
      item.bigBoxes = [];
      item.bigBoxes.push(bb);
      return item;
    } else {
      for (let j = 0; j < bb.smallBoxes.length; j++) {
        let sb = bb.smallBoxes[j];

        if (code == sb.barCode) {
          item.bigBoxes = [];
          bb.smallBoxes = [];
          bb.smallBoxes.push(sb);
          item.bigBoxes.push(bb);
          return item;
        } else {
          for (let k = 0; k < sb.products.length; k++) {
            let pd = sb.products[k];
            if (pd.barCodes.includes(code)) {
              item.bigBoxes = [];

              bb.smallBoxes = [];
              sb.products = [];
              sb.products.push(pd);
              bb.smallBoxes.push(sb);
              item.bigBoxes.push(bb);
              return item;
            }
          }
        }
      }
    }
  }

  return [];
}

//Add new Order
router.post("/add", (req, res) => {
  const customerId = req.body.customerId;
  const description = req.body.description;
  const customerName = req.body.customerName;
  const issuedOn = new Date();
  const bigBoxes = req.body.bigBoxes;
  const orderNo = req.body.barCode;
  const poNo = req.body.poNo;

  const newOrder = new Order({
    customerId,
    description,
    customerName,
    issuedOn,
    bigBoxes,
    barCode: orderNo,
    poNo,
  });
  console.log(orderNo);

  generateCodeAndSave(res, newOrder);
});

function generateCodeAndSave(res, newOrder) {
  var barcodes = [];
  let count = 0;
  newOrder.bigBoxes.forEach((bb, bbIndex) => {
    newOrder.totalWeight = newOrder.totalWeight + bb.bbWeight; // abhi
    console.log(bb.bbWeight);
    bb.boxNo = bbIndex + 1;
    barcodes.push(`${newOrder.barCode}-BB${bbIndex + 1}`);
    count++;

    // bb.barCode = newOrder.barCode + "-" + count.toString()
    bb.smallBoxes.forEach((sb, sbIndex) => {
      sb.boxNo = sbIndex + 1;
      barcodes.push(`${newOrder.barCode}-BB${bbIndex + 1}-SB${sbIndex + 1}`);
      count++;
      // sb.barCode = newOrder.barCode + "-" + count.toString()
      // sb.isLinked = true

      sb.products.forEach((pd, pdIndex) => {
        pd.productNo = pdIndex + 1;
        // pd.isLinked = true
        if (pd.noOfPolybags == 1) {
          barcodes.push(
            `${newOrder.barCode}-BB${bbIndex + 1}-SB${sbIndex + 1}-P${
              pdIndex + 1
            }`
          );
          count++;
        } else {
          for (let i = 0; i < pd.noOfPolybags; i++) {
            barcodes.push(
              `${newOrder.barCode}-BB${bbIndex + 1}-SB${sbIndex + 1}-P${
                pdIndex + 1
              }-PB${i + 1}`
            );
            count++;
            // pd.barCodes.push(newOrder.barCode + "-" + count.toString())
          }
        }
      });
    });
  });
  newOrder.barCodeCount = count;
  newOrder.barcodes = barcodes;
  console.log(barcodes);
  newOrder
    .save()
    .then((order) => {
      console.log("Barcodes: ", { length: barcodes.length, barcodes });
      res.status(200).json({
        success: true,
        msg: "Order Added Successfully.",
        data: { order, barcodes, generatedCode: newOrder.barCode },
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        msg: "Cannot add order: " + err,
      });
    });
}

//Remove Order
router.delete("/:orderId", (req, res) => {
  Order.findByIdAndDelete(req.params.orderId)
    .then((order) => {
      if (order) {
        res.status(200).json({
          success: true,
          msg: "Order removed successfully.",
          data: order,
        });
      } else {
        throw "order not found with id: " + req.params.orderId;
      }
    })

    .catch((err) =>
      res.status(400).json({
        success: false,
        msg: "Error removing the Order: " + err,
      })
    );
});

module.exports = router;
