export class Midlet{

  constructor(name,dependencies=[],action){
    this.name=name;

    if(typeof dependencies ==="string"){
      dependencies = dependencies.split("|").map(s=>s.trim());
    }else if (typeof dependencies ==="function") {
      action = dependencies;
      dependencies=[];
    }
    this.dependencies=dependencies;
    this.action=action;
  }
}
