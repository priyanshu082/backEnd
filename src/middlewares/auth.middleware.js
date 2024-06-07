import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler.js";
import  jwt  from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT=asyncHandler(async(req,res,next)=>{
    try {
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")   //this for mobile because we dont have cookies in mobile
    
        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }
    
        //decoding accesstoken
        const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        
        const user=User.findById(decodedToken?._id).select("password refreshToken")
        if(!user){
            //TODO:dsicussion about frontend
            throw new ApiError(401,"Invalid access token")
        }
    
        req.user=user;
        next();
    } catch (error) {
        throw new ApiError(401,"Invalid access token")
    }
})
