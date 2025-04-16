import { Request, Response } from 'express';
import { Event, RsvpEntry } from '../types/interfaces';
import db from '../utils/db';

class RsvpController {
    private logger: any;

    constructor(logger: any) {
        this.logger = logger;
    }

    /**
     * Create or update an RSVP for an event.
     */
    async createRsvp(req: Request, res: Response): Promise<void> {
        const { eventId, userId, status }: { eventId: number; userId: number; status: 'Yes' | 'No' | 'Maybe' } = req.body;

        // Validate input
        if (!eventId || !userId || !status || !['Yes', 'No', 'Maybe'].includes(status)) {
            res.status(400).json({ message: 'Invalid RSVP data. Ensure eventId, userId, and a valid status (Yes, No, Maybe) are provided.' });
            return;
        }

        try {
            this.logger.info(`Creating or updating RSVP for eventId: ${eventId}, userId: ${userId}, status: ${status}`);
            await db.query('BEGIN');

            // Check if the event exists
            const eventResult = await db.query<Event>(
                'SELECT id, capacity FROM events WHERE id = $1 FOR UPDATE',
                [eventId]
            );

            if (eventResult.rows.length === 0) {
                await db.query('ROLLBACK');
                this.logger.error(`Event not found: eventId ${eventId}`);
                res.status(404).json({ message: 'Event not found' });
                return;
            }

            const event = eventResult.rows[0];
            this.logger.info(`Event found: ${JSON.stringify(event)}`);

            // Query the total RSVPs for the event
            const rsvpCountResult = await db.query<{ total_rsvps: number }>(
                'SELECT COUNT(*) AS total_rsvps FROM rsvps WHERE event_id = $1',
                [eventId]
            );

            const currentRsvps = rsvpCountResult.rows[0]?.total_rsvps || 0;

            // Check if the RSVP already exists
            const rsvpResult = await db.query<RsvpEntry>(
                'SELECT * FROM rsvps WHERE event_id = $1 AND user_id = $2',
                [eventId, userId]
            );

            if (rsvpResult.rows.length > 0) {
                // Update the existing RSVP
                await db.query(
                    'UPDATE rsvps SET status = $1 WHERE event_id = $2 AND user_id = $3',
                    [status, eventId, userId]
                );
                this.logger.info(`RSVP updated successfully for userId: ${userId}`);
            } else {
                // Create a new RSVP
                if (event.capacity !== null && currentRsvps >= event.capacity) {
                    await db.query('ROLLBACK');
                    this.logger.info(`Event is fully booked: eventId ${eventId}`);
                    res.status(400).json({ message: 'Event is fully booked' });
                    return;
                }

                await db.query(
                    'INSERT INTO rsvps (event_id, user_id, status) VALUES ($1, $2, $3)',
                    [eventId, userId, status]
                );
                this.logger.info(`RSVP created successfully for userId: ${userId}`);
            }

            await db.query('COMMIT');
            res.status(201).json({ message: 'RSVP created or updated successfully' });
        } catch (error) {
            await db.query('ROLLBACK');
            if (error instanceof Error) {
                this.logger.error(`Error creating or updating RSVP: ${error.message}`);
            } else {
                this.logger.error('Error creating or updating RSVP: Unknown error');
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Cancel an RSVP by ID.
     */
    async cancelRsvp(req: Request, res: Response): Promise<void> {
        const { id }: { id?: number } = req.params;

        if (!id) {
            res.status(400).json({ message: 'RSVP ID is required' });
            return;
        }

        try {
            this.logger.info(`Canceling RSVP with id: ${id}`);
            const result = await db.query<RsvpEntry>(
                'DELETE FROM rsvps WHERE id = $1 RETURNING *',
                [id]
            );

            if (result.rowCount === 0) {
                res.status(404).json({ message: 'RSVP not found' });
                return;
            }

            res.status(200).json({ message: 'RSVP canceled successfully' });
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Error canceling RSVP: ${error.message}`);
            } else {
                this.logger.error('Error canceling RSVP: Unknown error');
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Add a new event.
     */
    async addEvent(req: Request, res: Response): Promise<void> {
        const { name, capacity }: { name: string; capacity?: number } = req.body;

        if (!name) {
            res.status(400).json({ message: 'Event name is required' });
            return;
        }

        try {
            this.logger.info(`Adding new event: ${name} with capacity: ${capacity ?? 'unlimited'}`);
            const result = await db.query<Event>(
                'INSERT INTO events (name, capacity) VALUES ($1, $2) RETURNING *',
                [name, capacity ?? null] // Use `null` for unlimited capacity
            );

            res.status(201).json({
                message: 'Event created successfully',
                event: result.rows[0],
            });
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Error adding event: ${error.message}`);
            } else {
                this.logger.error('Error adding event: Unknown error');
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
    * Get the count of RSVP statuses (Yes, No, Maybe) for an event.
    */
    async getRsvpCounts(req: Request, res: Response): Promise<void> {
        const { eventId }: { eventId?: number } = req.query;

        if (!eventId) {
            res.status(400).json({ message: 'Event ID is required' });
            return;
        }

        try {
            this.logger.info(`Fetching RSVP counts for eventId: ${eventId}`);
            const result = await db.query(
                `SELECT 
                    COUNT(CASE WHEN status = 'Yes' THEN 1 END) AS yes_count,
                    COUNT(CASE WHEN status = 'No' THEN 1 END) AS no_count,
                    COUNT(CASE WHEN status = 'Maybe' THEN 1 END) AS maybe_count
                FROM rsvps
                WHERE event_id = $1`,
                [eventId]
            );

            const counts = result.rows[0];
            res.status(200).json({
                yes: counts.yes_count || 0,
                no: counts.no_count || 0,
                maybe: counts.maybe_count || 0,
            });
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Error fetching RSVP counts: ${error.message}`);
            } else {
                this.logger.error('Error fetching RSVP counts: Unknown error');
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get all RSVPs for an event.
     */
    async getRsvps(req: Request, res: Response): Promise<void> {
        const { eventId }: { eventId?: number } = req.query;

        if (!eventId) {
            res.status(400).json({ message: 'Event ID is required' });
            return;
        }

        try {
            this.logger.info(`Fetching RSVPs for eventId: ${eventId}`);
            const result = await db.query<RsvpEntry>(
                'SELECT * FROM rsvps WHERE event_id = $1',
                [eventId]
            );

            res.status(200).json(result.rows);
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Error fetching RSVPs: ${error.message}`);
            } else {
                this.logger.error('Error fetching RSVPs: Unknown error');
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    
    /**
     * Update an RSVP for a user.
     */
    async updateRsvp(req: Request, res: Response): Promise<void> {
        const { eventId, userId, status }: { eventId: number; userId: number; status: 'Yes' | 'No' | 'Maybe' } = req.body;

        // Validate input
        if (!eventId || !userId || !status || !['Yes', 'No', 'Maybe'].includes(status)) {
            res.status(400).json({ message: 'Invalid RSVP data. Ensure eventId, userId, and a valid status (Yes, No, Maybe) are provided.' });
            return;
        }

        try {
            this.logger.info(`Updating RSVP for eventId: ${eventId}, userId: ${userId}, status: ${status}`);

            // Check if the RSVP exists
            const rsvpResult = await db.query<RsvpEntry>(
                'SELECT * FROM rsvps WHERE event_id = $1 AND user_id = $2',
                [eventId, userId]
            );

            if (rsvpResult.rows.length === 0) {
                res.status(404).json({ message: 'RSVP not found for the given user and event' });
                return;
            }

            // Update the RSVP
            await db.query(
                'UPDATE rsvps SET status = $1 WHERE event_id = $2 AND user_id = $3',
                [status, eventId, userId]
            );

            this.logger.info(`RSVP updated successfully for userId: ${userId}`);
            res.status(200).json({ message: 'RSVP updated successfully' });
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Error updating RSVP: ${error.message}`);
            } else {
                this.logger.error('Error updating RSVP: Unknown error');
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}

export default RsvpController;