const messageModel = require("../model/messageModel");

module.exports.addMessage=async(req,res,next)=>{
    try {
        const {from,to,message}=req.body;
        const data=await messageModel.create({
            message:{text:message},
            users:[from,to],
            sender:from
        });
        if(data)return res.json({msg:"Message added successfully"})
        return res.json({msg:"Failed to add message to the database"})
    } catch (error) {
        next(ex);
    }
};
module.exports.getAllMessages=async(req,res,next)=>{
    try {
        const {from,to}=req.body;
        const messages=await messageModel.find({
            users:{
                $all:[from,to],
            },
        }).sort({updatesAt:1});
        const projectMessages=messages.map((msg)=>{
            return{
                fromSelf:msg.sender.toString()===from,
                message:msg.message.text,
            };
        });
        res.json(projectMessages);
    } catch (error) {
        next(error);
    }
};