import {
  register,
  handleCall,
  handleAbort,
  consoleLog
} from "wapc-guest-as";
import { DataReader } from "./as-proto";

export function _start(): void {
  register("protoEcho", protoEcho);
}

function protoEcho(payload: ArrayBuffer): ArrayBuffer {
  consoleLog("start protoEcho");

  var test = new Test();
  test.decode(payload);
  var ab = new ArrayBuffer(test.size());
  test.encode(new DataReader(ab));

  consoleLog("end protoEcho");
  return ab;
}

class Nested {
  foo: string = "";

  decode(payload: ArrayBuffer): void {
    const dr = new DataReader(payload);
  
    while (dr.hasBytes()) {
      const wire = dr.readU64();
      const fieldNum = <i32>(wire >> 3);
      const wireType = <i32>(wire & 0x7);
      consoleLog("fieldNum = " + fieldNum.toString() + ", wireType = " + wireType.toString());

      switch (fieldNum) {
        case 1:
          if (wireType != 2) {
            throw new Error("proto: wrong wireType = " + wireType.toString() + " for field Foo");
          }
          this.foo = dr.readString();
          consoleLog("fieldBytes = " + this.foo.toString());
          break;
      }
    }
  }

  size(): u32 {
    var l: u32;
    var n: u32 = 0;
    l = this.foo.length
    if (l > 0) {
      n += 1 + l + sizeOfVarint(l)
    }
    return n
  }

  encode(dr: DataReader): void {
    var l: u32;
    l = this.foo.length
    if (l > 0) {
      dr.setUint8(0xa);
      dr.encodeVarintU64(l);
      dr.setBytes(String.UTF8.encode(this.foo));
    }
  }
}

class Test {
  field_uint64: u64;
  field_uint32: u32;
  field_int64: i64;
  field_int32: i32;
  field_sint64: i64;
  field_sint32: i32;
  field_string: string = "";
  field_bool: bool;
  field_bytes: ArrayBuffer = new ArrayBuffer(0);
  field_float: f32;
  field_double: f64;
  field_fixed32: u32;
  field_fixed64: u64;
  field_sfixed32: i32;
  field_sfixed64: i64;
  field_nested: Nested | null = null;

  decode(payload: ArrayBuffer): void {
    const dr = new DataReader(payload);
  
    while (dr.hasBytes()) {
      const wire = dr.readU64();
      const fieldNum = <i32>(wire >> 3);
      const wireType = <i32>(wire & 0x7);
      consoleLog("fieldNum = " + fieldNum.toString() + ", wireType = " + wireType.toString());

      switch (fieldNum) {
        case 1:
          if (wireType != 0) {
            throw new Error("proto: wrong wireType = " + wireType.toString() + " for field FieldUint64");
          }
          this.field_uint64 = dr.readU64();
          consoleLog("fieldUint64 = " + this.field_uint64.toString());
          break;
        case 2:
          if (wireType != 0) {
            throw new Error("proto: wrong wireType = " + wireType.toString() + " for field FieldUint32");
          }
          this.field_uint32 = dr.readU32();
          consoleLog("fieldUint32 = " + this.field_uint32.toString());
          break;
        case 3:
          if (wireType != 0) {
            throw new Error("proto: wrong wireType = " + wireType.toString() + " for field FieldInt64");
          }
          this.field_int64 = dr.readI64();
          consoleLog("fieldInt64 = " + this.field_int64.toString());
          break;
        case 4:
          if (wireType != 0) {
            throw new Error("proto: wrong wireType = " + wireType.toString() + " for field FieldInt32");
          }
          this.field_int32 = dr.readI32();
          consoleLog("fieldInt32 = " + this.field_int32.toString());
          break;
        case 5:
          if (wireType != 0) {
            throw new Error("proto: wrong wireType = " + wireType.toString() + " for field FieldSint64");
          }
          this.field_sint64 = dr.readS64();
          consoleLog("fieldSint64 = " + this.field_sint64.toString());
          break;
        case 6:
          if (wireType != 0) {
            throw new Error("proto: wrong wireType = " + wireType.toString() + " for field FieldSint32");
          }
          this.field_sint32 = dr.readS32();
          consoleLog("fieldSint32 = " + this.field_sint32.toString());
          break;
        case 7:
          if (wireType != 2) {
            throw new Error("proto: wrong wireType = " + wireType.toString() + " for field FieldString");
          }
          this.field_string = dr.readString();
          consoleLog("fieldString = " + this.field_string);
          break;
        case 8:
          if (wireType != 0) {
            throw new Error("proto: wrong wireType = " + wireType.toString() + " for field FieldBool");
          }
          this.field_bool = dr.readBool();
          consoleLog("fieldBool = " + this.field_bool.toString());
          break;
        case 9:
          if (wireType != 2) {
            throw new Error("proto: wrong wireType = " + wireType.toString() + " for field FieldBytes");
          }
          this.field_bytes = dr.readBytes();
          consoleLog("fieldBytes = " + this.field_bytes.toString());
          break;
        case 10:
          if (wireType != 5) {
            throw new Error("proto: wrong wireType = " + wireType.toString() + " for field FieldFloat");
          }
          this.field_float = dr.getFloat32();
          consoleLog("fieldFloat = " + this.field_float.toString());
          break;
        case 11:
          if (wireType != 1) {
            throw new Error("proto: wrong wireType = " + wireType.toString() + " for field FieldDouble");
          }
          this.field_double = dr.getFloat64();
          consoleLog("fieldDouble = " + this.field_double.toString());
          break;
        case 12:
          if (wireType != 5) {
            throw new Error("proto: wrong wireType = " + wireType.toString() + " for field FieldFixed32");
          }
          this.field_fixed32 = dr.getUint32();
          consoleLog("fieldFixed32 = " + this.field_fixed32.toString());
          break;
        case 13:
          if (wireType != 1) {
            throw new Error("proto: wrong wireType = " + wireType.toString() + " for field FieldFixed64");
          }
          this.field_fixed64 = dr.getUint64();
          consoleLog("fieldFixed64 = " + this.field_fixed64.toString());
          break;
        case 14:
          if (wireType != 5) {
            throw new Error("proto: wrong wireType = " + wireType.toString() + " for field FieldSFixed32");
          }
          this.field_sfixed32 = dr.getInt32();
          consoleLog("fieldSfixed32 = " + this.field_sfixed32.toString());
          break;
        case 15:
          if (wireType != 1) {
            throw new Error("proto: wrong wireType = " + wireType.toString() + " for field FieldSFixed");
          }
          this.field_sfixed64 = dr.getInt64();
          consoleLog("fieldSfixed64 = " + this.field_sfixed64.toString());
          break;
        case 16:
          if (wireType != 2) {
            throw new Error("proto: wrong wireType = " + wireType.toString() + " for field FieldNested");
          }
          const nestedBytes = dr.readBytes();
          if (this.field_nested == null) {
            this.field_nested = new Nested();
          }
          this.field_nested!.decode(nestedBytes);
          consoleLog("fieldNested = " + nestedBytes.toString());
          break;
      }
    }
  }

  size(): u32 {
    var l: u32;
    var n: u32 = 0;
    if (this.field_uint64 != 0) {
      n += 1 + sizeOfVarint(this.field_uint64)
    }
    if (this.field_uint32 != 0) {
      n += 1 + sizeOfVarint(this.field_uint32)
    }
    if (this.field_int64 != 0) {
      n += 1 + sizeOfVarint(this.field_int64)
    }
    if (this.field_int32 != 0) {
      n += 1 + sizeOfVarint(this.field_int32)
    }
    if (this.field_sint64 != 0) {
      n += 1 + sizeOfSigned(this.field_sint64)
    }
    if (this.field_sint32 != 0) {
      n += 1 + sizeOfSigned(this.field_sint32)
    }
    l = this.field_string.length
    if (l > 0) {
      n += 1 + l + sizeOfVarint(l)
    }
    if (this.field_bool) {
      n += 2
    }
    l = this.field_bytes.byteLength
    if (l > 0) {
      n += 1 + l + sizeOfVarint(l)
    }
    if (this.field_float != 0) {
      n += 5
    }
    if (this.field_double != 0) {
      n += 9
    }
    if (this.field_fixed32 != 0) {
      n += 5
    }
    if (this.field_fixed64 != 0) {
      n += 9
    }
    if (this.field_sfixed32 != 0) {
      n += 5
    }
    if (this.field_sfixed64 != 0) {
      n += 9
    }
    if (this.field_nested != null) {
      l = this.field_nested!.size();
      n += 2 + l + sizeOfVarint(l);
    }
    return n
  }

  encode(dr: DataReader): void {
    var l: u32;
    if (this.field_uint64 != 0) {
      dr.setUint8(0x8);
      dr.encodeVarintU64(this.field_uint64);
    }
    if (this.field_uint32 != 0) {
      dr.setUint8(0x10);
      dr.encodeVarintU64(this.field_uint32);
    }
    if (this.field_int64 != 0) {
      dr.setUint8(0x18);
      dr.encodeVarintU64(this.field_int64);
    }
    if (this.field_int32 != 0) {
      dr.setUint8(0x20);
      dr.encodeVarintU64(this.field_int32);
    }
    if (this.field_sint64 != 0) {
      dr.setUint8(0x28);
      dr.encodeSignedI64(this.field_sint64);
    }
    if (this.field_sint32 != 0) {
      dr.setUint8(0x30);
      dr.encodeSignedI64(this.field_sint32);
    }
    l = this.field_string.length
    if (l > 0) {
      dr.setUint8(0x3a);
      dr.encodeVarintU64(l);
      dr.setBytes(String.UTF8.encode(this.field_string));
    }
    if (this.field_bool) {
      dr.setUint8(0x40);
      dr.setUint8(this.field_bool ? 1 : 0);
    }
    l = this.field_bytes.byteLength
    if (l > 0) {
      dr.setUint8(0x4a);
      dr.encodeVarintU64(l);
      dr.setBytes(this.field_bytes);
    }
    if (this.field_float != 0) {
      dr.setUint8(0x55);
      dr.setFloat32(this.field_float);
    }
    if (this.field_double != 0) {
      dr.setUint8(0x59);
      dr.setFloat64(this.field_double);
    }
    if (this.field_fixed32 != 0) {
      dr.setUint8(0x65);
      dr.setUint32(this.field_fixed32);
    }
    if (this.field_fixed64 != 0) {
      dr.setUint8(0x69);
      dr.setUint64(this.field_fixed64);
    }
    if (this.field_sfixed32 != 0) {
      dr.setUint8(0x75);
      dr.setInt32(this.field_sfixed32);
    }
    if (this.field_sfixed64 != 0) {
      dr.setUint8(0x79);
      dr.setInt64(this.field_sfixed64);
    }
    if (this.field_nested != null) {
      dr.setUint8(0x82);
      dr.setUint8(0x1);
      l = this.field_nested!.size();
      dr.encodeVarintU64(l);
      this.field_nested!.encode(dr);
    }
  }
}

function sizeOfVarint(x: u64): u32 {
  var n: u32 = 0;
	while (true) {
		n++
		x >>= 7
		if (x == 0) {
			break
		}
	}
	return n
}

function sizeOfSigned(x: u64): u32 {
	return sizeOfVarint(<u64>((x << 1) ^ <u64>((<i64>x >> 63))))
}

// This must be present in the entry file to be exported from the Wasm module.
export function __guest_call(operation_size: usize, payload_size: usize): bool {
  return handleCall(operation_size, payload_size);
}

// Abort function
function abort(message: string | null, fileName: string | null, lineNumber: u32, columnNumber: u32): void {
  handleAbort(message, fileName, lineNumber, columnNumber);
}