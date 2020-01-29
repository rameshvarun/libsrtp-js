/** Represents the emscripten module. Only initialized after the init function is called. */
let EM = null;

export enum ErrorStatus {
  Ok = 0,
  Fail = 1,
  BadParam = 2,
  AllocFail = 3,
  DeallocFail = 4,
  InitFail = 5,
  Terminus = 6,
  AuthFail = 7,
  CipherFail = 8,
  ReplayFail = 9,
  ReplayOld = 10,
  AlgoFail = 11,
  NoSuchOp = 12,
  NoCtx = 13,
  CantCheck = 14,
  KeyExpired = 15,
  SocketErr = 16,
  SignalErr = 17,
  NonceBad = 18,
  ReadFail = 19,
  WriteFail = 20,
  ParseErr = 21,
  EncodeErr = 22,
  SemaphoreErr = 23,
  PFKeyErr = 24,
  BadMKI = 25,
  PktIndexOld = 26,
  PktIndexAdv = 27
}

// TODO: Fill out this list.
const ErrorDescription = [
  "nothing to report",
  "unspecified failure",
  "unsupported parameter",
  "couldn't allocate memory",
  "couldn't deallocate properly",
  "couldn't initialize",
  "can't process as much data as requested"
];

export enum SSRCType {
  Undefined = 0,
  Specific = 1,
  AnyInbound = 2,
  AnyOutbound = 3
}

export type SSRC =
  | { type: SSRCType.Undefined }
  | { type: SSRCType.Specific; value: number }
  | { type: SSRCType.AnyInbound }
  | { type: SSRCType.AnyOutbound };

export enum CipherType {
  SRTP_NULL_CIPHER = 0,
  SRTP_AES_ICM_128 = 1,
  SRTP_AES_ICM_192 = 4,
  SRTP_AES_ICM_256 = 5,
  SRTP_AES_GCM_128 = 6,
  SRTP_AES_GCM_256 = 7
}

export enum AuthType {
  SRTP_NULL_AUTH = 0,
  SRTP_HMAC_SHA1 = 3
}

export enum SecurityServices {
  None = 0,
  Conf = 1,
  Auth = 2,
  ConfAndAuth = 3
}

export class CryptoPolicy {
  cipherType: CipherType;
  cipherKeyLen: number;
  authType: AuthType;
  authKeyLen: number;
  authTagLen: number;

  secServe: SecurityServices;

  static getRTPDefault(): CryptoPolicy {
    let buffer = EM._malloc(EM.ccall("srtp_crypto_policy_t_sizeof", "number"));
  }
}

export class Policy {
  ssrc: SSRC;
}

function formatError(status: ErrorStatus) {
  return new Error(
    `libSRTP error, Code: ${status} (${ErrorStatus[status]}): ${ErrorDescription[status]}`
  );
}

function checkStatus(status: ErrorStatus) {
  if (status !== ErrorStatus.Ok) {
    throw formatError(status);
  }
}

export class Session {
  ctx: number;
  constructor() {
    let buffer = EM._malloc(EM.ccall("srtp_t_sizeof", "number"));
    checkStatus(
      EM.ccall("srtp_create", "number", ["number", "number"], [buffer, 0])
    );
    this.ctx = EM.HEAP32[buffer / 4];
    EM._free(buffer);
  }

  protect(packet: ArrayBuffer): ArrayBuffer {
    // TODO: Need to add auth length.
    let buf = EM._malloc(packet.byteLength);
    EM.HEAP8.set(packet, buf);
    let status = EM.ccall("srtp_protect", "number", ["number", "number", "number"], [this.ctx, buf, packet.byteLength]);
    EM.free(buf);
    if (status) {
      throw status;
    }
    return new Uint8Array(EM.HEAP8.buffer);
  }

  destroy() {
    checkStatus(
      EM.ccall("srtp_dealloc", "number", ["number"], [this.ctx])
    );
  }
}

const loader = require("./libsrtp2.out.js");
export function init(): Promise<void> {
  return new Promise((resolve, reject) => {
    loader().then(mod => {
      let status = mod.ccall("srtp_init", "number");
      if (status == ErrorStatus.Ok) {
        EM = mod;
        resolve();
      } else {
        reject(formatError(status));
      }
    });
  });
}
