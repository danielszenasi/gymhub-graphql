import { ApolloServer } from 'apollo-server';
import typeDefs from './schema';
import resolvers from './resolvers';
import { createConnection } from 'typeorm';
import { verify } from 'jsonwebtoken';
import * as Email from 'email-templates';
import 'reflect-metadata';

export function getUser(request: any) {
  const authorization = request.get('authorization');
  if (authorization) {
    const token = authorization.replace('Bearer ', '');
    const verifiedToken = verify(token, process.env.JWT_SECRET) as any;
    if (verifiedToken) {
      return { id: verifiedToken.userId, trainerProfileId: verifiedToken.trainerProfileId };
    }
  }
  return null;
}

const context = async ({ req }) => {
  const user = getUser(req);

  const mailer = new Email({
    message: {
      from: 'niftylettuce@gmail.com'
    },
    // uncomment below to send emails in development/test env:
    // send: true
    transport: {
      jsonTransport: true
    }
  });

  return { mailer, user };
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context
});

if (process.env.NODE_ENV !== 'test') {
  createConnection()
    .then(() => server.listen({ port: 4000 }))
    .then(({ url }) => console.log(`🚀 app running at ${url}`));
}

module.exports = {
  context,
  typeDefs,
  resolvers,
  ApolloServer,
  server
};
