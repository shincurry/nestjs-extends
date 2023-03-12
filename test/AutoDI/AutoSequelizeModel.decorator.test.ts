import { describe, expect, it } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { INestApplication, Module } from '@nestjs/common';
import { AutoSequelizeModel } from '../../src';
import path from 'path';
import { User } from './models/User.model';
import { Project } from './models/Project.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { EntitiesMetadataStorage } from "@nestjs/sequelize/dist/entities-metadata.storage";
import { DEFAULT_CONNECTION_NAME } from '@nestjs/sequelize/dist/sequelize.constants';

describe('AutoSequelizeModelModule', () => {
  let app: INestApplication;

  it(`test models loaded with default connection name.`, async () => {
    @AutoSequelizeModel({
      path: [
        path.join(__dirname, "./models/**/*.js"),
      ],
    })
    @AutoSequelizeModel({
      path: [
        path.join(__dirname, "./classes/*.js"),
      ],
    })
    @Module({
      imports: [
        SequelizeModule.forRootAsync({
          useFactory: () => {
            return {
              dialect: 'postgres',
            }
          }
        })
      ],
    })
    class TestAutoSequelizeModelModule {}

    const moduleRef = await Test.createTestingModule({
      imports: [
        TestAutoSequelizeModelModule,
      ],

    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    const models = EntitiesMetadataStorage.getEntitiesByConnection(DEFAULT_CONNECTION_NAME)
    expect(models.sort()).toStrictEqual([User, Project].sort());
  });

  it(`test models loaded with custom connection name.`, async () => {
    const CONNECTION_NAME = "custom_connection"

    @AutoSequelizeModel({
      connection: CONNECTION_NAME,
      path: [
        path.join(__dirname, "./models/**/*.js"),
      ],
    })
    @AutoSequelizeModel({
      connection: CONNECTION_NAME,
      path: [
        path.join(__dirname, "./classes/*.js"),
      ],
    })
    @Module({
      imports: [
        SequelizeModule.forRootAsync({
          name: CONNECTION_NAME,
          useFactory: () => {
            return {
              dialect: 'postgres',
            }
          }
        })
      ],
    })
    class TestAutoSequelizeModelModule2 {}

    const moduleRef = await Test.createTestingModule({
      imports: [
        TestAutoSequelizeModelModule2,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    const models = EntitiesMetadataStorage.getEntitiesByConnection(CONNECTION_NAME)
    expect(models.sort()).toStrictEqual([User, Project].sort());
  });
});