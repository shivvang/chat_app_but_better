# Chat Application

Welcome to the **Chat Application** repository! This project is a comprehensive chat application built with modern web technologies. It features robust functionality for direct messaging, group chats, file uploads, and more. Below, you'll find a detailed overview of the key features and technologies used in this application.

## 📜 Features

- **Direct Messaging:** Users can send and receive direct messages with real-time updates.
- **Group Chat Functionality:** Create and manage group chats with multiple participants.
- **Profile Management:** Users can upload and update profile images, as well as delete their profiles.
- **File Uploads:** Supports multiple file types (e.g., images, videos) via Cloudinary. Users can also download shared files.
- **Real-Time Chat:** Chats automatically scroll down to display the latest messages.
- **Node.js Clustering:** Divides load among different server instances to enhance scalability and performance.
- **Redis Integration:** Used for efficient communication between server instances.
- **Rate Limiting:** Controls the rate of incoming requests to protect against abuse and ensure fair usage.
- **Throttling:** Prevents repeated message sending abuse by limiting the rate of message submissions.
- **Debouncing:** Applied to user search functionality to reduce excessive API calls and improve performance.

## 🛠️ Technologies Used

- **Frontend:**
  - **React:** For building interactive and dynamic user interfaces.
  - **Tailwind CSS:** For styling and responsive design.
  - **ShadCN:** For UI component design and implementation.

- **Backend:**
  - **Node.js:** The runtime environment for the backend server.
  - **Express.js:** Framework used for handling server-side routing and logic.
  - **Redis:** Used for managing server instance communication and caching.
  - **MongoDB & Mongoose:** For database management and schema design.

- **File Storage:**
  - **Cloudinary:** Handles the upload, management, and deletion of files.
