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
  notifPeriod: "daily" | "weekly" | "montly" | "none";
};

export type Task = {
  _id: string;
  userId?: string;
  parent?: List;
  content: string;
  difficulty: "easy" | "medium" | "hard";
  date?: string;
  // ADD MORE PROPERTIES HERE
};

export type List = {
  _id: string;
  userId?: string;
  title: string;
};

export const MUI_BUTTON_STYLE: React.CSSProperties = {
  textTransform: "none",
  margin: "4px",
};
