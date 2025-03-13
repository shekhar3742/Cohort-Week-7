const express = require("express");
const app = express();
const jsonweb = require("jsonwebtoken");
const JWT_Secret = "AyushBhaiiii";
const {UserModel, TodoModel} = require("./db");
const  mongoose = require("mongoose");

mongoose.connect("your mongodb url/your folder name in which you want to stote data in database")

app.use(express.json());

app.post('/signup', async function(req, res){
    const email = req.body.email;
    const password= req.body.pasword;
    const name = req.body.name;

    await UserModel.create({
        email: email,
        password: password,
        name: name
    })
    res.json({
        msg: "you are signed up"
    })
});

app.post('/signin', auth, async function(req, res){
    const email = req.body.email;
    const password= req.body.pasword;

    const user = await UserModel.findOne({
        email: email,
        password: password
    })

    console.log(user);

    if(user){
        console.log({
            id: user._id.toString()
        })
        const token = jsonweb.sign({
            id: user._id.toString()
        },JWT_Secret);
        res.json({
            token: token
        });
    }
    else{
        res.status(403).json({
            msg: "Invalid Credentials"
        })
    }
})

app.post('/todo', auth,  async function(req, res){
    const userid = req.userid;
    const tittle = req.tittle;
    const done = req.done;
    
    await TodoModel.create({
        userid,
         tittle,
         done
    });

    res.json({
        msg : "Todo created"
    })
})


app.get('/todos', auth, async function(req, res){
    const userid = req.userid;
    const todos = await TodoModel.find({
        userid
    })
    res.json({
      todos
    })
})

function auth(req, res, next){
    const token = req.headers.token;

    const decodeuser = jsonweb.verify(token, JWT_Secret);
    if(decodeuser){
        req.userid = decodeuser.id;
        next();
    }
    else{
        res.status(403).json({
            msg : "Invalid crediantials"
        })
    }
}



app.listen(3000);