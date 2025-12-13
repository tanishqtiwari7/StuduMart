const User = require("../models/userModel")
const Event = require("../models/eventModel")
const Listing = require("../models/listingModel")
const Comment = require('../models/commentModel')

const getAllUsers = async (req, res) => {
    const users = await User.find()
    if (!users) {
        res.status(404)
        throw new Error('Users Not Found!')
    }
    res.status(200).json(users)
}

const updateUser = async (req, res) => {

    const updatedUser = await User.findByIdAndUpdate(req.params.uid, req.body, { new: true })

    if (!updatedUser) {
        res.status(400)
        throw new Error('User Not Updated')
    }

    res.status(200).json(updatedUser)

}

const addEvent = async (req, res) => {

    const { eventName, eventDescription, eventImage, eventDate, status, location, availableSeats, organizer, price } = req.body

    if (!eventName || !eventDescription || !eventImage || !eventDate || !status || !location || !availableSeats || !organizer || !price) {
        res.status(400)
        throw new Error("Please Fill Details")
    }

    let newEvent = await Event.create({
        eventName,
        eventDescription,
        eventImage,
        eventDate,
        status,
        location,
        availableSeats,
        organizer,
        price
    })

    if (!newEvent) {
        res.status(400)
        throw new Error('Event Not Created')
    }

    res.status(201).json(newEvent)



}

const updateEvent = async (req, res) => {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.eid, req.body, { new: true })

    if (!updatedEvent) {
        res.status(400)
        throw new Error('Event Not Updated')
    }

    res.status(200).json(updatedEvent)

}

const updateProductListing = async (req, res) => {
    const updatedListing = await Listing.findByIdAndUpdate(req.params.pid, req.body, { new: true }).populate('user')

    if (!updatedListing) {
        res.status(404)
        throw new Error('Product Not Updated!')
    }


    res.status(200).json(updatedListing)
}

const getAllComments = async (req, res) => {

    const comments = await Comment.find().populate('user').populate('event')
    if (!comments) {
        res.status(404)
        throw new Error('Comments Not Found!')
    }


    res.status(200).json(comments)


}


module.exports = { getAllUsers, updateUser, addEvent, updateEvent, updateProductListing, getAllComments }


