class FromConverter{
  convert(joinString) {
    let table  = joinString.replace(/from/i, '')
    .trim();

    return "\DB::table('" + table + "')";
  }
}
