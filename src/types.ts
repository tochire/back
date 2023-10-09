import { Request } from "express";
import { User } from "./models/User/User";

export interface MyRequest extends Request {
  user: User;
  body: {
    pm: string;
    plan: string;
  };
}

export interface MyContext {
  user: User;
}

export enum Priority {
  "Neutral" = "Neutral",
  "Low" = "Low",
  "Medium" = "Medium",
  "High" = "High",
}

export enum TaskStatus {
  "active" = "active",
  "completed" = "completed",
  "archived" = "archived",
  "deleted" = "deleted",
}

export enum TagStatus {
  "active" = "active",
  "archived" = "archived",
}
