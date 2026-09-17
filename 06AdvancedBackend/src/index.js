
import connectDB from "./db/index.js"
import dotenv from 'dotenv'
import app from "./app.js"

dotenv.config()
const port = process.env.PORT

connectDB()
.then(
    app.listen(port || 8000,()=>{
        console.log(`Server Is Listening on PORT - ${port}`);
    })
)
.catch((err) => {
    console.log(`MongoDB connection FAILED! || ${err}`);
})