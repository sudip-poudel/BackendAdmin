import express,{Request, Response}  from 'express'
import * as dotenv from 'dotenv';
dotenv.config();


import './database/connection'
const cors = require('cors');
const app = express()
const PORT = 4000
app.use(express.json());

import RegisterAdmin from './service/RegisterAdmin';
RegisterAdmin()

import AdminRoute from './routes/adminRoutes/adminRoutes'
import ClientRoutes from "./routes/clientRoutes/clientRoutes";

app.use(express.static("./src/uploads/")) 

app.use(cors({ 
    origin: '*' 
  }));


app.use('/admin', AdminRoute )
app.use('/client', ClientRoutes )

  
app.listen(PORT, ()=>{
    console.log('Server has started at', PORT)
})
