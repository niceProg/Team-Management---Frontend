export default async function fetchApi(endpoint, options = {}) {
  const baseUrl = 'https://cekplagiarism.my.id/loopback/api';
  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
