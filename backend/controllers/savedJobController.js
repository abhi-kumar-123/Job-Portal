const Application = require("../models/SavedJob")
const Job = require("../models/Job")
const SavedJob = require("../models/SavedJob")


//@desc Apply to job
exports.saveJob = async (req, res) => {
    try {
        const exists = await SavedJob.findOne({
            job: req.params.jobId, jobseeker: req.user._id
        })

        if (exists) {
            return res.status(400).json({
                message: "Job already saved"
            })
        }

        const saved = await SavedJob.create({
            job: req.params.jobId,
            jobseeker: req.user._id
        })
        res.status(201).json(saved)
    } catch (err) {
        res.status(500).json({
            message: "Failed to save jobs",
            error: err.message
        })
    }
}


//@desc Apply to job
exports.unsaveJob = async (req, res) => {
    try {
        await SavedJob.findOneAndDelete({
            job: req.params.jobId,
            jobseeker: req.user._id
        });

        res.json({ message: "Job Removed from saved list." })
    } catch (err) {
        res.status(500).json({
            message: "Failed to remove save jobs",
            error: err.message
        })
    }
}


//@desc Apply to job
exports.getMySavedJobs = async (req, res) => {
    try {
        const savedJobs = await SavedJob.find({
            jobseeker: req.user._id
        }).p0opulate({
            path: "job",
            populate: {
                path: "company",
                select: "name companyName companyLogo"
            }
        });
        res.json(savedJobs)
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch save jobs",
            error: err.message
        })
    }
}

