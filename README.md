# Real-Time Football Match Visualization Dashboard

A dynamic, interactive web application that visualizes football matches in real-time, showing player movements, ball position, match events, and statistics.

![Football Match Visualization Dashboard](/placeholder.svg?height=400&width=800)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Key Components](#key-components)
- [Customization](#customization)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

The Football Match Visualization Dashboard is a Next.js application that provides a comprehensive visual representation of football matches. It simulates real-time player movements, ball tracking, and match events, offering an immersive way to experience football matches through data visualization.

The dashboard currently uses simulated data but is designed to be easily integrated with real-time data sources.

## ✨ Features

- **Interactive Football Pitch**: Visual representation of the pitch with player and ball positions
- **Real-time Player Movement**: Players move around the pitch based on time progression
- **Ball Tracking**: Ball movement visualization with special paths for goals
- **Match Events Timeline**: Chronological display of key match events (goals, cards, substitutions)
- **Match Statistics**: Comprehensive stats including possession, shots, cards, etc.
- **Playback Controls**: Play, pause, speed control, and time navigation
- **Half-time & Full-time Overlays**: Special displays for match intervals
- **Team Switching at Half-time**: Teams switch sides for the second half
- **Dark/Light Theme**: Toggle between visual themes
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Technologies Used

- **Next.js**: React framework for the application
- **React**: UI component library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Component library for UI elements
- **Lucide React**: Icon library

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/football-match-visualization.git
   cd football-match-visualization
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install

   # or

   yarn install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev

   # or

   yarn dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

\`\`\`
football-match-visualization/
├── app/ # Next.js app directory
│ ├── layout.tsx # Root layout component
│ ├── page.tsx # Main page component
│ └── globals.css # Global styles
├── components/ # React components
│ ├── EventOverlay.tsx # Event notification overlay
│ ├── EventTimeline.tsx # Match events timeline
│ ├── FootballPitch.tsx # Football pitch visualization
│ ├── MatchControls.tsx # Playback control panel
│ ├── MatchDashboard.tsx # Main dashboard component
│ ├── MatchStats.tsx # Match statistics panel
│ └── MatchStatusOverlay.tsx # Half-time/full-time overlay
├── hooks/ # Custom React hooks
│ └── UseMobile.tsx # Mobile detection hook
├── lib/ # Utility functions and types
│ ├── MockData.ts # Simulated match data generator
│ ├── types.ts # TypeScript type definitions
│ └── utils.ts # Helper functions
├── public/ # Static assets
└── README.md # Project documentation
\`\`\`

## 🧩 Key Components

### `match-dashboard.tsx`

The main component that orchestrates the entire visualization. It manages:

- Match state and time progression
- Player and ball positions
- Event detection and display
- Half-time and full-time logic
- Theme switching

### `football-pitch.tsx`

Renders the football pitch with:

- SVG pitch markings
- Player positions with team colors
- Ball position
- Team indicators
- Player selection and information

### `event-timeline.tsx`

Displays a chronological timeline of match events with:

- Event categorization (goals, cards, substitutions)
- Visual indicators for event types
- Time markers
- Interactive event selection

### `match-controls.tsx`

Provides playback controls for the match:

- Play/pause functionality
- Speed adjustment
- Time navigation
- Match period indicators

### `match-stats.tsx`

Shows comprehensive match statistics:

- Score
- Possession
- Shots and shots on target
- Cards, corners, fouls
- Visual comparison between teams

## 🎨 Customization

### Adding Real Data

To integrate with real data sources:

1. Create a new data fetching service in `lib/services/`
2. Implement data transformation to match the expected types in `lib/types.ts`
3. Replace the mock data initialization in `match-dashboard.tsx`

### Modifying Teams

To change teams and players:

1. Edit the `generateMockMatchData` function in `lib/mock-data.ts`
2. Update team information, player rosters, and events

### Styling

The application uses Tailwind CSS for styling:

- Modify `tailwind.config.ts` to change theme colors
- Edit component classes for specific styling changes
- Update `globals.css` for global style modifications

## 🔮 Future Enhancements

- **Player Heat Maps**: Visualize player movement patterns
- **Pass Visualization**: Show passing networks between players
- **Match Highlights Reel**: Automatic compilation of key events
- **Commentary Feed**: AI-generated commentary based on match events
- **Multiple Camera Angles**: Different viewing perspectives
- **Formation Visualization**: Team tactical setup display
- **Player Statistics Panel**: Detailed individual player stats
- **WebSocket Integration**: Real-time data from live matches
- **Match Selection**: Choose from multiple available matches
- **User Authentication**: Personalized experience and settings

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
