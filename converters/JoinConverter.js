class JoinConverter{
  convert(joinString) {
    return joinString.trim()
    .split(" ")
    .reduce((carry, item)=>{

      if(["inner", "left", "right"].includes(item.toLowerCase())){
        carry.push(item.toLowerCase());
        return carry;
      }

      if(item.toLowerCase() === "join" && !["inner", "left", "right"].includes(carry[carry.length-1])){
        carry.push(item.toLowerCase());
        return carry;
      }

      carry[carry.length-1] += " " + item
      return carry;
    },[])
    .map(i=>{
      try {
        this.params = {};

        this._processTypes(i);
        this._procesTableName(i)
        this._procesOnClauses(i)
        this._processAlias(i)

        return this._generateLaravelStatement()
      } catch (e) {
        console.warn(`cannot parse '${i}'`);
        return i;
      }
    }).join("\n")


  }
  _validate(){

  }

  _processTypes(joinString) {

    switch (true) {
      case /^(inner join|join)/i.test(joinString): {
        this.params.type = "inner"
        break;
      }
      case /^left join/i.test(joinString): {
        this.params.type = "left"
        break;
      }
      case /^right join/i.test(joinString): {
        this.params.type = "left"
        break;
      }
    }

  }
  _procesTableName(joinString) {
    this.params.table = joinString.match(/join .*? on/i)[0]
    .replace(/(join | on)/gi,"")
  }
  _procesOnClauses(joinString){
    let on = joinString.replace(/^.* on /i, "").replace(/ as .*$/i, "")
    if ((on.match(/and/gi) || []).length > 0) {
      this.params.simple = false;
      this.params.on = on.replaceAll(" ", "").split(/and/i)
      .map(i => i.replaceAll(" ", "").split("="));
    } else {
      this.params.simple = true;
      this.params.on = [on.replaceAll(" ", "").split("=")];
    }
  }
  _processAlias(joinString){
    let alias = joinString.match(/ as .*?$/)
    if(alias){
      this.params.as = alias[0].replace(" as ", "")
    }
  }
  _generateLaravelStatement(){
    let str = "->";
    str += {inner: "join",left: "leftJoin",right: "rightJoin"}[this.params.type];
    str += `('${this.params.table}`;

    if(!!this.params.as){
      str += ` as ${this.params.as}`;
    }
    str +=  "', ";

    if(this.params.simple){
      str += `'${this.params.on[0][0]}','${this.params.on[0][1]}'`
    }else{
      str += 'function($query){'
      str += '$query'
      str += this.params.on.map(i=>`->on('${i[0]}','${i[1]}')`).join('')
      str += ';}'
    }

    str += ')';

    return str;
  }


}
