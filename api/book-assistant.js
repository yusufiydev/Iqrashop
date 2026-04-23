const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
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

const languageNames = {
    uz: "o'zbek",
    qq: 'qaraqalpaq',
    en: 'English',
    ru: 'русский',
};

const buildSystemPrompt = (book, reviews, language) => {
    const langName = languageNames[language] || languageNames.uz;
    const safeBook = book || {};
    const safeReviews = Array.isArray(reviews) ? reviews : [];

    const bookInfo = [
        `Nomi: ${safeBook.title || "Noma'lum"}`,
        `Muallif: ${safeBook.author || "Noma'lum"}`,
        safeBook.genre ? `Janr: ${safeBook.genre}` : null,
        safeBook.rating ? `Reyting: ${safeBook.rating}/5` : null,
        safeBook.price ? `Narx: ${Number(safeBook.price).toLocaleString()} so'm` : null,
        safeBook.description ? `Tavsif: ${String(safeBook.description).slice(0, 600)}` : null,
    ].filter(Boolean).join('\n');

    const reviewsInfo = safeReviews.length > 0
        ? safeReviews.slice(0, 4).map((review, index) => {
            const user = review?.user || "O'quvchi";
            const text = String(review?.text || '').slice(0, 500);
            return `${index + 1}. ${user}: "${text}"`;
        }).join('\n')
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
        '- Har bir savolga ALOHIDA, MAXSUS javob bering - umumiy javoblar bermang.',
        '- Foydalanuvchi nimani so\'rasa, aynan shu haqida gapiing.',
        '- Qisqa, aniq va foydali bo\'ling.',
        '- Har doim bir xil tarzda boshlamang.',
    ].join('\n');
};

const readBody = async (request) => {
    if (request.body && typeof request.body === 'object') {
        return request.body;
    }

    return new Promise((resolve, reject) => {
        let rawBody = '';

        request.on('data', (chunk) => {
            rawBody += chunk;
        });

        request.on('end', () => {
            try {
                resolve(rawBody ? JSON.parse(rawBody) : {});
            } catch (error) {
                reject(error);
            }
        });

        request.on('error', reject);
    });
};

const sendJson = (response, statusCode, payload) => {
    response.status(statusCode).json(payload);
};

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        sendJson(response, 405, { error: 'Method not allowed' });
        return;
    }

    try {
        const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;

        if (!apiKey) {
            sendJson(response, 500, { error: 'AI kaliti topilmadi. Deploy sozlamalarida GROQ_API_KEY ni tekshiring.' });
            return;
        }

        const body = await readBody(request);
        const question = String(body.question || '').trim();

        if (!question) {
            sendJson(response, 400, { error: 'Savol bo\'sh bo\'lishi mumkin emas.' });
            return;
        }

        const history = Array.isArray(body.history) ? body.history : [];
        const messages = [
            {
                role: 'system',
                content: buildSystemPrompt(body.book, body.reviews, body.language),
            },
            ...history
                .filter((message) => message && ['user', 'assistant'].includes(message.role) && String(message.content || '').trim())
                .slice(-10)
                .map(({ role, content }) => ({ role, content: String(content).slice(0, 1200) })),
            {
                role: 'user',
                content: question,
            },
        ];

        const groqResponse = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: resolveModel(process.env.GROQ_MODEL || process.env.VITE_GROQ_MODEL || DEFAULT_GROQ_MODEL),
                messages,
                temperature: 0.8,
                max_tokens: 900,
                top_p: 0.95,
            }),
        });

        const payload = await groqResponse.json().catch(() => null);

        if (!groqResponse.ok) {
            sendJson(response, groqResponse.status, {
                error: payload?.error?.message || payload?.message || 'AI xizmati bilan bog\'lanib bo\'lmadi.',
            });
            return;
        }

        const answer = payload?.choices?.[0]?.message?.content?.trim();

        if (!answer) {
            sendJson(response, 502, { error: 'AI dan javob kelmadi.' });
            return;
        }

        sendJson(response, 200, { answer });
    } catch (error) {
        sendJson(response, 500, { error: error.message || 'AI xizmati bilan bog\'lanib bo\'lmadi.' });
    }
}
