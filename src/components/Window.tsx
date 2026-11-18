
"use client";

import { useRef } from "react";
import type {
  ReactNode,
  PointerEvent as ReactPointerEvent,
} from "react";

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
  onMove: (x: number, y: number) => void;
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
  onMove,
}: WindowProps) {

  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  function handlePointerDown(
    event: ReactPointerEvent<HTMLElement>
  ) {
    if (isMaximized) return;

    // Don't start dragging when a title-bar button is clicked.
    if (
      event.target instanceof HTMLElement &&
      event.target.closest("button")
    ) {
      return;
    }

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: x,
      originY: y,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(
    event: ReactPointerEvent<HTMLElement>
  ) {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) return;

    const newX = drag.originX + event.clientX - drag.startX;
    const newY = drag.originY + event.clientY - drag.startY;

    onMove(newX, newY);
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLElement>) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
  }

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
      <header
        className="window-titlebar"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
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
