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

## Proto

WAProto `2.3000.1049983640` (baron-baileys-v2).
