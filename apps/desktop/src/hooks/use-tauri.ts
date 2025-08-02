import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

export function useTauri() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeTauri = async () => {
      try {
        // Check if we're in a Tauri environment
        if (typeof window !== "undefined") {
          // Check for Tauri v2 global
          console.log("Window object:", typeof window);
          console.log(
            "Tauri global available:",
            typeof window.__TAURI_INTERNALS__
          );

          // Test the connection with a simple command
          console.log("Attempting to call test_command...");
          const result = await invoke("test_command");
          console.log("Test command result:", result);
          setIsAvailable(true);
          console.log("Tauri is available and working");
        } else {
          console.log("Not running in browser environment");
          setIsAvailable(false);
        }
      } catch (error) {
        console.error("Tauri initialization error:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        setIsAvailable(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTauri();
  }, []);

  const callCommand = async (command: string, args?: any) => {
    if (!isAvailable) {
      throw new Error("Tauri is not available");
    }
    try {
      return await invoke(command, args);
    } catch (error) {
      console.error(`Error calling Tauri command '${command}':`, error);
      throw error;
    }
  };

  return {
    isAvailable,
    isLoading,
    callCommand,
  };
}
