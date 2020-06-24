const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname : {
        type : String,
        required : true,
        trim : true
    },
    lastname : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim : true
    },
    password : {
        type : String,
        required : true,
        trim : true
    },
    gender : {
        type : String,
        required : true,
    },
    birthdate : {
        type : String,
        required : true,
    }
});

const SignUp = mongoose.model("user", userSchema);

module.exports = SignUp;