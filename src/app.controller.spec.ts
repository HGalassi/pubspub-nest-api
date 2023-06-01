import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './app.user.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { Connection, connect, Model } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { ModuleMocker } from 'jest-mock';
import {expect, jest, test} from '@jest/globals';
import { MailerService } from '@nestjs-modules/mailer';
import { createMock, DeepMocked } from '@golevelup/ts-jest';


// import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'




describe('AppController', () => {
  let appController: AppController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let userModel: Model<User>;
  let configService: ConfigService
  let mock: ModuleMocker 

  const httpServiceMock = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  };

  const mailerServiceMock={
    post: jest.fn()
  }

  const userServiceMock={
    findAll: jest.fn()
  }

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    userModel = mongoConnection.model(User.name, UserSchema);
  })

  beforeEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
    
    const app: TestingModule = await Test.createTestingModule({
      providers: [  
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: getModelToken(User.name),  useValue: userModel
        },
        { 
          provide: MailerService,
          useValue: mailerServiceMock
        },
        {
          provide: ConfigService,
          useValue: {
             get: jest.fn((key: string) => {
                if(key === 'RABBITMQ_USER')
                  return "mockuser"
             })}
      
        },
    
      
    AppService],     controllers: [AppController],
    }).compile();
    configService = app.get<ConfigService>(ConfigService);
    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    // userServiceTest
    it('should test findAll()!"', async() => {
      let expected = {
        data:{
          first_name : 'aName', last_name: 'aLastName'
        }
      }
        await userServiceMock.findAll.mockReturnValue({data: {
            first_name : 'aName', last_name: 'aLastName'
        }})

      const result = await userServiceMock.findAll(1);
      expect(result).toEqual(expected);
    });
  });
});
