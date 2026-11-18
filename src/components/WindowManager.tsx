
"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";
import Window from "./Window";
import type { WindowID, WindowState } from "@/types/window";

type WindowManagerProps = {
  children: (openWindow: (id: WindowID) => void) => ReactNode;
};

const windowTitles: Record<WindowID, string> = {
  about: "About Me",
  projects: "My Projects",
  skills: "My Skills",
  experience: "Experience",
  resume: "Resume.pdf",
  contact: "Contact",
  computer: "My Computer",
};

function getWindowContent(id: WindowID) {
  switch (id) {
    case "about":
      return <h2>Welcome to my portfolio!</h2>;

    case "projects":
      return <h2>My Projects</h2>;

    case "skills":
      return <h2>My Skills</h2>;

    case "experience":
      return <h2>My Experience</h2>;

    case "resume":
      return <h2>Resume</h2>;

    case "contact":
      return <h2>Contact Me</h2>;

    case "computer":
      return <h2>My Computer</h2>;
  }
}

export default function WindowManager({
  children,
}: WindowManagerProps) {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(10);
  const managerRef = useRef<HTMLDivElement>(null);

  // Open an application window
  function openWindow(id: WindowID) {
    setWindows((currentWindows) => {
      const existingWindow = currentWindows.find(
        (window) => window.id === id
      );

      if (existingWindow) {
        return currentWindows.map((window) =>
          window.id === id
            ? {
                ...window,
                isMinimized: false,
                zIndex: nextZIndex,
              }
            : window
        );
      }

      const newWindow: WindowState = {
        id,
        title: windowTitles[id],
        x: 100 + currentWindows.length * 30,
        y: 70 + currentWindows.length * 30,
        width: 600,
        height: 400,
        zIndex: nextZIndex,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
      };

      return [...currentWindows, newWindow];
    });

    setNextZIndex((current) => current + 1);
  }

  // Close a window
  function closeWindow(id: WindowID) {
    setWindows((currentWindows) =>
      currentWindows.filter((window) => window.id !== id)
    );
  }

  // Minimize a window
  function minimizeWindow(id: WindowID) {
    setWindows((currentWindows) =>
      currentWindows.map((window) =>
        window.id === id
          ? { ...window, isMinimized: true }
          : window
      )
    );
  }

  // Maximize or restore a window
  function maximizeWindow(id: WindowID) {
    setWindows((currentWindows) =>
      currentWindows.map((window) =>
        window.id === id
          ? { ...window, isMaximized: !window.isMaximized }
          : window
      )
    );
  }

  // Bring a window to the front
  function focusWindow(id: WindowID) {
    setWindows((currentWindows) =>
      currentWindows.map((window) =>
        window.id === id
          ? { ...window, zIndex: nextZIndex }
          : window
      )
    );

    setNextZIndex((current) => current + 1);
  }

  // Move a window to a new position
  function moveWindow(id: WindowID, x: number, y: number) {
    const container = managerRef.current;

    if (!container) return;

    const maxX = Math.max(
      0,
      container.clientWidth -
        (windows.find((window) => window.id === id)?.width ?? 0)
    );

    const maxY = Math.max(0, container.clientHeight - 27);

    const boundedX = Math.min(Math.max(0, x), maxX);
    const boundedY = Math.min(Math.max(0, y), maxY);

    setWindows((currentWindows) =>
      currentWindows.map((window) =>
        window.id === id
          ? { ...window, x: boundedX, y: boundedY }
          : window
      )
    );
  }

  return (
    <>
      {children(openWindow)}

      <div className="window-manager" ref={managerRef}>
        {windows.map((window) => {
          if (!window.isOpen || window.isMinimized) {
            return null;
          }

          return (
            <Window
              key={window.id}
              title={window.title}
              x={window.x}
              y={window.y}
              width={window.width}
              height={window.height}
              zIndex={window.zIndex}
              isMaximized={window.isMaximized}
              onClose={() => closeWindow(window.id)}
              onMinimize={() => minimizeWindow(window.id)}
              onMaximize={() => maximizeWindow(window.id)}
              onFocus={() => focusWindow(window.id)}
              onMove={(x, y) => moveWindow(window.id, x, y)}
            >
              {getWindowContent(window.id)}
            </Window>
          );
        })}
      </div>
    </>
  );
}
