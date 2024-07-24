const mongoose =require('mongoose');
mongoose.connect("mongodb+srv://divyanshdoshipv:mqlaocwI9TKa5Bt7@cluster0.3xxr8yj.mongodb.net/DukaanApp")

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      description: 'Mostly Gmail'
    },
    firstName:{
        type:String,
        required:true
    },
    userNo: {
      type: Number,
      required: true,
      unique: true,
      description: 'User number for unique identification'
    },
    netGet: {
      type: Number,
      default: 0,
      description: 'Net amount the user will receive'
    },
    netGive: {
      type: Number,
      default: 0,
      description: 'Net amount the user will give'
    },
    password:{
        type:String,
        required:true,
        minLength:6
    }
  }, { timestamps: true });
  
const productSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:"User",
        required:true
    },
    productId:{
        type:String,
        unique:true,
        required :true
    },
    productName:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        default:0
    },
    price:{
       type:Number,
       default:0
    }
});

const productListSchema = new mongoose.Schema({
    productId: {
      type: String,
      required: true
    },
    quantityBought: {
      type: Number,
      required: true,
      min: 1
    },
    price:{
        type: Number,
        required: true
    }
  });
  const customerSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:"User",
        required:true  
    },
    customerName:{
        type:String,
        required:true,
        unique:false,
        description: 'Customer Name of given user'
    },
    customerNumber:{
        type:String,
        required:true,
        unique:false,
        description: 'Phone Number of the Customer'
    },
    netGet:{ 
        type:Number,
        default:0,
        description:'Amount user will get from customer'
    },
    netRemain:{
        type:Number,
        default:0,
        description:'Amount customer already gave'
    },
    productList:{
        type:[productListSchema],
        default:[],
        description:'List of Objects Customer adds'
    }
},{timestamps:true});

const productListSchemaSupplier= new mongoose.Schema({
    productId:{
        type:String,
        required:true
    },
    productName:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
})
const supplierSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:"User",
        required:true  
    },
    supplierName:{
        type:String,
        required:true,
        unique:false,
        description: 'Customer Name of given user'
    },
    supplierNumber:{
        type:String,
        required:true,
        unique:false,
        description: 'Phone Number of the Customer'
    },
    netRemain:{ 
        type:Number,
        default:0,
        description:'Amount user have to give to Supplier '
    },
    netGave:{
        type:Number,
        default:0,
        description:'Amount user already gave to Supplier'
    }
},{ timestamps: true });

const User=mongoose.model('User',userSchema);
const Product=mongoose.model('Product',productSchema);
const Customer=mongoose.model('Customer',customerSchema);
const Supplier=mongoose.model('Supplier',supplierSchema);

module.exports ={
    User,Product,Customer,Supplier
}
