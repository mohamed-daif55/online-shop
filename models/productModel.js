const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    price : {
        type : Number,
        required : true,
        trim : true
    },
    image : {
        type : String,
        required : true,
    },
    category : {
        type : String,
        required : true,
    }
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;