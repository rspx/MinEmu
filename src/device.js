class device {
    constructor (id,properties){
        properties = properties?properties:[]
        this.id = id
        this.properties = properties
        this.properties.push({ //Defualt properties
        "name":"enabled",
        "value":1,
        "readOnly":false})
        core.devices.push(this)
    }
    propertyExists = (propertyname) => {
        for (let i = 0; i < this.properties.length; i++) {
            if (this.properties[i].name == propertyname){
                return true
            }
        }
        return false
    }
    propertyReadOnly = (propertyname) => {
        for (let i = 0; i < this.properties.length; i++) {
            if (this.properties[i].name == propertyname){
                return this.properties[i].readOnly
            }
        }
        return true
    }
    getProperty = (property) => {
        property = property.slice(1)
        if (!this.propertyExists(property)){
            return null
        }
        for (let i = 0; i < this.properties.length; i++) {
            if (this.properties[i].name == property){
                return this.properties[i].value
            }
        }
        return null
    }
    setProperty = (property,value) => {
        property = property.slice(1)
        if (!this.propertyExists(property)){
            logger.warn(`Trying to set unknown property ${property} of ${this.toString()+this.id} `)
            return false
        }
        if (this.propertyReadOnly(property)){
            logger.warn(`Trying to set readonly property ${property} of ${this.toString()+this.id} `)
            return false
        }
        for (let i = 0; i < this.properties.length; i++) {
            if (this.properties[i].name == property){
                if (this.properties[i].name != "enabled"){
                    this.onPropertieChanged(property,value)
                    this.properties[i].value = value
                    return true
                }
                this.properties[i].value = value
                property == "enabled" && value == 0 && (
                    this.onDisable()
                )
                property == "enabled" && value == 1 && (
                    this.onEnabled()
                )
                return true
            }
        }
        return false
    }
    onPropertieChanged = (name,value) =>{

    }
    onDisable = () => {

    }
    onEnabled = () => {

    }
}