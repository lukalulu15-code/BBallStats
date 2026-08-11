import express from 'express';
import DefaultSlikaModel from "../models/defaultSlika";

export class DefaultSlikaContoller {
    addDefaultSlika = (req:express.Request,res:express.Response)=>{
        let defaultSlika=new DefaultSlikaModel({
            naziv:"default",
            slika:req.body.slika
        })
        defaultSlika.save().then((ok)=>{
            res.json({message:'ok'})
        }).catch(err=>{
            console.log(err)
        })
    }
    getDefaultSlika =(req:express.Request,res:express.Response)=>{
        DefaultSlikaModel.findOne({naziv:"default"}).then((defaultSlika)=>{
            res.json(defaultSlika)
        }).catch((err)=>{
            console.log(err);
        })
    }
}