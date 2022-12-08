const express = require('express');
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyparser = require('body-parser')


const UserRoute = require('./routes/UserRoutes')
const URI ='mongodb+srv://shabanu08:Anisha123@cluster0.kj8in.mongodb.net/test';
   
mongoose.Promise = global.Promise;
mongoose.connect(URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
   useUnifiedTopology: true ,
   useCreateIndex:true
}).then(() => {
    console.log('Database connected sucessfully ')
  },
  error => {
    console.log('Could not connected to database : ' + error)
  }
)
const app = express();
const PORT = process.env.PORT || 4000;
app.use(bodyparser.json());
app.use(morgan('dev'))
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())
app.use('/api/user',UserRoute)

app.get("/", (req, res) => {
    res.json({ message: "API Working" });
  });
  
app.listen(PORT, (req, res) => {
    console.log(`Server Started at PORT ${PORT}`);
  });