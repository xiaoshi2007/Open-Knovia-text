export type LLMProvider = 'openai' | 'deepseek' | 'glm' | 'openrouter';

export interface LLMSettings {
  provider: LLMProvider;
  model: string;
  apiKey: string;
  baseUrl?: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const providerDefaults: Record<LLMProvider, { baseUrl: string; model: string }> = {
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
  },
  deepseek: {
    baseUrl: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
  },
  glm: {
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    model: 'glm-4-flash',
  },
  openrouter: {
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'openai/gpt-4o-mini',
  },
};

export function getProviderDefault(provider: LLMProvider) {
  return providerDefaults[provider];
}

function resolveEndpoint(settings: LLMSettings) {
  const base = (settings.baseUrl || providerDefaults[settings.provider].baseUrl).replace(/\/$/, '');
  return `${base}/chat/completions`;
}

export async function chatWithLLM(settings: LLMSettings, messages: ChatMessage[]): Promise<string> {
  if (!settings.apiKey) throw new Error('未配置API Key');
  const endpoint = resolveEndpoint(settings);
  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model: settings.model || providerDefaults[settings.provider].model,
      messages,
      temperature: 0.7,
    }),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`模型请求失败(${resp.status}): ${text.slice(0, 200)}`);
  }
  const data = await resp.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('模型返回为空');
  return content;
}

export async function generateRandomQuestion(settings: LLMSettings, role: string) {
  const prompt = `你是一个教育平台出题助手。请针对${role}角色，随机生成1个高质量学习问题，要求：
1) 只有一个问题句子
2) 长度在20~45字
3) 要有思考性，不要太宽泛
4) 不要加任何前后解释`;

  const text = await chatWithLLM(settings, [{ role: 'user', content: prompt }]);
  return text.replace(/^["'“”]+|["'“”]+$/g, '').trim();
}

export async function analyzeWeakPoints(settings: LLMSettings, qaPairs: { q: string; a: string }[]) {
  const content = `请根据以下问答记录，分析学习者可能的知识薄弱点。
返回JSON，格式必须是:
{"weakPoints":[{"topic":"主题","reason":"原因","suggestion":"建议","priority":"high|medium|low"}]}
不要返回markdown代码块。

问答记录:
${qaPairs.map((item, idx) => `${idx + 1}. 问: ${item.q}\n答: ${item.a}`).join('\n\n')}`;

  const text = await chatWithLLM(settings, [{ role: 'user', content }]);
  const normalized = text.replace(/```json|```/g, '').trim();
  try {
    const parsed = JSON.parse(normalized);
    return parsed?.weakPoints || [];
  } catch {
    return [];
  }
}

