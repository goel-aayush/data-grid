"use client";
import { DataGridProvider } from "@/contexts/DataGridContext";
import { ThemeProvider } from "@/contexts/ThemeContext"; // <-- Import ThemeContext
import DataGrid from "@/components/DataGrid/DataGrid";
// import ThemeToggle from "@/components/ThemeToggle"; // optional toggle component

export default function Home() {
  return (
    <ThemeProvider>
      <main className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Custom DataGrid</h1>
          {/* <ThemeToggle /> Optional: add toggle button */}
        </div>

        <DataGridProvider>
          <DataGrid />
        </DataGridProvider>
      </main>
    </ThemeProvider>
  );
}
