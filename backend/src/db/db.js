const mongoose=require('mongoose')


//mongouri=MONGO_URI=mongodb+srv://pratikpadole07_db_user:16ZzU7Ijlsu0NGv@cluster0.fkfnmmk.mongodb.net/foodAppDB?retryWrites=true&w=majority&appName=Cluster0

function connectDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("MongoDB connected");
    })
    .catch((err)=>{
        console.log("MongoDb connection error:",err);
    })
}

module.exports=connectDB;