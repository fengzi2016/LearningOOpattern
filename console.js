//1.
var a = function(){}
a.b = 1
a.prototype.b = 2
a.prototype.c = 3
a.prototype.d = 4
console.log(a.b) //=>1
console.log(new a().b)//=>2

var foo = new a()
foo.c = 5
console.log(foo.c) //=>5
console.log(foo.d)//=>4

//2.
var Foo = function(){
    this.a = 1
    return {
      a:2
    }
  }
  
  var bar = new Foo()
  console.log(bar.a)//=>2
  //3.
  var map = Object.create(null);
  console.log("toString" in map); 
  //=>false
  var map = Object.create({a:1});
  console.log("toString" in map);
  //=>true 
  console.log("a" in map);
  //=>true
  //4.
  function foo(obj){
    return Object.prototype.toString.call(obj).slice(8,-1)
  }
  console.log(foo(new String))
  //=>String
  //作用：Object.prototype.toString.call(obj)是求出obj的对象类型，输出的是[object String],.slice(8,-1)作用是取第二个英语单词即类型
  
  //5.
  var a = {}
  a.bar = 2
  
  Object.defineProperty(a, "foo",
                        { value: "hi"});
  
  console.log(delete a.foo)
  //=>false
  console.log(delete a.bar)
  //=>true
  a.foo = "world"
  console.log(a.foo)
  //=>hi
  
  for (var key in a){
    console.log(key);
  }//无法枚举，这个for语句没有运行
 
  console.log("foo" in a);
  //=>true
  console.log("bar" in a);
  //false
  
  //Task1
  function Person(name,age){
    this.name=name;
    this.age=age;
  }
  Person.prototype.introduce=function(){
    console.log('I am '+ this.name +', I am '+this.age+' years old!')
  }
  var jerry = new Person("Jerry", 2);
  jerry.introduce();
function Vector(x,y){
  this.x=x;
  this.y=y;
}
Vector.prototype.plus=function(obj){
  this.x=this.x+obj.x;
  this.y=this.y+obj.y;
  return this;
}
Vector.prototype.minus=function(obj){
  this.x=this.x-obj.x;
  this.y=this.y-obj.y;
  return this;
}
let vector=new Vector(0,0);
console.log(vector.plus({x:1,y:1}))
console.log(vector.minus({x:-1,y:-1}))