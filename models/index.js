const Category = require("./categories");
const Supplier = require("./suppliers");
const Product = require("./products");
const Customer = require("./customers");
const Employee = require("./empoyees");
const Order = require("./orders");
const Media = require('./media');
const Cart =require('./carts')
const ProductVarians=require('./productVarians')
const Address=require('./address')

module.exports = {
  Category,
  Customer,
  Employee,
  Media,
  Order,
  Product,
  Supplier,
  Cart,
  ProductVarians,
  Address
};
