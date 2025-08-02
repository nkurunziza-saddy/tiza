import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTauri } from "@/hooks/use-tauri";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/test")({
  component: Test,
});

function Test() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState<string>("");
  const { isAvailable, isLoading, callCommand } = useTauri();

  async function greet() {
    if (!isAvailable) {
      console.log("Tauri not available");
      return;
    }

    try {
      const message = (await callCommand("greet", { name })) as string;
      const testMessage = (await callCommand("test_command")) as string;
      setMessage(testMessage);
      console.log(testMessage);
      setGreetMsg(message);
      const customMessage = (await callCommand("my_custom_command")) as string;
      console.log(customMessage);
    } catch (error) {
      console.error("Error calling Tauri command:", error);
      setGreetMsg("Error: Could not call Tauri command");
    }
  }

  if (isLoading) {
    return (
      <main className="container">
        <h1>Loading Tauri...</h1>
        <p>Please wait while we initialize the Tauri runtime.</p>
      </main>
    );
  }

  return (
    <main className="container ">
      <h1 className="text-lg">Welcome to Tauri + React</h1>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      {!isAvailable && (
        <div style={{ color: "orange", marginBottom: "1rem" }}>
          ⚠️ Not running in Tauri environment (this is normal in browser)
        </div>
      )}
      <Button onClick={greet} className="w-full">
        Run tauri
      </Button>
      {message && (
        <p className="text-center text-green-500 mt-4">Tauri says: {message}</p>
      )}
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <Input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <Button type="submit" disabled={!isAvailable}>
          Greet
        </Button>
      </form>
      <p>{greetMsg}</p>
    </main>
  );
}
