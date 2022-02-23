const express = require('express')
const Author = require('../models/author')
const auth = require('../middelware/auth')
const multer = require('multer')
const router= new express.Router()
// operations 

router.post('/signup',async(req,res)=>{
    try {
        console.log(req.author);
        const author = new Author(req.body)
        await author.save()
        // console.log(author)
        const token = await author.generateToken()
        res.status(200).send({author,token})
    }
    catch(error){
        res.status(400).send(error)
    }
})

//////
// login 
router.post('/login',async(req,res)=>{
try {
     const author = await Author.findByCredentials(req.body.email,req.body.password)
    const token = author.generateToken()
    res.status(200).send({author,token})
}
catch(error){
    res.status(400).send(error)
}
})

// get profile
// router.get('/profile',auth, async (req,res)=>{
//     res.status(200).send(req.author)
// })

router.get('/profile', auth.authorAuth, async (req, res) => {
    res.status(200).send(req.author)
})

// patch 

router.patch('/profile',auth.authorAuth,async(req,res)=>{
    try{
        const updates = Object.keys(req.body)
        console.log(updates)
        // old data (data stored in db)
       const author = await Author.findById(req.params.id)
       console.log(user)
    //    console.log(req.body)
       if(!req.Author){
        return res.status(404).send('No user is found')
    }
       updates.forEach((el)=>(author[el]=req.body[el]))
       await author.save()
        res.status(200).send(author)
    }
    catch(error){
        res.status(400).send(error)
    }
})
// delete 

router.delete('/profile',auth.authorAuth,async(req,res)=>{
    try{
        const author = await Author.findByIdAndDelete(req.params.id)
        if (!author) {
            return res.status(404).send('no author is found')
        }
        res.status(200).send(author)
    }
    catch(error){
        res.status(500).send(error)
    }

})


// log oug

router.delete('logout',auth.authorAuth,async(req,res)=>{
    try {
        req.author.tokens = req.author.tokens.filter((el)=>{
            return el !== req.token
        })
        await req.author.save()
        res.send('Logout Successfully')
    }
    catch(error){
        res.status(500).send(error)
    }

})


const uploads = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)) {
            cb(new Error('Please upload image'))
        }
        cb(null, true)
    }
})
router.post('/profile/avatar', auth.authorAuth, uploads.single('avatar'), async (req, res) => {
    try {
        req.author.avatar = req.file.buffer
        await req.author.save()
        res.send()
    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router