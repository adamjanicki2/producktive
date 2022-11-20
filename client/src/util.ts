export async function get(endpoint: string, params: Object = {}) {
  const pathString: string =
    endpoint + "?" + new URLSearchParams(JSON.stringify(params)).toString();
  try {
    const res = await fetch(pathString, { method: "GET" });
    return res.ok ? res.json() : null;
  } catch (error) {
    console.log(`GET request to ${pathString} failed!\n${error}`);
    return null;
  }
}

export async function post(endpoint: string, body: Object = {}) {
  try {
    console.log({ body: JSON.stringify(body) });
    const res = await fetch(endpoint, {
      body: JSON.stringify(body),
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
    });
    console.log({ res });
    return res.ok ? res.json() : null;
  } catch (error) {
    console.log(`POST req to ${endpoint} failed:\n${error}`);
    return null;
  }
}
