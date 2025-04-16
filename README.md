# RSVP.now

A scalable RSVP service that allows multiple users to RSVP for events with limited or unlimited seating. This service is built using modern web technologies and follows best practices for scalability, maintainability, and performance.

---

## Table of Contents

- [RSVP.now](#rsvpnow)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
    - [Backend](#backend)
    - [Tools and Libraries](#tools-and-libraries)
    - [Development Tools](#development-tools)
  - [Design Decisions](#design-decisions)
    - [1. **Dynamic Event Capacity**](#1-dynamic-event-capacity)
    - [2. **Transactional Integrity**](#2-transactional-integrity)
    - [3. **Scalable Architecture**](#3-scalable-architecture)
    - [4. **Error Handling**](#4-error-handling)
    - [5. **Type Safety**](#5-type-safety)
    - [6. **Caching (Optional)**](#6-caching-optional)
  - [API Endpoints](#api-endpoints)
    - [1. **Create or Update RSVP**](#1-create-or-update-rsvp)
    - [2. **Cancel RSVP**](#2-cancel-rsvp)
    - [3. **Create Event**](#3-create-event)
    - [4. **Get RSVP Counts**](#4-get-rsvp-counts)
    - [5. **List RSVPs**](#5-list-rsvps)
  - [Setup and Installation](#setup-and-installation)
    - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
  - [Database Schema](#database-schema)
    - [`events` Table](#events-table)
    - [`rsvps` Table](#rsvps-table)
  - [Testing](#testing)
  - [Contributing](#contributing)
  - [License](#license)

---

## Overview

RSVP.now is a backend service designed to manage RSVPs for events. It supports features like creating, updating, and canceling RSVPs, as well as managing event capacities. The service is built with scalability and flexibility in mind, allowing for both limited and unlimited seating events.

---

## Features

- **Create or Update RSVPs**: Users can RSVP for events or update their RSVP status (`Yes`, `No`, `Maybe`).
- **Cancel RSVPs**: Users can cancel their RSVPs.
- **Event Management**: Admins can create events with optional capacity limits.
- **RSVP Counts**: Retrieve counts of RSVP statuses (`Yes`, `No`, `Maybe`) for an event.
- **Dynamic Capacity Management**: Supports events with limited or unlimited seating.
- **Error Handling**: Comprehensive error handling for invalid inputs and server errors.

---

## Tech Stack

### Backend
- **Node.js**: JavaScript runtime for building scalable server-side applications.
- **Express.js**: Web framework for building RESTful APIs.
- **PostgreSQL**: Relational database for storing event and RSVP data.

### Tools and Libraries
- **TypeScript**: Strongly typed JavaScript for better code quality and maintainability.
- **dotenv**: For managing environment variables.
- **pg**: PostgreSQL client for Node.js.
- **ts-node**: For running TypeScript directly in development.
- **nodemon**: For automatic server restarts during development.

### Development Tools
- **ESLint**: For linting and enforcing code quality.
- **Postman**: For API testing and documentation.

---

## Design Decisions

### 1. **Dynamic Event Capacity**
- Events can have a fixed capacity or unlimited seating (`capacity = null`).
- This flexibility allows the service to handle a wide range of use cases, from small private events to large public gatherings.

### 2. **Transactional Integrity**
- Database operations for creating or updating RSVPs are wrapped in transactions to ensure data consistency, especially when dealing with capacity constraints.

### 3. **Scalable Architecture**
- The service is designed to scale horizontally by using stateless RESTful APIs and a relational database.

### 4. **Error Handling**
- Comprehensive error handling ensures that invalid inputs and server errors are gracefully managed, providing meaningful feedback to the client.

### 5. **Type Safety**
- TypeScript is used throughout the project to enforce type safety, reducing runtime errors and improving developer productivity.

### 6. **Caching (Optional)**
- Redis can be integrated for caching frequently accessed data, such as RSVP counts, to improve performance.

---

## API Endpoints

### 1. **Create or Update RSVP**
- **Endpoint**: `POST /api/rsvp`
- **Description**: Create a new RSVP or update an existing RSVP for a user.
- **Request Body**:
  ```json
  {
    "eventId": 1,
    "userId": 101,
    "status": "No"
  }
  ```
- **Response**:
  ```json
  {
    "message": "RSVP created or updated successfully"
  }
  ```

### 2. **Cancel RSVP**
- **Endpoint**: `DELETE /api/rsvp`
- **Description**: Cancel an existing RSVP for a user.
- **Request Body**:
  ```json
  {
    "eventId": 1,
    "userId": 101
  }
  ```
- **Response**:
  ```json
  {
    "message": "RSVP canceled successfully"
  }
  ```

### 3. **Create Event**
- **Endpoint**: `POST /api/event`
- **Description**: Create a new event.
- **Request Body**:
  ```json
  {
    "name": "Tech Conference",
    "capacity": 100
  }
  ```
- **Response**:
  ```json
  {
    "message": "Event created successfully"
  }
  ```

### 4. **Get RSVP Counts**
- **Endpoint**: `GET /api/event/:eventId/rsvp-counts`
- **Description**: Retrieve counts of RSVP statuses (`Yes`, `No`, `Maybe`) for an event.
- **Response**:
  ```json
  {
    "yes": 10,
    "no": 5,
    "maybe": 3
  }
  ```

### 5. **List RSVPs**
- **Endpoint**: `GET /api/rsvps`
- **Description**: Retrieve a list of all RSVPs.
- **Response**:
  ```json
  [
    {
      "id": 1,
      "eventId": 1,
      "userId": 101,
      "status": "Yes"
    },
    {
      "id": 2,
      "eventId": 1,
      "userId": 102,
      "status": "No"
    }
  ]
  ```

##  Setup and Installation

### Prerequisites
+ Node.js (version 14 or higher)
+ PostgreSQL database

---

## Getting Started

To get started with the project:

1. Clone the repository

```bash
git clone <repository-url>
```

2. Navigate to the project directory:
```bash
cd RSVP.now/rsvp-service
```

3. Install dependencies:
```bash
npm install
```

4. Set up the .env file:
```bash
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/rsvp_service
PORT=3000
```

5. Run database migrations to set up the schema.

6. Start the server:

```bash
npm run dev
```

## Database Schema

### `events` Table

| Column    | Type    | Description                       |
|-----------|---------|-----------------------------------|
| `id`      | Integer | Primary key                       |
| `name`    | String  | Name of the event                 |
| `capacity`| Integer | Maximum capacity (nullable)       |

### `rsvps` Table

| Column     | Type    | Description                            |
|------------|---------|----------------------------------------|
| `id`       | Integer | Primary key                            |
| `event_id` | Integer | Foreign key referencing `events.id`    |
| `user_id`  | Integer | ID of the user                         |
| `status`   | String  | RSVP status (`Yes`, `No`, `Maybe`)     |


## Testing

Use [Postman](https://www.postman.com/) or the provided Postman collection (`rsvp-service_collection.json`) to test the APIs.

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository.
2. **Create a new branch** for your feature or bug fix.
3. **Submit a pull request** with a detailed description of your changes.

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

