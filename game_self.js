/**
 * 第一步，定义类和转化地图
 * 字符串数组的转化:初始数组=>非动态元素描述数组【存字符串】、动态元素描述数组【存类的实例】
 * 类：Level,Vector,Player,Coin,Lava,
 * Level(plan)=>{
 *  this.width【地图宽】
 *  this.height【地图高】
 *  this.grid 【转化后的非动态，存字符串】 
 *  this.actors【转化后的动态，存类的实例】
 *  this.player 【动态数组中的Player】
 *  this.status 【游戏的状态】
 *  this.finishDelay
 *  isFinished() 【返回布尔值，判断游戏是否结束】
 *  obstacleAt(pos,size)【构建四周的wall和底部的熔岩，以及地图内的地形，将它们设置为“障碍”】
 *  actorAt(actor)【利用this.actors数组，返回覆盖在一起的动态元素】
 *  playerTouched(type,actor)【当碰到其它元素的时候，根据元素的type做出不同的反应】
 * 
 * }
 *Vector(x,y)=>{
     【用来记录元素所在位置，增减位置，以及一种倍数关系】
      this.x=x
      this.y=y
      this.plus(x,y)
      this.times(factor)
 }
 Player(pos)=>{
     【用来代表玩家控制的“黑条”】
     this.pos=pos{this.x,this.y}【元素坐标】
     this.size={this.x,this.y}【元素大小】
     this.speed={this.x,this.y}【存着当前的速度，用于模拟动量和重力】
     this.type='player'
     act(step,level,keys)【】
     
 }
 * 
 * 
 */