getRandInt = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}
class Color {
    constructor(r,g,b,a){
        a = a?a:255
        return {"r":r,"g":g,"b":b,"a":a}
    }
}