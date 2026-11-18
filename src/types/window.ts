
export type WindowID =
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "resume"
  | "contact"
  | "computer";

export type WindowState = {
  id: WindowID;
  title: string;

  x: number;
  y: number;

  width: number;
  height: number;

  zIndex: number;

  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
};
