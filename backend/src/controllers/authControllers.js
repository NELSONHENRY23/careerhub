import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'

const register = async (req, res) => {
    const {name, email, password} = req.body;

    try{

        // Check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: 'User already exists'});
        }
        // Hash password
        const hashedpassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedpassword,
        })

        await user.save();
        res.status(201).json({message: 'User registered successfully'});


    }catch(error){
        res.status(500).json({message: "Server error"});
    }

}

const login = async (req, res) => {

    const {email, password} = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message: 'Invalid credentials'});

        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message: 'Invalid credentials'});
        }

        // Create JWT token
        const token = jwt.sign({userId: user._id, role: user.role}, process.env.JWT_SECRET,{expiresIn: '1h'});
        res.json({token, user});
    } catch (error) {
        res.status(500).json({message: "Server error"});
    }
}