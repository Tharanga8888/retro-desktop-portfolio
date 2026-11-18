
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
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [showDesktopProperties, setShowDesktopProperties] = useState(false);
  const [iconOrder, setIconOrder] = useState(desktopItems);

  function handleDesktopContextMenu(
    event: React.MouseEvent<HTMLElement>
  ) {
    const target = event.target as HTMLElement;

    // Don't show the desktop menu over other interface elements.
    if (
      target.closest(
        "button, .window, .taskbar, .start-menu, .shutdown-screen"
      )
    ) {
      return;
    }

    event.preventDefault();

    setContextMenu({
      x: Math.min(event.clientX, window.innerWidth - 200),
      y: Math.min(event.clientY, window.innerHeight - 190),
    });
  }

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

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setContextMenu(null);
        setShowDesktopProperties(false);
      }
    }
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <main
      className="retro-desktop relative min-h-svh overflow-hidden"
      onContextMenu={handleDesktopContextMenu}
      onClick={() => setContextMenu(null)}
    >

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
              {iconOrder.map((item) => (
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

            {contextMenu && (
              <div
                className="desktop-context-menu"
                style={{
                  left: contextMenu.x,
                  top: contextMenu.y,
                }}
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedIcon(null);
                    setIconOrder([...desktopItems]);
                    setContextMenu(null);
                  }}
                >
                  <span>🔄</span>
                  Refresh
                </button>

                <div className="context-menu-divider" />

                <button
                  type="button"
                  onClick={() => {
                    setIconOrder([...desktopItems]);
                    setContextMenu(null);
                  }}
                >
                  <span>🗂️</span>
                  Arrange Icons
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIconOrder(
                      [...iconOrder].sort((a, b) =>
                        a.name.localeCompare(b.name)
                      )
                    );
                    setContextMenu(null);
                  }}
                >
                  <span>🔤</span>
                  Sort by Name
                </button>

                <div className="context-menu-divider" />

                <button
                  type="button"
                  onClick={() => {
                    setShowDesktopProperties(true);
                    setContextMenu(null);
                  }}
                >
                  <span>⚙️</span>
                  Properties
                </button>
              </div>
            )}

            {showDesktopProperties && (
              <div
                className="desktop-properties-overlay"
                onClick={() => setShowDesktopProperties(false)}
              >
                <div
                  className="desktop-properties"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="desktop-properties-titlebar">
                    <span>Display Properties</span>
                    <button
                      type="button"
                      onClick={() => setShowDesktopProperties(false)}
                      aria-label="Close properties"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="desktop-properties-content">
                    <div className="properties-icon">🖥️</div>
                    <div>
                      <strong>Portfolio OS Desktop</strong>
                      <p>
                        A retro desktop experience inspired by Windows 95.
                      </p>
                      <p>Version: 1.0</p>
                      <p>Resolution: Modern Web Display</p>
                    </div>
                  </div>

                  <div className="desktop-properties-actions">
                    <button
                      type="button"
                      onClick={() => setShowDesktopProperties(false)}
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}
                    
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
