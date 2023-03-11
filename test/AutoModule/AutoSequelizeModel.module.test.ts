import { describe, expect, it } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AutoSequelizeModelModule } from '../../src';
import path from 'path';
import { User } from './models/User.model';
import { Project } from './models/Project.model';
import { SequelizeModule } from '@nestjs/sequelize';

describe('AutoSequelizeModelModule', () => {
  let app: INestApplication;

  it(`test models loaded with default connection name.`, async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRootAsync({
          imports: [
            AutoSequelizeModelModule.forRoot({
              path: [
                path.join(__dirname, "./models/**/*.js"),
              ],
            }),
            AutoSequelizeModelModule.forRoot({
              path: [
                path.join(__dirname, "./classes/**/*.js"),
              ],
            }),
          ],
          useFactory: () => {
            return {
              dialect: 'postgres',
            }
          }
        })
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    expect(AutoSequelizeModelModule.models().sort()).toStrictEqual([User, Project].sort());
  });

  it(`test models loaded with custom connection name.`, async () => {
    const connectionName = "custom_connection"
    const moduleRef = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRootAsync({
          name: connectionName,
          imports: [
            AutoSequelizeModelModule.forRoot({
              name: connectionName,
              path: [
                path.join(__dirname, "./models/**/*.js"),
              ],
            }),
            AutoSequelizeModelModule.forRoot({
              path: [
                path.join(__dirname, "./classes/**/*.js"),
              ],
            }),
          ],
          useFactory: () => {
            return {
              dialect: 'postgres',
            }
          }
        })
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    expect(AutoSequelizeModelModule.models('custom_connection').sort()).toStrictEqual([User, Project].sort());
  });
});