import { Weather } from './Weather';
import { Terrain } from './Terrain';
import { Sky } from './Sky';
import { TimeSystem } from './TimeSystem';

export class Environment {
    constructor() {
        this.weather = new Weather();
        this.terrain = new Terrain();
        this.sky = new Sky();
        this.timeSystem = new TimeSystem();
    }

    init() {
        this.weather.init && this.weather.init();
        this.terrain.init && this.terrain.init();
        this.sky.init && this.sky.init();
        this.timeSystem.init && this.timeSystem.init();
    }

    update(deltaTime) {
        this.weather.update && this.weather.update(deltaTime);
        this.terrain.update && this.terrain.update(deltaTime);
        this.sky.update && this.sky.update(deltaTime);
        this.timeSystem.update && this.timeSystem.update(deltaTime);
    }
}
