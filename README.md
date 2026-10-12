# dravinBailz

WhatsApp Web library (Baileys-based).  
Package: `dravinBailz` · WAProto `2.3000.1049983640`

```bash
npm install github:dravin/dravinBailz
# atau extract zip lalu:
npm install ./dravin
```

Node **≥ 20**. SQLite auth butuh **Node ≥ 22.5** (`node:sqlite`).

---

## Quick start

```js
import makeWASocket, {
  useMultiFileAuthState,
  useSqliteAuthState,
  DisconnectReason
} from 'dravinBailz'

const { state, saveCreds } = await useMultiFileAuthState('./auth')
// atau: const { state, saveCreds, close } = await useSqliteAuthState('./auth')

const sock = makeWASocket({
  auth: state,
  printQRInTerminal: true,
  browser: ['Dravin', 'Chrome', '1.0.0']
})

sock.ev.on('creds.update', saveCreds)
sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
  if (connection === 'close') {
    const code = lastDisconnect?.error?.output?.statusCode
    if (code !== DisconnectReason.loggedOut) {
      // reconnect
    }
  }
})
```

---

## Auth

### Multi-file

```js
const { state, saveCreds } = await useMultiFileAuthState('./auth')
```

### SQLite (Node 22.5+)

```js
const { state, saveCreds, close } = await useSqliteAuthState('./auth', {
  fileName: 'auth.db',
  migrateFromFolder: './auth-folder' // optional migrate dari multi-file
})
sock.ev.on('creds.update', saveCreds)
// shutdown: close()
```

---

## Text & basic

```js
await sock.sendMessage(jid, { text: 'hello' })

// mention (nama tampil sesuai kontak lokal penerima)
await sock.sendMessage(jid, {
  text: 'halo @628xxxx',
  mentions: ['628xxxx@s.whatsapp.net']
})

// reply
await sock.sendMessage(jid, { text: 'ok' }, { quoted: m })

// react
await sock.sendMessage(jid, {
  react: { text: '👍', key: m.key }
})

// edit
await sock.sendMessage(jid, { text: 'edited', edit: sent.key })

// delete for everyone
await sock.sendMessage(jid, { delete: sent.key })
```

---

## Media

```js
await sock.sendMessage(jid, { image: { url: './a.jpg' }, caption: 'cap' })
await sock.sendMessage(jid, { video: { url: './v.mp4' }, caption: 'cap' })
await sock.sendMessage(jid, { audio: { url: './a.mp3' }, mimetype: 'audio/mp4' })
await sock.sendMessage(jid, { audio: { url: './ptt.ogg' }, ptt: true })
await sock.sendMessage(jid, { document: { url: './f.pdf' }, fileName: 'f.pdf', mimetype: 'application/pdf' })
await sock.sendMessage(jid, { sticker: { url: './s.webp' } })
```

Buffer juga bisa: `{ image: buffer }`.

---

## Location / contact / product

```js
await sock.sendMessage(jid, {
  location: { degreesLatitude: -6.2, degreesLongitude: 106.8, name: 'Jakarta', address: 'ID' }
})

await sock.sendMessage(jid, {
  contacts: {
    displayName: 'Name',
    contacts: [{ vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:Name\nTEL:+628xxx\nEND:VCARD' }]
  }
})
```

---

## buttonLocation

Interactive location header + list + quick reply.

```js
await sock.sendMessage(jid, {
  buttonLocation: {
    latitude: -6.2,
    longitude: 106.8,
    name: 'Base',
    address: 'Jakarta',
    jpegThumbnail: thumbBuffer, // Buffer | path | url
    text: 'Pilih menu',
    footer: 'dravinBailz',
    listButtonText: '☰ Menu',
    listSectionTitle: 'Main',
    listMenu: [
      { id: '.menu', title: 'All Menu', description: 'List fitur' }
    ],
    extraButtons: [
      { id: '.owner', displayText: 'Owner' }
    ]
  }
}, { quoted: m })
```

---

## Interactive / buttons

```js
// native flow / interactive buttons (tergantung client support)
await sock.sendMessage(jid, {
  text: 'Pilih',
  footer: 'footer',
  interactiveButtons: [
    {
      name: 'quick_reply',
      buttonParamsJson: JSON.stringify({ display_text: 'OK', id: 'ok' })
    }
  ]
})

// legacy buttons
await sock.sendMessage(jid, {
  text: 'Pilih',
  footer: 'footer',
  buttons: [
    { buttonId: 'a', buttonText: { displayText: 'A' }, type: 1 }
  ]
})
```

---

## Poll / event / album (jika didukung path generate)

```js
await sock.sendMessage(jid, {
  poll: {
    name: 'Vote',
    values: ['A', 'B', 'C'],
    selectableCount: 1
  }
})
```

---

## View once

```js
await sock.sendMessage(jid, {
  image: { url: './a.jpg' },
  viewOnce: true,
  caption: 'sekali lihat'
})
```

---

## Device targeting (relay options)

| Option | Effect |
|--------|--------|
| `isSecret: true` | Hanya primary device lawan |
| `protected: true` | Skip linked devices lawan |
| `me: true` | Hanya device sendiri |
| `noSelfSync: true` | Jangan sync ke device WA lu yang lain |

```js
await sock.sendMessage(jid, { text: 'secret' }, { isSecret: true })
await sock.sendMessage(jid, { text: 'protected' }, { protected: true })
await sock.sendMessage(jid, { text: 'no sync' }, { noSelfSync: true })
```

---

## SPR — sendPrivateRelay

Private relay ke **satu user** (1:1), fanout ke device dia, default `noSelfSync: true`.

### v1 — content apa adanya

```js
await sock.sendPrivateRelay('628xxxx@s.whatsapp.net', { text: 'halo' })
// alias
await sock.spr(jid, { conversation: 'halo' })
await sock.spr(jid, 'halo plain string')
```

### v2 — teks + mentions

```js
await sock.sendPrivateRelayV2(jid, null, {
  text: 'halo @628yyyy',
  mentions: ['628yyyy@s.whatsapp.net']
})
// alias: sock.sprV2(...)
```

Return: `{ messageId, jid, version }`.

---

## SPBR — sendBatchPrivateRelay

Batch private relay. Default max **25** target (`maxTargets`).

### v1 — content sama, sequential

```js
await sock.sendBatchPrivateRelay(
  ['628aaa@s.whatsapp.net', '628bbb@s.whatsapp.net'],
  { text: 'broadcast privat' },
  { delayMs: 400 }
)
// alias: sock.spbr(...)
```

### v2 — teks beda per target

```js
await sock.sendBatchPrivateRelayV2({
  '628aaa@s.whatsapp.net': 'halo A',
  '628bbb@s.whatsapp.net': 'halo B'
}, { delayMs: 400 })

// atau array
await sock.spbrV2([
  { jid: '628aaa@s.whatsapp.net', text: 'halo A' },
  { jid: '628bbb@s.whatsapp.net', text: 'halo B', mentions: ['628ccc@s.whatsapp.net'] }
])
```

### v3 — concurrent chunked

```js
await sock.sendBatchPrivateRelayV3(
  [
    { jid: '628aaa@s.whatsapp.net', text: 'A' },
    { jid: '628bbb@s.whatsapp.net', content: { text: 'B' } }
  ],
  {
    concurrency: 3,
    delayBetweenChunksMs: 600,
    maxTargets: 25
  }
)
// alias: sock.spbrV3(...)
```

Return: `{ version, total, results: [{ jid, ok, messageId?, error? }] }`.

**Catatan:** SPR/SPBR kirim sebagai **chat 1:1** ke tiap target, bukan group skmsg. Cocok buat DM massal terbatas — jangan di-spam (ban risk).

---

## relayMessage (low-level)

```js
await sock.relayMessage(jid, {
  extendedTextMessage: { text: 'raw' }
}, {
  messageId: 'CUSTOMID',
  noSelfSync: true,
  isSecret: false,
  protected: false
})
```

---

## Status / story

```js
await sock.sendMessage('status@broadcast', {
  text: 'status'
}, {
  statusJidList: ['628xxxx@s.whatsapp.net'],
  backgroundColor: '#111111',
  font: 0
})
```

---

## Groups (umum)

```js
await sock.groupMetadata(jid)
await sock.groupParticipantsUpdate(jid, [userJid], 'add') // add|remove|promote|demote
await sock.groupUpdateSubject(jid, 'Nama Baru')
await sock.groupSettingUpdate(jid, 'announcement') // atau 'not_announcement'
```

---

## Events penting

```js
sock.ev.on('messages.upsert', ({ messages, type }) => { })
sock.ev.on('messages.update', updates => { })
sock.ev.on('messages.delete', item => { })
sock.ev.on('message-receipt.update', receipts => { })
sock.ev.on('presence.update', p => { })
sock.ev.on('contacts.upsert', c => { })
sock.ev.on('chats.upsert', c => { })
sock.ev.on('groups.update', u => { })
sock.ev.on('group-participants.update', u => { })
sock.ev.on('connection.update', u => { })
sock.ev.on('creds.update', saveCreds)
```

---

## Tentang antiPeek / anti-CRM

**Tidak di-include.**

Alasan: CRM (`.insp` / store protobuf) baca **payload yang sama** dengan yang diterima client. Tidak ada metadata rahasia yang bisa bikin:

- lawan tetap baca teks asli, **dan**
- CRM lihat teks palsu

pada message yang sama di wire. Kalau konten diubah sebelum `relayMessage`, penerima juga dapat konten ubahan.

Yang bisa (dan sudah ada):

| Fitur | Kegunaan |
|--------|----------|
| `isSecret` / `protected` | Batasi device mana yang nerima |
| `noSelfSync` | Jangan muncul di device WA lu sendiri |
| SPR/SPBR | Kirim privat per user, bukan ke grup publik |

---

## Proto

WAProto **2.3000.1049983640** (diselaraskan dari baron-baileys-v2).  
Client version: `[2, 3000, 1049983640]`.

Termasuk field baru di schema (decode-ready), misalnya terkait location request / bot participant — helper send khusus belum tentu ada untuk semua type.

---

## License

MIT (Baileys lineage / WhiskeySockets contributors + dravinBailz modifications).
