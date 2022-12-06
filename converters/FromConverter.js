class FromConverter{
  convert(joinString) {
    let table  = joinString.replace(/from/i, '')
    .trim();

    return "table('" + table + "')";
  }
}
