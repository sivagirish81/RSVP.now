/**
 * Represents a player or user.
 */
export interface Player {
    id: number;
    name: string;
}

/**
 * Represents an event.
 */
export interface Event {
    id: number;
    name: string;
    capacity: number;
}

/**
 * Represents an RSVP entry.
 */
export interface RsvpEntry {
    id: number;
    eventId: number;
    userId: number;
    status: 'Yes' | 'No' | 'Maybe';
}