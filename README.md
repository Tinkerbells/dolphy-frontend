# FlashCards TMA - Telegram Mini App for Spaced Repetition Learning

FlashCards TMA is a Telegram Mini App that helps users learn and memorize information using spaced repetition techniques, similar to Anki and Quizlet. The app allows users to create decks of flashcards, study them with an intelligent scheduling algorithm, and track their progress over time.

## Features

- **Create and Manage Decks**: Organize your flashcards into different decks for different subjects.
- **Create and Edit Cards**: Add questions and answers with support for tags to organize content.
- **Spaced Repetition**: Smart algorithm that schedules cards based on your performance.
- **Study Sessions**: Interactive study sessions with performance tracking.
- **Progress Tracking**: Monitor your learning progress and review history.
- **Customizable Settings**: Adjust study preferences to suit your learning style.
- **Import/Export**: Import and export cards in bulk.

## Architecture

This application follows Clean Architecture principles with a clear separation of concerns:

- **Domain Layer**: Core business entities and logic independent of frameworks
- **Application Layer**: Use cases that orchestrate the flow of data to and from entities
- **Services Layer**: Adapters that implement interfaces defined in the application layer
- **UI Layer**: React components that render the user interface

## Technologies Used

- **React & TypeScript**: For building the user interface
- **Mantine UI**: Component library for consistent, well-designed UI
- **Telegram Mini Apps SDK**: For integration with Telegram
- **MobX-lite**: State management with reactive programming
- **React Query**: Data fetching and caching

## Setup and Development

### Prerequisites

- Node.js 16+
- npm or yarn
- Telegram account for testing

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/flashcards-tma.git
   cd flashcards-tma
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Building for Production

```bash
npm run build
# or
yarn build
```

### Testing with Telegram

1. Create a bot with [@BotFather](https://t.me/BotFather) on Telegram
2. Add the WebApp URL to your bot
3. Start your bot and use the WebApp button to open the app

## Project Structure

```
src/
├── domain/                  # Core business entities and logic
│   ├── card.ts              # Flashcard entity and operations
│   ├── deck.ts              # Deck entity and operations
│   ├── study.ts             # Study session entity and operations
│   └── user.ts              # User entity and operations
├── application/             # Use cases - application specific business rules
│   ├── ports.ts             # Interfaces for external services
│   ├── createCard.ts        # Create new card use case
│   ├── createDeck.ts        # Create new deck use case
│   ├── studyDeck.ts         # Study deck use case
│   └── manageDecks.ts       # Manage decks and settings use case
├── services/                # Adapters for external services
│   ├── storageAdapter.ts    # Storage implementation
│   ├── telegramAdapter.ts   # Telegram integration
│   ├── fakeData.ts          # Test data
│   └── store.tsx            # MobX store implementation
├── ui/                      # User interface components
│   ├── Decks/               # Decks list page
│   ├── DeckDetail/          # Deck details page
│   ├── Study/               # Study session page
│   ├── CardEdit/            # Card creation/editing page
│   ├── Settings/            # User settings page
│   └── components/          # Shared UI components
└── App.tsx                  # Main application component
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
