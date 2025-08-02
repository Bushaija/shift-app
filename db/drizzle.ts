import { type ExpoSQLiteDatabase, drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import type { SQLJsDatabase } from "drizzle-orm/sql-js";

import migrations from "./migrations/migrations";

let db: ExpoSQLiteDatabase | null = null;

export const initialize = async (): Promise<ExpoSQLiteDatabase> => {
  if (db) {
    return db;
  }

  try {
    const expoDb = openDatabaseSync("database.db", { enableChangeListener: true });
    db = drizzle(expoDb);
    return db;
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
};

export const useMigrationHelper = () => {
  if (!db) {
    return { success: false, error: new Error("Database not initialized") };
  }
  return useMigrations(db, migrations);
};
