import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser=asyncHandler( async (req,res)=>{
     //get user detail from frontend 
     //validation
     //check if user already exist
     // check for images,check for avatar
     //upload them to cloudinary
     //create user object- create entry in db
     //remove refresh token and 
     // check for user creation 
     // return res

     const {fullName,email,username,password}= req.body

     if ([ fullName,email,username,password].some((field)=>field.trim==="")) {
        throw new ApiError(400,"All field is required")
     } 

    //  User.findOne({email})  for checking single field 
   const existedUser=await User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409,"User with this username or email already exist")
    }

    //accessing files

    const avatarLocalPath =req.files?.avatar[0]?.path
    // const coverImageLocalPath =req.files?.coverImage[0]?.path

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    console.log(avatarLocalPath)

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }

    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

    console.log(avatar)
  

    const user=await User.create({
        fullName,
        avatar:avatar?.url,
        coverImage:coverImage?.url || "",
        password,
        email,
        username:username.toLowerCase()
    })

   const createdUser=await User.findById(user._id).select(
    "-password refreshToken"
   )

   if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user")
   }

   return res.status(201).json(
    new ApiResponse(200,createdUser,"User Registered")
   )
  

})

export  {registerUser}