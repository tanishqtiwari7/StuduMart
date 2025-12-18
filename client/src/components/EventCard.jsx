import { Link } from "react-router-dom";
import { formatDateTime } from "../utils/format";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getComments } from "../features/comments/commentsSlice";
import { Calendar, MapPin, Users, MessageCircle } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";

const EventCard = ({ event }) => {
  const eventDate = new Date(event.eventDate);
  const month = eventDate
    .toLocaleDateString("en-US", { month: "short" })
    .toUpperCase();
  const day = eventDate.getDate();

  const dispatch = useDispatch();
  const { allComments } = useSelector((state) => state.comments);

  // Filter comments for this specific event
  const eventComments = allComments.filter(
    (comment) => comment.event === event._id || comment.event?._id === event._id
  );
  const commentCount = eventComments.length;

  useEffect(() => {
    dispatch(getComments(event._id));
  }, []);

  return (
    <Link to={`/event/${event._id}`} className="block h-full group">
      <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-slate-200">
        <div className="relative h-48 overflow-hidden bg-slate-100">
          <img
            src={event.eventImage}
            alt={event.eventName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm p-2 text-center min-w-[50px]">
              <div className="text-xs font-bold text-[#0a0a38] uppercase tracking-wider">
                {month}
              </div>
              <div className="text-xl font-bold text-slate-900">{day}</div>
            </div>
          </div>
        </div>

        <CardContent className="p-5 flex flex-col flex-grow">
          <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {event.eventName}
          </h3>

          <div className="mb-4">
            <p className="text-xl font-bold text-[#0a0a38]">₹{event.price}</p>
          </div>

          <div className="space-y-2 text-sm text-slate-600 mb-4 flex-grow">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-400" />
              <span>{formatDateTime(event.eventDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-slate-400" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-auto">
          <div className="flex items-center text-sm text-slate-500 gap-1.5 pt-4">
            <Users size={16} className="text-[#0a0a38]" />
            <span className="font-medium">{event.availableSeats} Seats</span>
          </div>
          <div className="flex items-center text-sm text-slate-500 gap-1.5 pt-4">
            <MessageCircle size={16} className="text-slate-400" />
            <span className="font-medium">{commentCount}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default EventCard;
