import makeWASocket from './Socket/index.js';
import chalk from "chalk";
console.log(chalk.hex("#7c6cff")(`
█▀▄ █▀█ ▄▀█ █░█ █ █▄░█
█▄▀ █▀▄ █▀█ ▀▄▀ █ █░▀█
`));
console.log(chalk.hex("#7c6cff")("dravinBailz — WhatsApp Web library\n"));
console.log(chalk.gray("Stay updated with the latest dravinBailz news"));
export * from '../WAProto/index.js';
export * from './Utils/index.js';
export * from './Types/index.js';
export * from './Defaults/index.js';
export * from './WABinary/index.js';
export * from './WAM/index.js';
export * from './WAUSync/index.js';
export * from './Store/index.js';
export { makeWASocket };
export default makeWASocket;
