const router = require('express').Router()
let Order = require('../models/order.model');



router.route("/product")
    .put((req, res) => {
        const orderId = req.body.orderId
        const bigBoxId = req.body.bigBoxId
        const smallBoxId = req.body.smallBoxId
        const productId = req.body.productId
        const scannedBarcodes = req.body.scannedBarcodes

        console.log(req.body);
        Order.findByIdAndUpdate(orderId,
            {
                $set: {
                    "bigBoxes.$[bigBoxFilter].smallBoxes.$[smallBoxFilter].products.$[productFilter].isLinked": true,
                    "bigBoxes.$[bigBoxFilter].smallBoxes.$[smallBoxFilter].products.$[productFilter].barCodes": scannedBarcodes
                },
            },
            {
                "arrayFilters": [
                    {
                        "bigBoxFilter.smallBoxes.products._id": productId
                    },
                    {
                        "smallBoxFilter.products._id": productId
                    },
                    {
                        "productFilter._id": productId
                    }
                ],
                multi: true,
                new: true
            },


        ).then(order => {
            res.status(200).json({
                success: true,
                msg: "Product linked Successfully.",
                data: order
            })
        })

    })

router.route("/smallBox")
    .put((req, res) => {
        const orderId = req.body.orderId
        const bigBoxId = req.body.bigBoxId
        const smallBoxId = req.body.smallBoxId
        const scannedBarcode = req.body.scannedBarcode

        console.log(req.body);
        Order.findByIdAndUpdate(orderId,
            {
                $set: {
                    "bigBoxes.$[bigBoxFilter].smallBoxes.$[smallBoxFilter].isLinked": true,
                    "bigBoxes.$[bigBoxFilter].smallBoxes.$[smallBoxFilter].barCode": scannedBarcode
                },
            },
            {
                "arrayFilters": [
                    {
                        "bigBoxFilter.smallBoxes._id": smallBoxId
                    },
                    {
                        "smallBoxFilter._id": smallBoxId
                    },
                ],
                multi: true,
                new: true
            },


        ).then(order => {
            res.status(200).json({
                success: true,
                msg: "Small Box linked Successfully.",
                data: order
            })
        })

    })

router.route("/bigBox")
    .put((req, res) => {
        const orderId = req.body.orderId
        const bigBoxId = req.body.bigBoxId
        const scannedBarcode = req.body.scannedBarcode

        console.log(req.body);
        Order.findByIdAndUpdate(orderId,
            {
                $set: {
                    "bigBoxes.$[bigBoxFilter].isLinked": true,
                    "bigBoxes.$[bigBoxFilter].barCode": scannedBarcode
                },
            },
            {
                "arrayFilters": [
                    {
                        "bigBoxFilter._id": bigBoxId
                    }
                ],
                multi: true,
                new: true
            },


        ).then(order => {
            var linkedStatus = 0
            for (let bbIndex in order.bigBoxes) {
                if (!order.bigBoxes[bbIndex].isLinked) {
                    linkedStatus = 0
                    break;
                }
                linkedStatus = 1
            }
            if (linkedStatus == 1) {
                Order.findByIdAndUpdate({ _id: orderId }, { linkStatus: 1, completedOn: new Date() }, { new: true }).then(result => {
                    res.status(200).json({
                        success: true,
                        msg: "Big Box linked Successfully.",
                        data: result
                    })
                })
            }
            else {

                res.status(200).json({
                    success: true,
                    msg: "Big Box linked Successfully.",
                    data: order
                })
            }
        })

    })

module.exports = router