let joinConverter = {
    params: {},
    joinString: "",
    convertJoin(joinString) {
        this.params = {};
        this.joinString = joinString.replace(/[\n\t]/g, ' ')
            .replace(/ {2,}/g, ' ')
            .trim();

        try {
            this._processTypes();
            this._procesTableName()
            this._procesOnClauses()
            this._processAlias()

        } catch (e) {
            console.error(e);
            return ;
        }

        return this._generateLaravelStatement()
    },

    _processTypes() {

        switch (true) {
            case /^(inner join|join)/i.test(this.joinString): {
                this.params.type = "inner"
                break;
            }
            case /^left join/i.test(this.joinString): {
                this.params.type = "left"
                break;
            }
            case /^right join/i.test(this.joinString): {
                this.params.type = "left"
                break;
            }
        }

    },
    _procesTableName() {
        this.params.table = this.joinString.match(/on .*? /i)[0]
            .replace(/(on | )/gi, '')
    },
    _procesOnClauses(){
        let on = this.joinString.replace(/^.* on /i, "").replace(/ as .*$/i, "")
        if ((on.match(/and/gi) || []).length > 0) {
            this.params.simple = false;
            this.params.on = on.replaceAll(" ", "").split(/and/i)
                .map(i => i.replaceAll(" ", "").split("="));
        } else {
            this.params.simple = true;
            this.params.on = [on.replaceAll(" ", "").split("=")];
        }
    },
    _processAlias(){
        let alias = this.joinString.match(/ as .*?$/)
        if(alias){
            this.params.as = alias[0].replace(" as ", "")
        }
    },
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