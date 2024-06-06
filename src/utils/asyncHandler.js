
const asyncHandler=(fn)=>{
    return (req,res,next)=>{
        Promise.resolve(fn(req,res,next)).catch((err)=>next(err))
    }
}

//trycatch method
/*
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};
*/

export { asyncHandler };

//all other way of thinking this
// const asyncHandler=()=>{}
// const asyncHandler=(fn)=>{()=>{}}
// const asyncHandler=(fn)=> {async()=>{}}
