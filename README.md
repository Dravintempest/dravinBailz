# dravinBailz

WhatsApp Web library based on Baileys.

## Install

```bash
npm install github:Dravintempest/dravinBailz
```

## Auth (SQLite)

```js
import makeWASocket, { useSqliteAuthState } from 'dravinBailz'

const { state, saveCreds, close } = await useSqliteAuthState('./auth')
const sock = makeWASocket({ auth: state })
sock.ev.on('creds.update', saveCreds)
```

## Secret / Protected send

```js
// secret: only to recipient primary device
await sock.sendMessage(jid, { text: 'rahasia' }, { isSecret: true })

// protected: skip recipient linked devices
await sock.sendMessage(jid, { text: 'protected' }, { protected: true })
```
