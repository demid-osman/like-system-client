# like-system-client

Running script:

```
dcl start
```

I used sceneMessageBus for better traffic optimization, when clicking on the heart, the data is not rendered in a new way, but only sent to the server, I think this is the perfect solution.

Since TextShape only works with strings, I implemented a converter:

```ts
let value = counter.getComponent(TextShape).value
let number = Number(value)
number++
value = number.toString()
counter.getComponent(TextShape).value = value
```

You can change the offset, default value, text color, font size and hover text:

```ts
offset = { x: 0, y: 1.5, z: 0 }
defaultValue: string = '0'
defaultColor: Color3 = Color3.White()
defaultSize: number = 6
hoverText: string = 'Like'
```

The server-side to which you can make a request is here: [like-system-server](https://github.com/demid-osman/like-system-server) 