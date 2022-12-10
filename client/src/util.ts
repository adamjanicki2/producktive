import { stringify } from "qs";

export async function get(endpoint: string, params: Object = {}) {
  const pathString: string = endpoint + "?" + stringify(params);
  try {
    const res = await fetch(pathString, { method: "GET" });
    const json = await res.json();
    return json;
  } catch (error) {
    return null;
  }
}

export async function post(endpoint: string, body: Object = {}) {
  try {
    const res = await fetch(endpoint, {
      body: JSON.stringify(body),
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
    });
    const json = await res.json();
    return json;
  } catch (error) {
    console.log(`POST req to ${endpoint} failed:\n${error}`);
    return null;
  }
}

export async function del(endpoint: string, params: Object = {}) {
  const pathString: string = endpoint + "?" + stringify(params);
  try {
    const res = await fetch(pathString, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
    });
    return res.ok ? res.json() : null;
  } catch (error) {
    console.log(`DELETE req to ${endpoint} failed:\n${error}`);
    return null;
  }
}

export async function patch(endpoint: string, body: Object = {}) {
  try {
    const res = await fetch(endpoint, {
      body: JSON.stringify(body),
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
    });
    const json = await res.json();
    return json;
  } catch (error) {
    console.log(`PATCH req to ${endpoint} failed:\n${error}`);
    return null;
  }
}

export type User = {
  _id: string;
  email: string;
  username: string;
  notifPeriod: "daily" | "weekly" | "monthly" | "none";
  coins: number;
};

export type Task = {
  _id: string;
  userId?: string;
  parent?: List;
  content: string;
  difficulty: "easy" | "medium" | "hard";
  completed: boolean;
  deadline: string;
  reward: number;
  // ADD MORE PROPERTIES HERE
};

export type List = {
  _id: string;
  userId?: string;
  title: string;
};

export type ColorOption =
  | "yellow"
  | "orange"
  | "green"
  | "blue"
  | "red"
  | "black"
  | "purple";

export const COLOR_OPTIONS = [
  "yellow",
  "orange",
  "green",
  "blue",
  "red",
  "black",
  "purple",
] as const;

export type Pet = {
  _id: string;
  userId: string;
  petName: string;
  lastFed: Date;
  health: number;
  itemsOn: {
    duck: ColorOption;
    beak: ColorOption;
    hat: string;
  };
};

export type StoreItem = {
  _id: string;
  userId?: string;
  properties: Record<string, string>;
  type: "beak" | "hat" | "duck";
  identifier: string;
};

export const MUI_BUTTON_STYLE: React.CSSProperties = {
  textTransform: "none",
  margin: "4px",
};
