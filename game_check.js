/**
 * 第一步，定义类和转化地图
 * 字符串数组的转化:初始数组=>非动态元素描述数组【存字符串】、动态元素描述数组【存类的实例】
 * 类：Level,Vector,Player,Coin,Lava,
 * 各种类
 *   Level(plan)=>{
 * /**
 * 注意：
 * this.grid=[['wall','lava',null,..],['wall',null,null],[...],...]【记录所有的不动的熔岩和墙】
 * this.actors=[Lava(local,ch),Player(local,ch),Coin(local,ch),....]【记录会动的熔岩，玩家，金币；位置和字符串图标为参数】
 * 如果遍历到的是Plays，Coin，Lava对应的字符串图标则被this.actors记录这个实例，其位置和字符串图标作为实例的两个参数，在this.grid里用null记录,如果是'X'||'!'则被this.grid记录wall||lava，this.grid是数组数组
 */
//     *  this.width【地图宽】
//     *  this.height【地图高】
//     *  this.grid 【转化后的非动态，存字符串】 
//     *  this.actors【转化后的动态，存类的实例】
//     *  this.player 【动态数组中的Player】
//     *  this.status 【游戏的状态】
//     *  this.finishDelay
//     *  isFinished() 【返回布尔值，判断游戏是否结束】
//     *  obstacleAt(pos,size)【构建四周的wall和底部的熔岩以及地图内的地形，将它们设置为“障碍”】
//     *  actorAt(actor)【利用this.actors数组，返回覆盖在一起的动态元素】
//     *  playerTouched(type,actor)【当碰到其它元素的时候，根据元素的type做出不同的反应】
//     *  animate(step,keys)
//     * }
// Vector(x,y)=>{
//     【用来记录元素所在位置，增减位置，以及一种倍数关系】
//      this.x=x
//      this.y=y
//      this.plus(other)
//      this.times(factor)
// }
// Player(pos)=>{
//     【用来代表玩家控制的“黑条”】
//     this.pos=pos{this.x,this.y}【元素坐标】
//     this.size={this.x,this.y}【元素大小】
//     this.speed={this.x,this.y}【存着当前的速度，用于模拟动量和重力】
//     this.type='player'
//     moveX(step,level,keys)【X方向按照step速度移动以及（level）碰到障碍的处理，keys用来判断用户按的是左还是右】
//     moveY(step,level,keys)【y方向按照step*gravity速度向上移动，按照jumpSpeed速度向下移动，（level）碰到障碍的处理，keys用来判断用户是否按了上】
//     act(step,level,keys)【结合X和Y方向，处理碰到障碍物，处理lost后黑条的变化】
// }
/**
 * Lava(pos,ch)=>{
 * this.pos
 * this.size
 * this.speed
 * this.type
 * this.repeatPos =>{this.x,this.y}回到起始位置
 * act(step)【不同的熔岩不同速度移动，以及遇到障碍后如何移动】
 * }
 *//**
 * Coin(pos)=>{
 *  this.basePos
 *  this.size
 *  this.wobble【摇晃】
 *  this.type
 *  act(step)
 * }
 * /**
 * 第二步，将JS和htmlDOM相结合
 */
/**
 * DOMDisplay(parent,level)=>{
 * this.wrap =>存着一个父级DOM，子级为自定义的DOM元素和class
 * this.level=>存着一个Level类的实例
 * this.actorLayer=>存着一个包括所有动态actor的divDOM
 * drawBackground()=>将世界以table表示，给this.grid中的元素设置高宽，每一行为tr,行内的每一个元素为td
 * drawActors()=>将this.level.actors数组里的所有动态元素各生成一个div并且集中在一个父级div里
 * drawFrame()=>当移动层（actorLayer）存在时移除，再生成新的移动层，给装着变化层的this.wrap加CSS类名
 * scrollPlayerIntoView()=>让player的黑条不会在可见窗口之外
 * clear()=>删除转化层（this.wrap代表的div）
 * }
 *  
 *//**
 * 第三步，监听用户的按键事件
 * trackKeys()
 */
/**
 * 第四步，生成动画，规定游戏等级，开启游戏
 * runAnimation(frameFunc)
 * runLevel(level,Display,andThen)
 * run Game(plans,Display)
 */
 
 var simpleLevelPlan = [
  "                      ",
  "                      ",
  "  x              = x  ",
  "  x         o o    x  ",
  "  x @      xxxxx   x  ",
  "  xxxxx            x  ",
  "      x!!!!!!!!!!!!x  ",
  "      xxxxxxxxxxxxxx  ",
  "                      "
];

function Level(plan) {
  this.width = plan[0].length;
  this.height = plan.length;
  this.grid = [];
  this.actors = [];

  for (var y = 0; y < this.height; y++) {
    var line = plan[y], gridLine = [];
    for (var x = 0; x < this.width; x++) {
      var ch = line[x], fieldType = null;
      var Actor = actorChars[ch];
      if (Actor)
        this.actors.push(new Actor(new Vector(x, y), ch));
      else if (ch == "x")
        fieldType = "wall";
      else if (ch == "!")
        fieldType = "lava";
      gridLine.push(fieldType);
    }
    this.grid.push(gridLine);
  }


  this.player = this.actors.filter(function(actor) {
    return actor.type == "player";
  })[0];
  this.status = this.finishDelay = null;
}

Level.prototype.isFinished = function() {
  return this.status != null && this.finishDelay < 0;
};

function Vector(x, y) {
  this.x = x; this.y = y;
}
Vector.prototype.plus = function(other) {
  return new Vector(this.x + other.x, this.y + other.y);
};
Vector.prototype.times = function(factor) {
  return new Vector(this.x * factor, this.y * factor);
};

var actorChars = {
  "@": Player,
  "o": Coin,
  "=": Lava, "|": Lava, "v": Lava
};
/** Player(pos)=>{
  * this.pos
  * this.size
  * this.speed=>{this.x,this.y}【存着当前的速度，用于模拟动量和重力】
  * this.type
    act()
    moveX()
    moveY()
  * }
  * 
  */
function Player(pos) {
  this.pos = pos.plus(new Vector(0, -0.5));
  this.size = new Vector(0.8, 1.5);
  this.speed = new Vector(0, 0);
}
Player.prototype.type = "player";

function Lava(pos, ch) {
  this.pos = pos;
  this.size = new Vector(1, 1);
  if (ch == "=") {
    this.speed = new Vector(2, 0);
  } else if (ch == "|") {
    this.speed = new Vector(0, 2);
  } else if (ch == "v") {
    this.speed = new Vector(0, 3);
    this.repeatPos = pos;
  }
}
Lava.prototype.type = "lava";

function Coin(pos) {
  this.basePos = this.pos = pos.plus(new Vector(0.2, 0.1));
  this.size = new Vector(0.6, 0.6);
  this.wobble = Math.random() * Math.PI * 2;
}
Coin.prototype.type = "coin";

var simpleLevel = new Level(simpleLevelPlan);

function elt(name, className) {
  var elt = document.createElement(name);
  if (className) elt.className = className;
  return elt;
}


function DOMDisplay(parent, level) {
  this.wrap = parent.appendChild(elt("div", "game"));
  this.level = level;

  this.wrap.appendChild(this.drawBackground());
  this.actorLayer = null;
  this.drawFrame();
}

var scale = 20;

DOMDisplay.prototype.drawBackground = function() {
  var table = elt("table", "background");
  table.style.width = this.level.width * scale + "px";
  this.level.grid.forEach(function(row) {
    var rowElt = table.appendChild(elt("tr"));
    rowElt.style.height = scale + "px";
    row.forEach(function(type) {
      rowElt.appendChild(elt("td", type));
    });
  });
  return table;
};

DOMDisplay.prototype.drawActors = function() {
  var wrap = elt("div");
  this.level.actors.forEach(function(actor) {
    var rect = wrap.appendChild(elt("div",
                                    "actor " + actor.type));
    rect.style.width = actor.size.x * scale + "px";
    rect.style.height = actor.size.y * scale + "px";
    rect.style.left = actor.pos.x * scale + "px";
    rect.style.top = actor.pos.y * scale + "px";
  });
  return wrap;
};

DOMDisplay.prototype.drawFrame = function() {
  if (this.actorLayer)
    this.wrap.removeChild(this.actorLayer);
  this.actorLayer = this.wrap.appendChild(this.drawActors());
  this.wrap.className = "game " + (this.level.status || "");
  this.scrollPlayerIntoView();
};

DOMDisplay.prototype.scrollPlayerIntoView = function() {
  var width = this.wrap.clientWidth;
  var height = this.wrap.clientHeight;
  var margin = width / 3;

  // The viewport
  var left = this.wrap.scrollLeft, right = left + width;
  var top = this.wrap.scrollTop, bottom = top + height;

  var player = this.level.player;
  var center = player.pos.plus(player.size.times(0.5))
                 .times(scale);

  if (center.x < left + margin)
    this.wrap.scrollLeft = center.x - margin;
  else if (center.x > right - margin)
    this.wrap.scrollLeft = center.x + margin - width;
  if (center.y < top + margin)
    this.wrap.scrollTop = center.y - margin;
  else if (center.y > bottom - margin)
    this.wrap.scrollTop = center.y + margin - height;
};

DOMDisplay.prototype.clear = function() {
  this.wrap.parentNode.removeChild(this.wrap);
};

Level.prototype.obstacleAt = function(pos, size) {
  var xStart = Math.floor(pos.x);
  var xEnd = Math.ceil(pos.x + size.x);
  var yStart = Math.floor(pos.y);
  var yEnd = Math.ceil(pos.y + size.y);

  if (xStart < 0 || xEnd > this.width || yStart < 0)
    return "wall";
  if (yEnd > this.height)
    return "lava";
  for (var y = yStart; y < yEnd; y++) {
    for (var x = xStart; x < xEnd; x++) {
      var fieldType = this.grid[y][x];
      if (fieldType) return fieldType;
    }
  }
};

Level.prototype.actorAt = function(actor) {
  for (var i = 0; i < this.actors.length; i++) {
    var other = this.actors[i];
    if (other != actor &&
        actor.pos.x + actor.size.x > other.pos.x &&
        actor.pos.x < other.pos.x + other.size.x &&
        actor.pos.y + actor.size.y > other.pos.y &&
        actor.pos.y < other.pos.y + other.size.y)
      return other;
  }
};

var maxStep = 0.05;

Level.prototype.animate = function(step, keys) {
  if (this.status != null)
    this.finishDelay -= step;

  while (step > 0) {
    var thisStep = Math.min(step, maxStep);
    this.actors.forEach(function(actor) {
      actor.act(thisStep, this, keys);
    }, this);
    step -= thisStep;
  }
};

Lava.prototype.act = function(step, level) {
  var newPos = this.pos.plus(this.speed.times(step));
  if (!level.obstacleAt(newPos, this.size))
    this.pos = newPos;
  else if (this.repeatPos)
    this.pos = this.repeatPos;
  else
    this.speed = this.speed.times(-1);
};

var wobbleSpeed = 8, wobbleDist = 0.07;

Coin.prototype.act = function(step) {
  this.wobble += step * wobbleSpeed;
  var wobblePos = Math.sin(this.wobble) * wobbleDist;
  this.pos = this.basePos.plus(new Vector(0, wobblePos));
};

var playerXSpeed = 7;

Player.prototype.moveX = function(step, level, keys) {
  this.speed.x = 0;
  if (keys.left) this.speed.x -= playerXSpeed;
  if (keys.right) this.speed.x += playerXSpeed;

  var motion = new Vector(this.speed.x * step, 0);
  var newPos = this.pos.plus(motion);
  var obstacle = level.obstacleAt(newPos, this.size);
  if (obstacle)
    level.playerTouched(obstacle);
  else
    this.pos = newPos;
};

var gravity = 30;
var jumpSpeed = 17;

Player.prototype.moveY = function(step, level, keys) {
  this.speed.y += step * gravity;
  var motion = new Vector(0, this.speed.y * step);
  var newPos = this.pos.plus(motion);
  var obstacle = level.obstacleAt(newPos, this.size);
  if (obstacle) {
    level.playerTouched(obstacle);
    if (keys.up && this.speed.y > 0)
      this.speed.y = -jumpSpeed;
    else
      this.speed.y = 0;
  } else {
    this.pos = newPos;
  }
};

Player.prototype.act = function(step, level, keys) {
  this.moveX(step, level, keys);
  this.moveY(step, level, keys);

  var otherActor = level.actorAt(this);
  if (otherActor)
    level.playerTouched(otherActor.type, otherActor);

  // Losing animation
  if (level.status == "lost") {
    this.pos.y += step;
    this.size.y -= step;
  }
};

Level.prototype.playerTouched = function(type, actor) {
  if (type == "lava" && this.status == null) {
    this.status = "lost";
    this.finishDelay = 1;
  } else if (type == "coin") {
    this.actors = this.actors.filter(function(other) {
      return other != actor;
    });
    if (!this.actors.some(function(actor) {
      return actor.type == "coin";
    })) {
      this.status = "won";
      this.finishDelay = 1;
    }
  }
};

var arrowCodes = {37: "left", 38: "up", 39: "right"};

function trackKeys(codes) {
  var pressed = Object.create(null);
  function handler(event) {
    if (codes.hasOwnProperty(event.keyCode)) {
      var down = event.type == "keydown";
      pressed[codes[event.keyCode]] = down;
      event.preventDefault();
    }
  }
  addEventListener("keydown", handler);
  addEventListener("keyup", handler);
  return pressed;
}

function runAnimation(frameFunc) {
  var lastTime = null;
  function frame(time) {
    var stop = false;
    if (lastTime != null) {
      var timeStep = Math.min(time - lastTime, 100) / 1000;
      stop = frameFunc(timeStep) === false;
    }
    lastTime = time;
    if (!stop)
      requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

var arrows = trackKeys(arrowCodes);

function runLevel(level, Display, andThen) {
  var display = new Display(document.body, level);
  runAnimation(function(step) {
    level.animate(step, arrows);
    display.drawFrame(step);
    if (level.isFinished()) {
      display.clear();
      if (andThen)
        andThen(level.status);
      return false;
    }
  });
}

function runGame(plans, Display) {
  function startLevel(n) {
    runLevel(new Level(plans[n]), Display, function(status) {
      if (status == "lost")
        startLevel(n);
      else if (n < plans.length - 1)
        startLevel(n + 1);
      else
        console.log("You win!");
    });
  }
  startLevel(0);
}
