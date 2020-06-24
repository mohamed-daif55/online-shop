const express = require("express");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const Products = require("../models/productModel");
const User = require("../models/signupModel");
const Cart = require("../models/cart");
const Product = require("../models/productModel");

exports.getIndex = async (req, res) => {
    // isAdmin used to display specific footer links 
    let isAdmin = false;
    if( req.session.idetifyUser === process.env.ADMIN_EMAIL ){
        isAdmin = true
    }
    try {
        // customize pagination in url
        const page = +req.query.page || 1;
        const itemsPerPage = 5;
        let totalItems;
        // getting all products
        const numnberOfProducts = await Products.find().countDocuments();
        totalItems = numnberOfProducts;
        // customize number of items to be displayes per page
        const products = await Products.find().skip( (page - 1) * itemsPerPage ).limit(itemsPerPage);
        res.render("index",{ 
            products,
            currentPage : page,
            hasNextPage : itemsPerPage * page < totalItems,
            hasPreviousPage : page > 1,
            nextPage : page + 1,
            previousPage : page - 1,
            lastPage : Math.ceil( totalItems / itemsPerPage ),
            isAdmin,
            active : false,
            pageTitle : "shop"
        });
    } catch (error) {
        console.log(error);
    }
    
};

exports.getSignUp = (req, res) =>{
    // isAdmin used to display specific footer links 
    let isAdmin = false;
    if( req.session.idetifyUser === process.env.ADMIN_EMAIL ){
        isAdmin = true
    }
    // initialize error message to be sent to the user
    let message = req.flash("error");
    if(message.length > 0){
        message = message[0];
    }else{
        message = null;
    }
    res.render("sign-up",{
        pageTitle : "Sign UP",
        errorMessage : message,
        isAdmin
    });
};

exports.postSignUp = async (req, res) =>{
    //getting user inputes to make a new account
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;
    const gender = req.body.gender;
    const birthdate = req.body.birthdate;

    try {
        const userData = await User.findOne( { email } );
        // checking if user account already exist
        if(userData){
            return res.redirect("/sign-up");
        }
        // encrypt password before saving
        const hashedPassword = await bcrypt.hash( password ,12) ;
        // validate data
        if(firstname === ""){
            req.flash("error", "You must enter first name");
            return res.redirect("/sign-up");
        }
        
        if(lastname === ""){
            req.flash("error", "You must enter last name");
            return res.redirect("/sign-up");
        }

        if(email === ""){
            req.flash("error", "You must enter your email");
            return res.redirect("/sign-up");
        }

        if( !validator.isEmail(email) ){
            req.flash("error", "You must enter a valid email");
            return res.redirect("/sign-up");
        }

        if( password.length < 5 ){
            req.flash("error", "min Password is 5 characters and max is 20");
            return res.redirect("/sign-up");
        }

        if ( !(password === confirmpassword) ){
            req.flash("error", "password and confirm password should be the same");
            return res.redirect("/sign-up");
        }
        
        if( !gender ){
            req.flash("error", "You must select a gender");
            return res.redirect("/sign-up");
        }

        if( birthdate === "" ){
            req.flash("error", "You must enter your birthdate");
            return res.redirect("/sign-up");
        }
        // inserting into database
        const user = new User( { firstname, lastname, email, password : hashedPassword , gender, birthdate } );
        await user.save();
        // creating user session after sign up
        req.session.isLoggedIn = true;
        res.redirect("/");

    } catch (error) {
        console.log(error);
    }

};

exports.getLogin = (req, res) =>{
    // isAdmin used to display specific footer links 
    let isAdmin = false;
    if( req.session.idetifyUser === process.env.ADMIN_EMAIL ){
        isAdmin = true
    }
    // initialize error message to be sent to the user
    let message = req.flash("error");
    if(message.length > 0 ){
        message = message[0];
    }else{
        message = null;
    }
    res.render("log-in",{
        pageTitle : "log-in",
        errorMessage : message,
        isAdmin
    });
};

exports.postLoginUser = async (req, res) => {
    // getting email
    const email = req.body.email;

    try {
        //get user data by email
        const user = await User.findOne( {email} );
        // error message if email not exists
        if(!user){
            req.flash("error", "Email is invalid");
            return res.redirect("/log-in");
        }
        // checking intered password
        const doMatch = await bcrypt.compare(req.body.password, user.password)
        // if email and password matches =====> create session and redirect
        if(doMatch){
            req.session.isLoggedIn = true;
            req.session.idetifyUser = email;
            res.redirect("/");
        }else{
            // generate error message to user if password was incorrect
            req.flash("error", "Password is invalid");
            res.redirect("/log-in");
        }

    } catch (error) {
        console.log(error);
    }

};

exports.postLogout = (req, res) => {
    // destroy session to logout user
    req.session.destroy(error => {
        console.log(error);
        res.redirect("/");
    });
};

exports.getWatches = async (req, res) => {
    
    try {
        // isAdmin used to display specific footer links 
        let isAdmin = false;
        if( req.session.idetifyUser === process.env.ADMIN_EMAIL ){
            isAdmin = true
        }
        // get all watches data to display
        const products = await Products.find({ category : "Watches" });
        res.render("watches",{
            products,
            active : false,
            pageTitle : "watches",
            isAdmin
        });
    } catch (error) {
        console.log(error);
    }

};

exports.getWallets = async (req, res) => {
    
    try {
        // isAdmin used to display specific footer links 
        let isAdmin = false;
        if( req.session.idetifyUser === process.env.ADMIN_EMAIL ){
            isAdmin = true
        }
        // get all wallets data to dispaly
        const products = await Products.find({ category : "Wallets" });
        res.render("wallets",{
            products,
            active : false,
            pageTitle : "wallets",
            isAdmin
        });
    } catch (error) {
        console.log(error);
    }

};

exports.getBackBags = async (req, res) => {
    
    try {
        // isAdmin used to display specific footer links 
        let isAdmin = false;
        if( req.session.idetifyUser === process.env.ADMIN_EMAIL ){
            isAdmin = true
        }
        // get all back bags data to display
        const products = await Products.find({ category : "Back Bags" });
        res.render("back-bags",{
            products,
            active : false,
            pageTitle : "Back Bags",
            isAdmin
        });
    } catch (error) {
        console.log(error);
    }

};

exports.getAccountSettings = async (req, res) => {
    // isAdmin used to display specific footer links 
    let isAdmin = false;
    if( req.session.idetifyUser === process.env.ADMIN_EMAIL ){
        isAdmin = true
    }
    // initialize error message to be sent to the user
    let message = req.flash("error");
    if(message.length > 0 ){
        message = message[0];
    }else{
        message = null;
    }
    // getting user data by logged in email
    const user = await User.findOne({email : req.session.idetifyUser});

    res.render("account-settings",{
        pageTitle : "Account Settings",
        errorMessage : message,
        firstname : user.firstname,
        lastname : user.lastname,
        gender : user.gender,
        birthdate : user.birthdate,
        isAdmin
    });

};

exports.postAccountSettings = async (req, res) => {
    // getting user data after editing
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;
    const gender = req.body.gender;
    const birthdate = req.body.birthdate;

    try {
        // validate user inputs
        if(firstname === ""){
            req.flash("error", "You must enter first name");
            return res.redirect("/account-settings");
        }
        
        if(lastname === ""){
            req.flash("error", "You must enter last name");
            return res.redirect("/account-settings");
        }

        if( password.length < 5 ){
            req.flash("error", "min Password is 5 characters and max is 20");
            return res.redirect("/account-settings");
        }

        if ( !(password === confirmpassword) ){
            req.flash("error", "password and confirm password should be the same");
            return res.redirect("/account-settings");
        }
        
        if( !gender ){
            req.flash("error", "You must select a gender");
            return res.redirect("/account-settings");
        }

        if( birthdate === "" ){
            req.flash("error", "You must enter your birthdate");
            return res.redirect("/account-settings");
        }
        // hashing password before saving into database
        const hashedPassword = await bcrypt.hash( password ,12) ;
        // updating user data
        const user = await User.updateOne({email : req.session.idetifyUser},{
            $set : {
                firstname,
                lastname,
                password : hashedPassword,
                gender,
                birthdate
            }
        });

        res.redirect("/");

    } catch (error) {
        console.log(error);
    }

};

exports.getCartItem = async(req, res) => {
    // isAdmin used to display specific footer links 
    let isAdmin = false;
    if( req.session.idetifyUser === process.env.ADMIN_EMAIL ){
        isAdmin = true
    }
    // initialize empty array to store product data into cart
    const productArray = [];
    // get user id
    const userData = await User.findOne({email : req.session.idetifyUser});
    const userID = userData.id;
    // getting all cart items of same user
    const cartItemData = await Cart.find({userID : userID});
    // looping through cart items of same user and store it into array to display to user
    for(let product of cartItemData){
        productID = product.productID;
        const productData = await Product.findOne({_id : productID});
        productArray.push({productData,count : product.count });
    }
    // checking if cart is empty
    if( productArray.length == 0 ){
        return res.render("cart-items",{
            products : productArray,
            visible : true,
            pageTitle : "Cart Items",
            isAdmin
        });
    }
    // passing cart items to cart page
    res.render("cart-items",{
        products : productArray,
        visible : false,
        pageTitle : "Cart Items",
        isAdmin
    });
};

exports.postCartItem = async(req, res) => {
    // getting clicked product id 
    const productID = req.params.id;
    // getting logged in user data 
    const userData = await User.findOne({email : req.session.idetifyUser});
    const userID = userData.id;
    // counting number of same item user want to order
    const count = req.body.count;
    // saving cart data to database
    const cart = new Cart({userID, productID, count});
    await cart.save();

    res.redirect("/cart-items");

};

exports.deleteCartItem = async(req, res) => {
    // getting clicked product id
    const productID = req.params.id;
    try {
        // delete product from cart
        const deleteCart = await Cart.findOneAndDelete({ productID });
        res.redirect("/cart-items");
    } catch (error) {
        console.log(error);
    }

};