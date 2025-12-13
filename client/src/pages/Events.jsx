import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import { useDispatch, useSelector } from "react-redux";
import { getEvents } from "../features/events/eventsSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const Events = () => {
  const {
    allEvents,
    eventsLoading,
    eventsError,
    eventsErrorMessage,
    page,
    pages,
    total,
  } = useSelector((state) => state.events);
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const params = {
      page: currentPage,
      search: debouncedSearch,
    };
    dispatch(getEvents(params));
  }, [dispatch, currentPage, debouncedSearch]);

  useEffect(() => {
    if (eventsError && eventsErrorMessage) {
      toast.error(eventsErrorMessage);
    }
  }, [eventsError, eventsErrorMessage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Campus Events
          </h1>
          <p className="text-slate-600">
            Discover workshops, seminars, and social gatherings.
          </p>
        </div>

        <div className="mb-8 max-w-xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search events by name or location..."
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>
        </div>

        {eventsLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : allEvents?.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>

                <span className="text-slate-600 font-medium">
                  Page {currentPage} of {pages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pages}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-slate-500">
              No events found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
