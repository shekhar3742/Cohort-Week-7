const express = require("express");
const app = express();
const jsonweb = require("jsonwebtoken");
const JWT_Secret = "AyushBhaiiii";
const {UserModel, TodoModel} = require("./db")

app.use(express.json());

app.post('/signup', async function(req, res){
    const email = req.body.email;
    const password= req.body.pasword;
    const name = req.body.name;

    await UserModel.insert({
        email: email,
        password: password,
        name: name
    })
    res.json({
        msg: "you are signed up"
    })
});

app.post('/signin', async function(req, res){
    const email = req.body.email;
    const password= req.body.pasword;

    const user = await UserModel.findOne({
        email: email,
        password: password
    })

    console.log(user);

    if(user){
        const token = jsonweb.sign({
            id: user._id
        });
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

app.post('/todo', function(req, res){

})


app.get('/todos',function(req, res){

})

app.listen(3000);