export default async function bookRoutes(app) {
  // 📘 Schemas de validação (JSON Schema)
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
      // Mantemos como string e convertemos manualmente
      id: { type: 'string', pattern: '^[0-9]+$' } // Corrigido o pattern
    }
  };

  // 📘 CREATE
  app.post('/books', { schema: { body: bookBodySchema } }, async (req, reply) => {
    const { title, author } = req.body;
    const book = await app.prisma.book.create({ data: { title, author } });
    return reply.code(201).send(book);
  });

  // 📘 READ (lista)
  app.get('/books', async (req, reply) => {
    const books = await app.prisma.book.findMany({
      orderBy: { id: 'asc' }
    });
    return reply.send(books);
  });

  // 📘 READ (individual)
  app.get('/books/:id', { schema: { params: idParamSchema } }, async (req, reply) => {
    const id = parseInt(req.params.id);
    const book = await app.prisma.book.findUnique({ where: { id } });
    if (!book) return reply.code(404).send({ error: 'Book not found' });
    return reply.send(book);
  });

  // 📘 UPDATE
  app.put('/books/:id', { schema: { body: bookBodySchema, params: idParamSchema } }, async (req, reply) => {
    const id = parseInt(req.params.id);
    const { title, author } = req.body;
    const updatedBook = await app.prisma.book.update({
      where: { id },
      data: { title, author }
    });
    return reply.send(updatedBook);
  });

  // 📘 DELETE
  app.delete('/books/:id', { schema: { params: idParamSchema } }, async (req, reply) => {
    const id = parseInt(req.params.id);
    await app.prisma.book.delete({ where: { id } });
    return reply.code(204).send();
  });
}
