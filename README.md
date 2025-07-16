
# 🚀 BinStack — Professional Text Sharing & Storage Extension

<div align="center">
  <strong>A high-performance Chrome extension with multi-language architecture for seamless text sharing and storage</strong><br/>
  <em>Features • Architecture • Installation • Usage • Development</em>
</div>

---

## 🌟 Overview

**BinStack** is a full-stack Chrome extension that revolutionizes text sharing with a multi-language microservice architecture.

Built with modern technologies — **C++** for high-performance file operations, **Node.js** for robust API handling, and **React** for a sleek user interface — BinStack delivers **enterprise-grade performance** with **consumer-grade usability**.

---

## ✨ Features

### 🏆 Core Capabilities
- ⚡ **Lightning-Fast Storage** — C++ Crow microservice ensures sub-millisecond file operations
- 🔗 **Universal Share Links** — Generate temporary, cross-device paste URLs
- 💻 **Cross-Device Import** — Retrieve shared pastes instantly on any device
- 📚 **Smart History** — Quick access to your last 10 pastes with intelligent caching
- 📋 **One-Click Clipboard** — Seamless native clipboard integration

### 🔐 Security & Privacy
- ⏱️ **Temporary Links** — Auto-expiring after 24 hours (default)
- 🏠 **Local-First Storage** — Recent pastes stored securely in your browser
- 🚫 **Zero Tracking** — No analytics, no third-party data sharing
- 🔒 **Secure-by-Design** — End-to-end controlled data flow

---

## 🏗️ Architecture

### Multi-Language Microservice Design
~~~
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   React Frontend    │    │   Node.js Backend   │    │   C++ Microservice  │
│   (UI/UX Layer)     │◄──►│   (API Gateway)     │◄──►│   (File Operations) │
│                     │    │                     │    │                     │
│ • Chrome Extension  │    │ • Express.js        │    │ • Crow Framework    │
│ • Tailwind CSS      │    │ • RESTful API       │    │ • High-Performance  │
│ • Framer Motion     │    │ • CORS Handling     │    │ • File I/O          │
│ • Local Storage     │    │ • Request Routing   │    │ • Memory Efficient  │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
         │                           │                           │
         │                           ▼                           ▼
         │                  ┌─────────────────────┐    ┌─────────────────────┐
         │                  │    MongoDB Atlas    │    │   File System       │
         │                  │   (Metadata Store)  │    │   (Paste Storage)   │
         │                  │                     │    │                     │
         │                  │ • Share Links       │    │ • .txt Files        │
         │                  │ • Expiration Data   │    │ • Direct I/O        │
         │                  │ • Access Tracking   │    │ • No Overhead       │
         │                  └─────────────────────┘    └─────────────────────┘
         │
         ▼
┌─────────────────────┐
│   Chrome Storage    │
│   (Local Cache)     │
│                     │
│ • Recent Pastes     │
│ • User Preferences  │
│ • Theme Settings    │
└─────────────────────┘

~~~


---

## ❓ Why C++ for the Microservice?

- 🚀 **Sub-Millisecond Response Times** — 10x faster file ops vs Node.js  
- 💾 **Memory Efficient** — Lightweight and high-throughput  
- 🔧 **Direct File I/O Access** — Avoids interpreted language overhead  
- 🛡️ **Secure Execution** — Compiled binary hardens logic layer

---

## 💻 Technology Stack

### ⚙️ C++ Microservice
- **Crow Framework 1.2** — Inspired by Flask, built for speed  
- **C++17** — Modern, fast, and safe system-level language  
- **ASIO Library** — Asynchronous I/O  
- **CMake 3.10+** — Cross-platform build tooling  
- **Native JSON** — Fast serialization for API I/O
  
### 🖥️ Frontend
- **React 18.2** — Concurrent rendering for a responsive UI  
- **Tailwind CSS 3.4** — Utility-first, scalable styling  
- **Framer Motion 10.16** — Smooth animations and transitions  
- **Lucide React 0.263** — Clean, customizable icons  
- **Chrome Manifest V3** — Secure, modern extension APIs  

### 🌐 Backend
- **Node.js 18.x** — Non-blocking runtime environment  
- **Express.js 4.18** — Minimal web framework for routing  
- **MongoDB Atlas** — Cloud-hosted document store  
- **Mongoose 7.0** — Elegant MongoDB ORM  
- **CORS 2.8** — Cross-origin resource sharing


### 🔧 DevOps & Tooling
- Git, ESLint, Prettier  
- CMake, Make  
- npm/yarn  

---

## 🚀 Installation & Setup

### 📦 Prerequisites
- Node.js 18.x+  
- MongoDB Atlas or local MongoDB  
- GCC 9+ or Clang 10+  
- CMake 3.10+  
- Git

### ⚙️ Quick Start

### 1. Clone the Repository

~~~
git clone https://github.com/techyarnav/BinStack
~~~
### 2. ENV File Setup

~~~
MONGO_URI=<MONGODB_CONNECTION_STRING>
CROW_SERVICE_URL=http://localhost:18080
PORT=3001
~~~
### 3. Backend Setup
~~~
cd backend
cp .env.example .env  # Add your MongoDB URI
npm install
npm start
~~~
### 4. C++ Microservice Setup
~~~
cd cpp-service
mkdir build && cd build
cmake ..
make
./paste_service
~~~
### 5. Chrome Extension Setup
~~~
cd client
npm install
npm run build
~~~

### 6. Load the Extension in Chrome/Brave:

-Go to chrome://extensions
-Enable Developer Mode
-Click Load Unpacked
-Select client/build/

### 🎯 Usage
-Creating & Sharing Pastes
-Open BinStack extension
-Paste or type content
-Click Create Paste to store locally
-Click Generate Share Link for cross-device access

### 📥 Cross-Device Import
-Go to Import tab
-Paste the share link (e.g., pastebin:abcdef1234)
-Click Import Paste

###📚 Managing History
-View the Recent tab
-Reshare or delete pastes

### 🧱 Project Structure
~~~
binstack/
├── backend/                    # Node.js Express API
│   ├── server.js
│   ├── paste.routes.js
│   ├── mongo.model.js
|   ├── share.model.js
│   └── .env
|   
├── cpp-service/               # C++ Crow microservice
│   ├── paste_service.cpp
│   ├── CMakeLists.txt
│   └── build/
├── client/                    # React Chrome extension
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   └── App.js
│   └── public/
│       ├── manifest.json
│       └── index.html
└── pastes/                    # File storage directory
~~~
### 🛠 Development Commands

# Start backend, C++, and frontend concurrently (if script is setup)
~~~
npm run dev
~~~

#
#

<div align="center">
⭐️ Star this repository if you find it useful!
Built with ❤️ using C++, Node.js, and React

</div> 
