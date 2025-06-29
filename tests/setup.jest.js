//https://stackoverflow.com/a/68468204/1643179

import { TextEncoder, TextDecoder } from "util";

Object.assign(global, { TextDecoder, TextEncoder });
