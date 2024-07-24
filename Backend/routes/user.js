const express =require("express");
const router =express.Router();
const zod =require("zod");
const {User,Customer,Supplier,Product} =require("../db");
const {JWT_SECRET} =require("../config")
const {authMiddleware}=require("../middleware");
const jwt =require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid'); // Require the uuid package to generate unique IDs

const signupbody =zod.object({ //Signup body definition
    username:zod.string().email(),
    firstName:zod.string(),
    userNo:zod.string().length(10, { message: "Phone number must be exactly 10 digits long" }).regex(/^\d{10}$/, { message: "Phone number must only contain digits" }),
    password:zod.string().min(6,{message:"Password must be minimum 6 digit"}) 
})
router.post("/signup",async (req,res)=>{
    console.log("Inside Signup Route")
    const {success,error}=signupbody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message: "improper inputs" 
        })
     }
     const existingUser= await User.findOne({
        username:req.body.username
     })
     if(existingUser){
        return res.status(411).json({
            message: "User already taken"
        }) 
     }
     const user =await User.create({
        username:req.body.username,
        firstName:req.body.firstName,
        userNo:req.body.userNo,
        password:req.body.password
     });
     const token = jwt.sign({userId:user._id}, JWT_SECRET);
     res.json({
        message:"User Created successfully",
        token:token
     });
})

const signinbody=zod.object({ //Siginbody definition
    username:zod.string().email(),
    password:zod.string().min(6,{message:"Password must be minimum 6 digits"})
});

router.put("/signin", async(req,res)=>{
    console.log("Inside Sigin route");
    const {success}=signinbody.safeParse(req.body); //signin body validation
    if(!success){
        return res.json({
            message:"improper body"
        })
    }
    
    const {username,password} = req.body;  //Destructuring Body
    console.log(username," ",password);  
    
    try{
        const user=await User.findOne({username:username});     //Validating and finding user
        console.log(user);
        if(user){
            if(password==user.password){
                const token = jwt.sign({userId:user._id}, JWT_SECRET);
            return res.json({
            message:"User Signin successfully",
            token:token
            });
            }
            else{
                return res.json({
                    message:"Incorrect Password"
                })
            }  
        }
        else{
            return res.json({
                message:"User doesn't exist you need to signup"
            })
        }
    }catch(error){
         return res.status(404).json({
            message:error
         })
    }
    
    
})

const addProductbody=zod.object({
    productName:zod.string(),
    quantity:zod.number(),
    price:zod.number(),
    supplierNumber:zod.string()
})
// Router To add New Product in The product Model
router.post("/addProduct",authMiddleware,async (req,res)=>{
    const {success} =addProductbody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message:"Improper Inputs"
        })
    }
    try{
    const {productName,quantity,price,supplierNumber}=req.body;
    const productId=uuidv4();
    const product = await Product.create({
        userId:req.userId,
        productName:productName,
        productId:productId,
        quantity:quantity,
        price:price
    });
    const supplier=await Supplier.findOneAndUpdate({supplierNumber:supplierNumber},
    {
        $push:
        {
            productList:
            {
               productId:productId,
               quantityBought:quantity
            }
        }
    },{new:true}
    )
    if(!supplier){
        return res.json({
            message:"Supplier Not Found, First add Supplier"
        })
    }
    return res.status(200).json({
        message:"Product added successfully",
        productId:product.productId
    });
    }catch(error){
        return res.status(403).json({
            message:error
        })
    }
    
})

//See Product List
router.get("/seeProductList",authMiddleware,async(req,res)=>{
    try {
        const products = await Product.find({ userId: req.userId });
        res.status(200).json({product:products});
      } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products' });
      }
})

const addCustomerbody=zod.object({
    customerName:zod.string(),
    customerNumber:zod.string(),
    netRemain:zod.number(),
    netGet:zod.number()
})
router.post("/addCustomer",authMiddleware,async(req,res)=>{
    const {success} = addCustomerbody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message:"Invalid inputs"
        })
    }
    
    const session=await Customer.startSession();
    session.startTransaction();

    try{
        const {customerName,customerNumber, productList, netRemain, netGet} =req.body;
        
        const customer =await Customer.create([{
            userId:req.userId,
            customerName:customerName,
            customerNumber:customerNumber,
            netRemain:netRemain,
            netGet:netGet,
            // productList:productList
        }],{session});
        console.log("Below customer create");
        // for(const item of productList){
        //     const {productId, quantityBought}=item;
        //     const product=await Product.findOneAndUpdate(
        //         {productId:productId},
        //         {$inc:{quantity:-quantityBought}},
        //         {new:true,session}
        //     );
        //     if(!product){
        //         throw new Error(`Product with $(productId) not found`);
        //     }
        // }
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message:"Customer added successfully",
            customer:customer[0]
        });
    }
    catch(error){
        await session.abortTransaction();
        session.endSession();

        console.error('Error adding customer and updating products:',error);
        res.status(500).json({
            message:error.message
        })
    }
})

router.get("/seeCustomerList",authMiddleware,async (req,res)=>{
    const filter = req.query.filter || ""; // Default to an empty string if no filter is provided
    const regex = new RegExp(filter, 'i'); // Create a case-insensitive regex for the filter
    const customers= await Customer.find({userId:req.userId,
        customerName:regex
    });
    if(!customers){
        return res.status(404).json({
            message:`Customer for userId ${req.userId} not found`
        })
    }
    let totalNetRemain=0;
    let totalNetGet=0;
    

    customers.forEach((customer) => {
        totalNetGet += customer.netGet;
        totalNetRemain += customer.netRemain;
    });

    const customerList = customers.map((customer) => ({
        customerName: customer.customerName,
        netRemain: customer.netRemain,
        netGet: customer.netGet,
        customerNumber:customer.customerNumber
      }));
  
      res.json({
        customer:customerList,
        totalNetGet:totalNetGet,
        totalNetRemain:totalNetRemain
      });
})

router.get("/seeCustomerDetails",authMiddleware,async (req,res)=>{
    const{phoneNumber} = req.query;

    if(!phoneNumber){
       return res.status(400).json({
           message:"Phone number required"
       });
    }

    try{
       const customer= await Customer.findOne({customerNumber: phoneNumber});

       if(!customer){
           return res.status(400).json({
               message:"Customer not found"
           });
       }

       return res.status(200).json({
           message: "Customer found",
          customer:customer
       });

    } catch(error){
      return res.status(500).json({
       message: error.message
      })
   }
});
const addCustomerProductBody = zod.object({
    productList: zod.array(zod.object({
      productId: zod.string(),
      quantityBought: zod.number().min(1)
    }))
  });
  
  router.put("/addCustomerProduct", authMiddleware, async (req, res) => {
    const { phoneNumber } = req.query;
    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone Number Required" });
    }
  
    const { success, error } = addCustomerProductBody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({ message: "Improper Inputs", error });
    }
  
    const session = await Customer.startSession();
    session.startTransaction();
    const { productList } = req.body;
    console.log(productList[0].quantityBought);
    try {
      const customer = await Customer.findOne({ customerNumber: phoneNumber }).session(session);
      if (!customer) {
        throw new Error("Customer not found");
      }
  
      for (const item of productList) {
        const { productId, quantityBought } = item;
        const product = await Product.findOneAndUpdate(
          { productId },
          { $inc: { quantity: -quantityBought } },
          { new: true, session }
        );
  
        if (!product) {
          throw new Error(`Product with productId ${productId} not found`);
        }
  
        customer.productList.push({
          productId: product.productId,
          quantityBought: quantityBought,
          price: product.price
        });
      }
  
      await customer.save({ session });
  
      await session.commitTransaction();
      session.endSession();
  
      res.status(200).json({ message: "Products added to customer and inventory updated successfully" });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(400).json({ message: error.message });
    }
  });

const addSupplierBody=zod.object({
    supplierName:zod.string(),
    supplierNumber:zod.string(),
    // productList:zod.array(zod.object({
    //     productName:zod.string(),
    //     quantityBought:zod.number(),
    //     price:zod.number()
    // })),
    netRemain:zod.number(),
    netGave:zod.number() 
})
router.post("/addSupplier",authMiddleware,async(req,res)=>{
    const {success} = addSupplierBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message:"Invalid inputs"
        })
    }
    try{
    const{supplierName,supplierNumber,netRemain,netGave} = req.body;
    // let totalSale=0;
    // for(const product in productList){
    //     totalSale=totalSale+product.quantityBought*product.price;
    //     await Product.create({
    //         userId:req.userId,
    //         productId:uuidv4(),
    //         productName:product.productName,
    //         quantity:product.quantityBought,
    //         price:product.price    
    //     })
    // }
    
    // const productListSupplier = productList.map((product)=>({
    //     productId:product.productId,
    //     quantityBought:product.quantityBought
    // }));
    // const netRemain=totalSale-netGave;
    const supplier= await Supplier.create({
         userId:req.userId,
         supplierName,
         supplierNumber,
         netRemain,
         netGave
    })
    
    res.status(200).json({
        message:`${supplier.supplierName} added successfully`
    })
    }catch(error){
        res.status(403).json({
            message:error
        })
    }    
})

router.get("/seeSupplierList",authMiddleware, async(req,res)=>{

    const suppliers=await Supplier.find({userId:req.userId});
    if(!suppliers){
        return res.status(404).json({
            message:`Supplier for userId ${req.userId} not found`
        })
    }
    
    let totalNetRemain=0;
    let totalNetGave=0;
    
    suppliers.forEach((supplier) => {
        totalNetGave += supplier.netGave;
        totalNetRemain += supplier.netRemain;
    });

    const supplierList = suppliers.map((supplier)=>({
        supplierName: supplier.supplierName,
        netRemain: supplier.netRemain,
        netGave: supplier.netGave,
        supplierNumber:supplier.supplierNumber
    }))

    res.json({
        suppliers:supplierList,
        totalNetGave:totalNetGave,
        totalNetRemain:totalNetRemain
    });
})


router.get("/seeSupplierDetails",authMiddleware,async (req,res)=>{
     const{phoneNumber} = req.query;

     if(!phoneNumber){
        return res.status(400).json({
            message:"Phone number required"
        });
     }

     try{
        const supplier= await Supplier.findOne({supplierNumber: phoneNumber});

        if(!supplier){
            return res.status(400).json({
                message:"Supplier not found"
            });
        }

        return res.status(200).json({
            message: "Supplier found",
            supplier: supplier
        });

     } catch(error){
       return res.status(500).json({
        message: error.message
       })
    }
});

router.get("/verify",authMiddleware,(req,res)=>{
    return res.status(200).json({
        message:"Verification Successfull"
    })
})
module.exports=router;