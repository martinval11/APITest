import request from './request';

export async function req(
  url: string,
  method: string,
  headers?: any,
  body?: any,
) {
  try {
    const data = JSON.parse(body || null);
    const response: any = await request(url, {
      method: method,
      headers: { ...(headers || undefined) },
      body: JSON.stringify(data || undefined),
    });
    return response;
  } catch (error) {
    alert('Invalid Request');
  }
}
