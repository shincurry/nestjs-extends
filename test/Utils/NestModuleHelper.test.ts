import { describe, expect, it } from '@jest/globals';
import { Controller, Module } from '@nestjs/common';
import { addControllersToModule, addControllerToModule, addExportsToModule, addExportToModule, addImportsToModule, addImportToModule, addProvidersToModule, addProviderToModule } from '../../src/Utils/NestModuleHelper';


describe('NestModuleHelper', () => {

  it(`test addProviderToModule`, () => {
    @Module({})
    class TestModule {}

    addProviderToModule(TestModule, {
      provide: "test-provider-1",
      useValue: 1,
    })

    const providers = Reflect.getOwnMetadata("providers", TestModule);
    expect(providers.length).toBe(1);
    expect(providers[0]).toEqual({ provide: 'test-provider-1', useValue: 1 });

  });
  it(`test addProvidersToModule`, () => {
    @Module({
    })
    class TestModule {}

    addProvidersToModule(TestModule, [
      { provide: "test-provider-1", useValue: 1 },
      { provide: "test-provider-2", useValue: 2 },
    ])

    const providers = Reflect.getOwnMetadata("providers", TestModule);
    expect(providers.length).toBe(2);
    expect(providers[0]).toEqual({ provide: 'test-provider-1', useValue: 1 });
    expect(providers[1]).toEqual({ provide: 'test-provider-2', useValue: 2 });

  });

  it(`test addControllerToModule`, () => {
    @Controller()
    class Controller1 {}

    @Module({})
    class TestModule {}

    addControllerToModule(TestModule, Controller1)

    const controllers = Reflect.getOwnMetadata("controllers", TestModule);
    expect(controllers.length).toBe(1);
    expect(controllers[0]).toBe(Controller1);

  });
  it(`test addControllersToModule`, () => {
    @Controller()
    class Controller1 {}
    @Controller()
    class Controller2 {}

    @Module({
    })
    class TestModule {}

    addControllersToModule(TestModule, [
      Controller1,
      Controller2,
    ])

    const controllers = Reflect.getOwnMetadata("controllers", TestModule);
    expect(controllers.length).toBe(2);
    expect(controllers[0]).toBe(Controller1);
    expect(controllers[1]).toBe(Controller2);

  });

  it(`test addImportToModule`, () => {
    @Module({})
    class Module1 {}

    @Module({})
    class TestModule {}

    addImportToModule(TestModule, Module1)

    const imports = Reflect.getOwnMetadata("imports", TestModule);
    expect(imports.length).toBe(1);
    expect(imports[0]).toBe(Module1);

  });
  it(`test addImportsToModule`, () => {
    @Module({})
    class Module1 {}
    @Module({})
    class Module2 {}

    @Module({
    })
    class TestModule {}

    addImportsToModule(TestModule, [
      Module1,
      Module2,
    ])

    const imports = Reflect.getOwnMetadata("imports", TestModule);
    expect(imports.length).toBe(2);
    expect(imports[0]).toBe(Module1);
    expect(imports[1]).toBe(Module2);

  });

  it(`test addExportToModule`, () => {
    @Module({})
    class Module1 {}

    @Module({})
    class TestModule {}

    addExportToModule(TestModule, Module1)

    const exports = Reflect.getOwnMetadata("exports", TestModule);
    expect(exports.length).toBe(1);
    expect(exports[0]).toBe(Module1);

  });
  it(`test addExportsToModule`, () => {
    @Module({})
    class Module1 {}
    @Module({})
    class Module2 {}

    @Module({
    })
    class TestModule {}

    addExportsToModule(TestModule, [
      Module1,
      Module2,
    ])

    const exports = Reflect.getOwnMetadata("exports", TestModule);
    expect(exports.length).toBe(2);
    expect(exports[0]).toBe(Module1);
    expect(exports[1]).toBe(Module2);

  });

});