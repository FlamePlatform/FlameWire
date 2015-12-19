const singleton = [];
const _class = [];
const middleware = [];


//Contain for files
export class Container {
  constructor() {
    if (instance) {
      return instance;
    }
  }
  check(name) {
    if (singleton[name]) {
      throw new Error("Name already added as Singleton");
    }
    if (_class[name]) {
      throw new Error("Name already added as Class");
    }
  }

  singleton(name, _class) {
    this.check(name);
    this.singletonReplace(name, _class);
  }


  singletonReplace(name, _class) {
    if (typeof _class === "object") {
      singleton[name] = _class;
    } else if (typeof _class === "function") {
      singleton[name] = _class;
    } else {
      throw new Error("singleton requires a class or class constructor");
    }
  }

  instance(name, __class) {
    this.check(name);
    if (typeof __class !== "function") {
      throw new Error("object expects a construct for an object");
    } else {
      _class[name] = __class;
    }
  }

  get(name) {
    return this.getSingleton(name) || this.getClass(name);
  }

  getSingleton(name) {
    var object = singleton[name];
    switch (typeof object) {
      case "object":
        return object;
      case "function":
        singleton[name] = new object();
        return singleton[name];
      default:
        return;
    }
  }

  getClass(name) {
    var object = _class[name];
    switch (typeof object) {
      case "function":
        return new object();
      default:
        return null;
    }
  }

  remove(name) {
    var good = true;
    if (singleton[name]) {
      delete singleton[name];
    } else if (_class[name]) {
      delete _class[name];
    } else {
      good = false;
    }
    return good;
  }
}

const instance = new Container();
