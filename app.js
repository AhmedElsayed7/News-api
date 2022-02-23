// const mongoose = require('mongoose');

// // connetc <<<  make you connet with DataBase
// // test name of database
// mongoose.connect('mongodb://127.0.0.1:27017/test');

// //model >>> properties like name age 
// const Cat = mongoose.model('Cat', { name: String });

// // 
// const kitty = new Cat({ name: 'Zildjian' });  
// // data
// // .save built in function ,save in database


const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/test')

//model >>> properties like name age 
const Cat = mongoose.model('Cat', { name: String });

// 
const kitty = new Cat({ name: 'Zildjian' });  
// data
// .save built in function ,save in database
