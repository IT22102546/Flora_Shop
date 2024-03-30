import Order from "../models/order.model.js";
import { mongoose } from "mongoose";
import { errorHandler } from "../utils/error.js";

//test order
export const testOrder = (req, res) => {
    res.json({ msg: "Order works" });
}

//create new order
export const createOrder = async (req, res,next)=>{
    if (!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.phone || !req.body.address ||!req.body.state || !req.body.zip  || !req.body.subtotal || !req.body.deliveryfee || !req.body.totalcost ) {
        return next(errorHandler(400, 'Please provide all required fields'));
      }

      const userId = req.body.userId;
      const productsId = req.body.productsId;
      const first_name = req.body.first_name;
      const last_name = req.body.last_name;
      const email = req.body.email;
      const phone = req.body.phone;
      const address = req.body.address;
      const state = req.body.state;
      const zip = req.body.zip;
      const subtotal = req.body.subtotal;
      const deliveryfee = req.body.deliveryfee;
      const totalcost = req.body.totalcost;

      function idGen(phone) {
        const randomString = Math.random().toString(36).substring(2, 10); 
        const id = "ORD" + randomString + phone; 
        return id;
    }

      const orderId = idGen(phone);

      const newOrder = new Order({
        orderId, userId,productsId,first_name,last_name,email,phone,
        address,state,zip,subtotal,deliveryfee,totalcost
      })

      try {
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
      } catch (error) {
        next(error);
      }
}

//get all orders
export const  getAllOrders = async(req,res,next)=>{
    Order.find().then((orders)=>{
        res.json(orders);
    }).catch((error)=>{
        console.log(error);
    })
}

//get single order
// export const getOrder = async (req, res) => {
//     try {
//       const { id } = req.params.id;
  
//       // Validate the ObjectId
//       if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({ message: 'Invalid order ID' });
//       }
  
//       // Query the database using the validated ObjectId
//       const order = await Order.findById(id);
  
//       if (!order) {
//         return res.status(404).json({ message: 'Order not found' });
//       }
  
//       res.status(200).json(order);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   };
export const getOrder = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json(order);    

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


//update order
export const updateOrder = async(req, res, next)=>{
    let orderId = req.params.id;
    const {first_name, last_name, email, address, state, zip} = req.body;
    
    const updateOrder = {
        first_name,
        last_name,
        email,
        address,
        state,
        zip
    }

    try {
        await Order.findByIdAndUpdate(orderId, updateOrder);
        res.status(200).json(updateOrder);
    } catch (error) {
        next(error);
    }
}

//delete order
export const deleteOrder = async(req, res ,next)=>{
    let  orderId = req.params.id;
    try {
        await Order.findByIdAndDelete(orderId);
        res.status(200).json('The Order has been deleted');
      } catch (error) {
        next(error);
      }
}