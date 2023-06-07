import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './app.user.service';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Connection, Model } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { ModuleMocker } from 'jest-mock';
import {jest} from '@jest/globals';
import { MailerService } from '@nestjs-modules/mailer';
import mockUserService from './__mocks__/user.service.mock.axios'
import { HttpException, NotAcceptableException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ExternalExceptionFilter } from '@nestjs/core/exceptions/external-exception-filter';

describe('AppController', () => {
  const axios = require("axios");
  jest.mock("axios");
  let appController: AppController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let userModel: Model<User>;
  let configService: ConfigService
  let mock: ModuleMocker 
  let userSerivce: UserService

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


  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [  
        {
          provide: UserService,
          useValue:mockUserService
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
    AppService],     controllers: [AppController]
    }).compile();
    configService = app.get<ConfigService>(ConfigService);
    appController = app.get<AppController>(AppController);
    userSerivce = app.get<UserService>(UserService);
  });

  it ("should test get user by id" , async () => {
    mockUserService.findAll.mockImplementationOnce(() => Promise.resolve({
      data: {first_name: 'aName', last_name: 'aLastName'}
    }))
    const resp = await userSerivce.findAll(1)     
    expect(resp).toEqual({data: { first_name: 'aName', last_name: 'aLastName'}}) 
  })


  fit ("should test get user by id and fails" , async () => {
    mockUserService.findAll.mockImplementation(() => {
      throw new HttpException('Not Found', 404);
    });   
    const spyOnLoggingThings = jest.spyOn(appController,'someErrorLoggingThings');
    await expect(appController.getUserById(100)).rejects.toThrow(HttpException) 	
    expect(spyOnLoggingThings).toBeCalledTimes(1)
  })
})



