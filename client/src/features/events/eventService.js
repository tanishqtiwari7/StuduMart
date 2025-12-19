import axios from "axios";

const fetchEvents = async (params) => {
  const response = await axios.get("/api/event", { params });
  return response.data;
};

const fetchEvent = async (eid) => {
  const response = await axios.get("/api/event/" + eid);
  return response.data;
};

const rsvpEvent = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  let id = data;
  let body = {};

  if (typeof data === "object" && data.id) {
    id = data.id;
    body = data.teamData;
  }

  const response = await axios.post("/api/event/" + id + "/rsvp", body, config);
  return response.data;
};

const eventService = { fetchEvents, fetchEvent, rsvpEvent };

export default eventService;
