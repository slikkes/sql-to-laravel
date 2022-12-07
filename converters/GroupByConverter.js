class GroupByConverter{
  convert(groupByString) {
    return groupByString
    .replace(/group by/i,'')
    .trim()
    .split(',')
    .map(item=>{

      let s = item.trim();
      if(/^(\w+\.){0,}\w+/.test(s)){
        return `->groupBy('${s}')`;
      }

      return `->groupBy(\DB::raw('${s}'))`;
    })
    .join("")
  }

}
