class SelectConverter{
  convert(selectString) {
    let selectItems = selectString
    .replace('select','')
    .trim()
    .split(',')
    .map(item=>{

      let s = item.trim();
      if(/^(\w+\.){0,}\w+( as \w+){0,}$/i.test(s)){
        // simple item
        return {s, raw: false};
      }

      return {
        s:"\DB::raw('" + s + "')",
        raw: true
      };
    });

    return this._generateLaravelStatement(selectItems)
  }

  _generateLaravelStatement(selectItems){
    let str = "->select(";

    str += selectItems.map(i=>i.raw ? i.s : `'${i.s}'`)
    .join(",")

    return str +")"
  }


}
