import activityLog from "../models/ActivityLog.js"

export const getActivity = async (req,res) => {
    try {
        const activity = await activityLog.find({user:req.user._id}).sort({createdAt:-1}).limit(10).populate("relatedPost","content")
        return res.status(201).json({message:"ActivityLog Fetch Sucessfully",success:true,activity})
    } catch (error) {
         return res.status(500).json({ success: false,message: "Failed to fetch activityLog",error: error?.message || error});
    }
}