
# Chat Application

Welcome to the **Chat Application** repository! This project is a comprehensive chat application built with modern web technologies. It offers robust functionality including direct messaging, group chats, file uploads, and more. Below is a detailed overview of the key features and technologies used in this application.

## 📜 Features

- **Direct Messaging:** Users can send and receive direct messages with real-time updates.
- **Group Chat Functionality:** Create and manage group chats with multiple participants.
- **Profile Management:** Upload, update, and delete profile images.
- **File Uploads:** Supports multiple file types (e.g., images, videos) via Cloudinary. Users can also download shared files.
- **Real-Time Chat:** Chats automatically scroll down to display the latest messages.
- **Node.js Clustering:** Distributes load among different server instances to enhance scalability and performance.
- **Redis Integration:** Manages communication between server instances efficiently.
- **Rate Limiting:** Controls the rate of incoming requests to protect against abuse and ensure fair usage.
- **Throttling:** Limits the rate of message submissions to prevent abuse.
- **Debouncing:** Reduces excessive API calls in the user search functionality to improve performance.

## 🛠️ Technologies Used

- **Frontend:**
  - **React:** For building interactive and dynamic user interfaces.
  - **Tailwind CSS:** For styling and responsive design.
  - **ShadCN:** For UI component design and implementation.

- **Backend:**
  - **Node.js:** Runtime environment for the backend server.
  - **Express.js:** Framework for handling server-side routing and logic.
  - **Redis:** Manages server instance communication and caching.
  - **MongoDB & Mongoose:** For database management and schema design.

- **File Storage:**
  - **Cloudinary:** Handles file uploads, management, and deletion.

## Getting Started

To get your chat application up and running, follow these steps:

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/shivvang/chat_app_but_better.git
cd chat_app_but_better
```

### 2. Navigate to the Directories

Set up both the frontend and backend components by navigating to each directory and installing dependencies:

```bash
# Navigate to the client directory
cd client
npm install

# Navigate to the server directory
cd ../server
npm install
```

### 3. Install and Set Up Redis

Redis is used for managing data between server instances. Follow these steps to set it up:

**For Linux Users:**

1. Install Redis:
   ```bash
   sudo apt-get update
   sudo apt-get install redis-server
   ```

2. Start the Redis server:
   ```bash
   redis-server
   ```

**For Windows Users:**

Use Windows Subsystem for Linux (WSL) to install Redis:

1. Install WSL and a Linux distribution (e.g., Ubuntu) from the Microsoft Store.
2. Open the WSL terminal and follow the Linux instructions to install Redis.

### 4. Running the Project

Start the frontend, backend, and Redis server:

**Frontend:**

Navigate to the `client` directory and run:

```bash
npm run dev
```

**Backend:**

Navigate to the `server` directory and run:

```bash
npm start
```

**Redis:**

Run the Redis CLI (in the WSL terminal if on Windows):

```bash
redis-cli
```

---
Happy coding and enjoy building with your chat application! 🎉
