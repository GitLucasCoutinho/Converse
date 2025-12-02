# Converse: AI Conversation Assistant

Converse is an intelligent, real-time conversation and translation application built with Next.js and powered by Google's Generative AI. It provides a seamless interface for users to chat with an AI, get feedback on their messages, and translate text between languages instantly.

## Features

- **AI-Powered Chat**: Engage in natural conversations with a powerful AI assistant.
- **Real-time Translation**: Translate text between English and Portuguese on the fly.
- **Instant Word Translation**: Hover over any word in the chat to see its translation.
- **Grammar & Style Feedback**: Get suggestions to improve your writing.
- **Conversation Summarization**: Instantly generate a summary of your chat history.
- **Speech-to-Text**: Use your microphone to dictate messages.
- **Customizable Themes**: Switch between multiple light color themes and a sleek dark mode.
- **Responsive Design**: A clean, modern UI that works beautifully on both desktop and mobile devices.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI**: [Google AI via Genkit](https://firebase.google.com/docs/genkit)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20 or later recommended)
- [npm](https://www.npmjs.com/) or another package manager like [Yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://your-repository-url.com/project-name.git
    cd project-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the root of your project and add your Google AI API key. You can get a key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    ```env
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```

### Running the Application

Once the installation is complete, you can run the application in development mode.

```bash
npm run dev
```

This will start the Next.js development server, typically on `http://localhost:9002`. Open this URL in your browser to see the application.

## Available Scripts

- **`npm run dev`**: Starts the development server with Next.js and Genkit.
- **`npm run build`**: Builds the application for production.
- **`npm run start`**: Starts a production server.
- **`npm run lint`**: Lints the codebase using Next.js's built-in ESLint configuration.
- **`npm run typecheck`**: Runs the TypeScript compiler to check for type errors.
