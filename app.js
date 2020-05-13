require('dotenv').config();
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const ejs = require("ejs")
const app = express()

//Port

//const PORT = 3000
//View Engine
app.set('view engine', 'ejs')

//USE
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))


mongoose.connect(`mongodb+srv://${process.env.username}:${process.env.password}@cluster0-tkoks.mongodb.net/usersDB`, {useNewUrlParser: true, useUnifiedTopology: true})

app.get('/', (req, res) => {
    res.send("Hello World");
})

//mongodb Connection Validation
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {

    console.log("We are connected")
})

//Schema

const userSchema={
    id:Number,
    name:String,
    username:String,
    email:String
}

const User=mongoose.model("User",userSchema)

app.route('/api/users')
    .get((req,res)=>{
        User.find({},(err,foundUsers)=>{
            if(err){
                res.send(err)
            }else {
                res.send(foundUsers)
            }
        })
    })
    .post((req,res)=>{
    const newUser=new User({
        id:req.body.id,
        name:req.body.name,
        username:req.body.username,
        email: req.body.email
    })
    newUser.save(err=>{
        if(!err){
            res.send("Successfully added a new user")
        }else{
            res.send(err)
        }
    })
})

app.route("/api/users/:_id")
    .get((req,res)=>{
        User.findOne({_id:req.params._id},(err,foundUser)=>{
            if(foundUser){
                res.send(foundUser)
            }else {
                res.send("No user with _id matching found")
            }
        })
    });

app.route('/api/users/1')
    .put((req,res)=>{
        User.update(
            {id:1},
            {
                id:req.body.id,
                name:req.body.name,
                username:req.body.username,
                email: req.body.email
            },
            {overwrite:true},
            (err, result)=>{
                if (!err) {
                    res.send("Successfully updated article");
                }
            }

        )
    })
    .delete((req,res)=>{
        User.deleteOne(
        { id:1}, function(err, result) {
            if (!err) {
                res.send("User Data successfully removed");
            }
        })
    });

let port=process.env.PORT
if(port==null||port==""){
    port=3000;
}

app.listen(port, () => {
    console.log("Server is started successfully")
})