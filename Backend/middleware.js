const {JWT_SECRET}=require("./config");
const jwt =require("jsonwebtoken");

const authMiddleware =(req,res,next)=>{
    const authHeader=req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(411).json({
            message:"Incorrect Header"
        });
    }
    const token =authHeader.split(" ")[1];
    console.log(token);
    try{ 
        const decoded =jwt.verify(token,JWT_SECRET);
        req.userId=decoded.userId;
        next();

    }catch(error){
        return res.status(403).json({
            message:error
        });
    }
}

module.exports={
    authMiddleware
}

