
"use client";

import { useState } from "react";
import type { WindowID } from "@/types/window";

type ExplorerEntry = {
  id: string;
  name: string;
  kind: "folder" | "file";
  icon: string;
  children?: ExplorerEntry[];
  targetWindow?: WindowID;
};

type FileExplorerProps = {
  openWindow: (id: WindowID) => void;
};

// Mock file system
const fileSystem: ExplorerEntry[] = [
  {
    id: "drive-c",
    name: "Local Disk (C:)",
    kind: "folder",
    icon: "💽",
    children: [
      {
        id: "portfolio",
        name: "Portfolio",
        kind: "folder",
        icon: "📁",
        children: [
          {
            id: "about-file",
            name: "About Me.txt",
            kind: "file",
            icon: "📄",
            targetWindow: "about",
          },
          {
            id: "skills-file",
            name: "My Skills.txt",
            kind: "file",
            icon: "📄",
            targetWindow: "skills",
          },
          {
            id: "experience-file",
            name: "Experience.txt",
            kind: "file",
            icon: "📄",
            targetWindow: "experience",
          },
          {
            id: "contact-file",
            name: "Contact.txt",
            kind: "file",
            icon: "📄",
            targetWindow: "contact",
          },
        ],
      },
      {
        id: "projects-folder",
        name: "Projects",
        kind: "folder",
        icon: "📁",
        children: [
          {
            id: "projects-file",
            name: "My Projects.txt",
            kind: "file",
            icon: "📄",
            targetWindow: "projects",
          },
        ],
      },
      {
        id: "documents-folder",
        name: "Documents",
        kind: "folder",
        icon: "📁",
        children: [
          {
            id: "resume-file",
            name: "Resume.pdf",
            kind: "file",
            icon: "📕",
            targetWindow: "resume",
          },
        ],
      },
    ],
  },
  {
    id: "drive-d",
    name: "Data (D:)",
    kind: "folder",
    icon: "💽",
    children: [
      {
        id: "backup-folder",
        name: "Backups",
        kind: "folder",
        icon: "📁",
        children: [],
      },
    ],
  },
  {
    id: "floppy",
    name: "3½ Floppy (A:)",
    kind: "folder",
    icon: "💾",
    children: [],
  },
];

export default function FileExplorer({
  openWindow,
}: FileExplorerProps) {
  const [history, setHistory] = useState<string[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const currentPath = history[historyIndex];

  // Resolve the current folder from its path.
  let currentItems = fileSystem;
  let currentFolderName = "My Computer";

  for (const folderId of currentPath) {
    const folder = currentItems.find((item) => item.id === folderId);

    if (!folder || !folder.children) break;

    currentItems = folder.children;
    currentFolderName = folder.name;
  }

  function navigateTo(path: string[]) {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(path);

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setSelectedItem(null);
  }

  function goBack() {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSelectedItem(null);
    }
  }

  function goForward() {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSelectedItem(null);
    }
  }

  function goUp() {
    if (currentPath.length > 0) {
      navigateTo(currentPath.slice(0, -1));
    }
  }

  function openEntry(entry: ExplorerEntry) {
    if (entry.kind === "folder") {
      navigateTo([...currentPath, entry.id]);
      return;
    }

    if (entry.targetWindow) {
      openWindow(entry.targetWindow);
    }
  }

  return (
    <div className="file-explorer">
      <div className="explorer-toolbar">
        <button
          type="button"
          onClick={goBack}
          disabled={historyIndex === 0}
        >
          ◀ Back
        </button>

        <button
          type="button"
          onClick={goForward}
          disabled={historyIndex === history.length - 1}
        >
          Forward ▶
        </button>

        <button
          type="button"
          onClick={goUp}
          disabled={currentPath.length === 0}
        >
          ⬆ Up
        </button>
      </div>

      <div className="explorer-address">
        <strong>Address:</strong>
        <span>My Computer</span>

        {currentPath.map((folderId) => {
          const folder = fileSystem
            .flatMap((drive) => [
              drive,
              ...(drive.children ?? []),
            ])
            .find((item) => item.id === folderId);

          return (
            <span key={folderId}>
              {" / "}
              {folder?.name}
            </span>
          );
        })}
      </div>

      <div className="explorer-content">
        {currentItems.map((entry) => (
          <button
            key={entry.id}
            type="button"
            className={`explorer-item ${
              selectedItem === entry.id ? "selected" : ""
            }`}
            onClick={() => setSelectedItem(entry.id)}
            onDoubleClick={() => openEntry(entry)}
          >
            <span className="explorer-item-icon">{entry.icon}</span>
            <span>{entry.name}</span>
          </button>
        ))}
      </div>

      <div className="explorer-status">
        {currentItems.length} object(s) | {currentFolderName}
      </div>
    </div>
  );
}
