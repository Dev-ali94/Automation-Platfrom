import mongoose, { Schema } from "mongoose"

const generationSchema = new mongoose.Schema({
 user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:"true"},
 promt:{type:String,required:true},
 content:{type:String,required:true},
 tone:{type:String}
 
},{timestamps:true})

export const Generation = mongoose.model("Generation",generationSchema)
export default Generation