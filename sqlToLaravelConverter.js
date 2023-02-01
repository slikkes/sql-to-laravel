class sqlToLaravel{
  constructor(){
    this.converters = {
      select: new SelectConverter(),
      from: new FromConverter(),
      joins: new JoinConverter(),
      wheres: new WhereConverter(),
      groupBy: new GroupByConverter(),
      orderBy: null,
    }
  }

  convertSqlToLaravel(sqlStr){
    sqlStr = sqlStr.replace(/[\n\t]/g, ' ')
    .replace(/ {2,}/g, ' ')
    .replaceAll('`','')
    .trim()

    let parts = {
      from: this._parseFrom(sqlStr),
      select: this._parseSelect(sqlStr),
      joins: this._parseJoins(sqlStr),
      wheres: this._parseWhere(sqlStr),
      groupBy: this._parseGroupBy(sqlStr),
      orderBy: this._parseOrderBy(sqlStr),
    }

    // console.log(parts);

    return Object.entries(parts)
    .map(part => {
      if(!part[1]){
        return null;
      }
      return this.converters[part[0]]?.convert(part[1])
    })
    .join("\n");
  }

  _parseSelect(str){
    if( !str.toLowerCase().includes('select')){
      return null;
    }
    if(/select.*from/i.test(str)){
      return str.match(/select.*from/i)[0].replace(/from/i,"").trim()
    }

    return str;
  }
  _parseFrom(str){
    if( !str.toLowerCase().includes('from')){
      return null;
    }

    if(/from.*join/i.test(str)){

      return str.match(/from.*?join/i)[0]
      .replace(/(inner|left|right) /i,"")
      .replace(/join/i,'')
      .trim()
    }
    if(/from.*where/i.test(str)){
      return str.match(/from.*where/i)[0].replace("where","").trim()
    }

    return str;
  }
  _parseJoins(str){
    if( !str.toLowerCase().includes('join')){
      return null;
    }

    if(/join.*where/i.test(str)){
      return str.match(/(inner|left|right) join.*where/i)[0]
      .replace(/where/i,"").trim()
    }

    if(/from.*group by/s.test(str)){
      return str.match(/(inner|left|right) join.*group by/s)[0]
      .replace(/group b/i,"").trim()
    }

    return str;
  }
  _parseWhere(str){
    if( !str.toLowerCase().includes('where')){
      return null;
    }

    let ret = str.match(/where.*(group by|order by)/i);
    if(ret){
      return ret[0].replace(/(group by|order by)/i,"")
      .trim()
    }

    return str.match(/where.*/i)[0];
  }
  _parseGroupBy(str){
    if( !str.toLowerCase().includes('group by')){
      return null;
    }

    let ret = str.match(/group by.*(having|order by)/i);
    if(ret){
      return ret[0].replace(/(having|order by)/i,"")
      .trim()
    }

    return str.match(/group by.*/i)[0];
  }
  _parseOrderBy(str){}
}
