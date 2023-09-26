export default function request<Response>(
  url: string,
  config: RequestInit = {}
): any {
  return fetch(url, config)
    .then((response) => response.text())
    .then((data) => data as Response)
    .catch(() => 'Error');
}
