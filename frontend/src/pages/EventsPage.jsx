import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Trash2 } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { useEventStore } from "../stores/useEventStore";
import { useUserStore } from "../stores/useUserStore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1597040663342-45b326432694?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1573407947257-f4eb2c5fe8a0?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80",
];

function getEventImage(event, index) {
    return event.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

function formatDate(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" });
}

function SkeletonGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="flex flex-col rounded-xl overflow-hidden ring-1 ring-foreground/10 bg-card"
                >
                    <Skeleton className="aspect-video w-full rounded-none" />
                    <div className="px-4 py-4 space-y-3">
                        <Skeleton className="h-3 w-28" />
                        <Skeleton className="h-4 w-20 rounded-full" />
                        <Skeleton className="h-5 w-4/5" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <div className="space-y-2 pt-1">
                            <Skeleton className="h-3 w-36" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function EventCard({ event, index, isAdmin, onDelete }) {
    return (
        <div className="relative block h-full">
            <Link to={`/events/${event._id}`} className="block h-full">
                <Card className="card-glow h-full cursor-pointer hover:ring-primary/40">
                    <div className="aspect-video w-full overflow-hidden">
                        <img
                            src={getEventImage(event, index)}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <CardHeader className="pt-4">
                        {event.date && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                                <Calendar size={11} />
                                {formatDate(event.date)}
                            </p>
                        )}

                        {event.category && (
                            <Badge
                                variant="outline"
                                className="w-fit border-primary/50 text-primary"
                            >
                                {event.category}
                            </Badge>
                        )}

                        <CardTitle className="text-base leading-snug line-clamp-2">
                            {event.title}
                        </CardTitle>

                        <CardDescription className="line-clamp-2 text-sm">
                            {event.description}
                        </CardDescription>

                        {isAdmin && (
                            <CardAction>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onDelete(event._id);
                                    }}
                                    className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                    title="Delete event"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </CardAction>
                        )}
                    </CardHeader>

                    <CardContent className="pt-0 mt-auto space-y-1.5">
                        {event.time && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <Clock size={11} className="text-primary" />
                                {event.time}
                            </p>
                        )}
                        {event.location && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <MapPin size={11} className="text-primary" />
                                {event.location}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </Link>
        </div>
    );
}

function EventGrid({ events, isAdmin, onDelete }) {
    if (events.length === 0) {
        return (
            <p className="text-center text-muted-foreground py-24">
                No upcoming events scheduled at this time.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
                <EventCard
                    key={event._id}
                    event={event}
                    index={index}
                    isAdmin={isAdmin}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

const EventsPage = () => {
    const { events, fetchEvents, loading, removeEvent } = useEventStore();
    const { user } = useUserStore();
    const isAdmin = user?.role === "admin";

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 bg-parchment">
            <div className="max-w-6xl mx-auto">
                <PageHeader
                    badge="Community & Celebration"
                    title="Temple Events"
                    subtitle="Join our community in prayer, ritual, and celebration throughout the year."
                />

                {loading && events.length === 0
                    ? <SkeletonGrid />
                    : <EventGrid events={events} isAdmin={isAdmin} onDelete={removeEvent} />
                }
            </div>
        </div>
    );
};

export default EventsPage;
