const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectID = mongoose.ObjectID;


const user = new Schema({
    email: {type: String, unique: true},
    password: String,
    name: String
})


const todo = new Schema({
    tittle: String,
    done: Boolean,
    userid: ObjectID
})

const UserModel = mongoose.model("user", user);
const TodoModel = mongoose.model("todos", todo);

module.exports ={
    UserModel: UserModel,
    TodoModel: TodoModel
}