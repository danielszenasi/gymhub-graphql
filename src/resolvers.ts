import { getRepository, IsNull } from "typeorm";
import { User } from "./entities/user.entity";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { ApolloError } from "apollo-server";
import { Trainer } from "./entities/trainer.entity";
import GraphQLJSON from "graphql-type-json";
import { GraphQLUpload } from "graphql-upload";

import { Exercise } from "./entities/exercise.entity";
import * as cloudinary from "cloudinary";
import { GraphQLScalarType, Kind } from "graphql";
import { ExerciseHistory } from "./entities/exercise-history.entity";
import { Workout } from "./entities/workout.entity";

function generateToken(user: any) {
  return sign(
    {
      userId: user.id,
      trainerProfileId: user.trainerProfileId
    },
    process.env.JWT_SECRET
  );
}

async function processUpload(upload: any): Promise<string> {
  const { stream } = await upload;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  try {
    const url = await new Promise<string>((resolve, reject) => {
      const streamLoad = cloudinary.v2.uploader.upload_stream(
        (error: any, result: any) => {
          if (result) {
            resolve(result.secure_url);
          } else {
            reject(error);
          }
        }
      );
      stream.pipe(streamLoad);
    });
    return url;
  } catch (err) {
    throw new Error(`Failed to upload profile picture! Err:${err.message}`);
  }
}

const resolvers = {
  Upload: GraphQLUpload,
  JSON: GraphQLJSON,
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value; // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10);
      }
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      return null;
    }
  }),
  Query: {
    me: (_, __, { user }) => getRepository(User).findOneOrFail(user.id),
    clients: (_, __, { user }) => {
      return getRepository(User).find({
        where: { trainerId: user.trainerProfileId }
      });
    },
    exercises: (_, __, { user }) => {
      return getRepository(Exercise).find({
        where: [{ userId: user.id }, { userId: IsNull() }]
      });
    },
    workouts: (_, args, { user }) => {
      return getRepository(Workout).find({
        where: [
          {
            trainerId: user.trainerProfileId,
            ...(args.userId && { userId: args.userId })
          }
        ],
        relations: ["exercises", "user", "exercises.exercise"]
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
        user
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
        user: newUser
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
      const updatedUser = await userRepository.update(user.id, {
        firstName,
        lastName,
        inviteToken: "",
        inviteAccepted: true,
        password: hashedPassword
      });

      return {
        token: generateToken(updatedUser),
        user: updatedUser
      };
    },
    createExercise: async (
      _,
      { name, instructions, measures, categories, bodyParts, file },
      { user }
    ) => {
      const url = await processUpload(file);
      const exerciseRepository = getRepository(Exercise);
      const newExercise = await exerciseRepository.save({
        name,
        instructions,
        measures: measures,
        categories: categories,
        bodyParts: bodyParts,
        url,
        userId: user ? user.id : null
      });
      return newExercise;
    },
    createWorkout: async (_, { startsAt, exercises, userId }, { user }) => {
      const exerciseHistoryRepository = getRepository(ExerciseHistory);
      const workoutRepository = getRepository(Workout);

      const newWorkout = await workoutRepository.save(
        workoutRepository.create({
          startsAt,
          userId,
          trainerId: user.trainerProfileId
        })
      );

      const exerciseEntities = exercises.map(exercise =>
        exerciseHistoryRepository.create({
          ...exercise,
          workoutId: newWorkout.id
        })
      );
      const newExercises = await exerciseHistoryRepository.save(
        exerciseEntities
      );

      return { ...newWorkout, exercises: newExercises };
    }
  }
};

export default resolvers;
