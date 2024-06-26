import Stripe from 'stripe';
import dotenv from "dotenv";
import Order from "../models/order.model.js"


dotenv.config();

const stripe = Stripe(process.env.CHECKOUT_API_KEY_SECRET);

export const createSession = async (req, res) => {

  const cartItems = req.body.cartItems;

  const metadata = {
    userId: req.body.userId,
    items: cartItems.map(item => ({
      _id: item._id,
      title: item.title,
      cartTotalQuantity: item.cartTotalQuantity
    }))
  };

  // Convert metadata to a JSON string
  const metadataString = JSON.stringify(metadata);

  // Truncate metadata if it exceeds 500 characters
  //const truncatedMetadata = metadataString.length > 500 ? metadataString.substring(0, 500) : metadataString;
  
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
      cartItems: metadataString,
    }
  });


  const line_items = req.body.cartItems.map((item)=>{
    return{
      price_data: {
        currency: "lkr", // Changed currency to USD
        product_data: {
          name: item.title,
          images:[item.image],
          description:item.description,
          metadata:{
            id:item.id,
          },
        },
        // Adjust unit amount to cents (multiply by 100)
        unit_amount: item.price * 100, 
      },
      quantity:item.cartTotalQuantity,
    }
  }) 

  // Calculate the total amount
  const totalAmount = line_items.reduce((acc, item) => acc + (item.price_data.unit_amount * item.quantity), 0);

  // Check if the total amount is less than 50 cents in USD
  if (totalAmount < 50) {
    return res.status(400).send({ error: "Total amount must be at least 50 cents in USD." });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types:['card'],
    shipping_address_collection:{
      allowed_countries:['LK'],
    },
    shipping_options:[
      {
        shipping_rate_data:{
          type:'fixed_amount',
          fixed_amount:{
            amount:0,
            currency:'lkr',
          },
          display_name:'Free Shipping',
          delivery_estimate:{
            minimum:{
              unit:'business_day',
              value: 1,
            },
            maximum:{
              unit:'business_day',
              value: 2,
            },
          }
        }
      },
      {
        shipping_rate_data:{
          type:'fixed_amount',
          fixed_amount:{
            amount:50000, // Adjusted amount to 500 cents (5 USD)
            currency:'lkr',
          },
          display_name:'One Day Delivery',
          delivery_estimate:{
            minimum:{
              unit:'business_day',
              value:1,
            },
            maximum:{
              unit:'business_day',
              value:1,
            },
          },
        },
      },
    ],
    phone_number_collection:{
      enabled:true,
    },
    customer:customer.id,
    line_items,
    mode: 'payment',
    success_url: `http://localhost:5173/order-pay-success`,
    cancel_url: `http://localhost:5173/cart`,
  });

  res.send({ url: session.url });
};

//create order (save successful payments in databse)
const createOrder = async (customer, data) => {
  try {
    const cartItems = JSON.parse(customer.metadata.cartItems);
    const Items = cartItems.items.map(item => ({
      _id: item._id,
      title: item.title,
      cartTotalQuantity: item.cartTotalQuantity,
      // Add any other necessary fields from the item object
    }));

    const newOrder = new Order({
      orderId: data.id,
      userId: customer.metadata.userId,
      productsId: Items.map(item => ({
        id: item._id,
        title: item.title,
        quantity: item.cartTotalQuantity
      })),
      first_name: data.customer_details.name.split(' ')[0],
      last_name: data.customer_details.name.split(' ')[1],
      email: data.customer_details.email,
      phone: data.customer_details.phone,

      address: data.customer_details.address.line1,

      city: data.customer_details.address.city,
      zip: data.customer_details.address.postal_code,
      subtotal: data.amount_subtotal / 100,
      deliveryfee: 300,
      totalcost: data.amount_total / 100,
    });

    const savedOrder = await newOrder.save();
      //console.log("Processed Order:", savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    throw error; // Rethrow the error to be caught by the caller
  }
};



// This is your Stripe CLI webhook secret for testing your endpoint locally.
let endpointSecret;

export const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let data;
  let eventType;

  if (endpointSecret) {
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log("Webhook verified!!");
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    data = event.data.object;
    eventType = event.type;
  } else {
    data = req.body.data.object;
    eventType = req.body.type;
  }

  // Handle the event
  if (eventType === "checkout.session.completed") {
    stripe.customers
      .retrieve(data.customer)
      .then((customer) => {
        // console.log(customer);
        // console.log("data", data);
        createOrder(customer, data);
        
        //console.log("Order created successfully!");

        // createOrder(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send().end();
};

