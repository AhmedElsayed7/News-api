const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const authorSchema = new mongoose.Schema({
    name:{
        type:String ,
        required:true,
        trim:true 
    },
    age:{
        type:Number ,
        default:20
    },
    email:{
        type:String ,
        required:true,
        trim:true,
        unique:true,
        trim:true,
        lowercase:true, 
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
    } 
}  , 
    password:{
          type:String,
          required:true,
          trim:true, 
          minLength:true
    },
    address:{
        type:String ,
        required: true,
        trim: true
    },  
    mobile:{
        type:String ,
        required:true,
        // validate(value) {
        //     let phoneRegex = new RegExp("^01[0-2,5]{1}[0-9]{8}$")
        //     if (!phoneRegex.test(value)) {
        //         throw new Error('Invalid phone number.')
        //     }
        // }
        validate(value){
            if (!validator.isMobilePhone(value.replace('0',''),'ar-EG') || value.length > 11 ){
                throw new Error('Invalid phone number')
            }
        }

    } ,
    tokens:[
        {
            type:String,
            required:true
        }
    ],
    roles:{
        type:String,
        enum:['admin','author'],
        default:'author'
    },
    avatar:{
        type:Buffer
    }
})





authorSchema.virtual('news', {
    ref: 'News',
    localField: '_id',
    foreignField: 'owner'
})


authorSchema.pre('save',async function(){
    const author = this

      // check if author password ismodifed or not
    // if modifed hash it 
    // if not , not change hashing passwored
    if(author.isModified('password'))
    author.password = await bcrypt.hash(author.password,8)
})

authorSchema.statics.findByCredentials = async (email,password) =>{
    const author = await Author.findOne({email})
    if(!author){
        throw new Error('Unable to login..check email or password')
    }
// false 
    const isMatch = await bcrypt.compare(password,author.password)
    console.log(isMatch)
    if(!isMatch){
        throw new Error('Unable to login..check email or password')
    }
    return author

}

// generating Token
authorSchema.methods.generateToken = async function() {
    // user.tokens = []
    const author = this
    const token = jwt.sign({
        _id:author._id.toString()
    },process.env.JWT_SECRET)


    author.tokens = author.tokens.concat(token)
    await author.save()
    return token
}



const Author = mongoose.model('Author', authorSchema)
module.exports = Author

   
