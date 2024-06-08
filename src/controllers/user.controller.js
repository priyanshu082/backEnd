import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'


//for generating the accesstoken and refreshtoken
const generateAccessAndrefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); //for stoping the eerror sshich come form saving in database by the fields which are required but we have already saved the required fields in database so we do not neet to check here the reuired fields are available or not thats why we use validateBeforeSave:false

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refreh token"
    );
  }
};


//register user
const registerUser = asyncHandler(async (req, res) => {
  //get user detail from frontend
  //validation
  //check if user already exist
  // check for images,check for avatar
  //upload them to cloudinary
  //create user object- create entry in db
  //remove refresh token and
  // check for user creation
  // return res

  const { fullName, email, username, password } = req.body;

  if (
    [fullName, email, username, password].some((field) => field.trim === "")
  ) {
    throw new ApiError(400, "All field is required");
  }

  //  User.findOne({email})  for checking single field
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with this username or email already exist");
  }

  //accessing files

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath =req.files?.coverImage[0]?.path
//   console.log(req.files);

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  console.log(avatar)

  const user = await User.create({
    fullName,
    avatar: avatar?.url,
    coverImage: coverImage?.url || "",
    password,
    email,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered"));
});


//for login of user
const loginUser = asyncHandler(async (req, res) => {
  //req.body se data
  //username email password hai ya nahi
  //find the user
  //password check kro
  //access and refresh token bnao
  //send cookies

  const { username, email, password } = req.body;
  console.log(username,email)

  if (!username && !email) {
    throw new ApiError(400, "username & email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User doesn't exist");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Password Incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndrefreshToken(
    user._id
  );

  //since we are not having the refresh token in the previous user so we will call once again for the user
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //cookies sending part so we need some ooptions
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          refreshToken,
         accessToken,
        },
        "User logged in successfully"
      )
    );
});


//for logout of user
const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      //used for setting particular field
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"user Logged Out successfully"))
});


//refreh acesstoken end point
const refreshAccessToken=asyncHandler(async(req,res)=>{
  //access the cookies when end point hits
  const incomingRefreshToken=req.cookies?.refreshToken || req.body.refreshToken

  if(!incomingRefreshToken){
    throw new ApiError(400,"Authorized request")
  }

  try {
    const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
  
    const user=await User.findById(decodedToken._id)
  
    if(!user){
      throw new ApiError(400,"Invalid refresh Token")
    }
  
    if(incomingRefreshToken!==user?.refreshToken){
       throw new ApiError(401,"refresh token is expired or used")
    }
  
    const options={
      httpOnly:true,
      secure:true
    }
  
    const {accessToken,newRefreshToken}= await generateAccessAndrefreshToken(user._id)
  
     return res
     .status(201)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",newRefreshToken,options)
     .json(
      new ApiResponse(
        200,
        {accessToken,refreshToken:newRefreshToken},
        "Access Token refreshed succesfully"
      )
     )
  } catch (error) {
    throw new ApiError(500,error?.message || "Invalid refresh token")
  }

})

//change current passowrd
const changeCurrentPassword=(asyncHandler(async(req,res)=>{
  const {oldPassword,newPassWord}=req.body 

  //we will use middle ware to put user in req
  const user=await User.findById(req.user?._id)

  //now we will check whether the old passowrd is correct or not 
  const isPasswordCorrect= user.isPasswordCorrect(oldPassword)
  
  if(!isPasswordCorrect){
    throw new ApiError(400,"Invalid old Password")
  }

  user.password=newPassWord //here it will run the code 
  await user.save({validateBeforeSave:false})

  return res.status(200).json(new ApiResponse(200,{},"Password is change"))
}))

export { registerUser, loginUser, logOutUser,refreshAccessToken };
