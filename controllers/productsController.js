const express = require("express");
const Product = require("../models/productModel");

exports.getAddProduct = (req, res) => {
    // isAdmin used to display specific footer links 
    let isAdmin = false;
    if( req.session.idetifyUser === process.env.ADMIN_EMAIL ){
        isAdmin = true
    }

    res.render("add-products",{
        pageTitle : "Add Products",
        isAdmin
    });
};

exports.postAddProducts = async (req, res) => {

    try {
        // saving new product to database
        const newProduct = new Product({
            price : req.body.price,
            image : req.file.path,
            category : req.body.category
        });
        const product = await newProduct.save();

        res.redirect("/");
        
    } catch (error) {
        console.log(error);
    }

};