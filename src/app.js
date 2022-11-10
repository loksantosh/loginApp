const express=require("express")
const bodyparser=require("body-parser")
const mongoose=require("mongoose")
const app=express()

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))

const {createUser ,loginUser}=require('./controllers/userController')
const Port=process.env.port ||3000

//view engine
app.set('view engine' ,'ejs')

mongoose.connect('mongodb+srv://santosh:Santosh24@cluster0.xy0vu.mongodb.net/logindata?retryWrites=true&w=majority',{useNewUrlParser :true}
).then(()=>console.log("database connected") ,(error)=>console.log(error))

//routes

app.get('/' ,(req ,res)=>{
    res.render('base',{title:"login Page"})
})


app.post('/register' ,createUser)
app.post('/login' ,loginUser)


//logout
app.get('/dashboard' ,(req,res)=>{
    res.render('dashboard' ,{})
})

app.get('/logout' ,(req,res)=>{
    res.render('logout',{})
})

app.get('/signup' ,(req,res)=>{
    res.render('signup',{})
})



app.listen(Port ,()=>console.log(`server running on ${Port}`))