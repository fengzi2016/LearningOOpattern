/**
 * 创建level
 */
var actorChars = {
    "@": Player,
    "o": Coin,
    "=": Lava, "|": Lava, "v": Lava
  };
function Level(plan){
    this.width = plan[0].length;
    this.height = plan.length;
    this.grid=[];
    this.actors=[];
    this.fininshDelay=null;
    this.status='';
    for(let i=0;i<this.height;i++){
        let row=plan[i];let line=[];
        for(let j=0;j<this.height;j++){
            if(actorChars[row[j]]){
                let Actor=actorChars[row[j]];
                this.actors.push(new Actor(new Vector(i,j)),row[j]);

                line.push(null);
            }else{
               if(row[j]==='x'){
                   line.push('wall');
               }else if(row[j]==='!'){
                   line.push('lava');
               }else{
                   line.push(null);
               }
            }
        }
        this.grid.push(line);
    }
    this.player=this.actors.filter(function(actor){
        return actor==='Player';
    })[0];
}
function isFinished(){
    return this.fininshDelay<0&&this.status!=='';
}


/**创建位置Vector */

function Vector(x,y){
    this.x=x;
    this.y=y;
}
Vector.prototype.plus=function(x,y){
    return new Vector(this.x+x,this.y+y);
}
Vector.prototype.times=function(factor){
    return new Vector(this.x*factor,this.y*factor);
}

/**创建Player*/
function Player(pos){
    this.pos=pos.plus(new Vector(0,-0.5));
    this.size=new Vector(0.8,1.5);
    this.speed=new Vector(0,0);
}
Player.prototype.type='player';
function Lava(pos,ch){
    this.pos=pos;
    this.size=new Vector(1,1);
    if(ch='='){
        this.speed=new Vector(2,0);
    }else if(ch='|'){
        this.speed=new Vector(0,2);
    }else if(ch='V'){
        this.speed=new Vector(0,3);
        this.repeatPos=pos;
    }
}
Lava.prototype.type='lava';

function Coin(pos){
    this.basePos=this.pos=pos.plus(new Vector(0.2,0.1));
    this.size=new Vector(0.6,0.6);
    this.wobble=Math.random()*Math.PI*2;
}
Coin.prototype.type='coin';
/**
 * 当定义完所有的类时，应该思考哪些实例应该同时具备哪些类的方法和属性
 * 比如，任何一个actor应该都是其对应的类的实例。在new Actor(new Vector(i,j),row[j])就做到了
 */