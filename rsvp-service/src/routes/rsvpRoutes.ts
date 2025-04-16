import express, { Application } from 'express';
import RsvpController from '../controllers/rsvpController';
import Logger from '../utils/logger';

const setRsvpRoutes = (app: Application): void => {
    const router = express.Router();
    const logger = new Logger();
    const rsvpController = new RsvpController(logger);

    router.post('/rsvp', rsvpController.createRsvp.bind(rsvpController));
    router.put('/rsvp', rsvpController.updateRsvp.bind(rsvpController));
    router.get('/rsvps', rsvpController.getRsvps.bind(rsvpController));
    router.delete('/rsvp/:id', rsvpController.cancelRsvp.bind(rsvpController));
    router.post('/events', rsvpController.addEvent.bind(rsvpController));
    router.get('/rsvp-counts', rsvpController.getRsvpCounts.bind(rsvpController));

    app.use('/api', router);
};

export default setRsvpRoutes;