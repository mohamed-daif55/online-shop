const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const cartSchema = new mongoose.Schema({
    userID : {
        type : ObjectId,
        required : true,
        ref : "user"
    },
    productID : {
        type : ObjectId,
        required : true,
        ref : "product"
    },
    count : {
        type : Number,
        required : true
    }
});

const Cart = mongoose.model("cart", cartSchema);

module.exports = Cart;