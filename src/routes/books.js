export default async function booksRoutes(app) {

    //Schemas simples de validação (JSON Schema)
    const bookBodySchema = {
        type: 'object',
        required: ['title', 'author'],
        properties: {
            title: { type: 'string', minLength: 1 },
            author: { type: 'string', minLength: 1 }
        }
    };
    const idParamSchema = {
        type: 'object',
        required: ['id'],
        properties: {
            // Mantemos como string e convertimos manualmente
            id: { type: 'string', pattern: '^[0-9]+$' }
        }
    };
    // CREATE 
    app.post('/books', { schema: { body: bookBodySchema } }, async (req, reply) => {
        const { title, author } = req.body;
        const book = await app.prisma.book.create({ data: { title, author } });
        return reply.code(201).send(book);
    });

    // READ (lista)

    app.get('/books', async (reg, reply) => {
        const books = await app.prisma.book.findMany({
            orderBy: { id: 'asc' }
        });
        return reply.send(books);
    });
}