const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const BOOK_ASSISTANT_API_URL = import.meta.env.VITE_BOOK_ASSISTANT_API_URL || '/api/book-assistant';
const DEFAULT_GROQ_MODEL = 'llama-3.3-70b-versatile';
const DEPRECATED_MODEL_REPLACEMENTS = {
    'llama3-70b-8192': 'llama-3.3-70b-versatile',
    'llama3-8b-8192': 'llama-3.1-8b-instant',
};

const resolveModel = (modelValue) => {
    const normalized = String(modelValue || '').trim();

    if (!normalized) {
        return DEFAULT_GROQ_MODEL;
    }

    return DEPRECATED_MODEL_REPLACEMENTS[normalized] || normalized;
};

const GROQ_MODEL = resolveModel(import.meta.env.VITE_GROQ_MODEL || DEFAULT_GROQ_MODEL);

const languageNames = {
    uz: "o'zbek",
    en: 'English',
    ru: 'русский',
};

const buildSystemPrompt = (book, reviews, language) => {
    const langName = languageNames[language] || languageNames.uz;

    const bookInfo = [
        `Nomi: ${book.title}`,
        `Muallif: ${book.author || "Noma'lum"}`,
        book.genre ? `Janr: ${book.genre}` : null,
        book.rating ? `Reyting: ${book.rating}/5` : null,
        book.price ? `Narx: ${Number(book.price).toLocaleString()} so'm` : null,
        book.description ? `Tavsif: ${book.description.slice(0, 600)}` : null,
    ].filter(Boolean).join('\n');

    const reviewsInfo = reviews.length > 0
        ? reviews.slice(0, 4).map((r, i) => `${i + 1}. ${r.user}: "${r.text}"`).join('\n')
        : "Sharhlar yo'q.";

    return [
        `Siz kitob do'koni AI yordamchisisiz. Faqat ${langName} tilida javob bering.`,
        '',
        'Kitob haqida ma\'lumot:',
        bookInfo,
        '',
        "O'quvchilar sharhlari:",
        reviewsInfo,
        '',
        'Muhim qoidalar:',
        '- Har bir savolga ALOHIDA, MAXSUS javob bering — umumiy javoblar bermang.',
        '- Foydalanuvchi nimani so\'rasa, aynan shu haqida gapiing.',
        '- Qisqa, aniq va foydali bo\'ling.',
        '- Har doim bir xil tarzda boshlamang.',
    ].join('\n');
};

export const requestBookAssistantAnswer = async ({ book, reviews = [], question, language = 'uz', history = [] }) => {
    if (!question?.trim()) {
        throw new Error('Savol bo\'sh bo\'lishi mumkin emas.');
    }

    const remoteResponse = await fetch(BOOK_ASSISTANT_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            book,
            reviews,
            question,
            language,
            history,
        }),
    }).catch(() => null);

    if (remoteResponse?.headers.get('content-type')?.includes('application/json')) {
        const payload = await remoteResponse.json().catch(() => null);

        if (!remoteResponse.ok) {
            const errorMessage =
                payload?.error
                || payload?.message
                || 'AI xizmati bilan bog\'lanib bo\'lmadi.';
            throw new Error(errorMessage);
        }

        const answer = payload?.answer?.trim();

        if (!answer) {
            throw new Error('AI dan javob kelmadi.');
        }

        return { answer };
    }

    if (!GROQ_API_KEY) {
        throw new Error('AI kaliti topilmadi. Deploy sozlamalarida GROQ_API_KEY ni tekshiring.');
    }

    const messages = [
        {
            role: 'system',
            content: buildSystemPrompt(book, reviews, language),
        },
        ...history
            .filter((m) => m && ['user', 'assistant'].includes(m.role) && m.content?.trim())
            .slice(-10)
            .map(({ role, content }) => ({ role, content: content.slice(0, 1200) })),
        {
            role: 'user',
            content: question.trim(),
        },
    ];

    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: GROQ_MODEL,
            messages,
            temperature: 0.8,
            max_tokens: 900,
            top_p: 0.95,
        }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
        const errorMessage =
            payload?.error?.message
            || payload?.message
            || 'AI xizmati bilan bog\'lanib bo\'lmadi.';
        throw new Error(errorMessage);
    }

    const answer = payload?.choices?.[0]?.message?.content?.trim();

    if (!answer) {
        throw new Error('AI dan javob kelmadi.');
    }

    return { answer };
};
