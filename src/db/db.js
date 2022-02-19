const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')

mongoose.connect("mongodb://127.0.0.1:27017/ecomadminpanel").then(() => {
    console.log("Mongodb connected");
}).catch(() => {
    console.log("Mongodb Failed");
})


const register = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String
        }
    }]
})

register.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({
            _id: this.id.toString()
        }, "qwertyuiopasdfghjklzxcvbnmqwertyu")
        this.tokens = this.tokens.concat({
            token: token
        })
        await this.save()
        return token
    } catch (error) {
        console.log(`Error ${error}`);
    }
}

const login = mongoose.model("adminpanelecom", register);

const product = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    }

})

const addproducts = mongoose.model("addproduct", product);

module.exports = {
    login,
    addproducts
};