// const asyncHandler = ()=>{}


// why and what are we doing -> 
// some functions in our route handler maybe asynchronous so to handle them as try and catch or 
// as promise instead of writing the same code for each and every one of them we can make a reusable function
// asyncHandler what it does is take a function as an argument and wraps it as async task 
// and returns it to wherever we want 

    
const asyncHandler = (fn) => async(req,res,next) =>{
    try {
        await fn(req,res,next)
    } catch (error) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message
        })
    }
}

export {asyncHandler}