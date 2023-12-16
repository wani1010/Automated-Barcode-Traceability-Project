const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = new Schema({
    name: { type: String, trim: true },
    description: { type: String, default: "" },
    barCodes: { type: Array, default: [] },
    size: { type: String, default: "" },
    weight:{type: String ,default:""},
    partNo: { type: String, default: "" },
    noOfPolybags: { type: Number, required: true },
    quantityPerBag: { type: Number, required: true },
    type: { type: String, default: "PD" },
    // linkedTo: { type: String, default: "" },
    isLinked: { type: Boolean, default: false },

    productNo: { type: Number }
})

const SmallBox = new Schema({
    name: { type: String, trim: true },
    description: { type: String, default: "" },
    barCode: { type: String, default: "" },
    boxNo: { type: Number },
    type: { type: String, default: "SB" },
    // linkedTo: { type: String, default: "" },
    isLinked: { type: Boolean, default: false },
    products: [Product],

});

const BigBox = new Schema({
    name: { type: String, trim: true },
    description: { type: String, default: "" },
    barCode: { type: String, default: "" },
    boxNo: { type: Number },
    bbWeight:{ type: Number,default:0,required:true }, // abhi
    type: { type: String, default: "BB" },
    smallBoxes: [SmallBox],
    isLinked: { type: Boolean, default: false },

});

const OrderSchema = new Schema({
    // _id: { type: String, required: true },
    totalWeight:{type: Number,default:0,required:true}, // abhi
    customerId: { type: String, required: true, trim: true },
    customerName: { type: String, required: true, trim: true },
    linkStatus: { type: Number, default: 0 },
    issuedOn: { type: Date, required: true },
    barCode: { type: String, default: "" },
    poNo: { type: String, default: "" },
    completedOn: { type: Date, default: null },
    barCodeCount: { type: Number, default: 0 },
    barcodes: { type: Array, default: [] },
    bigBoxes: [BigBox]
}, {
    timestamps: true
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;