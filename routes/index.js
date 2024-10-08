const express = require("express")
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model")

router.get("/" , function(req , res){
    let error = req.flash("error");
    res.render("index" , {error , loggedin: false})
});

router.get("/shop" , isLoggedIn , async function (req , res){
    let products = await productModel.find()
    let success = req.flash("success")
    res.render("shop" ,{ products , success })
})

router.get("/cart" , isLoggedIn , async function (req , res){
    let user = await userModel
    .findOne({ email : req.user.email })
    .populate("cart")
    
    let total_price = 0 ;
     user.cart.forEach(function(item) {
        total_price += item.price + 20  - item.discount
     })

    let bill = 0 ;
      user.cart.forEach(item => {
        // Calculate the bill for the current item
         bill = Number(item.price) + 20 - Number(item.discount);
        // You can log the bill or store it in an array
        console.log(`Bill for ${item.name}: ₹ ${bill.toFixed(2)}`);
    });

    // const bill = Number(user.cart[0].price) + 20 - Number(user.cart[0].discount) 
    res.render("cart" , { user , bill , total_price})
})

router.get("/addtocart/:productid" , isLoggedIn , async function (req , res){
     console.log(req.user);
    
    let user =  await userModel.findOne({email : req.user.email})
    user.cart.push(req.params.productid)
    await user.save();
    req.flash("success" , "Added to cart")
    res.redirect("/shop")
})

router.get("/logout" , isLoggedIn , function (req,res){
    res.render("/")
})

module.exports = router;