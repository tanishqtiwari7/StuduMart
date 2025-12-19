import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addEvent, updateEvent } from "../features/admin/adminSlice";
import { getCategories } from "../features/categories/categorySlice";
import {
  Calendar,
  MapPin,
  Image,
  DollarSign,
  Users,
  User,
  FileText,
  Check,
  Tag,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";

import { toast } from "react-toastify";
import axios from "axios";

const AddEvent = () => {
  const { edit } = useSelector((state) => state.admin);
  const { categories } = useSelector((state) => state.category);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCategories("event"));
  }, [dispatch]);

  const [uploading, setUploading] = useState(false);
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
    category: "",
    isTeamEvent: false,
    teamPrice: "",
    minTeamSize: 1,
    maxTeamSize: 1,
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
    category,
    isTeamEvent,
    teamPrice,
    minTeamSize,
    maxTeamSize,
  } = formData;

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => {
      return {
        ...prev,
        [e.target.name]: value,
      };
    });
  };

  // Ensure price is a number before sending
  const prepareFormData = () => {
    return {
      ...formData,
      price: Number(formData.price),
      availableSeats: Number(formData.availableSeats),
      teamPrice: Number(formData.teamPrice),
      minTeamSize: Number(formData.minTeamSize),
      maxTeamSize: Number(formData.maxTeamSize),
    };
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const { data } = await axios.post("/api/upload", formData);

      // Fix: Ensure we use the correct path format
      const imagePath = data.replace(/\\/g, "/");
      setFormData((prev) => ({ ...prev, eventImage: imagePath }));
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
      toast.error("Image upload failed");
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();

    if (
      !eventName ||
      !eventDescription ||
      !eventDate ||
      !location ||
      !organizer ||
      !category ||
      !eventImage
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const dataToSend = prepareFormData();

    try {
      if (edit.isEdit) {
        await dispatch(updateEvent(dataToSend)).unwrap();
        toast.success("Event updated successfully");
      } else {
        await dispatch(addEvent(dataToSend)).unwrap();
        toast.success("Event created successfully");
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
        category: "",
        isTeamEvent: false,
        teamPrice: "",
        minTeamSize: 1,
        maxTeamSize: 1,
      });
    } catch (error) {
      console.error(error);
      toast.error(error || "Operation failed");
    }
  };

  useEffect(() => {
    if (edit.isEdit && edit.event) {
      setFormData(edit.event);
    }
  }, [edit.isEdit, edit.event]);

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>{edit.isEdit ? "Edit Event" : "Create New Event"}</CardTitle>
        <CardDescription>
          Fill in the details below to{" "}
          {edit.isEdit ? "update the" : "create a new"} event.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddEvent} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Event Name
              </label>
              <div className="relative">
                <FileText
                  className="absolute left-3 top-2.5 text-slate-400"
                  size={20}
                />
                <Input
                  type="text"
                  name="eventName"
                  value={eventName}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="e.g. Tech Symposium 2024"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Category
              </label>
              <div className="relative">
                <Tag
                  className="absolute left-3 top-2.5 text-slate-400"
                  size={20}
                />
                <select
                  name="category"
                  value={category}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 pl-10 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a38] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Date & Time
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-2.5 text-slate-400"
                  size={20}
                />
                <Input
                  type="datetime-local"
                  name="eventDate"
                  value={eventDate}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Location
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-2.5 text-slate-400"
                  size={20}
                />
                <Input
                  type="text"
                  name="location"
                  value={location}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="e.g. Main Auditorium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Organizer
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-2.5 text-slate-400"
                  size={20}
                />
                <Input
                  type="text"
                  name="organizer"
                  value={organizer}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="e.g. Computer Science Dept"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Available Seats
              </label>
              <div className="relative">
                <Users
                  className="absolute left-3 top-2.5 text-slate-400"
                  size={20}
                />
                <Input
                  type="number"
                  name="availableSeats"
                  value={availableSeats}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="e.g. 100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Price (₹)
              </label>
              <div className="relative">
                <DollarSign
                  className="absolute left-3 top-2.5 text-slate-400"
                  size={20}
                />
                <Input
                  type="number"
                  name="price"
                  value={price}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="0 for free events"
                  disabled={isTeamEvent}
                />
              </div>
            </div>

            {/* Team Event Section */}
            <div className="col-span-1 md:col-span-2 space-y-4 border p-4 rounded-md bg-slate-50">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isTeamEvent"
                  checked={isTeamEvent}
                  onChange={handleChange}
                  id="isTeamEvent"
                  className="h-4 w-4 rounded border-gray-300 text-[#0a0a38] focus:ring-[#0a0a38]"
                />
                <label
                  htmlFor="isTeamEvent"
                  className="text-sm font-medium text-slate-700"
                >
                  Is this a Team Event?
                </label>
              </div>

              {isTeamEvent && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Team Price (₹)
                    </label>
                    <Input
                      type="number"
                      name="teamPrice"
                      value={teamPrice}
                      onChange={handleChange}
                      placeholder="Amount per team"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Min Team Size
                    </label>
                    <Input
                      type="number"
                      name="minTeamSize"
                      value={minTeamSize}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Max Team Size
                    </label>
                    <Input
                      type="number"
                      name="maxTeamSize"
                      value={maxTeamSize}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Image URL
              </label>
              <div className="relative">
                <Image
                  className="absolute left-3 top-2.5 text-slate-400"
                  size={20}
                />
                <Input
                  type="text"
                  name="eventImage"
                  value={eventImage}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="https://..."
                />
              </div>
              <div className="mt-2">
                <label className="text-sm font-medium text-slate-700 block mb-1">
                  Or Upload Image
                </label>
                <Input
                  type="file"
                  onChange={uploadFileHandler}
                  accept="image/*"
                />
                {uploading && (
                  <p className="text-sm text-blue-600">Uploading...</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              name="eventDescription"
              value={eventDescription}
              onChange={handleChange}
              rows={4}
              className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a38] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Detailed description of the event..."
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="bg-[#0a0a38] hover:bg-slate-900 w-full md:w-auto"
            >
              <Check size={20} className="mr-2" />
              {edit.isEdit ? "Update Event" : "Create Event"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddEvent;
