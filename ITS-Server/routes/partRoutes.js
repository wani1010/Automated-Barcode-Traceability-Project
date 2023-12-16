const router = require('express').Router();
let Part = require('../models/part.model');

//Get all parts
router.route('/')
    .get((req, res) => {
        Part.find()
            .then(parts => res.status(200).json({
                success: true,
                msg: "Part details fetched successfully.",
                data: parts
            }))
            .catch(err => res.status(400).json({
                success: false,
                msg: "Error fetching the parts: ." + err,
            }))
    })

//Get parts by Id
router.route('/:id').get((req, res) => {
    Part.findById(req.params.id)
        .then(part => res.status(200).json({
            success: true,
            msg: "Part details fetched successfully.",
            data: part
        }))
        .catch(err => res.status(400).json({
            success: false,
            msg: "Error fetching the order: ." + err,
        }))
})

//Add new Part
router.post("/add", (req, res) => {
    const partName = req.body.partName;
    const partNo = req.body.partNo
    const size = req.body.size
    const weight = req.body.weight
    const description = req.body.description

    const newPart = new Part({
        partName,
        partNo,
        size,
        weight,
        description
    })

    newPart.save().then((part) => {
        res.status(200).json({
            success: true,
            msg: "Part Added Successfully.",
            data: part
        })
    })
        .catch(err => res.status(400).json({
            success: false,
            msg: "Cannot add Part: " + err
        }))
})


//Remove Part
router.delete("/:id", (req, res) => {
    Part.findByIdAndDelete(req.params.id).then(part => res.status(200).json({
        success: true,
        msg: "Part removed successfully.",
        data: part
    }))
        .catch(err => res.status(400).json({
            success: false,
            msg: "Error removing the part: " + err,
        }))
})

module.exports = router;