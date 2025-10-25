import {
    potato, 
    cactus, 
    swamper,
    shovel, 
    bucketOfWater
} from './farm_classes.js';

import { game } from './farm_game.js'; 

document.addEventListener('DOMContentLoaded', function() 
{
    window.game = game;
    document.getElementById('0').addEventListener('click', () => {
        window.game.setCurrentTool(new bucketOfWater());
    });
    
    document.getElementById('1').addEventListener('click', () => {
        window.game.setCurrentTool(new shovel());
    });
    
    document.getElementById('2').addEventListener('click', () => {
        window.game.setCurrentTool(new potato());
    });
    
    document.getElementById('3').addEventListener('click', () => {
        window.game.setCurrentTool(new cactus());
    });
    
    document.getElementById('4').addEventListener('click', () => {
        window.game.setCurrentTool(new swamper());
    });
});