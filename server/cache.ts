import NodeCache from "node-cache"

export class Cache {
    private cache : NodeCache | undefined

    const getInstance = () => {
        if (!this.cache) {
            this.cache = new NodeCache( { stdTTL: 100, checkperiod: 120 } )
        }

        return this.cache
    }
}