function rowHeights(rows) {
    return rows.map(function(row) {
      return row.reduce(function(max, cell) {
        return Math.max(max, cell.minHeight());
      }, 0);
    });
  }
  /*得到每一行里最长列的长度，返回的是数组,rows[0]返回的最长列长度加了1*//*
  行高 */
  function colWidths(rows) {
    return rows[0].map(function(_, i) {
      return rows.reduce(function(max, row) {
        return Math.max(max, row[i].minWidth());
      }, 0);
    });
  }
  /*得到每一列所有行里最宽的字符串的宽度，返回的是数组*/
  /**
  *列宽
   */
  function drawTable(rows) {
    var heights = rowHeights(rows);
    console.log(heights)
    var widths = colWidths(rows);
  
    function drawLine(blocks, lineNo) {
      let result =blocks.map(function(block) {
        return block[lineNo];
      }).join(" ");
      return result;
    }
  /*添加分隔符------*/
    function drawRow(row, rowNum) {
      var blocks = row.map(function(cell, colNum) {
        return cell.draw(widths[colNum], heights[rowNum]);
      });
      return blocks[0].map(function(_, lineNo) {
        return drawLine(blocks, lineNo);
      }).join("\n");
    }
  /*添加字符串*/
    return rows.map(drawRow).join("\n");
  }
  function repeat(string, times) {
    var result = "";
    for (var i = 0; i < times; i++)
      result += string;
    return result;
  }
  /**
   *返回times个string拼接的字符串
   */
  function TextCell(text) {
    this.text = text.split("\n");
  }
  /**
   * 以\n分开，返回一个数组
   */
  TextCell.prototype.minWidth = function() {
    return this.text.reduce(function(width, line) {
      return Math.max(width, line.length);
    }, 0);
  };
  /**
   * 返回数组里最长的字符串
   */
  TextCell.prototype.minHeight = function() {
    return this.text.length;
  };
  /**
   * 返回数组的长度
   */
  TextCell.prototype.draw = function(width, height) {
    var result = [];
    for (var i = 0; i < height; i++) {
      var line = this.text[i] || "";
      result.push(line + repeat(" ", width - line.length));
    }
    return result;
  };
  /*生成每一行 【字符串和空格的结合】*/
  function UnderlinedCell(inner) {
    this.inner = inner;
  }
  UnderlinedCell.prototype.minWidth = function() {
    return this.inner.minWidth();
  };
  /**
   * 返回inner里最长的字符串
   */
  UnderlinedCell.prototype.minHeight = function() {
    return this.inner.minHeight() + 1;
  };
  /**
   * 返回inner数组的长度+1
   */
  UnderlinedCell.prototype.draw = function(width, height) {
    return this.inner.draw(width, height - 1)
      .concat([repeat("-", width)]);
  };
  function dataTable(data) {
    var keys = Object.keys(data[0]);
    var headers = keys.map(function(name) {
      return new UnderlinedCell(new TextCell(name));
    });
    var body = data.map(function(row) {
      return keys.map(function(name) {
        return new TextCell(String(row[name]));
      });
    });
    return [headers].concat(body);
  }
  /**
   * [ [ UnderlinedCell { inner: [Object] },
    UnderlinedCell { inner: [Object] },
    UnderlinedCell { inner: [Object] } ],
  [ TextCell { text: [Object] },
    TextCell { text: [Object] },
    TextCell { text: [Object] } ],
    ......]
   */
  /**
   * header:[[name,height,country]]
   * 其中每个元素都有UnderlineCell类和TextCell类的所有属性和方法
   * body:[['Kilimajaro','5895','Tanzania'],['Eversest','8848','Nepal'],[...],...]
   * 其中每一个元素数组里的元素都有TextCell类的所有属性和方法
   * UnderlineCell(inner){
   * inner:inner;
   * minWidth();
   * minHeight();
   * draw(width,height);
   * }
   * TextCell(text){
   * text:[由text以\n为拆分点拆分的]
   * minWidth();
   * minHeigth();
   * draw(width,height)
   * }
   */
  /**
   * 思路：
   * 首先第一个函数生成 [[name,height,country],['Kilimajaro','5895','Tanzania'],['Eversest','8848','Nepal'],[...],...]
   */
  var MOUNTAINS = [
    {name: "Kilimanjaro", height: 5895, country: "Tanzania"},
    {name: "Everest", height: 8848, country: "Nepal"},
    {name: "Mount Fuji", height: 3776, country: "Japan"},
    {name: "Mont Blanc", height: 4808, country: "Italy/France"},
    {name: "Vaalserberg", height: 323, country: "Netherlands"},
    {name: "Denali", height: 6168, country: "United States"},
    {name: "Popocatepetl", height: 5465, country: "Mexico"}
  ];
  
  drawTable(dataTable(MOUNTAINS));
  // console.log(drawTable(dataTable(MOUNTAINS)));
  // → name         height country
  //   ------------ ------ -------------
  //   Kilimanjaro  5895   Tanzania
  //   … etcetera
  /*输入的是个对象数组 */