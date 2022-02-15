const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const  {login, addproducts} = require("./db/db")
const cookieParser = require('cookie-parser')
const auth = require("./middleware/auth")
const multer  = require('multer');





app.set('view engine', 'html');
app.use(cookieParser())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))




app.use(express.static(path.join(__dirname, "../public")));

app.get("/",(req,res) => {
    res.render("index")

})





app.get("/dashboard", auth, (req,res) =>{
    res.sendFile(path.join(__dirname, "../public/dashboard.html"))
    
})


app.post("/login",async(req,res)=>{

    try {
        const email = req.body.email;
        const password = req.body.password;

        
        const user = await login.findOne({email : email})
        
        
        if(user == null){
            res.send("Failed")
        }else if(user.email === email && user.password === password){
            
            const token = await user.generateAuthToken();
            res.cookie("jwt", token, {
                expires : new Date(Date.now() + 100000000),
                httpOnly : true
                
            })
            

            res.redirect('/dashboard')
        }else{
            res.send("failed")
        }



    } 
    
    catch (error) {
        res.send(`Error ${error}`)
    }
    
})



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/img')
    },
    filename: function (req, file, cb) {
      
    //   cb(null, file.originalname)
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);


    }
  })


  const upload = multer({ storage : storage }) 




app.post("/addproducts",upload.single('img'),async (req,res)=>{
    const prodname = req.body.title;
    const cat = req.body.cat;
    const desc = req.body.description;
    const price = req.body.price;
    // const img = req.file.path;
    const imglink = (`http://localhost:5000/img//${req.file.filename}`);
    

    
   const addprod = new addproducts({
        title : prodname,
    category : cat,
    desc : desc,
    price : price,
    image : imglink
    })

    if(
   await addprod.save()){
       res.send("done")
   }else{
       res.send("failed")
   }
   
    
})

app.get("/api",async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
   const getdata = await addproducts.find()
   res.send(getdata)
})










app.listen(5000, ()=>{
    console.log(`Listening on port 5000`);
})