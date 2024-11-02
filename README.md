# StoryPath - Location-Based Experience Platform

Welcome to the **StoryPath** project! This platform allows users to create and explore interactive, location-driven narratives, such as virtual museum exhibits, immersive tours, and treasure hunts with clues.

## Table of Contents
- [About StoryPath](#about-storypath)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributors](#contributors)
- [License](#license)
- [Contact](#contact)

## About StoryPath

**StoryPath** is an innovative platform that turns every location into a new adventure. It enables users to author experiences in the web app (built with React) and explore them using the mobile player (built with React Native). Through StoryPath, users can create educational experiences, guided tours, and treasure hunts with interactive clues.

## Features

The StoryPath Player (React Native app) offers the following main features:

- **Profile Management**: Users can create a profile by entering their name and uploading a photo.
- **Project Selection**: Users can view a list of published projects and select one to participate in.
- **Instructions & Clues**: Each project provides instructions and clues for users to follow in order to locate specific locations.
- **Location Scoring**: Users earn points by entering the radius of a location or scanning a QR code.
- **Map View**: Users can view their current location and see unlocked locations on a map.
- **Progress Tracking**: The app tracks scores, the number of unlocked locations, and displays the number of participants who have unlocked each location.

## Installation

To set up this project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/thanghoang7020202/storypath-react-native.git
   cd storypath-react-native
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the app**:

   ```bash
    npx expo start
   ```

4. **Run the app**: Follow the instructions to run the app on an iOS or Android emulator, or connect a physical device.

Note: This app is tested on 2 Android physical devices: Samsung Galaxy S22 Ultra and Samsung Galaxy S24 Ultra.

## Usage

To use the StoryPath Player, follow these steps:
1. **Create a Profile**: Enter your name and upload a profile photo.
2. **Explore Projects**: Choose from various location-based projects.
3. **Follow Clues**: Use the instructions and clues provided to find locations.
4. **Unlock Locations**: Enter the correct radius or scan QR codes to score points.
5. **Track Progress**: View your score, unlocked locations, and see participant counts.

## Project Structure

The StoryPath project consists of two main components:
   ```bash
   .storypath/
   │
   ├── app/
   │   ├── (tabs)/
   │   │   ├── ProjectHomeScreen/
   │   │   │   ├── [id].jsx
   │   │   │   ├── QRCodeScanner.jsx
   │   │   │   └── ShowMap.jsx
   │   │   ├── _layout.jsx
   │   │   ├── about.jsx
   │   │   ├── profile.jsx
   │   │   ├── projectIdContext.js
   │   │   ├── projects.jsx
   │   │   └── usernameContext.js
   │   ├── components/
   │   │   ├── api.jsx
   │   │   ├── edit-profile.jsx
   │   │   └── imagePicker.jsx
   │   ├── data/
   │   │   ├── icons.js
   │   │   ├── images.js
   │   │   ├── locations.js
   │   │   └── theme.js
   │   ├── assets/
   │   ├── scripts/
   │   └── ...
   ├── package.json
   └── README.md
   ```
   - **app/(tabs)**: Contains the main navigation screens for projects, map view, QR code scanning, and project-related contexts.
   - **components**: Contains reusable components like the profile editor and image picker.
   - **data**: Contains assets and configuration files like icons, theme settings, and location data.

## Contributors

* Cao Quoc Thang Hoang - Designer, Project Developer, and Owner

## License

This project is private and confidential and is currently restricted to the [COMP2140] Web/Mobile Programming course at the University of Queensland, Australia, until March 2025. After this date, the project will be published under the MIT License, allowing free usage, modification, and distribution under the terms of the license.

## Contact

For any questions, reach out via email at s4759487@uq.edu.au.