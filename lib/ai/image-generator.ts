export interface GeneratedImageResult {
  buffer: Buffer;
}

async function fetchRemoteImage(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`图片资源下载失败: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function callGPTImage2(
  prompt: string,
): Promise<GeneratedImageResult> {
  const baseUrl = process.env.NEW_API_BASE_URL;
  const apiKey = process.env.NEW_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error(
      "AI 出图服务未配置，请检查 NEW_API_BASE_URL 和 NEW_API_KEY",
    );
  }

  const response = await fetch(`${baseUrl}/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-image-2",
      prompt,
      size: "1024x1024",
    }),
  });

  if (!response.ok) {
    throw new Error(`AI 出图服务请求失败: ${response.status}`);
  }

  const data = await response.json();
  const image = data.data?.[0];

  if (typeof image?.b64_json === "string" && image.b64_json.length > 0) {
    return { buffer: Buffer.from(image.b64_json, "base64") };
  }

  if (typeof image?.url === "string" && image.url.length > 0) {
    return { buffer: await fetchRemoteImage(image.url) };
  }

  throw new Error("AI 出图服务返回内容为空");
}
