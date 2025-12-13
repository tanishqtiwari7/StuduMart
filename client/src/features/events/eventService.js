import axios from "axios";

const fetchEvents = async (params) => {
  const response = await axios.get("/api/event", { params });
  return response.data;
};

const fetchEvent = async (eid) => {
  const response = await axios.get("/api/event/" + eid);
  return response.data;
};

const rsvpEvent = async (eid, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post("/api/event/" + eid + "/rsvp", {}, config);
  return response.data;
};

const eventService = { fetchEvents, fetchEvent, rsvpEvent };

export default eventService;
