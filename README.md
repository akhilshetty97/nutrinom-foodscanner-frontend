# NutriNom - Smart Food Scanner Mobile App

NutriNom is a full stack mobile application that enables users to scan food products and receive detailed nutritional information along with AI-powered insights. This repository contains the frontend codebase of the application.

![image](https://github.com/user-attachments/assets/4979ea3a-ca36-4918-9259-1d339424b095)
![image](https://github.com/user-attachments/assets/92857084-9e5a-4267-b102-627bc37a0c9a)
![image](https://github.com/user-attachments/assets/3dde5682-2020-4f9f-adee-8bfe1c2e41af)



## Features

- **Barcode Scanning**: Utilizes device camera for quick product identification
- **Real-time Nutritional Analysis**: Displays comprehensive nutritional information
- **AI-Powered Insights**: Integrates GPT-4 mini for intelligent food analysis
- **User Authentication**: Secure sign-in using Google OAuth
- **Scan History**: Personalized tracking of scanned products
- **Product Details**: Comprehensive information including:
  - Nutri-Score ratings
  - Eco-Score information
  - Complete ingredient lists
  - Country of origin
  - Packaging information
  - NOVA group classifications

## Tech Stack

- **Core Framework**: React Native
- **Language**: TypeScript
- **State Management**: React Context API
- **Authentication**: Google OAuth, JWT
- **API Integration**: RESTful APIs
- **Backend Services**: Express.js, Supabase
- **Cloud Infrastructure**: AWS (EC2, Route 53)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)
- Google OAuth credentials
- AWS account (for deployment)

## Project Structure

```
src/
├── components/         # Reusable UI components
├── screens/           # Screen components
├── navigation/        # Navigation configuration
├── services/         # API and third-party service integrations
├── context/          # React Context for state management
├── utils/            # Helper functions and utilities
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
└── assets/           # Images, fonts, and other static assets
```

## Key Components

### Scanner
- Camera integration for barcode scanning
- Real-time product detection
- Error handling for invalid or unrecognized barcodes

### Authentication
- Google OAuth implementation
- JWT token management
- Secure session handling

### Product Analysis
- Integration with GPT-4 mini for nutritional insights
- Data processing and formatting
- Caching mechanism for frequent requests

## Contact

For any queries or support, please reach out to akhilshetty2406@gmail.com

## Download

[![Download on the App Store](https://img.shields.io/badge/Download_on_the-App_Store-black.svg?style=for-the-badge)](https://apps.apple.com/us/app/nutrinom/id6739545306)
