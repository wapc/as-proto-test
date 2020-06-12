import {
  register,
  handleCall,
  handleAbort,
  consoleLog
} from "wapc-guest-as";
import { DataReader } from "as-msgpack";

export function _start(): void {
  register("protoEcho", protoEcho);
}

function protoEcho(payload: ArrayBuffer): ArrayBuffer {
  consoleLog("start protoEcho");

  const dr = new DataReader(payload);
  const wire = readU64(dr);
  
  const fieldNum = <i32>(wire >> 3)
  const wireType = <i32>(wire & 0x7)  
  consoleLog("fieldNum = " + fieldNum.toString());
  consoleLog("wireType = " + wireType.toString());

  switch (fieldNum) {
		case 1:
      if (wireType != 0) {
				throw new Error("proto: wrong wireType = " + wireType.toString() + " for field FieldUint64")
      }
      var fieldUint64 = readU64(dr);
      consoleLog("fieldUint64 = " + fieldUint64.toString());
  }
  
  return payload;
}

function readU64(dr: DataReader): u64 {
  var value: u64 = 0;
  for (var shift: u64 = 0;;) {
    if (shift >= 64) {
      throw new Error("ErrIntOverflowTest")
    }
    var b2 = dr.getUint8();
    value |= (<u64>b2 & 0x7F) << shift
    if (b2 < 0x80) {
      break
    }
    shift += 7;
  }
  return value
}

// This must be present in the entry file to be exported from the Wasm module.
export function __guest_call(operation_size: usize, payload_size: usize): bool {
  return handleCall(operation_size, payload_size);
}

// Abort function
function abort(message: string | null, fileName: string | null, lineNumber: u32, columnNumber: u32): void {
  handleAbort(message, fileName, lineNumber, columnNumber);
}