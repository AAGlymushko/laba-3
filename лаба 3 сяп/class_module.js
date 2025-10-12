         const SIZE = 15;

         class base_id
        {
            #id;

            constructor(id = "#") { this.#id = id; }

            get() { return this.#id; }
            set(id) { this.#id = id; }
        }

         class block extends base_id
        {
            constructor(id = "#block") { super(id); }
        }

         class item extends base_id
        {
            constructor(id = "#item") { super(id); }
        }

         class water_block extends block
        {
            constructor(id = "#block/water_block") { super(id); }
        }

         class earth_block extends block
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

         class plants extends item
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

         class tool extends item
        {
            constructor(id = "#item/tool") { super(id); }
        }

         class potato extends plants
        {
            constructor() { super("#item/plants/potato"); }
        }

         class cactus extends plants
        {
            constructor() { super("#item/plants/cactus"); }
        }

         class swamper extends plants
        {
            constructor() { super("#item/plants/swamper"); }
        }

         class tree extends plants
        {
            constructor() { super("#item/plants/tree"); }
        }

         class shovel extends tool
        {
            constructor() { super("#item/tool/shovel"); }
        }

         class bucket_of_water extends tool
        {
            constructor() { super("#item/tool/bucket_of_water"); }
        }

         class field
        {
            #array;
            #current_id;

            constructor()
            {
                this.#init_array();
                this.createToolbar();
                this.#current_id = new bucket_of_water();
            }
            
            #redact_earth_if_current_water_block(i, j)
            {
                const maxDepth = 3

                for (let di = -maxDepth; di <= maxDepth; ++di)
                {
                    for (let dj = -maxDepth; dj <= maxDepth; ++dj)
                    {
                        const ni = i + di;
                        const nj = j + dj;

                        if (ni < 0 || nj < 0 || ni >= SIZE || nj >= SIZE) continue;

                        const distance = Math.abs(di) + Math.abs(dj);
                        const level = maxDepth - distance + 1;
                        if (level <= 0) continue;

                        const cell = this.get_array_element(ni, nj);

                        if (cell.get() === "#block/earth_block" && cell.get_count_water() < level)
                        {
                            cell.set_count_water(level);
                        }
                    }
                }
            }

            #color(i, j)
            {
                const colors = [ "#ffff66", "#d2a679", "#996633", "#4b2e2e" ];

                switch(this.#array[i][j].get()) 
                {
                    case "#block/earth_block": return colors[Math.max(0, Math.min(3, this.#array[i][j].get_count_water()))];
                    case "#block/water_block": return "#75a0dcff";
                }
            }

            #icon(i, j)
            {
                const cell = this.#array[i][j];

                if (cell.get() === "#block/earth_block")
                {
                    switch (cell.get_id_plants().get())
                    {
                        case "#item/plants/potato": return "🥔";
                        case "#item/plants/cactus": return "🌵";
                        case "#item/plants/swamper": return "🌱";
                        case "#item/plants/tree": return "🌳";
                    }
                }
                return "";
            }

            #init_array()
            {
                this.#array = [];
                for (let i = 0; i < SIZE; i++)
                {
                    let row = [];
                    for (let j = 0; j < SIZE; j++)
                    {
                        row.push(new earth_block());
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
                    this.#array[i][j] = new earth_block();
                    this.#set_water();
                }
            }

            #redact_earth_block(i, j, item)
            {
                switch (item.get())
                {
                    case "#item/tool/bucket_of_water":
                        this.#array[i][j] = new water_block();
                        this.#set_water();
                        break;
                    case "#item/tool/shovel": 
                        this.#redact_plants(i, j, new plants());  break;
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

                        butt.addEventListener("click", () => 
                        {
                            this.set_array_element(i, j, this.#current_id);
                            this.createToolbar();
                            setTimeout(() => {
                                const cell = this.#array[i][j];
                                if (cell.get() === "#block/earth_block" && cell.get_id_plants().get() !==  "#item/plants") 
                                {
                                    cell.set_id_plants(new tree());
                                    this.createToolbar();
                                }
                            }, 2000);

                        });

                        butt.style.backgroundColor = this.#color(i, j);
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

         const game = new field();