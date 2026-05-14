export interface ReasoningResult {
  analysis: string;
  enhancedPrompt: string;
  styleNotes: string;
  compositionTip: string;
}

export async function callGPT55Reasoning(
  persona: string,
  scene: string,
  params: Record<string, unknown>,
): Promise<ReasoningResult> {
  const baseUrl = process.env.NEW_API_BASE_URL;
  const apiKey = process.env.NEW_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error("AI 推理服务未配置，请检查 NEW_API_BASE_URL 和 NEW_API_KEY");
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "你是一位资深视觉设计师和 AI 绘图专家。请以 JSON 格式返回，不要包含任何 markdown 代码块。",
        },
        {
          role: "user",
          content: `用户需求：
- 身份：${persona} | 场景：${scene}
- 参数：${JSON.stringify(params, null, 2)}

请返回以下 JSON 结构：
{
  "analysis": "需求分析（中文，2-3句）",
  "enhancedPrompt": "增强后的英文 Prompt（专业摄影/设计描述词）",
  "styleNotes": "风格说明要点（中文）",
  "compositionTip": "构图建议（中文）"
}`,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI 推理服务请求失败: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("AI 推理服务返回内容为空");
  }

  return JSON.parse(content) as ReasoningResult;
}
