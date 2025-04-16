export interface Rsvp {
    email: string;
    eventId: number;
    userId: number;
}

class RsvpModel {
    private rsvps: Rsvp[];

    constructor() {
        this.rsvps = [];
    }

    /**
     * Save an RSVP if the event's capacity is not exceeded.
     * @param rsvp - The RSVP object to save.
     * @param currentRsvps - The current number of RSVPs for the event.
     * @param capacity - The capacity of the event.
     * @returns True if RSVP is saved, false if the event is fully booked.
     */
    saveRsvp(rsvp: Rsvp, currentRsvps: number, capacity: number): boolean {
        if (currentRsvps < capacity) {
            this.rsvps.push(rsvp);
            return true;
        }
        return false;
    }

    /**
     * Find all RSVPs.
     * @returns An array of all RSVPs.
     */
    findRsvps(): Rsvp[] {
        return this.rsvps;
    }

    /**
     * Cancel an RSVP by email.
     * @param email - The email of the RSVP to cancel.
     * @returns True if RSVP is canceled, false if not found.
     */
    cancelRsvp(email: string): boolean {
        const index = this.rsvps.findIndex((rsvp) => rsvp.email === email);
        if (index !== -1) {
            this.rsvps.splice(index, 1);
            return true;
        }
        return false;
    }
}

export default RsvpModel;