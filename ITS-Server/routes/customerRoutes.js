const router = require('express').Router();
let Customer = require('../models/customer.model');

//Get all customers
router.route('/')
    .get((req, res) => {
        Customer.find()
            .then(customers => res.status(200).json({
                success: true,
                msg: "Customer details fetched successfully.",
                data: customers
            }))
            .catch(err => res.status(400).json({
                success: false,
                msg: "Error fetching the customers: ." + err,
            }))
    })

//Get customers by Id
router.route('/:id').get((req, res) => {
    Customer.findById(req.params.id)
        .then(customer => res.status(200).json({
            success: true,
            msg: "Customer details fetched successfully.",
            data: customer
        }))
        .catch(err => res.status(400).json({
            success: false,
            msg: "Error fetching the order: ." + err,
        }))
})

//Add new Customer
router.post("/add", (req, res) => {
    const customerName = req.body.customerName;
    const description = req.body.description


    const newCustomer = new Customer({
        customerName,
        description
    })

    newCustomer.save().then((customer) => {
        res.status(200).json({
            success: true,
            msg: "Customer Added Successfully.",
            data: customer
        })
    })
        .catch(err => res.status(400).json({
            success: false,
            msg: "Cannot add Customer: " + err
        }))
})


//Remove Customer
router.delete("/:id", (req, res) => {
    Customer.findByIdAndDelete(req.params.id).then(customer => res.status(200).json({
        success: true,
        msg: "Customer removed successfully.",
        data: customer
    }))
        .catch(err => res.status(400).json({
            success: false,
            msg: "Error removing the customer: " + err,
        }))
})

module.exports = router;