const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CountSchema = new Schema({
    orderCount: { type: Number, default: 0 },
});

const Count = mongoose.model('Count', CountSchema);

module.exports = Count;