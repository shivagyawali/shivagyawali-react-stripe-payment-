const cors = require("cors");
const express = require("express");
const stripe = require("stripe")("pk_test_cKu35UsK7FopPOcNRnSBPDz200Ne1vX77T");
const uuid = require("uuid/v4");
const app = express();

//middleware

app.use(express.json());

app.use(cors());

// route
app.get("/", (req, res) => {
  res.send("worked!");
});

app.post("/payment", (req, res) => {
  const { product, token } = req.body;
  console.log("PRODUCT", product);
  console.log("PRICE", product.price);
  const idemponetencyKey = uuid();
  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: product.price * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `purchase of ${product.name}`,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country,
            },
          },
        },
        { idemponetencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
});

//listen
app.listen(9000, () => console.log(`listening to port 8282`));
