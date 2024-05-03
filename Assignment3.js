const express= require('express')
const path=require('path')
const fs=require('fs')
const app=express()
app.use(express.json())
///////////////////////////////////////////////
// Middleware to check if the member is uniqe to POST
let isMemberUniqe= (req,res,next)=>{
    let nationalId= +req.body.nationalId
    let members= JSON.parse(fs.readFileSync('members.json','utf-8'))
    let found= members.findIndex((member)=>member.nationalId===nationalId)
    if(found===-1){
        next()
    }else{
        res.json({message:"Member is already there."})
    }
    }
    // middlware check if member id exists && if member deleted softly
    const checkMemberExistance=(req,res,next)=>{
        const {id}=req.params
        let members=JSON.parse(fs.readFileSync('members.json','utf-8'))
        const memberIdx=members.findIndex(mem=>mem.id===+id)
        let isDeleted=false
        isDeleted=members[memberIdx].deleted
        if(memberIdx===-1||isDeleted){
            res.status(404).json({message:'member not found'})
        }else{
            next()
        }
    }
    // middleware to check if trainer id exists
    const checkTrainerId=(req,res,next)=>{
        const {id}=req.params
        let trainers=JSON.parse(fs.readFileSync('trainers.json','utf-8'))
        const trainer=trainers.findIndex(tr=>tr.id===+id)
        if(trainer===-1){
            res.status(404).json({message:'trainer not found'})
        }else{
            next()
        }
    }

//////////////////////////////////////
/////////////////////////////////////
// Trainers API
// GET all trainers with their members
app.get('/trainers',(req,res)=>{
let members=JSON.parse(fs.readFileSync('members.json','utf-8'))
let trainers=JSON.parse(fs.readFileSync('trainers.json','utf-8'))
let trainersWithMembers= trainers.map((trainer)=>{
    let trainerMembers=members.filter((member)=>member.trainerId===trainer.id)
    trainer.members=trainerMembers.map(((t)=>[t.name,t.membership]))
    return trainer
})
res.json(trainersWithMembers)
})
// GET spesefic trainer with his members
app.get('/trainers/:id',checkTrainerId,(req,res)=>{
    let members=JSON.parse(fs.readFileSync('members.json','utf-8'))
    let trainers=JSON.parse(fs.readFileSync('trainers.json','utf-8'))
    let idx = trainers.findIndex((t)=>t.id===+req.params.id)
    let trainerMembers= members.filter((member)=>member.trainerId===trainers[idx].id)
    trainers[idx].members=trainerMembers.map((t)=>[t.name,t.membership])
    let trainerWithMembers=trainers[idx]
    res.json(trainerWithMembers)
})
// POST new trainer
app.post('/trainers',(req,res)=>{
let trainers=JSON.parse(fs.readFileSync('trainers.json','utf-8'))
req.body.id=trainers.length+1
trainers.push(req.body) 
fs.writeFileSync('trainers.json',JSON.stringify(trainers))
res.status(201).json({message:"added"})
}) 
// PUT trainer
app.put('/trainers/:id',checkTrainerId,(req,res)=>{
    let trainers=JSON.parse(fs.readFileSync('trainers.json','utf-8'))
    let idx= trainers.findIndex((t)=>t.id===+req.params.id)
    trainers[idx]=req.body
    fs.writeFileSync('trainers.json',JSON.stringify(trainers))
    res.json({message:"updated"})
})
// DELETE trainer
app.delete('/trainers/:id',checkTrainerId,(req,res)=>{
    let trainers=JSON.parse(fs.readFileSync('trainers.json','utf-8'))
    let idx= trainers.findIndex((t)=>t.id===+req.params.id)
    trainers.splice(idx,1)
    fs.writeFileSync('trainers.json',JSON.stringify(trainers))
    res.json({message:"deleted"})
})
// Members API
// POST member if uniqe
app.post('/members',isMemberUniqe,(req,res)=>{
let members=JSON.parse(fs.readFileSync('members.json','utf-8'))
req.body.id=members.length+1
members.push(req.body)
fs.writeFileSync('members.json',JSON.stringify(members))
res.status(201).json({message:"added"})
})
// GET member check his membership
app.get('/members/:id',checkMemberExistance,(req,res)=>{
    let members = JSON.parse(fs.readFileSync('members.json','utf-8'))
    idx=members.findIndex((mem)=>mem.id===+req.params.id)
    let today= new Date()
    let startDate=new Date(members[idx].membership.from)
    let endDate=new Date(members[idx].membership.to)
    if(today>startDate&&today<endDate){
        res.json(members[idx])
    }else{
        
        res.json({message:"this member is not allowed to enter the gym"})
    }
})
// GET all members with their trainer
app.get('/members',(req,res)=>{
    let members=JSON.parse(fs.readFileSync('members.json','utf-8'))
    let trainers=JSON.parse(fs.readFileSync('trainers.json','utf-8'))
    membersWithTrainers=members.map((mem)=>{
        let memberTrainer= trainers.filter((tr)=>tr.id===mem.trainerId)
        mem.trainer=memberTrainer
        return mem
    })
    res.json(membersWithTrainers)
})

// PUT member (name,membership,trainerId)
app.put('/members/:id',checkMemberExistance,(req,res)=>{
    let members=JSON.parse(fs.readFileSync('members.json','utf-8'))
    let idx=members.findIndex(mem=>mem.id===+req.params.id)
    members[idx].name=req.body.name
    members[idx].membership=req.body.membership
    members[idx].trainerId=req.body.trainerId
    fs.writeFileSync('members.json',JSON.stringify(members))
    res.json({message:'member updated'})
})
// DELETE member (soft delete)
app.delete('/members/:id',checkMemberExistance,(req,res)=>{
    let members=JSON.parse(fs.readFileSync('members.json','utf-8'))
    let idx=members.findIndex(mem=>mem.id===+req.params.id)
    members[idx].deleted=true
    members[idx].membership.cost=0
    fs.writeFileSync('members.json',JSON.stringify(members))
    res.json({message:'member deleted'})
})
///////////////////////////////////////
// GET revenues of all members
app.get('/membersrev',(req,res)=>{
    let members=JSON.parse(fs.readFileSync('members.json','utf-8'))
    let total=0
    total = members.reduce((acc,mem)=>acc+mem.membership.cost,0)
    res.json({"total revenues":total})
})
// GET revenues of a specefic trainer
app.get('/trainersrev/:id',checkTrainerId,(req,res)=>{
    let members=JSON.parse(fs.readFileSync('members.json','utf-8'))
    let trainerMembers=members.filter((mem)=>mem.trainerId===+req.params.id)
    let total = trainerMembers.reduce((acc,mem)=>acc+mem.membership.cost,0)
    res.json({"Trainer total revenues":total})
})
app.listen(3000,()=>{console.log('server is running..')})