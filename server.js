const express = require('express');
const recurly = require('recurly')

// Import middleware
require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const methodOverride = require('method-override');
const { json } = require('body-parser');

const cors = require('cors');


var corsOptions = {
    origin: ['http://localhost:9001', 'http://localhost:3000', 'http://localhost:5173'],
    optionsSuccessStatus: 200 // For legacy browser support
}


// Set up express
const app = express();

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Implement middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride('_method'))
app.use(cors(corsOptions));

// Instantiate a configured recurly client
const client = new recurly.Client(`${process.env.RECURLY_API_KEY}`)

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}


// GET user's account
app.get(`/api/account/:accountId`, async function (req, res) {
    const account_id = req.params.accountId;
    try {
        const account = await client.getAccount(`${account_id}`)
        console.log('Fetched account: ', account.code)
        res.send({ account })
    } catch (error) {
        console.error(error.message)
    }
});

// // // React POST route to handle a Purchase form
app.post('/api/subscriptions/new', async function (req, res) {
    await delay(3500);
    res.set('Access-Control-Allow-Origin', 'http://localhost:9001');
    const accountDetails = req.body.accountInfo;
    let purchaseReq = {
        currency: 'USD',
        //gateway_code: req.body.gateway,
        account: {
            //code: account_code,//uuid.v1(),
            code: req.body.accountCode,
            address: {
                street1: accountDetails.street1, //'1234',
                city: accountDetails.city, //'Denver',
                region: accountDetails.region, //'CO',
                postalCode: accountDetails.postalCode, //'80021',
                country: accountDetails.country //'US'
            },
            billingInfo: { token_id: req.body.token_id },
        },
        subscriptions: [
            {
                planCode: req.body.plan_code,
                addOns: req.body.plan_addons
            }
        ]
    }
    try {
        let invoiceCollection = await client.createPurchase(purchaseReq)
        res.status(200).send({ invoiceCollection: invoiceCollection.chargeInvoice })
    } catch (err) {

        if (err && err.transactionError && err.transactionError.code === 'three_d_secure_action_required') {
            const { threeDSecureActionTokenId } = err.transactionError;
            console.log(threeDSecureActionTokenId,)
            return res.send({ threeDSecure: true, threeDSecureActionTokenId });
        }
    }
})


// This endpoint provides configuration to recurly.js
app.get('/config', function (req, res) {
    res.setHeader('Content-Type', 'application/javascript');
    res.send(`window.recurlyConfig = { publicKey: ${process.env.RECURLY_PUBLIC_KEY} }`);
});


// Serve static file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
  
  // Setup default port
  app.set('port', process.env.PORT || 9001);
  
  // Start express app
  app.listen(app.get('port'), () => {
    console.log(`Server running at port: ${app.get('port')}`)
  });