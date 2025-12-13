const jwt = require('jsonwebtoken')
const User = require("../models/userModel")

const protect = async (req, res, next) => {

    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(" ")[1]
            let decoded = jwt.verify(token, process.env.JWT_SECRET)
            let user = await User.findById(decoded.id).select('-password')

            if (!user) {
                res.status(401)
                throw new Error('Unauthorsed access')
            }
            req.user = user
            next()
        } catch (error) {
            res.status(401)
            throw new Error('Unauthorsed access')
        }

    } else {
        res.status(401)
        throw new Error('Unauthorsed access')

    }

}

module.exports = { protect }