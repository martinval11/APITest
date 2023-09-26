export default function request<Response>(
  url: string,
  config: RequestInit = {}
): Promise<Response> {
  return fetch(url, config)
    .then((response) => {
      if (response.ok) return response;
      throw new Error(`Error HTTP: ${response.status}`);
    })
    .then((response) => response.text())
    .then((data) => data as Response)
}
