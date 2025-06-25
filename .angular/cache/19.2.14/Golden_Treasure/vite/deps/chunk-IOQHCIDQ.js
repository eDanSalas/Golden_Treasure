import {
  getApps,
  registerVersion
} from "./chunk-DD6JDW3G.js";
import {
  EnvironmentInjector,
  Injectable,
  Injector,
  NgZone,
  PendingTasks,
  Version,
  assertInInjectionContext,
  inject,
  isDevMode,
  runInInjectionContext,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-3LRBLCYY.js";
import {
  Observable,
  asyncScheduler,
  observeOn,
  queueScheduler,
  subscribeOn
} from "./chunk-OPJDHPG3.js";

// node_modules/firebase/app/dist/esm/index.esm.js
var name = "firebase";
var version = "11.9.1";
registerVersion(name, version, "app");

// node_modules/@angular/core/fesm2022/rxjs-interop.mjs
function pendingUntilEvent(injector) {
  if (injector === void 0) {
    assertInInjectionContext(pendingUntilEvent);
    injector = inject(Injector);
  }
  const taskService = injector.get(PendingTasks);
  return (sourceObservable) => {
    return new Observable((originalSubscriber) => {
      const removeTask = taskService.add();
      let cleanedUp = false;
      function cleanupTask() {
        if (cleanedUp) {
          return;
        }
        removeTask();
        cleanedUp = true;
      }
      const innerSubscription = sourceObservable.subscribe({
        next: (v) => {
          originalSubscriber.next(v);
          cleanupTask();
        },
        complete: () => {
          originalSubscriber.complete();
          cleanupTask();
        },
        error: (e) => {
          originalSubscriber.error(e);
          cleanupTask();
        }
      });
      innerSubscription.add(() => {
        originalSubscriber.unsubscribe();
        cleanupTask();
      });
      return innerSubscription;
    });
  };
}

// node_modules/@angular/fire/fesm2022/angular-fire.mjs
var VERSION = new Version("ANGULARFIRE2_VERSION");
function ɵgetDefaultInstanceOf(identifier, provided, defaultApp) {
  if (provided) {
    if (provided.length === 1) {
      return provided[0];
    }
    const providedUsingDefaultApp = provided.filter((it) => it.app === defaultApp);
    if (providedUsingDefaultApp.length === 1) {
      return providedUsingDefaultApp[0];
    }
  }
  const defaultAppWithContainer = defaultApp;
  const provider = defaultAppWithContainer.container.getProvider(identifier);
  return provider.getImmediate({
    optional: true
  });
}
var ɵgetAllInstancesOf = (identifier, app) => {
  const apps = app ? [app] : getApps();
  const instances = [];
  apps.forEach((app2) => {
    const provider = app2.container.getProvider(identifier);
    provider.instances.forEach((instance) => {
      if (!instances.includes(instance)) {
        instances.push(instance);
      }
    });
  });
  return instances;
};
var LogLevel;
(function(LogLevel2) {
  LogLevel2[LogLevel2["SILENT"] = 0] = "SILENT";
  LogLevel2[LogLevel2["WARN"] = 1] = "WARN";
  LogLevel2[LogLevel2["VERBOSE"] = 2] = "VERBOSE";
})(LogLevel || (LogLevel = {}));
var currentLogLevel = isDevMode() && typeof Zone !== "undefined" ? LogLevel.WARN : LogLevel.SILENT;
var ɵZoneScheduler = class {
  zone;
  delegate;
  constructor(zone, delegate = queueScheduler) {
    this.zone = zone;
    this.delegate = delegate;
  }
  now() {
    return this.delegate.now();
  }
  schedule(work, delay, state) {
    const targetZone = this.zone;
    const workInZone = function(state2) {
      if (targetZone) {
        targetZone.runGuarded(() => {
          work.apply(this, [state2]);
        });
      } else {
        work.apply(this, [state2]);
      }
    };
    return this.delegate.schedule(workInZone, delay, state);
  }
};
var ɵAngularFireSchedulers = class _ɵAngularFireSchedulers {
  outsideAngular;
  insideAngular;
  constructor() {
    const ngZone = inject(NgZone);
    this.outsideAngular = ngZone.runOutsideAngular(() => new ɵZoneScheduler(typeof Zone === "undefined" ? void 0 : Zone.current));
    this.insideAngular = ngZone.run(() => new ɵZoneScheduler(typeof Zone === "undefined" ? void 0 : Zone.current, asyncScheduler));
  }
  static ɵfac = function ɵAngularFireSchedulers_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ɵAngularFireSchedulers)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _ɵAngularFireSchedulers,
    factory: _ɵAngularFireSchedulers.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ɵAngularFireSchedulers, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var alreadyWarned = false;
function warnOutsideInjectionContext(original, logLevel) {
  if (!alreadyWarned && (currentLogLevel > LogLevel.SILENT || isDevMode())) {
    alreadyWarned = true;
    console.warn("Calling Firebase APIs outside of an Injection context may destabilize your application leading to subtle change-detection and hydration bugs. Find more at https://github.com/angular/angularfire/blob/main/docs/zones.md");
  }
  if (currentLogLevel >= logLevel) {
    console.warn(`Firebase API called outside injection context: ${original.name}`);
  }
}
function runOutsideAngular(fn) {
  const ngZone = inject(NgZone, {
    optional: true
  });
  if (!ngZone) {
    return fn();
  }
  return ngZone.runOutsideAngular(() => fn());
}
function run(fn) {
  const ngZone = inject(NgZone, {
    optional: true
  });
  if (!ngZone) {
    return fn();
  }
  return ngZone.run(() => fn());
}
var zoneWrapFn = (it, taskDone, injector) => {
  return (...args) => {
    if (taskDone) {
      setTimeout(taskDone, 0);
    }
    return runInInjectionContext(injector, () => run(() => it.apply(void 0, args)));
  };
};
var ɵzoneWrap = (it, blockUntilFirst, logLevel) => {
  logLevel ||= blockUntilFirst ? LogLevel.WARN : LogLevel.VERBOSE;
  return function() {
    let taskDone;
    const _arguments = arguments;
    let schedulers;
    let pendingTasks;
    let injector;
    try {
      schedulers = inject(ɵAngularFireSchedulers);
      pendingTasks = inject(PendingTasks);
      injector = inject(EnvironmentInjector);
    } catch (e) {
      warnOutsideInjectionContext(it, logLevel);
      return it.apply(this, _arguments);
    }
    for (let i = 0; i < arguments.length; i++) {
      if (typeof _arguments[i] === "function") {
        if (blockUntilFirst) {
          taskDone ||= run(() => pendingTasks.add());
        }
        _arguments[i] = zoneWrapFn(_arguments[i], taskDone, injector);
      }
    }
    const ret = runOutsideAngular(() => it.apply(this, _arguments));
    if (!blockUntilFirst) {
      if (ret instanceof Observable) {
        return ret.pipe(subscribeOn(schedulers.outsideAngular), observeOn(schedulers.insideAngular));
      } else {
        return run(() => ret);
      }
    }
    if (ret instanceof Observable) {
      return ret.pipe(subscribeOn(schedulers.outsideAngular), observeOn(schedulers.insideAngular), pendingUntilEvent(injector));
    } else if (ret instanceof Promise) {
      return run(() => new Promise((resolve, reject) => {
        pendingTasks.run(() => ret).then((it2) => runInInjectionContext(injector, () => run(() => resolve(it2))), (reason) => runInInjectionContext(injector, () => run(() => reject(reason))));
      }));
    } else if (typeof ret === "function" && taskDone) {
      return function() {
        setTimeout(taskDone, 0);
        return ret.apply(this, arguments);
      };
    } else {
      return run(() => ret);
    }
  };
};

export {
  pendingUntilEvent,
  VERSION,
  ɵgetDefaultInstanceOf,
  ɵgetAllInstancesOf,
  ɵAngularFireSchedulers,
  ɵzoneWrap
};
/*! Bundled license information:

firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@angular/core/fesm2022/rxjs-interop.mjs:
  (**
   * @license Angular v19.2.14
   * (c) 2010-2025 Google LLC. https://angular.io/
   * License: MIT
   *)
*/
//# sourceMappingURL=chunk-IOQHCIDQ.js.map
