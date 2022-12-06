class sqlToLaravel{
  constructor(){
    this.converters = {
      select: null,
      from: null,
      joins: new JoinConverter(),
      wheres: null,
      groupBy: null,
      orderBy: null,
    }
  }

  convertSqlToLaravel(sqlStr){
    sqlStr = sqlStr.replace(/[\n\t]/g, ' ')
    .replace(/ {2,}/g, ' ')
    .trim()

    let parts = {
      select: this._parseSelect(sqlStr),
      from: this._parseFrom(sqlStr),
      joins: this._parseJoins(sqlStr),
      wheres: this._parseWhere(sqlStr),
      groupBy: this._parseGroupBy(sqlStr),
      orderBy: this._parseOrderBy(sqlStr),
    }

    console.log(parts);

    return Object.entries(parts)
    .map(part => this.converters[part[0]]?.convert(part[1]))
    .join("");
  }

  _parseSelect(str){
    if( !str.toLowerCase().includes('select')){
      return null;
    }
    if(/select.*from/i.test(str)){
      return str.match(/select.*from/i)[0].replace("from","").trim()
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
    if( !str.includes('join')){
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
  _parseWhere(str){}
  _parseGroupBy(str){}
  _parseOrderBy(str){}
}
