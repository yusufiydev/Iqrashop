import vercelHandler from '../../api/book-assistant.js';

const createResponse = () => {
    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        body: '',
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(payload) {
            this.body = JSON.stringify(payload);
            return this;
        },
    };

    return response;
};

export const handler = async (event) => {
    try {
        const request = {
            method: event.httpMethod,
            body: event.body ? JSON.parse(event.body) : {},
        };
        const response = createResponse();

        await vercelHandler(request, response);

        return response;
    } catch (error) {
        return {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ error: error.message || 'So\'rov noto\'g\'ri yuborildi.' }),
        };
    }
};
