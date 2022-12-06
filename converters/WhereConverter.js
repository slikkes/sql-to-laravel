class WhereConverter{
  convert(whereString) {
    return whereString
    .replace('where','')
    .trim()
    .split('and')
    .map(item=>{

      let s = item.trim();
      if(/(=|<>|<=|=>)/.test(s)){
        let parts = s.replace(/[\n\t ]/g, '').split(/(=|<>|<=|=>)/)
        let ret = `->where('${parts[0]}'`;

        if(parts[1] != "="){
          ret += `,'${parts[1]}'`
        }

        return ret +  `,${parts[2]})`
      }

      return `->whereRaw('${s}')`;
    })
    .join("")
  }

  _generateLaravelStatement(selectItems){
    let str = "->select(";

    str += selectItems.map(i=>i.raw ? i.s : `'${i.s}'`)
    .join(",")

    return str +")"
  }


}
