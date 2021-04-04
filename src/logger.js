class logger{
    static logs = []
    static log = (text) =>{
        this.logs.push({"type":"log","text":text})
    }
    static warn = (text) =>{
        this.logs.push({"type":"warn","text":text})
    }
    static show = () =>{
        this.logs.forEach(log => {
            console[log.type](log.text)
        });
    }
}