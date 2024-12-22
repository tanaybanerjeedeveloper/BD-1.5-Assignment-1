const express = require('express');
const { resolve } = require('path');
let cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('static'));

let taxRate = 5;
let discountPercentage = 10;
let loyaltyRate = 2;

//Endpoint-1
app.get('/cart-total', (req, res) => {
  let newItemPrice = parseFloat(req.query.newItemPrice);
  let cartTotal = parseFloat(req.query.cartTotal);
  let totalPrice = newItemPrice + cartTotal;
  res.send(totalPrice.toString());
});

//Endpoint-2
const calculateDiscount = (isMember, cartTotal) => {
  if (isMember === 'true') {
    let discountedPrice = cartTotal - (discountPercentage / 100) * cartTotal;
    let finalPrice = Math.round(discountedPrice * 100) / 100;
    return finalPrice.toString();
  } else {
    return 'You are not a member!';
  }
};

app.get('/membership-discount', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  let isMember = req.query.isMember;
  res.send(calculateDiscount(isMember, cartTotal));
});

//Endpoint-3
const calculateTax = (cartTotal) => {
  let taxAmount = (taxRate / 100) * cartTotal;
  return Math.round(taxAmount * 100) / 100;
};
app.get('/calculate-tax', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send(calculateTax(cartTotal).toString());
});

//Emdpoint-4
const determineNumberOfDeliveryDays = (shippingMethod, distance) => {
  let numberOfDays;
  if (shippingMethod === 'standard') {
    numberOfDays = distance / 50;
  } else {
    numberOfDays = distance / 100;
  }
  return Math.round(numberOfDays * 100) / 100;
};
app.get('/estimate-delivery', (req, res) => {
  let shippingMethod = req.query.shippingMethod;
  let distance = parseFloat(req.query.distance);
  res.send(determineNumberOfDeliveryDays(shippingMethod, distance).toString());
});

//Endpoint-5
const calculateShippingDays = (weight, distance) => {
  let shippingDays = ((weight * distance * 0.1) / 2) * weight;
  return Math.round(shippingDays * 100) / 100;
};
app.get('/shipping-cost', (req, res) => {
  let weight = parseFloat(req.query.weight);
  let distance = parseFloat(req.query.distance);
  res.send(calculateShippingDays(weight, distance).toString());
});

//Endpoint-6
const calculateLoyaltyPoints = (purchaseAmount) => {
  let loyaltyPoints = purchaseAmount * 2;
  return Math.round(loyaltyPoints * 100) / 100;
};
app.get('/loyalty-points', (req, res) => {
  let purchaseAmount = parseFloat(req.query.purchaseAmount);
  res.send(calculateLoyaltyPoints(purchaseAmount).toString());
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
