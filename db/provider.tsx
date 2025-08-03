import type { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import type { SQLJsDatabase } from "drizzle-orm/sql-js";
import React, { type PropsWithChildren, useContext, useEffect, useState } from "react";
import { initialize } from "./drizzle";

type ContextType = { db: SQLJsDatabase | ExpoSQLiteDatabase | null; error: Error | null }

export const DatabaseContext = React.createContext<ContextType>({ db: null, error: null });

export const useDatabase = () => useContext(DatabaseContext);

export function DatabaseProvider({ children }: PropsWithChildren) {
  const [db, setDb] = useState<SQLJsDatabase | ExpoSQLiteDatabase | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (db) return;

    console.log("Initializing database...");
    initialize()
      .then((newDb) => {
        console.log("Database initialized successfully");
        setDb(newDb);
        setError(null);
      })
      .catch((err) => {
        console.error("Database initialization failed:", err);
        setError(err);
        // Don't block the app if database fails to initialize
        // The app can still function without the database for basic navigation
      });
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, error }}>
      {children}
    </DatabaseContext.Provider>
  );
}

