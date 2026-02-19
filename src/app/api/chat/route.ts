import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/authMiddleware';
import { z } from 'zod';

const ChatMessageSchema = z.object({
  patientId: z.string().min(1),
  message: z.string().min(1),
});

const simpleAIResponses: Record<string, string> = {
  'boli': 'Ból podczas ćwiczeń może wskazywać na zbyt intensywny trening lub nieprawidłową technikę. Zalecam zmniejszenie intensywności i skonsultowanie się z fizjoterapeutą.',
  'ból': 'Ból podczas ćwiczeń może wskazywać na zbyt intensywny trening lub nieprawidłową technikę. Zalecam zmniejszenie intensywności i skonsultowanie się z fizjoterapeutą.',
  'zmęczony': 'Zmęczenie jest naturalną reakcją organizmu na trening. Upewnij się, że odpoczywasz wystarczająco między treningami i śpisz 7-9 godzin.',
  'zmęczona': 'Zmęczenie jest naturalną reakcją organizmu na trening. Upewnij się, że odpoczywasz wystarczająco między treningami i śpisz 7-9 godzin.',
  'odpoczynek': 'Odpoczynek jest kluczowy dla regeneracji mięśni. Planuj przynajmniej 1-2 dni wolnego od treningu w każdym tygodniu.',
  'regeneracja': 'Regeneracja obejmuje sen, odżywianie, nawodnienie i aktywny odpoczynek. Każdy z tych elementów jest ważny dla postępów.',
  'postęp': 'Aby śledzić postępy, regularnie wykonuj pomiary i testy. Zanotuj wyniki, aby widzieć poprawę w czasie.',
  'ćwiczenie': 'Wybierz ćwiczenia odpowiednie do Twojego poziomu. Zaczynaj od lżejszych i stopniowo zwiększaj intensywność.',
  'trening': 'Trening powinien być dostosowany do Twojego poziomu. Pamiętaj o rozgrzewce przed i rozciąganiu po treningu.',
  'ile': 'Czas treningu zależy od Twojego poziomu. Początkujący powinni zaczynać od 20-30 minut, zaawansowani mogą trenować 45-60 minut.',
  'jak': 'Jakość jest ważniejsza niż ilość. Lepiej wykonać mniej ćwiczeń poprawnie niż więcej źle.',
  'co': 'Najlepiej zacząć od podstawowych ćwiczeń wzmacniających. Skup się na równowadze, sile i mobilności.',
  'dieta': 'Prawidłowe odżywianie wspiera regenerację. Białko jest ważne dla odbudowy mięśni, a węglowodany dla energii.',
  'sen': 'Sen jest kluczowy dla regeneracji. Staraj się spać 7-9 godzin dziennie w ciemnym i chłodnym pomieszczeniu.',
  'woda': 'Nawodnienie jest ważne przed, w trakcie i po treningu. Pij przynajmniej 2-3 litry wody dziennie.',
  'rozgrzewka': 'Rozgrzewka przygotowuje ciało do wysiłku. Powinna trwać 5-10 minut i obejmować lekkie cardio i ruchy dynamiczne.',
  'rozciąganie': 'Rozciąganie po treningu pomaga w regeneracji. Rozciągaj główne grupy mięśniowe przez 15-30 sekund każda.',
  'barki': 'Ćwiczenia na barki powinny być wykonywane ostrożnie, szczególnie po urazach. Zacznij od lekkich ciężarów.',
  'kolano': 'Ból kolana może wynikać z przeciążenia. Unikaj głębokich przysiadów i skup się na wzmacnianiu mięśni ud.',
  'plecy': 'Ćwiczenia na plecy wzmacniają mięśnie posturalne. Planki i superman to dobre ćwiczenia na początek.',
  'noga': 'Ćwiczenia na nogi są fundamentem. Przysiady, wykrody i martwy ciąg są podstawowymi ćwiczeniami.',
};

function generateAIResponse(userMessage: string, patientName: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  for (const [keyword, response] of Object.entries(simpleAIResponses)) {
    if (lowerMessage.includes(keyword)) {
      return `Cześć ${patientName}! ${response}`;
    }
  }
  
  return `Dziękuję za wiadomość, ${patientName}. 
  
Na podstawie Twojego pytania, oto kilka ogólnych wskazówek:

1. **Słuchaj swojego ciała** - jeśli coś boli, przestań i skonsultuj się ze specjalistą.

2. **Regularność** - lepiej trenować krócej, ale regularnie, niż długо raz na jakiś czas.

3. **Postępuj zgodnie z planem** - Twój plan rehabilitacji został stworzony przez specjalistę, aby zapewnić bezpieczne postępy.

4. **Kontakt** - jeśli masz wątpliwości, skontaktuj się ze mną lub bezpośrednio z fizjoterapeutą.

Czy masz jakieś konkretne pytania dotyczące Twojego planu?`;
}

export async function GET(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');

    if (!patientId) {
      return NextResponse.json({ error: 'patientId is required' }, { status: 400 });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { patientId },
      orderBy: { createdAt: 'asc' },
      take: 50,
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    
    const validation = ChatMessageSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { patientId, message } = validation.data;

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    const userMessage = await prisma.chatMessage.create({
      data: {
        patientId,
        role: 'user',
        content: message,
      },
    });

    const aiResponse = generateAIResponse(message, patient.firstName);

    const assistantMessage = await prisma.chatMessage.create({
      data: {
        patientId,
        role: 'assistant',
        content: aiResponse,
      },
    });

    return NextResponse.json({
      userMessage,
      assistantMessage,
    });
  } catch (error) {
    console.error('Failed to send message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
