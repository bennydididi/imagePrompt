export async function uploadToCoze(file: File, token: string) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("https://api.coze.cn/v1/files/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Coze upload failed: ${res.status} ${text}`);
  }

  const json = await res.json();
  // Expecting { data: { id: string, ... } }
  return json.data?.id;
}



