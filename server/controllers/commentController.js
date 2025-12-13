const Comment = require('../models/commentModel')
const User = require("../models/userModel")
const Event = require("../models/eventModel")

const addComment = async (req, res) => {

    if (!req.body.text) {
        res.status(400)
        throw new Error('Please Add Text!')
    }

    const newComment = await Comment.create({ text: req.body.text, user: req.user._id, event: req.params.eid })

    const event = await Event.findById(req.params.eid)
    const user = await User.findById(req.user._id)

    if (!newComment || !event || !user) {
        res.status(400)
        throw new Error("Comment Not Added!")
    }

    res.status(201).json({
        _id: newComment._id,
        createdAt: newComment.createdAt,
        text: newComment.text,
        event,
        user
    })

}

const getComments = async (req, res) => {
    const comments = await Comment.find({ event: req.params.eid }).populate('user').populate('event')

    if (!comments) {
        res.status(404)
        throw new Error('Comments Not Found!')
    }

    res.status(200).json(comments)

}


module.exports = { addComment, getComments }