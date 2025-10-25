export const SIZE = 15;

export const colors = [ "#ffff66", "#d2a679", "#996633", "#4b2e2e" ];

export const MAX_DEPTH = colors.length - 1;

export class base
{
    #id;

    constructor(id = "#") { this.#id = id; }

    get() { return this.#id; }
    set(id) { this.#id = id; }
}

export class block extends base
{
    constructor(id = "#block") { super(id); }
}

export class item extends base
{
    constructor(id = "#item") { super(id); }
}

export class waterBlock extends block
{
    constructor(id = "#block/water_block") { super(id); }
}

export class earthBlock extends block
{
    #count_water;
    #plants_in_block;

    constructor(id = "#block/earth_block")
    {
        super(id);
        this.#count_water = 0;
        this.#plants_in_block = new plants();
    }

    get_id_plants() { return this.#plants_in_block; }
    set_id_plants(new_plants) { this.#plants_in_block = new_plants; }
            
    get_count_water() { return this.#count_water; }
    set_count_water(count_water) { this.#count_water = count_water; }
}

export class plants extends item
{
    #status;

    constructor(id = "#item/plants")
    {
    super(id);
    this.#status = 0;
    }

    set_status(status) { this.#status = status; }
    get_status() { return this.#status; }
}

export class tool extends item
{
    constructor(id = "#item/tool") { super(id); }
}

export class potato extends plants
{
    constructor() { super("#item/plants/potato"); }
}

export class cactus extends plants
{
    constructor() { super("#item/plants/cactus"); }
}

export class swamper extends plants
{
    constructor() { super("#item/plants/swamper"); }
}

export class tree extends plants
{
    constructor() { super("#item/plants/tree"); }
}

export class shovel extends tool
{
    constructor() { super("#item/tool/shovel"); }
}

export class bucketOfWater extends tool
{
    constructor() { super("#item/tool/bucket_of_water"); }
}