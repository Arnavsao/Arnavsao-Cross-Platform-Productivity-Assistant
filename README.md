# Zenith Mode - Productivity Assistant

Zenith Mode is a web-based productivity assistant designed to help users enhance their focus and manage tasks effectively. Users can input their current work/activity mode, mood, and time of day to receive personalized AI-driven suggestions and engage in a contextual chatbot experience.

## ✨ Features

*   **User Authentication:** Secure registration and login functionality.
*   **Personalized Focus Plans:**
    *   Input fields for Mode (e.g., Gaming, Work, Study), Mood (e.g., Happy, Stressed), and Time of Day.
    *   Receive an initial AI-generated suggestion based on these focus parameters.
*   **Interactive Chatbot:**
    *   Continue the conversation with an AI assistant that understands the current focus context and chat history.
    *   Real-time message updates.
*   **Persistent State:**
    *   User authentication details and chat history per user are persisted in `localStorage` using Redux Persist, allowing users to resume sessions.
*   **Responsive UI:**
    *   Clean and modern interface built with React and Tailwind CSS.
    *   Custom animated cursor and smooth page transitions using Framer Motion.
    *   Landscape-oriented chat interface for wider screens.
*   **OpenAI Integration:** Leverages OpenAI's API for intelligent suggestions and chat responses.

## 🛠️ Technologies Used

*   **Frontend:**
    *   React 18
    *   Vite (Build Tool & Dev Server)
    *   React Router DOM (v6 for Client-Side Routing)
    *   Redux Toolkit (for Global State Management)
    *   React-Redux
    *   Redux Persist (for `localStorage` persistence)
    *   Tailwind CSS (Utility-First CSS Framework)
    *   Framer Motion (Animation Library)
    *   OpenAI API Client Library (`openai`)
*   **Linting/Formatting:** ESLint (configured with standard React practices)

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18.x or later recommended)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd productivity-assistance
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables:**
    *   You need an API key from OpenAI to use the AI features.
    *   Create a file named `.env.local` in the root of the project.
    *   Add your OpenAI API key to this file:
        ```env
        VITE_OPENAI_API_KEY=your_openai_api_key_here
        ```
    *   **Important:** `.env.local` is already listed in the `.gitignore` file to prevent your API key from being committed to the repository.

### Running the Development Server

1.  **Start the Vite development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

2.  Open your browser and navigate to `http://localhost:5173` (or the port specified in your terminal).

## 📝 Notes

*   **User Data Storage:** Currently, for development simplicity, user registration data (including names and emails, though not passwords directly for login checking) is stored client-side in `localStorage` via Redux Persist. For a production application, user authentication and data storage would be handled by a secure backend server and database.
*   **OpenAI API Key Security:** Ensure your `VITE_OPENAI_API_KEY` is kept confidential and the `.env.local` file is not pushed to public repositories. If your key is accidentally exposed, revoke it immediately from your OpenAI dashboard and generate a new one.

## 🔮 Future Enhancements (Potential)

*   Backend integration for secure user data management and more complex operations.
*   Expanded list of modes, moods, and suggestion types.
*   Integration with other productivity tools or calendars.
*   Native desktop or mobile applications.

---

This README provides a basic structure. Feel free to expand on any section or add new ones as your project evolves!
