class WhereConverter{
  convert(whereString) {
    return whereString
    .replace(/where/i,'')
    .trim()
    .split(/and/i)
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
    .join("\n")
  }

  _generateLaravelStatement(selectItems){
    let str = "->select(";

    str += selectItems.map(i=>i.raw ? i.s : `'${i.s}'`)
    .join(",")

    return str +")"
  }


}
