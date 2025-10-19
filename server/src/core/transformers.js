module.exports = class {
    #data;
    constructor(resource){
        if(Array.isArray(resource)){
            this.#data = resource.map((instance) => {
                return this.response(instance);
            })
        } else {
            this.#data = this.response(resource);
        }
        return this.#data;
    }
}