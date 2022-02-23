const express = require('express')
const app = express()
const port = process.env.PORT || 8080

app.use(express.json())

// const bodyParser = require("body-parser");

// app.use(bodyParser.urlencoded({ extended: false })); 
// app.use(bodyParser.json());

const AuthorRouter = require('./routers/author')
const NewsRouter = require('./routers/news')
app.use(NewsRouter)
app.use(AuthorRouter)
// require('')

// convert json to object

require('./db/mongoose')




app.listen(port,()=>{
    console.log('Server is running on port '+port)
})  

