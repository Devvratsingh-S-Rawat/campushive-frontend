import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Calendar, Heart, Users, IndianRupee, CheckCircle2, ArrowLeft } from "lucide-react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { gradientFor } from "../utils/gradients";

function formatDateRange(start, end) {
  const opts = { day: "numeric", month: "short", year: "numeric" };
  const s = new Date(start).toLocaleDateString("en-IN", opts);
  const e = new Date(end).toLocaleDateString("en-IN", opts);
  return s === e ? s : `${s} — ${e}`;
}

export default function FestDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [fest, setFest] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [interested, setInterested] = useState(false);
  const [interestedCount, setInterestedCount] = useState(0);
  const [interestBusy, setInterestBusy] = useState(false);

  // per-event registration state: "idle" | "working" | "registered" | "failed"
  const [regState, setRegState] = useState({});

  useEffect(() => {
    Promise.all([api.get(`/fests/${id}`), api.get(`/fests/${id}/events`)])
      .then(([festRes, eventsRes]) => {
        setFest(festRes.data);
        setInterestedCount(festRes.data.interested_count);
        setEvents(eventsRes.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function toggleInterest() {
    if (!user) return;
    setInterestBusy(true);
    // optimistic update — feels instant, corrected below if the call fails
    const next = !interested;
    setInterested(next);
    setInterestedCount((c) => c + (next ? 1 : -1));
    try {
      const res = await api.post(`/fests/${id}/interest`);
      setInterested(res.data.interested);
      setInterestedCount(res.data.interested_count);
    } catch {
      setInterested(!next);
      setInterestedCount((c) => c + (next ? -1 : 1));
    } finally {
      setInterestBusy(false);
    }
  }

  async function handleRegister(event) {
    if (!user) return;
    setRegState((s) => ({ ...s, [event.id]: "working" }));
    try {
      const res = await api.post(`/events/${event.id}/register`);
      const data = res.data;

      // free event — backend already confirmed it, nothing more to do
      if (data.amount === 0) {
        setRegState((s) => ({ ...s, [event.id]: "registered" }));
        return;
      }

      // paid event — open Razorpay's checkout with the order the backend created
      const rzp = new window.Razorpay({
        key: data.razorpay_key_id,
        amount: data.amount,
        currency: "INR",
        name: "CampusHive",
        description: event.name,
        order_id: data.razorpay_order_id,
        handler: async function (response) {
          try {
            await api.post(`/events/${event.id}/verify-payment`, {
              registration_id: data.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setRegState((s) => ({ ...s, [event.id]: "registered" }));
          } catch {
            setRegState((s) => ({ ...s, [event.id]: "failed" }));
          }
        },
        modal: {
          ondismiss: function () {
            // user closed the popup without paying — let them try again,
            // not a hard failure
            setRegState((s) => ({ ...s, [event.id]: "idle" }));
          },
        },
        theme: { color: "#5b21b6" },
      });
      rzp.open();
    } catch {
      setRegState((s) => ({ ...s, [event.id]: "failed" }));
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="h-48 rounded-2xl bg-gray-100 animate-pulse mb-6" />
        <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse mb-3" />
        <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
      </div>
    );
  }

  if (!fest) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center text-gray-400">
        Fest not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`relative bg-gradient-to-br ${gradientFor(fest.id)} overflow-hidden`}>
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-white/10" />
        <div className="relative max-w-3xl mx-auto px-6 pt-6 pb-10">
          <Link to="/" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to fests
          </Link>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-white/80 text-sm font-medium uppercase tracking-wide mb-1">
                {fest.college_name}
              </p>
              <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white mb-3">
                {fest.name}
              </h1>
              <div className="flex flex-wrap gap-1.5">
                {fest.category?.map((cat) => (
                  <span key={cat} className="text-xs font-medium text-white bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{interestedCount}</p>
                <p className="text-white/70 text-xs">interested</p>
              </div>
              {user?.role === "student" && (
                <button
                  onClick={toggleInterest}
                  disabled={interestBusy}
                  className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full transition-colors disabled:opacity-60 ${
                    interested
                      ? "bg-white text-brand-purple"
                      : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${interested ? "fill-brand-purple" : ""}`} />
                  {interested ? "Interested" : "I'm Interested"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-brand-purple" /> {fest.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-brand-purple" /> {formatDateRange(fest.start_date, fest.end_date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-brand-purple" /> {fest.event_count} events
          </span>
        </div>

        {fest.description && <p className="text-gray-700 mb-8 leading-relaxed">{fest.description}</p>}

        {!user && events.length > 0 && (
          <div className="bg-violet-50 text-brand-purple text-sm rounded-xl p-4 mb-6">
            <Link to="/signin" className="font-semibold underline">Sign in</Link> to mark interest or register for an event.
          </div>
        )}

        <h2 className="font-display text-xl font-bold text-brand-ink mb-4">Events</h2>

        {events.length === 0 && (
          <p className="text-gray-400 text-sm">No events listed for this fest yet.</p>
        )}

        <div className="space-y-3">
          {events.map((event) => {
            const state = regState[event.id] || "idle";
            return (
              <div key={event.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    {event.category && (
                      <span className="text-xs font-medium text-brand-purple bg-violet-50 px-2 py-0.5 rounded-full">
                        {event.category}
                      </span>
                    )}
                    <h3 className="font-semibold text-lg mt-1.5">{event.name}</h3>
                    {event.description && (
                      <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                    )}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-2">
                      {event.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>}
                      {event.max_participants && <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Max {event.max_participants}</span>}
                      <span>{event.registered_count} registered</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="flex items-center font-semibold text-brand-ink">
                      {event.entry_fee > 0 ? (
                        <><IndianRupee className="w-3.5 h-3.5" />{event.entry_fee}</>
                      ) : (
                        "Free"
                      )}
                    </span>

                    {user?.role === "student" && (
                      <>
                        {state === "registered" ? (
                          <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                            <CheckCircle2 className="w-4 h-4" /> Registered
                          </span>
                        ) : (
                          <button
                            onClick={() => handleRegister(event)}
                            disabled={state === "working"}
                            className="bg-brand-orange hover:bg-brand-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors disabled:opacity-60"
                          >
                            {state === "working" ? "Processing…" : state === "failed" ? "Try again" : "Register"}
                          </button>
                        )}
                        {state === "failed" && (
                          <span className="text-xs text-red-500">Payment didn't go through</span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
