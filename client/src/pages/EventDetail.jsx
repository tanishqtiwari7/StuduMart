import { useParams, Link } from "react-router-dom";
import { formatDateTime, formatPrice, formatDate } from "../utils/format";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";
import Loader from "../components/Loader";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEvent, rsvpEvent, resetRsvp } from "../features/events/eventsSlice";
import { getComments } from "../features/comments/commentsSlice";
import { toast } from "react-toastify";
import PaymentButton from "../components/PaymentButton";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  User,
  Clock,
  Share2,
  CheckCircle,
  Ticket,
  Plus,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const EventDetail = () => {
  const {
    event,
    eventsLoading,
    eventsError,
    eventErrorMessage,
    rsvpLoading,
    rsvpSuccess,
  } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);
  const { eid } = useParams();
  const dispatch = useDispatch();
  const [showRsvpModal, setShowRsvpModal] = useState(false);

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamData, setTeamData] = useState({ teamName: "", teamMembers: [] });
  const [memberEmail, setMemberEmail] = useState("");

  const addMember = () => {
    if (memberEmail && !teamData.teamMembers.includes(memberEmail)) {
      setTeamData({
        ...teamData,
        teamMembers: [...teamData.teamMembers, memberEmail],
      });
      setMemberEmail("");
    }
  };

  const removeMember = (email) => {
    setTeamData({
      ...teamData,
      teamMembers: teamData.teamMembers.filter((e) => e !== email),
    });
  };

  const handleTeamSubmit = () => {
    const size = teamData.teamMembers.length + 1;
    if (size < event.minTeamSize || size > event.maxTeamSize) {
      toast.error(
        `Team size must be between ${event.minTeamSize} and ${event.maxTeamSize}`
      );
      return;
    }
    dispatch(rsvpEvent({ id: eid, teamData }));
    setShowTeamModal(false);
  };

  useEffect(() => {
    dispatch(getEvent(eid));
    dispatch(getComments(eid));
  }, [eid, dispatch]);

  useEffect(() => {
    if (eventsError && eventErrorMessage) {
      toast.error(eventErrorMessage);
    }
    if (rsvpSuccess) {
      toast.success("You're going! RSVP confirmed.");
      setShowRsvpModal(false);
      dispatch(resetRsvp());
    }
  }, [eventsError, eventErrorMessage, rsvpSuccess, dispatch]);

  const handleRsvp = () => {
    if (!user) {
      toast.error("Please login to RSVP");
      return;
    }
    dispatch(rsvpEvent(eid));
  };

  const handlePaymentSuccess = () => {
    dispatch(getEvent(eid)); // Refresh event data to show as attending
  };

  if (eventsLoading) {
    return <Loader />;
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Event not found
          </h2>
          <Link to="/events" className="text-[#0a0a38] hover:underline">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const isGoing = event.attendees?.some(
    (a) => a.user?._id === user?._id || a.user === user?._id
  );

  const spotsLeft = Math.max(
    0,
    (event.capacity || 50) - (event.attendees?.length || 0)
  );

  const isPaidEvent = !event.isFree && event.price > 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full">
        <img
          src={event.eventImage}
          alt={event.eventName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <Link
            to="/events"
            className="inline-flex items-center text-white/80 hover:text-white mb-6 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Events
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#0a0a38] text-white text-sm font-bold mb-3">
                {event.category?.name || "Event"}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {event.eventName}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(event.eventDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>
                    {new Date(event.eventDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <button className="px-6 py-3 bg-white/10 backdrop-blur hover:bg-white/20 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
                <Share2 size={20} />
                Share
              </button>

              {!isGoing ? (
                <>
                  {spotsLeft === 0 ? (
                    <button
                      disabled
                      className="px-8 py-3 bg-slate-600 text-white rounded-xl font-bold shadow-lg cursor-not-allowed"
                    >
                      Sold Out
                    </button>
                  ) : event.isTeamEvent ? (
                    <button
                      onClick={() => setShowTeamModal(true)}
                      className="px-8 py-3 bg-[#0a0a38] hover:bg-[#15154a] text-white rounded-xl font-bold shadow-lg transition-all flex items-center gap-2"
                    >
                      Register Team
                    </button>
                  ) : isPaidEvent ? (
                    <div className="w-48">
                      <PaymentButton
                        eventId={eid}
                        amount={event.price}
                        onPaymentSuccess={handlePaymentSuccess}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={handleRsvp}
                      disabled={rsvpLoading}
                      className="px-8 py-3 bg-[#0a0a38] hover:bg-[#15154a] text-white rounded-xl font-bold shadow-lg transition-all flex items-center gap-2"
                    >
                      {rsvpLoading ? "Processing..." : "RSVP Now"}
                    </button>
                  )}
                </>
              ) : (
                <button className="px-8 py-3 bg-green-500 text-white rounded-xl font-bold shadow-lg cursor-default flex items-center gap-2">
                  <CheckCircle size={20} />
                  You're Going
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                About This Event
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 whitespace-pre-line">
                {event.eventDescription}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Discussion
              </h2>
              <CommentForm eventId={eid} />
              <div className="mt-8">
                <CommentList eventId={eid} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4">Event Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg text-slate-500 shadow-sm">
                      <Ticket size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Price</p>
                      <p className="font-bold text-slate-900">
                        {event.isFree || event.price === 0
                          ? "Free"
                          : formatPrice(event.price)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg text-slate-500 shadow-sm">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Attendees</p>
                      <p className="font-bold text-slate-900">
                        {event.attendees?.length || 0} going
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Capacity</p>
                    <p className="font-bold text-slate-900">
                      {event.capacity || 50}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg text-slate-500 shadow-sm">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Organizer</p>
                      <p className="font-bold text-slate-900">
                        {event.organizer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {spotsLeft < 10 && spotsLeft > 0 && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm font-medium rounded-xl text-center">
                  🔥 Hurry! Only {spotsLeft} spots left
                </div>
              )}
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-2">Need Help?</h3>
              <p className="text-sm text-slate-600 mb-4">
                Contact the organizer for questions about this event.
              </p>
              <button className="w-full py-2 bg-white text-slate-900 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                Contact Organizer
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Team Registration Modal */}
      <Dialog open={showTeamModal} onOpenChange={setShowTeamModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Register Your Team</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Team Name
              </label>
              <Input
                value={teamData.teamName}
                onChange={(e) =>
                  setTeamData({ ...teamData, teamName: e.target.value })
                }
                placeholder="Enter team name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Add Team Members (Email)
              </label>
              <div className="flex gap-2">
                <Input
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="student@example.com"
                />
                <Button onClick={addMember} type="button" size="icon">
                  <Plus size={18} />
                </Button>
              </div>
              <div className="space-y-2 mt-2">
                {teamData.teamMembers.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-slate-50 p-2 rounded-md"
                  >
                    <span className="text-sm text-slate-700">{email}</span>
                    <button
                      onClick={() => removeMember(email)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500">
                Team Size: {teamData.teamMembers.length + 1} (Min:{" "}
                {event.minTeamSize}, Max: {event.maxTeamSize})
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTeamModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleTeamSubmit}>Register Team</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventDetail;
