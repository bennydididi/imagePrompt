import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'no file' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: (file as any).type ?? 'application/octet-stream' });
    const fd = new FormData();
    const filename = (file as any).name ?? 'upload.jpg';
    fd.append('file', blob, filename);

    // upload to Coze
    const uploadResp = await fetch('https://api.coze.cn/v1/files/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.COZE_API_TOKEN ?? ''}`,
      },
      body: fd as any,
    });

    if (!uploadResp.ok) {
      const txt = await uploadResp.text();
      return NextResponse.json({ error: 'coze upload failed', detail: txt }, { status: 502 });
    }

    const uploadJson = await uploadResp.json();
    const fileId = uploadJson?.data?.id ?? null;

    // call workflow/run immediately
  // read additional params from the incoming form and forward them to the workflow
  const promptType = String(form.get('promptType') ?? '');
  const userQuery = String(form.get('userQuery') ?? '');

  const runResp = await fetch('https://api.coze.cn/v1/workflow/run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.COZE_API_TOKEN ?? ''}`,
    },
    body: JSON.stringify({
      workflow_id: process.env.COZE_WORKFLOW_ID ?? '',
      parameters: {
        img: JSON.stringify({ file_id: fileId }),
        promptType,
        userQuery,
      },
      is_async: false,
    }),
  });

    if (!runResp.ok) {
      const txt = await runResp.text();
      return NextResponse.json({ error: 'coze workflow run failed', detail: txt }, { status: 502 });
    }

    const runJson = await runResp.json();
    return NextResponse.json({ fileId, workflow: runJson });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error(err);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}


