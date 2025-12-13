import axios from "axios"

const API_URL = "/api/admin/"


const fetchAllUsers = async (token) => {

    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL + "users", options)
    return response.data
}

const fetchAllEvents = async () => {
    const response = await axios.get("/api/event")
    return response.data
}

const fetchAllListings = async () => {
    const response = await axios.get("/api/product")
    return response.data
}


const updateListing = async (updatedProduct, token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put("/api/admin/product/" + updatedProduct._id, updatedProduct, options)
    console.log(response.data)
    return response.data

}

const updateUser = async (updatedUser, token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put("/api/admin/users/" + updatedUser._id, updatedUser, options)
    return response.data

}


const createEvent = async (formData, token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post("/api/admin/event", formData, options)
    return response.data

}

const update = async (updatedEvent, token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put("/api/admin/event/" + updatedEvent._id, updatedEvent, options)
    console.log(response.data)
    return response.data

}



const adminService = { fetchAllUsers, fetchAllEvents, fetchAllListings, updateListing, updateUser, createEvent, update }

export default adminService 