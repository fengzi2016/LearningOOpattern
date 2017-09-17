var MOUNTAINS = [
    {name: "Kilimanjaro", height: 5895, country: "Tanzania"},
    {name: "Everest", height: 8848, country: "Nepal"},
    {name: "Mount Fuji", height: 3776, country: "Japan"},
    {name: "Mont Blanc", height: 4808, country: "Italy/France"},
    {name: "Vaalserberg", height: 323, country: "Netherlands"},
    {name: "Denali", height: 6168, country: "United States"},
    {name: "Popocatepetl", height: 5465, country: "Mexico"}
  ];
/**
 * 思路：1.先将所给的对象数组转化为数组数组，提取标题和内容，将属性值和属性分离。
 * 参数baseArr=初始数组【MOUNTAINS】
 * Separate(baseArr)=>[[name,height,country],['Kilimanjaro',5895,'Tanzania'],[...],...]=>changedArr
 */
function Separate(baseArr){
    let headerArr=Object.keys(baseArr[0]);
    let contentArr=baseArr.map(function(row){
       return headerArr.reduce(function(accumulate,headerName){
           accumulate.push(row[headerName]);
           return accumulate;
        },[]);
    });
    return [headerArr].concat(contentArr);
}
let changedArr=Separate(MOUNTAINS);
// console.log(Separate(MOUNTAINS))
/**
 * 2.求出每一列里面最长的元素的长度[列宽]
 * 参数changedArr=changedArr
 * colWidth(changedArr)=>[number,nuber,number,...]=>colwidthArr
 */
function colWidth(changedArr){
    return changedArr[0].map(function(_,index){
        return changedArr.reduce(function(accumulate,row){
                if(typeof row[index] ==='number'){
                    row[index]=row[index].toString();
                }
                accumulate=Math.max(accumulate,row[index].length);
                return accumulate;
        },0)
    });
}
let colWidthArr=colWidth(changedArr);
//[12,6,13]
// console.log(colWidth(changedArr));
/**
 * 3.根据colWidthArr将changedArr的每一个元素转化为格式化的字符串
 * 参数changedArr=changedArr
 * format(changedArr,colWidthArr)=>[['name         ','height','country      '],
 *                      ['Kilimanjaro  ','5895  ','Tanzania     '],
 *                      [...],....]
 *                  =>formatArr
 */
function format(changedArr,colwidthArr){
    return changedArr.map(function(row){
        colWidthArr.forEach(function(len,index){
           while(row[index].length<len){
                  row[index]=row[index]+' ' ;
           }
        });
        return row;
    });
}
let formatArr=format(changedArr,colWidthArr);
// console.log(formatArr)
/**formatArr=>[ 
 *[ 'name        ', 'height', 'country      ' ],
  [ 'Kilimanjaro ', '5895  ', 'Tanzania     ' ],
  [ 'Everest     ', '8848  ', 'Nepal        ' ],
  [ 'Mount Fuji  ', '3776  ', 'Japan        ' ],
  ........
                                              ]
 */
/**4.给第一行加上分割线
 * divLine(fomatArr,lineSymbol,needLine)=>[
 *                         [
 *                          [ 'name        ', 'height', 'country      ' ],
 *                          [ '------------', '------', '-------------' ]
 *                         ],
 *                         [ 'Kilimanjaro ', '5895  ', 'Tanzania     ' ],
 *                         [ 'Everest     ', '8848  ', 'Nepal        ' ],
 *                         [ 'Mount Fuji  ', '3776  ', 'Japan        ' ],
 *                         ......
 *                                                                      ]
 *                  =>finalArr
 * 
 * 
 */
function divLine(fomatArr,lineSymbol,needLine){
    let divLineArr=[];
        formatArr[0].forEach(function(element,index){
            divLineArr.push(lineSymbol);
            while(divLineArr[index].length<element.length){
                divLineArr[index]=divLineArr[index]+lineSymbol;
            }
         });
    return formatArr.map(function(row,index,collection){
        if(index===needLine){
         row=[collection[index]].concat([divLineArr]);
        }
        return row;
    });
}
let finalArr=divLine(formatArr,'-',0);
/**
 * 5.求每一行的行高
 * rowHeight(finalArr)=>[number,number,number,...]=>rowHeightArr
 *
 */
function rowHeight(finalArr){
    return finalArr.reduce(function(accumulate,element){
           if(typeof element[0] === 'object'){
               accumulate.push(element.length);
           }else{
               accumulate.push(1);
           }
           return accumulate;
        },[]);
}
// console.log(rowHeight(finalArr));
let rowHeightArr=rowHeight(finalArr);

/**
 * 6. 将每一个数组元素转化为字符串
 * 参数row=finalArr的每一个元素
 * 参数oneRowHeight=row所对应的行高
 * drawRow(row,oneRowHeight)=>result
 */
function drawRow(row,oneRowHeight){
    let str='';
    if(oneRowHeight>1){
       str = row.map(function(element){
            return element.join(' ');
            }).join('\n');
    }else{
      str = row.join(' ')
    }
    return str;
}

/**
 * 7.对finalArr
 * drawTable(finalArr,rowHeight)
 */
function drawTable(finalArr,rowHeightArr){
   return finalArr.reduce(function(accumulate,row,index){
       return accumulate+drawRow(row,rowHeightArr[index])+'\n';
    },'');
}
console.log(drawTable(finalArr,rowHeightArr));