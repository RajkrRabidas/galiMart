const app = require('./src/app');
const PORT = process.env.PORT || 3000;
const connectToDB = require("./config/db")


connectToDB()
app.listen(PORT, ()=>{
    console.log("server is running 3000...")
})