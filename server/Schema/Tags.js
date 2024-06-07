import mongoose, { Schema } from "mongoose";

const TagsSchema=mongoose.Schema({
    tag:{
        type: String,
    }
})

export default mongoose.model("tags", TagsSchema);