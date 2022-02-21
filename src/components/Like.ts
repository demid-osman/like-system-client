const sceneMessageBus = new MessageBus()
const serverUrl = 'http://localhost/api/'

export class Like extends Entity {
    offset = { x: 0, y: 1.5, z: 0 }
    defaultValue: string = '0'
    defaultColor: Color3 = Color3.White()
    defaultSize: number = 6
    hoverText: string = 'Like'
    /**
     * Create unique like counter
     * @constructor
     * @param {string} model - GLTFShape
     * @param {TransformConstructorArgs} transform - transform args
     * @param {string} id - ID
     * @param {boolean} isBillboard - counter face the camera in any moment
     */
    constructor(
        model: string,
        transform: TranformConstructorArgs,
        id: string,
        isBillboard?: boolean | false,
    ) {
        super()
        engine.addEntity(this)
        this.addComponent(new GLTFShape(model))
        this.addComponent(new Transform(transform))

        // Value counter entity
        const counter = new Entity()
        counter.addComponent(new Transform({ position: new Vector3(this.offset.x, this.offset.y, this.offset.z) }))
        counter.addComponent(new TextShape(this.defaultValue))
        counter.getComponent(TextShape).color = this.defaultColor
        counter.getComponent(TextShape).fontSize = this.defaultSize
        counter.setParent(this)

        // Billboard
        isBillboard ? counter.addComponent(new Billboard()) :

        // Add like after click
        this.addComponent(new OnPointerDown(
            () => {
                sceneMessageBus.emit('counterUpdate', {})
                this.sendRequest(id)
            }, 
            { hoverText: this.hoverText }
        ));

        // Get current value
        (async function () {
            let url = serverUrl + id
            const res = await fetch(url)
            const data = await res.json()
            counter.getComponent(TextShape).value = data.value
        }())
    
        // Optimization
        sceneMessageBus.on('counterUpdate', () => {
            let value = counter.getComponent(TextShape).value
            let number = Number(value)
            number++
            value = number.toString()
            counter.getComponent(TextShape).value = value
        })
    }

    private async sendRequest(id: string) {
        try {
            const url = serverUrl + id 
            const req = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' } })
            return await req.json()
        } catch (e: any) {
            log('Like.ts (sendRequest): ', e.message)
        }
    }
}