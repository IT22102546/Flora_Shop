import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
        type: String,
        required: true,
        unique: true,
      },
    description: {
      type: String,
      required: true,
    },
    
    image: {
      type: String,
      default:
        'https://media.istockphoto.com/id/951105418/photo/very-nice-young-woman-holding-a-colourful-fresh-blossoming-flower-bouquet-of-different-sorts.jpg?s=612x612&w=0&k=20&c=emRNuMDnrdFVf1G4xLcZVAd_nwOlpJ43xaUyMtqB8z0=',
    },
    category: {
      type: String,
      default: 'uncategorized',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    price:{
        type: Number,
        required: true
    },
    quantity:{
      type: Number,
      required: true,
      
    },
    deliveryTime:{
        type: String,
        required: true,
    },
    supplier:{
        type: String,
        required: true,
    },
    promotions:{
        type: String,
    },
    rating:{
        type:Number
    },
    reviews:{
        type:String
    }

   
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;