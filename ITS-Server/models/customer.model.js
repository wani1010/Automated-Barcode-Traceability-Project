const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    customerName: { type: String, required: true, trim: true },
    description: { type: String, defailt: "" }
});

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;