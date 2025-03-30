export class Cessna172 {
    constructor() {
        this.model = {
            name: "Cessna 172 Skyhawk",
            wingArea: 16.2, // m²
            mass: 757, // kg (empty weight)
            wingspan: 11, // m
            maxSpeed: 140, // knots
            stallSpeed: 40, // knots
            length: 8.28, // m
            height: 2.72, // m
            maxFuel: 56, // gallons
            powerplant: {
                type: "Piston",
                power: 160, // hp
                maxRPM: 2700
            }
        };
    }
}
