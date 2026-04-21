import { GENRES, VENDORS } from './mockApi';

const API_URL = 'https://openlibrary.org';
const COVERS_URL = 'https://covers.openlibrary.org/b/id';
const CACHE_TTL_MS = 10 * 60 * 1000;

const responseCache = new Map();
const pendingRequests = new Map();

const subjectMap = {
    roman: 'fiction',
    fantastika: 'fantasy',
    fantasy: 'fantasy',
    scifi: 'science_fiction',
    sheriyat: 'poetry',
    biznes: 'business',
    bolalar: 'children',
    tarix: 'history',
    ilmiy: 'science',
};

const genreAliases = GENRES.reduce((map, genre) => {
    map[genre.id] = genre.id;
    map[genre.name.toLowerCase()] = genre.id;
    return map;
}, {});

const genreKeywords = {
    roman: ['fiction', 'novel', 'classic', 'literature'],
    sheriyat: ['poetry', 'poem'],
    ilmiy: ['science', 'scientific'],
    fantastika: ['fantasy', 'science fiction', 'speculative'],
    tarix: ['history', 'historical'],
    biznes: ['business', 'finance', 'economics', 'leadership'],
    bolalar: ['children', 'kids', 'juvenile'],
};

const normalizeText = (value) => {
    if (typeof value === 'string') {
        return value.trim();
    }

    if (value && typeof value === 'object' && 'value' in value) {
        return normalizeText(value.value);
    }

    if (Array.isArray(value) && value.length > 0) {
        return normalizeText(value[0]);
    }

    return '';
};

const toArray = (value) => {
    if (Array.isArray(value)) {
        return value;
    }

    return value ? [value] : [];
};

const hashString = (value) => {
    let hash = 0;

    for (const char of String(value)) {
        hash = Math.imul(hash, 31) + char.charCodeAt(0);
        hash >>>= 0;
    }

    return hash;
};

const seededInt = (seed, min, max, salt) => {
    const mixed = Math.imul(seed ^ salt, 2654435761) >>> 0;
    return min + (mixed % (max - min + 1));
};

const createCoverUrl = (coverId, title) => {
    if (coverId) {
        return `${COVERS_URL}/${coverId}-L.jpg`;
    }

    return `https://placehold.co/400x600/e0e7ff/4f46e5?text=${encodeURIComponent(title)}`;
};

const extractAuthorName = (book) => {
    if (Array.isArray(book.author_name) && book.author_name.length > 0) {
        return book.author_name[0];
    }

    if (Array.isArray(book.authors) && book.authors.length > 0) {
        const author = book.authors[0];

        if (typeof author === 'string') {
            return author;
        }

        if (author?.name) {
            return author.name;
        }

        if (author?.author?.name) {
            return author.author.name;
        }
    }

    return 'Noma\'lum muallif';
};

const extractSubjects = (book, fallbackGenre) => {
    const subjects = [
        fallbackGenre,
        ...toArray(book.subject),
        ...toArray(book.subjects),
    ]
        .map((item) => normalizeText(typeof item === 'string' ? item : item?.name))
        .filter(Boolean);

    return [...new Set(subjects)];
};

const resolveGenre = (book, fallbackGenre) => {
    const subjects = extractSubjects(book, fallbackGenre)
        .map((item) => item.toLowerCase().replace(/[_-]/g, ' '));

    for (const subject of subjects) {
        if (genreAliases[subject]) {
            return genreAliases[subject];
        }

        for (const [genreId, keywords] of Object.entries(genreKeywords)) {
            if (keywords.some((keyword) => subject.includes(keyword))) {
                return genreId;
            }
        }
    }

    return fallbackGenre && genreAliases[fallbackGenre] ? fallbackGenre : undefined;
};

const buildRequestUrl = (path, params = {}) => {
    const url = new URL(path, API_URL);

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            url.searchParams.set(key, String(value));
        }
    });

    return url.toString();
};

const fetchJson = async (path, params = {}) => {
    const url = buildRequestUrl(path, params);
    const cached = responseCache.get(url);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return cached.data;
    }

    if (pendingRequests.has(url)) {
        return pendingRequests.get(url);
    }

    const request = fetch(url, {
        headers: {
            Accept: 'application/json',
        },
    })
        .then(async (response) => {
            if (!response.ok) {
                throw new Error(`OpenLibrary request failed with status ${response.status}`);
            }

            return response.json();
        })
        .then((data) => {
            responseCache.set(url, {
                data,
                timestamp: Date.now(),
            });

            return data;
        })
        .finally(() => {
            pendingRequests.delete(url);
        });

    pendingRequests.set(url, request);

    return request;
};

const mapBookData = (book, options = {}) => {
    const id = normalizeText(book.key).replace('/works/', '').replace('/books/', '') || `book-${hashString(book.title)}`;
    const seed = hashString(id);
    const title = normalizeText(book.title) || 'Nomsiz kitob';
    const price = seededInt(seed, 30000, 150000, 11);
    const hasOldPrice = seededInt(seed, 0, 99, 17) > 60;
    const genre = resolveGenre(book, options.fallbackGenre);

    return {
        id,
        title,
        author: extractAuthorName(book),
        price,
        oldPrice: hasOldPrice ? price + seededInt(seed, 10000, 50000, 19) : null,
        image: createCoverUrl(book.cover_i || book.cover_id, title),
        vendor: VENDORS[seededInt(seed, 0, VENDORS.length - 1, 23)],
        rating: (seededInt(seed, 30, 50, 29) / 10).toFixed(1),
        reviews: seededInt(seed, 10, 500, 31),
        isNew: seededInt(seed, 0, 99, 37) > 80,
        isBestSeller: seededInt(seed, 0, 99, 41) > 90,
        genre,
        description: normalizeText(book.description) || normalizeText(book.first_sentence) || null,
        subjects: extractSubjects(book, options.fallbackGenre),
    };
};

export const openLibrary = {
    searchBooks: async (query, limit = 20, page = 1) => {
        try {
            const trimmedQuery = normalizeText(query);

            if (!trimmedQuery) {
                return [];
            }

            const data = await fetchJson('/search.json', {
                q: trimmedQuery,
                limit,
                page,
            });

            if (!Array.isArray(data.docs)) {
                return [];
            }

            return data.docs.map((book) => mapBookData(book));
        } catch (error) {
            console.error('OpenLibrary Search Error:', error);
            return [];
        }
    },

    getBooksBySubject: async (subject, limit = 20, offset = 0) => {
        try {
            const normalizedSubject = normalizeText(subject).toLowerCase();
            const olSubject = subjectMap[normalizedSubject] || normalizedSubject;
            const data = await fetchJson(`/subjects/${encodeURIComponent(olSubject)}.json`, {
                limit,
                offset,
            });

            if (!Array.isArray(data.works)) {
                return [];
            }

            return data.works.map((work) => mapBookData(work, { fallbackGenre: normalizedSubject }));
        } catch (error) {
            console.error('OpenLibrary Subject Error:', error);
            return [];
        }
    },

    getBookDetails: async (workId) => {
        try {
            const normalizedId = normalizeText(workId);

            if (!normalizedId) {
                return null;
            }

            const cleanId = normalizedId.startsWith('/works/') ? normalizedId : `/works/${normalizedId}`;
            const data = await fetchJson(`${cleanId}.json`);
            let authorName = '';

            if (Array.isArray(data.authors) && data.authors.length > 0) {
                try {
                    const authorKey = data.authors[0]?.author?.key;

                    if (authorKey) {
                        const authorData = await fetchJson(`${authorKey}.json`);
                        authorName = normalizeText(authorData.name);
                    }
                } catch (authorError) {
                    console.error('OpenLibrary Author Error:', authorError);
                }
            }

            return mapBookData(
                {
                    ...data,
                    key: cleanId,
                    author_name: authorName ? [authorName] : data.author_name,
                    cover_i: Array.isArray(data.covers) ? data.covers[0] : null,
                },
                {
                    fallbackGenre: resolveGenre(data),
                },
            );
        } catch (error) {
            console.error('OpenLibrary Details Error:', error);
            return null;
        }
    },
};
