import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { INestApplication, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { NamedCacheModule } from '../../src';
import { Cache } from 'cache-manager';

const CACHE_MANAGER_1 = Symbol("CACHE_MANAGER_1");
const CACHE_MANAGER_2 = Symbol("CACHE_MANAGER_2");

@Module({
  imports: [
    NamedCacheModule.register(CACHE_MANAGER_1, {}),
    NamedCacheModule.registerAsync(CACHE_MANAGER_2, {
      useFactory: () => {
        return {}
      },
    }),
  ]
})
class TestNamedCacheModule {}

describe('NamedCache', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TestNamedCacheModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  })

  it(`test run two individual NamedCache`, async () => {
    const cache1 = app.get<Cache>(CACHE_MANAGER_1);
    const cache2 = app.get<Cache>(CACHE_MANAGER_2);

    await cache1.set("name", "naruto")
    expect(await cache1.get("name")).toBe("naruto")
    expect(await cache2.get("name")).toBe(undefined)
    await cache2.set("name", "sasuke")
    expect(await cache1.get("name")).toBe("naruto")
    expect(await cache2.get("name")).toBe("sasuke")
  });
});