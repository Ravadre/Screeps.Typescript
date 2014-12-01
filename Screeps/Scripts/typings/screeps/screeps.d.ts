declare enum GameCode {
    OK = 0,
    NotOwner = -1,
    NoPath = -2,
    NameExists = -3,
    Busy = -4,
    NotFound = -5,
    NotEnoughEnergy = -6,
    InvalidTarget = -7,
    Full = -8,
    NotInRange = -9,
    InvalidArgs = -10,
    Tired = -11,
    NoBodyPart = -12,
    NotEnoughExtensions = -13
}

declare enum Direction {
    Top = 1,
    TopRight = 2,
    Right = 3,
    BottomRight = 4,
    Bottom = 5,
    BottomLeft = 6,
    Left = 7,
    TopLeft = 8
}

declare enum ExitDirection {
    Top = 1,
    Right = 3,
    Bottom = 5,
    Left = 7
}

declare enum RoomObjTypes { 
    Creeps= 1,
    MyCreeps= 2,
    HostileCreeps = 3,
    SourcesActive= 4,
    Sources= 5,
    DroppedEnergy= 6,
    Structures= 7,
    MyStructures= 8,
    HostileStructures= 9,
    Flags= 10,
    ConstructionSites= 11,
    MySpawns= 12,
    HostileSpawns= 13,
    ExitTop= 14,
    ExitRight= 15,
    ExitBottom= 16,
    ExitLeft= 17,
}

interface PathfindingOptions {
    maxOps?: number;
    ignoreCreeps?: boolean;
    ignoreDestructibleStructures?: boolean;
    withinRampartsOnly?: boolean;
}

/** An object with the creep’s owner info. */
interface Owner {
     /** The name of the owner user. */
    username: string;
}

interface FindStep {
    x: number;
    y: number;
    dx: number;
    dy: number;
    direction: Direction;
}

interface Creep extends AttackableEntity {
    /** 
      * A unique object identificator.
      */
    id: string;
    /**
     * Creep’s name. You can choose the name while creating a new creep, and it cannot be changed later. This name is a hash key to access the creep via the Game.creeps object.
     */
    name: string;

    /** An object with the creep’s owner info. */
    owner: Owner;

    /** The link to the Room object of this creep. */
    room: Room;

    /** An object representing the position of this creep in a room. */
    pos: RoomPosition;

    memory: any;

    /** Whether it is your creep or foe. */
    my: boolean;

    /** Whether this creep is still being spawned. */
    spawning: boolean;

    /** An array describing the creep’s body. */
    body: {
        /** One of the body parts constants. */
        type: string;
        /** The remaining amount of hit points of this body part. */
        hits: number
    }[];

    /** The current amount of energy the creep is carrying. */
    energy: number;

    /** The total amount of energy the creep can carry. */
    energyCapacity: number;

    /** The current amount of hit points of the creep. */
    hits: number;

    /** The maximum amount of hit points of the creep. */
    hitsMax: number;

    /** The remaining amount of game ticks after which the creep will die. */
    ticksToLive: number;

    /** The movement fatigue indicator. If it is greater than zero, the creep cannot move. */
    fatigue: number;

    /** Attack another creep or structure in a short-ranged attack. Needs the ATTACK body part. If the target is inside a rampart, then the rampart is attacked instead.
     * @param target - The targetr object to be attacked.
      */
    attack(target: AttackableEntity): GameCode;

    build(target: ConstructionSite): GameCode;

    dropEnergy(amount?: number): GameCode;

    getActiveBodyparts(type: string): number;

    harvest(target: Source): GameCode;

    heal(target: Creep): GameCode;

    move(direction: number): GameCode;

    moveTo(x: number, y: number): GameCode;

    moveTo(target: PositionEntity, opts?: PathfindingOptions): GameCode;

    pickup(target: Energy): GameCode;

    rangedAttack(target: AttackableEntity); GameCode;

    repair(target: RepairableEntity): GameCode;

    transferEnergy(target: AttackableEntity, amount?: number): GameCode;

    suicide(): GameCode;
}

interface PositionEntity { }
interface RepairableEntity { }
interface AttackableEntity extends PositionEntity { }


interface Spawn extends Structure {
    name: string;

    memory: any;
    
    spawning: {
        name: string;
        needTime: number;
        remainingTime: number;
    }

    energy: number;

    energyCapcity: number;
    
    createCreep(body: string[], name?: string, memory?: any): GameCode;

    transferEnergy(target: Creep, amount?: number): GameCode;
}

interface Structure extends AttackableEntity, RepairableEntity {
    id: string;

    owner: Owner;

    room: Room;

    pos: RoomPosition;

    hits: number;

    hitsMax: number;

    structureType: string;

    my: boolean;
}

interface Exit {
    id: string;
    room: Room;
    pos: RoomPosition;
    exit: ExitDirection;
}

interface Energy extends PositionEntity {
    id: string;

    room: Room;

    pos: RoomPosition;

    energy: number;
}

interface Room {
    name: string;

    find(type: RoomObjTypes, opts?: { filter: any }): any[];

    lookAt(x: number, y: number): any[];
    lookAt(target: PositionEntity): any[];

    findPath(fromPos: RoomPosition, toPos: RoomPosition, opts?: PathfindingOptions): FindStep[];

    makeSnapshot(description?: string): void;

    /** On success getPositionAt will return RoomPosition; on failure, null. */
    getPositionAt(x: number, y: number): RoomPosition;

    createFlag(x: number, y: number, name?: string): GameCode;
    createFlag(pos: PositionEntity, name?: string): GameCode;
    createConstructionSite(x: number, y: number, structureType: string): GameCode;
    createConstructionSite(pos: PositionEntity, structureType: string): GameCode;
}

interface Flag {
    id: string;
    name: string;
    roomName: string;
    room: Room;
    pos: RoomPosition;

    remove(): GameCode;
}

interface ConstructionSite extends PositionEntity {
    id: string;
    owner: Owner;
    room: Room;
    pos: RoomPosition;
    progress: number;
    progressTotal: number;
    StructureTypes: string;
    my: boolean;

    remove(): GameCode;
}

interface Source extends PositionEntity {
    id: string;
    room: Room;
    pos: RoomPosition;
    energy: number;
    energyCapacity: number;
    ticksToRegeneration: number;
}

interface RoomPosition extends PositionEntity {
    /** X position in the room.*/
    x: number;
    /** Y position in the room. */
    y: number;
    /** The name of the room. */
    roomName: string;

    /** Check whether this position is in the given range of another position. 
     * @param toPos - The target position.
     * @param range - The range distance.
     */
    inRangeTo(toPos: RoomPosition, range: number): boolean; 
}

declare var Game: {
    creeps: { [name: string]: Creep };
    flags: { [name: string]: Flag };
    spawns: { [name: string]: Spawn };
    structures: { [name: string]: Structure };

    getRoom(name: string): Room;
    getObjectById(id: string): any;

    /** System game tick counter. It is automatically incremented on every tick. */
    time: number;


    WORK: string;
    MOVE: string;
    CARRY: string;
    ATTACK: string;
    RANGED_ATTACK: string;
    HEAL: string;
    TOUGH: string;

    notify(message: string): void;
}

declare var Memory: any;