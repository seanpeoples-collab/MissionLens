# MissionLens - Video Strategy Prospector

MissionLens is an AI-powered tool designed to help agencies and consultants find prospective nonprofit clients. It analyzes an organization's public video presence (YouTube, Social Media) and generates a "Pitchable Gap" strategy instantly.

## Features

*   **Impact Score**: Automatically rates a nonprofit's video maturity from 0-100.
*   **Platform Audit**: Checks presence and health of YouTube, LinkedIn, Instagram, TikTok, and Website.
*   **AI Strategy Generation**: Creates a cold outreach framework (Subject Line, Hook, Problem, Solution) tailored to the specific organization.
*   **Export**: Save reports as PDF or Text Briefs.

## Tech Stack

*   **Frontend**: React, TypeScript, TailwindCSS, Recharts
*   **AI**: Google Gemini API (`gemini-3-flash-preview`)
*   **Build Tool**: Vite

## Setup & Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/mission-lens.git
    cd mission-lens
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Create an API Key:
    *   Get a key from [Google AI Studio](https://aistudio.google.com/).
    *   Create a `.env` file in the root directory:
        ```
        API_KEY=your_actual_api_key_here
        ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

## Deployment

This project is optimized for deployment on **Vercel** or **Netlify**.

1.  Import this repository into Vercel/Netlify.
2.  Add your `API_KEY` in the **Environment Variables** settings during deployment.
3.  Deploy!
