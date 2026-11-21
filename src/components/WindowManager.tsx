
"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Window from "./Window";
import type { WindowID, WindowState } from "@/types/window";
import FileExplorer from "@/components/FileExplorer";

type WindowManagerProps = {
  children: (controls: {
    openWindow: (id: WindowID) => void;
    windows: WindowState[];
    activeWindowId: WindowID | null;
    onTaskbarClick: (id: WindowID) => void;
    cascadeWindows: () => void;
    tileHorizontally: () => void;
    tileVertically: () => void;
    minimizeAllWindows: () => void;
    restoreAllWindows: () => void;
    bringAllWindowsToFront: () => void;
  }) => ReactNode;
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

function getWindowContent(
  id: WindowID,
  openWindow: (id: WindowID) => void
): ReactNode {
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
      return <FileExplorer openWindow={openWindow} />;
  }
}

export default function WindowManager({
  children,
}: WindowManagerProps) {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(10);
  const managerRef = useRef<HTMLDivElement>(null);
  const [managerSize, setManagerSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const container = managerRef.current;
    if (!container) return;
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setManagerSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    resizeObserver.observe(container);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  const activeWindow = windows.reduce<WindowState | null>(
    (active, window) => {
      if (window.isMinimized) return active;

      if (!active || window.zIndex > active.zIndex) {
        return window;
      }

      return active;
    },
    null
  );

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
    if (managerSize.width === 0 || managerSize.height === 0) {
      return;
    }
    const maxX = Math.max(
      0,
      managerSize.width -
        (windows.find((window) => window.id === id)?.width ?? 0)
    );
    const maxY = Math.max(0, managerSize.height - 27);

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

  function handleTaskbarClick(id: WindowID) {
    const clickedWindow = windows.find(
      (window) => window.id === id
    );

    if (!clickedWindow) return;

    // Clicking the active window minimizes it.
    if (
      !clickedWindow.isMinimized &&
      activeWindow?.id === id
    ) {
      minimizeWindow(id);
      return;
    }

    // Otherwise restore it and bring it to the front.
    setWindows((currentWindows) =>
      currentWindows.map((window) =>
        window.id === id
          ? {
              ...window,
              isMinimized: false,
              zIndex: nextZIndex,
            }
          : window
      )
    );

    setNextZIndex((current) => current + 1);
  }

  // Arrange all open windows in a cascading layout.
  function cascadeWindows() {
    const containerWidth = managerSize.width;
    const containerHeight = managerSize.height;

    if (containerWidth === 0 || containerHeight === 0) return;

    setWindows((currentWindows) => {
      const openWindows = currentWindows.filter(
        (window) => window.isOpen
      );

      return currentWindows.map((window) => {
        const index = openWindows.findIndex(
          (item) => item.id === window.id
        );

        if (index === -1) return window;

        const width = Math.min(window.width, containerWidth);
        const height = Math.min(window.height, containerHeight);

        const maxX = Math.max(0, containerWidth - width);
        const maxY = Math.max(0, containerHeight - height);

        return {
          ...window,
          x: Math.min(index * 30, maxX),
          y: Math.min(index * 30, maxY),
          width,
          height,
          isMinimized: false,
          isMaximized: false,
          zIndex: nextZIndex + index,
        };
      });
    });

    setNextZIndex((current) => current + windows.filter(
      (window) => window.isOpen
    ).length);
  }

  // Arrange windows in horizontal rows.
  function tileHorizontally() {
    const containerWidth = managerSize.width;
    const containerHeight = managerSize.height;

    if (containerWidth === 0 || containerHeight === 0) return;

    setWindows((currentWindows) => {
      const openWindows = currentWindows.filter(
        (window) => window.isOpen
      );

      const count = openWindows.length;

      if (count === 0) return currentWindows;

      return currentWindows.map((window) => {
        const index = openWindows.findIndex(
          (item) => item.id === window.id
        );

        if (index === -1) return window;

        const rowHeight = containerHeight / count;
        const y = index * rowHeight;

        return {
          ...window,
          x: 0,
          y,
          width: containerWidth,
          height: rowHeight,
          isMinimized: false,
          isMaximized: false,
          zIndex: nextZIndex + index,
        };
      });
    });

    setNextZIndex((current) => current + windows.filter(
      (window) => window.isOpen
    ).length);
  }

  // Arrange windows in vertical columns.
  function tileVertically() {
    const containerWidth = managerSize.width;
    const containerHeight = managerSize.height;

    if (containerWidth === 0 || containerHeight === 0) return;

    setWindows((currentWindows) => {
      const openWindows = currentWindows.filter(
        (window) => window.isOpen
      );

      const count = openWindows.length;

      if (count === 0) return currentWindows;

      return currentWindows.map((window) => {
        const index = openWindows.findIndex(
          (item) => item.id === window.id
        );

        if (index === -1) return window;

        const columnWidth = containerWidth / count;
        const x = index * columnWidth;

        return {
          ...window,
          x,
          y: 0,
          width: columnWidth,
          height: containerHeight,
          isMinimized: false,
          isMaximized: false,
          zIndex: nextZIndex + index,
        };
      });
    });

    setNextZIndex((current) => current + windows.filter(
      (window) => window.isOpen
    ).length);
  }


  // Minimize every open window.
  function minimizeAllWindows() {
    setWindows((currentWindows) =>
      currentWindows.map((window) =>
        window.isOpen
          ? { ...window, isMinimized: true }
          : window
      )
    );
  }

  // Restore every minimized window.
  function restoreAllWindows() {
    setWindows((currentWindows) =>
      currentWindows.map((window) =>
        window.isOpen
          ? { ...window, isMinimized: false }
          : window
      )
    );
  }

  // Restore all windows and bring them to the front.
  function bringAllWindowsToFront() {
    const openWindowCount = windows.filter(
      (window) => window.isOpen
    ).length;

    setWindows((currentWindows) => {
      let zIndex = nextZIndex;

      return currentWindows.map((window) => {
        if (!window.isOpen) return window;

        return {
          ...window,
          isMinimized: false,
          zIndex: zIndex++,
        };
      });
    });

    setNextZIndex((current) => current + openWindowCount);
  }


  return (
    <div className="window-manager-root">
      {children({
        openWindow,
        windows,
        activeWindowId: activeWindow?.id ?? null,
        onTaskbarClick: handleTaskbarClick,
        cascadeWindows,
        tileHorizontally,
        tileVertically,
        minimizeAllWindows,
        restoreAllWindows,
        bringAllWindowsToFront,
      })}

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
              {getWindowContent(window.id, openWindow)}
            </Window>
          );
        })}
      </div>
    </div>
  );
}
