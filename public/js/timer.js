
class Timer
{
    constructor(nameOfTimer)
    {
        this.name = nameOfTimer; 
        this.startTime;
        this.endTime; 
        Timer.prototype.start = function() 
        {
            this.startTime = Date.now(); 
        }
        Timer.prototype.stop = function() 
        {
           this.endTime = Date.now() - this.startTime; 
           console.log(`${this.name} took ${Math.floor(this.endTime/1000)} seconds to process`); 
        }
        
    };
}

export default Timer; 