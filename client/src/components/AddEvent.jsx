import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addEvent, updateEvent } from "../features/admin/adminSlice";
import {
  Calendar,
  MapPin,
  Image,
  DollarSign,
  Users,
  User,
  FileText,
  Check,
} from "lucide-react";

const AddEvent = () => {
  const { edit } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    eventName: "",
    eventDescription: "",
    eventDate: "",
    eventImage: "",
    status: "upcoming",
    location: "",
    availableSeats: "",
    organizer: "",
    price: "",
  });

  const {
    eventName,
    eventDescription,
    eventDate,
    eventImage,
    status,
    location,
    availableSeats,
    organizer,
    price,
  } = formData;

  const handleChange = (e) => {
    setFormData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();

    if (
      !eventName ||
      !eventDescription ||
      !eventDate ||
      !location ||
      !organizer
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      if (edit.isEdit) {
        await dispatch(updateEvent(formData)).unwrap();
      } else {
        await dispatch(addEvent(formData)).unwrap();
      }
      setFormData({
        eventName: "",
        eventDescription: "",
        eventDate: "",
        eventImage: "",
        status: "upcoming",
        location: "",
        availableSeats: "",
        organizer: "",
        price: "",
      });
    } catch (error) {
      console.error("Failed to save event:", error);
    }
  };

  useEffect(() => {
    if (edit.isEdit && edit.event) {
      setFormData(edit.event);
    }
  }, [edit.isEdit, edit.event]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          {edit.isEdit ? "Edit Event" : "Add New Event"}
        </h1>
        <p className="text-slate-600">
          Fill in the details below to{" "}
          {edit.isEdit ? "update the" : "create a new"} event.
        </p>
      </div>

      <form
        onSubmit={handleAddEvent}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Event Title
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="h-5 w-5 text-slate-400" />
              </div>
              <input
                name="eventName"
                value={eventName}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-[#0a0a38] focus:border-[#0a0a38] sm:text-sm"
                type="text"
                placeholder="e.g. Annual Tech Symposium"
              />
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              name="eventDescription"
              value={eventDescription}
              onChange={handleChange}
              rows={4}
              className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-[#0a0a38] focus:border-[#0a0a38] sm:text-sm"
              placeholder="Describe the event..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-slate-400" />
              </div>
              <input
                name="eventDate"
                value={eventDate}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-[#0a0a38] focus:border-[#0a0a38] sm:text-sm"
                type="date"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={status}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-[#0a0a38] focus:border-[#0a0a38] sm:text-sm"
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="postponed">Postponed</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Image URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Image className="h-5 w-5 text-slate-400" />
              </div>
              <input
                name="eventImage"
                value={eventImage}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-[#0a0a38] focus:border-[#0a0a38] sm:text-sm"
                type="text"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-slate-400" />
              </div>
              <input
                name="location"
                value={location}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-[#0a0a38] focus:border-[#0a0a38] sm:text-sm"
                type="text"
                placeholder="e.g. Main Auditorium"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Organizer
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                name="organizer"
                value={organizer}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-[#0a0a38] focus:border-[#0a0a38] sm:text-sm"
                type="text"
                placeholder="e.g. Student Council"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Available Seats
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-slate-400" />
              </div>
              <input
                name="availableSeats"
                value={availableSeats}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-[#0a0a38] focus:border-[#0a0a38] sm:text-sm"
                type="number"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Price (₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-slate-400" />
              </div>
              <input
                name="price"
                value={price}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-[#0a0a38] focus:border-[#0a0a38] sm:text-sm"
                type="number"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-[#0a0a38] text-white rounded-lg font-medium hover:bg-[#050520] transition-colors flex items-center gap-2 shadow-sm"
          >
            <Check size={20} />
            {edit.isEdit ? "Update Event" : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEvent;
