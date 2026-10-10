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

## antiPeek (relay option)

Mask view-once content when relaying/sending.

```js
await sock.sendMessage(jid, content, { antiPeek: true })
// or
await sock.relayMessage(jid, message, { antiPeek: true })
```

When set, view-once payload is replaced with text `Dravin Bailz` before send.

## buttonLocation

```js
await sock.sendMessage(jid, {
  buttonLocation: {
    latitude: 0,
    longitude: 0,
    name: 'tes',
    address: 'DravinBailz',
    jpegThumbnail: thumb, // Buffer | path | url
    text: 'menu text',
    footer: 'footer',
    listButtonText: '☰ All Menu',
    listSectionTitle: 'Main Menu',
    listMenu: [
      { id: '.menu', title: 'All Menu', description: 'Lihat semua fitur' }
    ],
    extraButtons: [
      { id: '.owner', displayText: 'Owner' }
    ]
  }
}, { quoted: m })
```
