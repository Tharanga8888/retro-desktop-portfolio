
"use client";

import { useEffect, useState } from "react";
import WindowManager from "@/components/WindowManager";
import type { WindowID } from "@/types/window";

type DesktopItem = {
  id: string;
  name: string;
  icon: string;
};

const desktopItems: DesktopItem[] = [
  { id: "about", name: "About Me", icon: "👤" },
  { id: "projects", name: "My Projects", icon: "📁" },
  { id: "skills", name: "My Skills", icon: "🛠️" },
  { id: "experience", name: "Experience", icon: "💼" },
  { id: "resume", name: "Resume.pdf", icon: "📄" },
  { id: "contact", name: "Contact", icon: "📧" },
  { id: "computer", name: "My Computer", icon: "🖥️" },
  { id: "trash", name: "Recycle Bin", icon: "🗑️" },
];

export default function Home() {
  const [time, setTime] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  // Update the taskbar clock
  useEffect(() => {
    const updateClock = () => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateClock();

    const timer = window.setInterval(updateClock, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="retro-desktop relative min-h-svh overflow-hidden">

      {/* Desktop Icons */}
      
    <WindowManager>
      {(openWindow) => (
        <div className="desktop-icons grid grid-cols-1">
          {desktopItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`desktop-icon ${
                selectedIcon === item.id ? "selected" : ""
              }`}
              onClick={() => {
                setSelectedIcon(item.id);
                setStartMenuOpen(false);

                if (item.id !== "trash") {
                  openWindow(item.id as WindowID);
                }
              }}
              aria-label={item.name}
            >
              <span className="desktop-icon-art" aria-hidden="true">
                {item.icon}
              </span>
              <span className="desktop-icon-label">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </WindowManager>

      {/* Start Menu */}
      {startMenuOpen && (
        <div className="start-menu">
          <div className="start-menu-heading">
            <span>THARANGA</span>
            <strong>Portfolio OS</strong>
          </div>

          <div className="start-menu-content">
            <p>Welcome to my desktop!</p>
            <p className="start-menu-hint">
              Applications coming soon...
            </p>
          </div>
        </div>
      )}

      {/* Taskbar */}
      <footer className="taskbar">

        <button
          type="button"
          className={`start-button ${startMenuOpen ? "pressed" : ""}`}
          onClick={() => setStartMenuOpen(!startMenuOpen)}
          aria-expanded={startMenuOpen}
        >
          <span className="start-logo" aria-hidden="true">
            🪟
          </span>
          <strong>Start</strong>
        </button>

        <div className="taskbar-divider" />

        <div className="taskbar-spacer" />

        {/* System Tray */}
        <div className="system-tray">
          <span aria-hidden="true">🔊</span>
          <span aria-hidden="true">🌐</span>
          <span className="clock">{time || "--:--"}</span>
        </div>

      </footer>
    </main>
  );
}
