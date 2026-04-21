import { useEffect, useRef, useState } from 'react';
import { Bot, LoaderCircle, SendHorizontal, User2 } from 'lucide-react';

import { requestBookAssistantAnswer } from '../../services/bookAssistantApi';

const MAX_HISTORY_ITEMS = 6;

const BookAssistant = ({ book, reviews = [], language = 'uz', t }) => {
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const handleAsk = async (incomingQuestion) => {
        const nextQuestion = (incomingQuestion ?? question).trim();

        if (!nextQuestion || isLoading) {
            return;
        }

        const history = messages
            .slice(-MAX_HISTORY_ITEMS)
            .map(({ role, content }) => ({ role, content }));
        const userMessage = {
            id: `${Date.now()}-user`,
            role: 'user',
            content: nextQuestion,
        };

        setError('');
        setIsLoading(true);
        setMessages((prev) => [...prev, userMessage]);
        setQuestion('');

        try {
            const payload = await requestBookAssistantAnswer({
                book,
                reviews,
                question: nextQuestion,
                language,
                history,
            });

            setMessages((prev) => [
                ...prev,
                {
                    id: `${Date.now()}-assistant`,
                    role: 'assistant',
                    content: payload.answer,
                },
            ]);
        } catch (requestError) {
            setError(requestError.message || t('bookAssistant.error'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [messages, isLoading, error]);

    if (!book) {
        return null;
    }

    const handleInputKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleAsk();
        }
    };

    return (
        <div className="rounded-3xl border border-[#dce2ef] bg-white p-3 shadow-sm sm:p-4">
            <div className="overflow-hidden rounded-3xl border border-[#dce2ef] bg-white shadow-sm">
                <div className="max-h-[560px] min-h-[460px] overflow-y-auto p-4 sm:p-5">
                    {messages.length === 0 ? (
                        <div className="flex h-full min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-[#dce2ef] bg-white px-4 text-center text-sm text-gray-600">
                            {t('bookAssistant.empty')}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {messages.map((message) => {
                                const isAssistant = message.role === 'assistant';

                                return (
                                    <div
                                        key={message.id}
                                        className={`flex gap-3 ${isAssistant ? 'items-start' : 'items-start justify-end'}`}
                                    >
                                        {isAssistant ? (
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                                                <Bot className="h-5 w-5" />
                                            </div>
                                        ) : null}

                                        <div
                                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:text-[15px] ${
                                                isAssistant
                                                    ? 'border border-[#dce2ef] bg-white text-gray-800'
                                                    : 'bg-gray-900 text-white'
                                            }`}
                                        >
                                            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] opacity-70">
                                                {isAssistant ? 'AI' : t('bookAssistant.you')}
                                            </p>
                                            <p className="whitespace-pre-wrap">{message.content}</p>
                                        </div>

                                        {!isAssistant ? (
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-gray-700">
                                                <User2 className="h-5 w-5" />
                                            </div>
                                        ) : null}
                                    </div>
                                );
                            })}

                            {isLoading ? (
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                                        <Bot className="h-5 w-5" />
                                    </div>
                                    <div className="inline-flex items-center gap-2 rounded-2xl border border-[#dce2ef] bg-white px-4 py-3 text-sm text-gray-700">
                                        <LoaderCircle className="h-4 w-4 animate-spin text-emerald-700" />
                                        <span>{t('bookAssistant.sending')}</span>
                                    </div>
                                </div>
                            ) : null}

                            {error ? (
                                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            ) : null}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                <div className="border-t border-[#dce2ef] bg-white p-3 sm:p-4">
                    <div className="rounded-2xl border border-[#dce2ef] bg-white p-2.5 focus-within:border-[#10B981] focus-within:bg-white">
                        <textarea
                            id="book-assistant-question"
                            value={question}
                            onChange={(event) => setQuestion(event.target.value)}
                            onKeyDown={handleInputKeyDown}
                            rows="3"
                            placeholder={t('bookAssistant.placeholder')}
                            className="w-full resize-none bg-transparent px-2 py-1 text-base text-gray-900 outline-none placeholder:text-gray-500"
                        />
                        <div className="mt-2 flex items-center justify-end">
                            <button
                                type="button"
                                onClick={() => handleAsk()}
                                disabled={!question.trim() || isLoading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <SendHorizontal className="h-4 w-4" />
                                {t('bookAssistant.send')}
                            </button>
                        </div>
                    </div>
                    <p className="mt-2 px-1 text-xs leading-5 text-gray-500 sm:text-sm">
                        {t('bookAssistant.disclaimer')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BookAssistant;
