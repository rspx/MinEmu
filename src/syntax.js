class syntaxHighlighter{
    static colors = {
        "instruction": "#c586c0",
        "keyword" : "#dcdcaa",
        "number" :  "#b5cea8",
        "bool":     "#569cd6",
        "devices": "#4ec9b0",
        "default": "#9cdcfe",
        "string": "#ce9178"
    }
    static keywords = [
        "color","clear","rect","line","equal","notEqual","lessThan","lessThanEq","greaterThan",
        "greaterThanEq","strictEqual","always","add","sub","mul","div","idiv","mod","pow","land",
        "shl","shr","or","and","xor","not","max","min","rand"
    ]
    static getColor(text){
        if (text == "true" || text == "false"){
            return this.colors.bool
        }
        if (text in InstructionHandler){
            return this.colors.instruction
        }
        if (isFinite(text)){
            return this.colors.number
        }
        for (let i = 0;i<core.suportedDevices.length;i++){
            if (text.includes(core.suportedDevices[i])){
                return this.colors.devices
            }
        }
        for (let i = 0;i<this.keywords.length;i++){
            if (text == this.keywords[i]){
                return this.colors.keyword
            }
        }
        return this.colors.default
    }
}