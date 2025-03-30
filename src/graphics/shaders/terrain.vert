// src/aircraft/models/Cessna172.js
export class Cessna172 {
    constructor() {
        this.specs = {
            wingArea: 16.2, // m^2
            mass: 757, // kg empty weight
            wingspan: 11, // m
            maxSpeed: 140, // knots
            stallSpeed: 47, // knots
            maxFuel: 212, // liters
            maxAltitude: 13500, // feet
            enginePower: 160 // hp
        };

        this.model = {
            // 3D model details
            scale: 1,
            meshPath: '/assets/models/cessna172.glb',
            texturePath: '/assets/textures/cessna172/'
        };

        this.performance = {
            climbRate: 720, // feet per minute
            cruiseSpeed: 122, // knots
            range: 800, // nautical miles
            fuelConsumption: 10 // gallons per hour
        };

        this.characteristics = {
            dragCoefficient: 0.027,
            liftCoefficient: 1.6,
            aspectRatio: 7.32,
            ostwaldEfficiency: 0.8
        };
    }
}
