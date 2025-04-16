# RSVP.now
A scalable RSVP service

## Project Overview
RSVP.now is a scalable RSVP service that allows multiple users to RSVP for events with limited seating. This service is built using Node.js and Express, providing a robust backend for managing RSVPs efficiently.

## Features
- Create RSVPs for events
- Retrieve RSVPs for events
- Cancel RSVPs
- Limited seating management

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node package manager)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd rsvp-service
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Configuration
1. Create a `.env` file in the root directory and add your environment variables:
   ```
   DATABASE_URL=<your-database-url>
   PORT=3000
   ```

### Running the Application
To start the server, run:
```
npm start
```
The application will be running on `http://localhost:3000`.

## API Endpoints
- `POST /rsvps` - Create a new RSVP
- `GET /rsvps` - Retrieve all RSVPs
- `DELETE /rsvps/:id` - Cancel an RSVP

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.