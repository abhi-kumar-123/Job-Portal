const fs = require('fs')
const path = require('path')
const User = require('../models/User')

//@desc Update user profile (name,avatar, company, details)

exports.updateProfile = async (req, res) => {
    try {
        const {name,avatar,companyName,companyDescription,companyLogo,resume}=req.body
        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.name = name || user.name;
        user.avatar = avatar || user.avatar;
        user.resume = resume || user.resume;

        //If employer, allow updating company info
        if (user.role === "employer") {
            user.companyName = companyName || user.companyName
            user.companyDescription = companyDescription || user.companyDescription
            user.companyLogo = companyLogo || user.companyLogo
        }

        await user.save()

        res.json({
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
            companyName: user.companyName,
            companyDescription: user.companyDescription,
            companyLogo: user.companyLogo,
            resume: user.resume || ''
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};


//@desc  Delete resume file (Jobseeker file)

exports.deleteResume = async (req, res) => {
    try {

        const { resumeUrl } = req.body //expect resumeUrl to be the URL of the resume

        //Extract file name from the URL

        const fileName = resumeUrl?.split('/')?.pop();

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        if (user.role !== "'jobseeker") {
            return res.status(404).json({
                message: 'Only Jobseeker can delete resume'
            });
        }

        //Construct the full file path

        const filepath = path.join(__dirname, '../uploads', fileName);
        //check if the file exist and delete them
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }

        //set the user's resume to an empty string

        user.resume = ''
        await user.save()

        res.json({
            message: 'Resume deleted succesfully'
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

//@desc Get user public profile
exports.getPublicProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}