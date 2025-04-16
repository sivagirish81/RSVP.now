import express, { Application } from 'express';
import setRsvpRoutes from './routes/rsvpRoutes';
import db from './utils/db';

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());
setRsvpRoutes(app);

// Test database connection on startup
(async () => {
    try {
        await db.connectToDb();
        console.log('Connected to the database successfully.');
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1); // Exit the process if the database connection fails
    }
})();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});