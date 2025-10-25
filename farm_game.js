import {
    SIZE,
    colors, 
    MAX_DEPTH, 
    waterBlock, 
    earthBlock, 
    plants, 
    potato, 
    cactus, 
    swamper, 
    tree, 
    bucketOfWater
} from './farm_classes.js';

class field
{
    #array;
    #current_id;

    constructor()
    {
        this.#init_array();
        this.createToolbar();
        this.#current_id = new bucketOfWater();
    }
            
    #redact_earth_if_current_water_block(i, j)
    {
        for (let di = -MAX_DEPTH; di <= MAX_DEPTH; ++di)
        {
            for (let dj = -MAX_DEPTH; dj <= MAX_DEPTH; ++dj)
            {
                const ni = i + di;
                const nj = j + dj;

                if (ni < 0 || nj < 0 || ni >= SIZE || nj >= SIZE) continue;

                const distance = Math.abs(di) + Math.abs(dj);
                const level = MAX_DEPTH - distance + 1;
                if (level <= 0) continue;

                const cell = this.get_array_element(ni, nj);

                if (cell.get() === "#block/earth_block" && cell.get_count_water() < level)
                {
                    cell.set_count_water(level);
                }
            }
        }
    }

    #return_color(i, j)
    {
        switch(this.#array[i][j].get()) 
        {
            case "#block/earth_block": return colors[Math.max(0, Math.min(MAX_DEPTH, this.#array[i][j].get_count_water()))];
            case "#block/water_block": return "#75a0dcff";
        }
    }

    #icon(i, j)
    {
        const cell = this.#array[i][j];

        if (cell.get() !== "#block/earth_block") return "";
        switch (cell.get_id_plants().get())
        {
            case "#item/plants/potato": return "🥔";
            case "#item/plants/cactus": return "🌵";
            case "#item/plants/swamper": return "🌱";
            case "#item/plants/tree": return "🌳";
        }    
    }

    #init_array()
    {
        this.#array = [];
        for (let i = 0; i < SIZE; i++)
        {
            let row = [];
            for (let j = 0; j < SIZE; j++)
            {
                row.push(new earthBlock());
            }
            this.#array.push(row);
        }
    }

    #redact_plants(i, j, object)
    {
        if (this.#array[i][j].get() === "#block/earth_block") this.#array[i][j].set_id_plants(object);
    }

    #set_water()
    {
        for (let i = 0; i < SIZE; ++i) 
            for (let j = 0; j < SIZE; ++j)
                if (this.#array[i][j].get() === "#block/earth_block") 
                    this.#array[i][j].set_count_water(0);
        for (let i = 0; i < SIZE; ++i) 
            for (let j = 0; j < SIZE; ++j)
                if (this.#array[i][j].get() === "#block/water_block")
                    this.#redact_earth_if_current_water_block(i, j);
        for (let i = 0; i < SIZE; ++i) 
            for (let j = 0; j < SIZE; ++j)
                if (this.#array[i][j].get() === "#block/earth_block" && this.#array[i][j].get_count_water() === 0)
                    this.#array[i][j].set_id_plants(new plants());
    }

    #click_water(i, j, item)
    {
        if (item.get() === "#item/tool/bucket_of_water")
        {
            this.#array[i][j] = new earthBlock();
            this.#set_water();
        }
    }

    #redact_earth_block(i, j, item)
    {
        switch (item.get())
        {
            case "#item/tool/bucket_of_water":
                this.#array[i][j] = new waterBlock();
                this.#set_water();
                break;
            case "#item/tool/shovel": 
                this.#redact_plants(i, j, new plants());
                break;
            case "#item/plants/potato": 
                if (this.#array[i][j].get_count_water() >= 1 && this.#array[i][j].get_id_plants().get() === "#item/plants")
                {
                    this.#redact_plants(i, j, new potato());
                }
                break;
            case "#item/plants/cactus": 
                if (this.#array[i][j].get_count_water() >= 2  && this.#array[i][j].get_id_plants().get() === "#item/plants") 
                {    
                    this.#redact_plants(i, j, new cactus()); 
                }
                break;
            case "#item/plants/swamper": 
                if (this.#array[i][j].get_count_water() >= 3  && this.#array[i][j].get_id_plants().get() === "#item/plants") 
                {
                    this.#redact_plants(i, j, new swamper()); 
                }
                break;
        }
    }

    set_array_element(i, j, item)
    {
        switch(this.#array[i][j].get()) 
        {
            case "#block/earth_block": this.#redact_earth_block(i, j, item); break;
            case "#block/water_block": this.#click_water(i, j, item);        break;
        }
    }

    get_array_element(i, j) { return this.#array[i][j]; }

    setCurrentTool(tool) { this.#current_id = tool; }

    createToolbar() 
    {
        const element = document.getElementById("array");
        element.innerHTML = "";

        for (let i = 0; i < SIZE; ++i) 
        {
            for (let j = 0; j < SIZE; ++j) 
            {
                const butt = document.createElement("button");

                butt.addEventListener("click", () => {
                    this.set_array_element(i, j, this.#current_id);
                    this.createToolbar();
                    setTimeout(() => {
                        const cell = this.#array[i][j];
                        if (cell.get() === "#block/earth_block" && cell.get_id_plants().get() !==  "#item/plants") 
                        {
                            cell.set_id_plants(new tree());
                            this.createToolbar();
                        }}, 2000);});

                butt.style.backgroundColor = this.#return_color(i, j);
                butt.textContent = this.#icon(i, j);
                        
                butt.style.width = "50px";
                butt.style.height = "50px";
                butt.style.fontSize = "18px";
                butt.style.margin = "2px";
                butt.style.textAlign = "center";
                butt.style.verticalAlign = "middle";

                element.appendChild(butt);
            }
            element.appendChild(document.createElement("br"));
        }
    }
}

export const game = new field();