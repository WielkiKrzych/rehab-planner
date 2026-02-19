import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.ZAI_API_KEY,
  baseURL: 'https://api.z.ai/api/paas/v4/',
});

const systemPrompt = `Jesteś profesjonalnym asystentem AI specjalizującym się w rehabilitacji i fizjoterapii. Twoim zadaniem jest pomaganie pacjentom w pytaniach dotyczących:

1. **Ćwiczenia** - jak wykonywać ćwiczenia, jakie są przeciwwskazania, jak zwiększać intensywność
2. **Ból** - interpretacja bólu, gdy należy zgłosić się do specjalisty
3. **Regeneracja** - sen, odpoczynek, techniki regeneracji
4. **Postępy** - jak śledzić postępy, na co zwracać uwagę
5. **Dieta** - nawodnienie, białko, węglowodany dla sportowców
6. **Technika** - prawidłowa forma wykonywania ćwiczeń

Zasady:
- Odpowiadaj zwięźle i konkretnie
- Jeśli pytanie wykracza poza Twoją wiedzę, odeslij do specjalisty
- Używaj języka polskiego
- Bądź empatyczny i wspierający
- Nie diagnozuj - to robi fizjoterapeuta
- Pytaj o szczegóły gdy potrzebujesz więcej informacji`;

export async function getAIResponse(userMessage: string, context?: {
  patientName?: string;
  recentCheckins?: Array<{date: string; painLevel: number; energyLevel: number; sleepQuality: number; mood: number}>;
  goals?: Array<{name: string; goalType: string}>;
}) {
  if (!process.env.ZAI_API_KEY) {
    return null;
  }

  try {
    let contextInfo = '';
    
    if (context?.patientName) {
      contextInfo += `Pacjent: ${context.patientName}\n`;
    }
    
    if (context?.recentCheckins && context.recentCheckins.length > 0) {
      contextInfo += `\nOstatnie oceny gotowości:\n`;
      for (const checkin of context.recentCheckins) {
        contextInfo += `- ${checkin.date}: ból ${checkin.painLevel}/10, energia ${checkin.energyLevel}/10, sen ${checkin.sleepQuality}/10, nastrój ${checkin.mood}/10\n`;
      }
    }
    
    if (context?.goals && context.goals.length > 0) {
      contextInfo += `\nCele pacjenta:\n`;
      for (const goal of context.goals) {
        contextInfo += `- ${goal.name} (${goal.goalType})\n`;
      }
    }

    const messages: Array<{role: 'system' | 'user' | 'assistant'; content: string}> = [
      { role: 'system', content: systemPrompt },
    ];

    if (contextInfo) {
      messages.push({
        role: 'system',
        content: `Kontekst pacjenta:\n${contextInfo}`
      });
    }

    messages.push({ role: 'user', content: userMessage });

    const completion = await openai.chat.completions.create({
      model: 'glm-5',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'Przepraszam, nie udało mi się odpowiedzieć.';
  } catch (error) {
    console.error('GLM-5 API error:', error);
    return null;
  }
}
