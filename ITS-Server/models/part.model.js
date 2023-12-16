const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PartSchema = new Schema({
    partName: { type: String, required: true, trim: true },
    size: { type: String, default: "" },
    weight: { type: Number, default: 0,required:true },
    partNo: { type: String, default: "" },
    description: { type: String, default: "" }
});

const Part = mongoose.model('Part', PartSchema);

module.exports = Part;