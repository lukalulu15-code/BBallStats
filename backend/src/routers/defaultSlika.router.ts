import express from 'express';
import { DefaultSlikaContoller } from '../controllers/defaultSlika.controller';

const defaultSlikaRouter=express.Router();

defaultSlikaRouter.route("/addDefaultSlika").post(
    (req,res)=> new DefaultSlikaContoller().addDefaultSlika(req,res)
)
defaultSlikaRouter.route("/getDefaultSlika").get(
    (req,res)=> new DefaultSlikaContoller().getDefaultSlika(req,res)
)

export default defaultSlikaRouter;