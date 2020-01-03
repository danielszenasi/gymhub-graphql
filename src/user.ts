import { gql } from "apollo-server";
import { v4 as uuid } from "uuid";
import { ApolloError } from "apollo-server";
import { Trainer } from "./entities/trainer.entity";
import { User } from "./entities/user.entity";
import { compare, hash } from "bcryptjs";
import { getRepository } from "typeorm";
import { generateToken } from "./utils";

export const typeDef = gql`
  extend type Query {
    me: User
    clients: [User]
  }
  extend type Mutation {
    login(email: String!, password: String!): AuthPayload
    signup(
      email: String!
      password: String!
      firstName: String
      lastName: String
      isTrainer: Boolean
    ): AuthPayload
    inviteUser(email: String!): User
    signupByInvite(
      email: String!
      inviteToken: String!
      password: String!
      firstName: String
      lastName: String
    ): AuthPayload
  }
  type User {
    id: ID!
    email: String!
    inviteAccepted: Boolean!
    units: JSON!
    firstName: String
    lastName: String
    isTrainer: Boolean!
  }
  type AuthPayload {
    token: String!
    user: User
  }
  type UserIdPayload {
    id: String!
  }
`;
export const resolvers = {
  Query: {
    me: (_, __, { user }) => getRepository(User).findOneOrFail(user.id),
    clients: (_, __, { user }) => {
      return getRepository(User).find({
        where: { trainerId: user.trainerProfileId }
      });
    }
  },
  Mutation: {
    login: async (_, { email, password }) => {
      const userRepository = getRepository(User);
      const user = await userRepository.findOneOrFail({ email });
      const passwordValid = await compare(password, user.password);
      if (!passwordValid) {
        throw new Error("Invalid password");
      }
      return {
        token: generateToken(user),
        user: { ...user, isTrainer: !!user.trainerProfileId }
      };
    },
    signup: async (
      _,
      { firstName, lastName, email, password, isTrainer },
      { mailer }
    ) => {
      const hashedPassword = await hash(password, 10);
      const emailConfirmToken = uuid();
      const userRepository = getRepository(User);
      const trainerRepository = getRepository(Trainer);

      const user = userRepository.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        emailConfirmToken,
        emailConfirmed: false,
        inviteAccepted: true
      });

      if (isTrainer) {
        const trainer = await trainerRepository.save({});
        user.trainerProfileId = trainer.id;
      }

      const newUser = await userRepository.save(user);

      mailer.send({
        template: "signupUser",
        message: {
          to: newUser.email
        },
        locals: {
          mailAppUrl: process.env.APP_URL,
          emailConfirmToken,
          email: newUser.email
        }
      });

      return {
        token: generateToken(newUser),
        user: { ...newUser, isTrainer: !!newUser.trainerProfileId }
      };
    },
    inviteUser: async (_, { email }, { mailer, user }) => {
      const userRepository = getRepository(User);

      const existingUser = await userRepository.findOne({ email });
      if (existingUser) {
        return existingUser;
      }

      const inviteToken = uuid();

      const newUser = await userRepository.save({
        email,
        inviteToken,
        trainerId: user.trainerProfileId,
        password: "",
        inviteAccepted: false
      });

      mailer.send({
        template: "inviteUser",
        message: {
          to: newUser.email
        },
        locals: {
          mailAppUrl: process.env.APP_URL,
          inviteToken,
          email: newUser.email
        }
      });

      return newUser;
    },
    signupByInvite: async (
      _,
      { email, password, inviteToken, firstName, lastName }
    ) => {
      const userRepository = getRepository(User);
      const user = await userRepository.findOneOrFail({ email });

      if (user.inviteToken !== inviteToken || user.inviteAccepted) {
        throw new ApolloError("Invalid invite token");
      }

      const hashedPassword = await hash(password, 10);
      const updatedUser = await userRepository.save({
        id: user.id,
        firstName,
        lastName,
        inviteToken: "",
        inviteAccepted: true,
        password: hashedPassword
      });

      return {
        token: generateToken(updatedUser),
        user: { ...updatedUser, isTrainer: !!updatedUser.trainerProfileId }
      };
    }
  }
};
