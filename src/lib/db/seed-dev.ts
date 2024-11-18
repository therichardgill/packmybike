import seedDatabase, { clearDatabase } from './seed';

// Only run in development
if (import.meta.env.DEV) {
  const initializeDatabase = async () => {
    try {
      await clearDatabase();
      await seedDatabase();
      console.log('Development database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  };

  initializeDatabase();
}