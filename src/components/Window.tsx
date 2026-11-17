
"use client";

import type { ReactNode } from "react";

type WindowProps = {
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMaximized: boolean;
  children: ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
};

export default function Window({
  title,
  x,
  y,
  width,
  height,
  zIndex,
  isMaximized,
  children,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
}: WindowProps) {
  return (
    <section
      className={`window ${isMaximized ? "maximized" : ""}`}
      style={{
        left: x,
        top: y,
        width: isMaximized ? "100%" : width,
        height: isMaximized ? "100%" : height,
        zIndex,
      }}
      onMouseDown={onFocus}
    >
      <header className="window-titlebar">
        <div className="window-title">
          <span aria-hidden="true">🗔</span>
          <strong>{title}</strong>
        </div>

        <div className="window-controls">
          <button
            type="button"
            aria-label="Minimize window"
            onClick={(event) => {
              event.stopPropagation();
              onMinimize();
            }}
          >
            _
          </button>

          <button
            type="button"
            aria-label={isMaximized ? "Restore window" : "Maximize window"}
            onClick={(event) => {
              event.stopPropagation();
              onMaximize();
            }}
          >
            {isMaximized ? "❐" : "□"}
          </button>

          <button
            type="button"
            aria-label="Close window"
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
          >
            ×
          </button>
        </div>
      </header>

      <div className="window-content">
        {children}
      </div>
    </section>
  );
}
