const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel, TodoModel } = require("./db");
const { auth, JWT_SECRET } = require("./auth");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { z } = require("zod");



mongoose.connect("your mongodb url/your folder name in which you want to stote data in database")

const app = express();
app.use(express.json());

app.post("/signup", async function(req, res) {
    const requireBody = z.object({
        email: z.string().min(4).max(20).email(),
        name : z.string().min(4).max(20),
        password:z.string().min(4).max(20)
    })

    const parseddatasuccess = requireBody.safeParse(req.body);

    if(!parseddatasuccess.success){
        res.json({
            msg : "Incorrect format"
        })
        return 
    }

   
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    let errorthrown = false ;

    try{
    const hasedpassword = await bcrypt.hash(password, 5);
    console.log(hasedpassword);


    await UserModel.create({
        email: email,
        password:hasedpassword ,
        name: name
    });
    
   } catch(e){
        res.json({
             message: "User already Exist"
        })
        errorthrown = true;
   }

   if(!errorthrown){
    res.json({
        message: "You are signed up"
    })
   }
   
});


app.post("/signin", async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const response = await UserModel.findOne({
        email: email
        
    });

    if(!response){
        res.status(403).json({
            msg : "User doesnt exist"
        })
        return
    }

    const passwordmatch = await bcrypt.compare(password, response.password);

    if (passwordmatch) {
        const token = jwt.sign({
            id: response._id.toString()
        }, JWT_SECRET);

        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Incorrect creds"
        })
    }
});


app.post("/todo", auth, async function(req, res) {
    const userId = req.userId;
    const title = req.body.title;
    const done = req.body.done;

    await TodoModel.create({
        userId,
        title,
        done
    });

    res.json({
        message: "Todo created"
    })
});


app.get("/todos", auth, async function(req, res) {
    const userId = req.userId;

    const todos = await TodoModel.find({
        userId
    });

    res.json({
        todos
    })
});

app.listen(3000);