const express = require('express');
const cors = require('cors');
require('dotenv').config();

// TODO: add a stripe key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const uuid = require('uuid');


const app = express();


//middleware
app.use(express.json())
app.use(cors())

//routes
app.get('/', (req, res) => {
    res.send('IT WORKS!')
})

app.post("/payment", (req, res) => {

    const {product, token} = req.body;
    console.log("PRODUCT", product);
    console.log("PRICE", product.price);
    const idempontencyKey = uuid.v4();

    console.log("IK", idempontencyKey);
    
    return stripe.customers.create({
        email: token.email,
        source: token.id
    })
    .then(customer => {
        return stripe.charges.create({
            amount: product.price * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: `purchase of ${product.name}`,
            shipping: {
                name: token.card.name,
                address: {
                    country: token.card.address_country
                }
            }
        })
    })
    .then(charge => res.status(200).json(charge))
    .catch(err => console.log(err))
})

//listen 

app.listen(5000, () => console.log('LISTENING AT PORT 5000'));