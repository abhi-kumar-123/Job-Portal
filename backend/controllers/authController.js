const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
//Generate token

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "60d" })
};

//@desc Register new User
const register = async (req, res) => {
    try {
        const { name, email, password, avatar, role } = req.body
        const userExists = await User.findOne({ email })

        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name, email, password:hashedPassword, avatar, role
        });



        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            token: generateToken(user._id),
            companyName: user.companyName || '',
            companyDescription: user.companyDescription || '',
            companyLogo: user.companyLogo || '',
            resume: user.resume || ''
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
};

//@desc Login User
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })

        if (!user || !(await user.matchPassword(password))) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }
        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar || '',
            role: user.role,
            token: generateToken(user._id),
            companyName: user.companyName || '',
            companyDescription: user.companyDescription || '',
            companyLogo: user.companyLogo || '',
            resume: user.resume || ''
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
};

//@desc Get Logged-in user
const getMe = async (req, res) => {
    try {
        return res.json(req.user)
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
};


module.exports = {
    register,
    login,
    getMe
};