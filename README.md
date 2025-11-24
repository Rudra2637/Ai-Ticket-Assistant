
# AI Ticket Assistant

The AI Ticket Assistant is a smart support ticket system that leverages an AI agent to streamline the resolution process. When a new ticket is created, the AI agent automatically analyzes its content and provides an intelligent, context-aware response to guide the support team. This project aims to reduce response times and improve the efficiency of customer support operations. The application is built with a React frontend and an Express.js backend.

## Features

- **User Authentication:** Secure user registration and login functionality.
- **Ticket Management:** Create, view, update, and delete support tickets.
- **Intelligent AI Agent:** When a ticket is created, an AI agent automatically analyzes the issue and generates a helpful suggestion or response, which is then displayed on the ticket details page.
- **Email Notifications:** Receive email notifications for new user signups and ticket creations.
- **Role-based Access Control:** Admin panel to view all tickets.

## Tech Stack

### Backend (`ai-assistant`)

- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **Background Jobs:** Inngest
- **Emailing:** Nodemailer
- **Dependencies:** `bcrypt`, `cors`, `dotenv`

### Frontend (`ai-assistant-frontend`)

- **Framework:** React
- **Build Tool:** Vite
- **Routing:** React Router
- **Styling:** Tailwind CSS & DaisyUI
- **Dependencies:** `react-markdown`

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- MongoDB instance (local or cloud)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Ai-Ticket-Assistant
    ```

2.  **Backend Setup (`ai-assistant`):**
    ```bash
    cd ai-assistant
    npm install
    ```
    - Create a `.env` file in the `ai-assistant` directory and add the following variables:
      ```
      MONGO_URI=<your_mongodb_connection_string>
      JWT_SECRET=<your_jwt_secret>
      EMAIL_HOST=<your_email_host>
      EMAIL_PORT=<your_email_port>
      EMAIL_USER=<your_email_user>
      EMAIL_PASS=<your_email_password>
      INNGEST_EVENT_KEY=<your_inngest_event_key>
      INNGEST_SIGNING_KEY=<your_inngest_signing_key>
      ```

3.  **Frontend Setup (`ai-assistant-frontend`):**
    ```bash
    cd ../ai-assistant-frontend
    npm install
    ```
    - Create a `.env` file in the `ai-assistant-frontend` directory and add the following variable, pointing to your backend server:
      ```
      VITE_API_URL=http://localhost:8000
      ```

### Running the Application

1.  **Start the backend server:**
    ```bash
    cd ../ai-assistant
    npm run dev
    ```

2.  **Start the Inngest development server (in a separate terminal):**
    ```bash
    cd ../ai-assistant
    npm run inngest-dev
    ```

3.  **Start the frontend development server (in a separate terminal):**
    ```bash
    cd ../ai-assistant-frontend
    npm run dev
    ```

The application will be available at `http://localhost:5173`.

## Folder Structure

```
.
├── ai-assistant/
│   ├── controllers/
│   ├── inngest/
│   ├── models/
│   ├── routes/
│   └── ...
└── ai-assistant-frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   └── pages/
    └── ...
```
