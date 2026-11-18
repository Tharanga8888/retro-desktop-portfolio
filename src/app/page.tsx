
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

const startMenuApps: {
    id: WindowID;
    name: string;
    icon: string;
  }[] = [
    { id: "about", name: "About Me", icon: "👤" },
    { id: "projects", name: "My Projects", icon: "📁" },
    { id: "skills", name: "My Skills", icon: "🛠️" },
    { id: "experience", name: "Experience", icon: "💼" },
    { id: "resume", name: "Resume", icon: "📄" },
    { id: "contact", name: "Contact", icon: "📧" },
    { id: "computer", name: "My Computer", icon: "🖥️" },
  ];

export default function Home() {
  const [time, setTime] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [isShutDown, setIsShutDown] = useState(false);

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
        {({
          openWindow,
          windows,
          activeWindowId,
          onTaskbarClick,
        }) => (
          <>
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
                    
            {/* Start Menu */}
            {startMenuOpen && (
              <div className="start-menu">
                <div className="start-menu-sidebar">
                  <span>THARANGA</span>
                  <strong>Portfolio OS</strong>
                </div>

                <div className="start-menu-main">
                  <div className="start-menu-section-title">
                    Programs
                  </div>

                  <div className="start-menu-apps">
                    {startMenuApps.map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        className="start-menu-item"
                        onClick={() => {
                          openWindow(app.id);
                          setStartMenuOpen(false);
                        }}
                      >
                        <span>{app.icon}</span>
                        <span>{app.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="start-menu-divider" />

                  <button
                    type="button"
                    className="start-menu-shutdown"
                    onClick={() => {
                      setStartMenuOpen(false);
                      setIsShutDown(true);
                    }}
                  >
                    <span>🔌</span>
                    <span>Shut Down...</span>
                  </button>
                </div>
              </div>
            )}

            {/* Shutdown Screen */}
            {isShutDown && (
              <div className="shutdown-screen">
                <div className="shutdown-dialog">
                  <div className="shutdown-heading">
                    Portfolio OS
                  </div>

                  <div className="shutdown-content">
                    <span className="shutdown-icon">🖥️</span>

                    <h2>It is now safe to close your browser.</h2>

                    <p>
                      Your Portfolio OS has been shut down.
                    </p>

                    <button
                      type="button"
                      onClick={() => setIsShutDown(false)}
                    >
                      Restart Computer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Taskbar */}
            <footer className="taskbar">
              <div id="portfolio-start-menu">
                <button
                  type="button"
                  className={`start-button ${startMenuOpen ? "pressed" : ""}`}
                  onClick={() => setStartMenuOpen((current) => !current)}
                  aria-expanded={startMenuOpen}
                  aria-controls="portfolio-start-menu"
                >
                  <span className="start-logo" aria-hidden="true">
                    🪟
                  </span>
                  <strong>Start</strong>
                </button>
              </div>
              <div className="taskbar-divider" />

              <div className="taskbar-applications">
                {windows.map((window) => (
                  <button
                    key={window.id}
                    type="button"
                    className={`taskbar-window-button ${
                      activeWindowId === window.id ? "active" : ""
                    }`}
                    onClick={() => onTaskbarClick(window.id)}
                    title={window.title}
                  >
                    {window.title}
                  </button>
                ))}
              </div>

              <div className="taskbar-spacer" />

              {/* System Tray */}
              <div className="system-tray">
                <span aria-hidden="true">🔊</span>
                <span aria-hidden="true">🌐</span>
                <span className="clock">{time || "--:--"}</span>
              </div>

            </footer>
        </>
        )}
      </WindowManager>
    </main>
  );
}
