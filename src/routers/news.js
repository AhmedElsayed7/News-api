const express = require('express')
const News = require('../models/news')
const multer = require('multer')
const auth = require('../middelware/auth')

const router = new express.Router()

// Adding News 


// router.post('/news',auth,async(req,res)=>{
//    try {
//     const news = News({...req.body, author:req.author._id})
//     await news.save()
//     res.status(200).send(news)
//    }
//    catch(error){
//     res.status(500).send(error)
//    }
// })

router.post('/news', auth.authorAuth, async (req, res) => {
    try {
        const news = new News({
            ...req.body,
            owner: req.author._id
        })
        await news.save()
        res.status(200).send(news)
    } catch (e) {
        res.status(500).send(e.message)
    }
})
// Get News 

router.get('/news',auth.authorAuth,async(req,res)=>{
    try {
        await req.author.populate('news')
        res.status(200).send(req.author.news)
    }
    catch(error){
        res.status(500).send(error)
       }
})

// get bt id 

router.get('/news/:id',auth.authorAuth,async(req,res)=>{
  try {
    const _id = req.params.id
    const news = await News.findOne({_id ,
         author : req.author.id})
         if (!news){
             res.status(404).send('Not found any news')

         }
         res.status(500).send(news)
        }
         catch(error){
            res.status(500).send(error)
           }
        
})

// patch 

router.patch('/news/:id',auth.authorAuth,async(req,res)=> {
    try {
        const _id = req.params.id 
        const author = await Author.findOneAndUpdate({
            _id , 
            owner : req.user._id
        } , 
        req.body ,{
            new : true , 
            runValidators:true
        })
        if (!author){
            res.status(404).send('No news is found ')
        } 
        res.status(200).send(news)  
    }
    catch(error){
        res.status(500).send(error)  

    }
        
})


// delete by id 

router.delete('/news/:id',auth.authorAuth,async(req,res)=>{
    try {
        const news = await News.findByIdAndDelete(req.params.id)
        if(!news){
            res.status(404).send('No news is found ')
        }
        res.status(200).send(news)  
    }
    catch(error){
        res.status(500).send(error)  

    }
})

// get by id 

router.get('/Authornews/:id',auth.authorAuth,async(req,res)=>{
    try{
        const _id = req.params.id
        const news = await News.findOne({_id,owner:req.user._id})
        if(!news){
            return res.status(404).send('No task is found')
        }
        await author.populate('owner')
        res.status(200).send(news.owner)
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


router.post('/news/:id', auth.authorAuth, uploads.single('image'), async (req, res) => {
    try {
        const _id = req.params.id
        const news = await News.findById({
            _id,
            owner: req.author._id
        })
        if (!news) {
            return res.status(400).send('Unable to find news.')
        }
        news.image = req.file.buffer
        await news.save()
        res.send()
    } catch (e) {
        res.status(500).send(e.message)
    }
})
    
    

module.exports = router