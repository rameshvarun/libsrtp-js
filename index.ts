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

export class Policy {
  constructor() {

  }
}

export class Session {
  constructor() {

  }
}

const loader = require("./libsrtp2.out.js");
export function init(): Promise<void> {
  return new Promise((resolve, reject) => {
    loader().then(mod => {
      let status = mod.ccall('srtp_init', 'number');
      if (status == ErrorStatus.Ok) {
        EM = mod;
        resolve();
      } else {
        reject(status);
      }
    });
  });
}
