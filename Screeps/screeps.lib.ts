var StructureTypes = {
    Spawn: "spawn",
    Extension: "extension",
    Wall: "wall",
    Ramport: "rampart"
};
var Body = {
    Move: "move",
    Work: "work",
    Carry: "carry",
    Attack: "attack",
    RangedAttack: "ranged_attack",
    Tough: "tough",
    Heal: "heal"
};
var BodyCost = {
    'move': 50,
    'work': 20,
    'carry': 50,
    'attack': 100,
    'ranged_attack': 150,
    'heal': 200,
    'tough': 5
};

class BodyUtils {
    static calculateCost(body: string[]): number {
        return <number>_.reduce(body, (acc: number, b: string) => { return acc + BodyCost[b]; }, 0);
    }
}