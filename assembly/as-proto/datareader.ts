import { BLOCK_MAXSIZE } from "rt/common";
import { E_INDEXOUTOFRANGE, E_INVALIDLENGTH } from "util/error";

export class DataReader {
  readonly buffer: ArrayBuffer;
  @unsafe readonly dataStart: usize;
  private byteOffset: i32;
  readonly byteLength: i32;

  constructor(
    buffer: ArrayBuffer,
    byteOffset: i32 = 0,
    byteLength: i32 = buffer.byteLength
  ) {
    if (
      i32(<u32>byteLength > <u32>BLOCK_MAXSIZE) |
      i32(<u32>byteOffset + byteLength > <u32>buffer.byteLength)
    )
      throw new RangeError(E_INVALIDLENGTH);
    this.buffer = buffer; // retains
    var dataStart = changetype<usize>(buffer);
    this.dataStart = dataStart;
    this.byteLength = byteLength;
    this.byteOffset = byteOffset;
  }

  ////////

  encodeVarintU64(v: u64): void {
    while (v >= 1<<7) {
      this.setUint8(<u8>(v&0x7f | 0x80))
      v >>= 7
    }
    this.setUint8(<u8>v)
  }

  encodeSignedI64(v: i64): void {
    this.encodeVarintU64(<u64>(v<<1)^<u64>(v>>63))
  }

  readString(): string {
    const strLen = this.readU64();
    const strLenI = <i32>strLen;
    if (strLenI < 0) {
      throw new Error("ErrInvalidLengthTest")
    }
    const strBytes = this.getBytes(strLenI);
    return String.UTF8.decode(strBytes);
  }
  
  readBytes(): ArrayBuffer {
    const bytesLen = this.readU64();
    const bytesLenI = <i32>bytesLen;
    if (bytesLenI < 0) {
      throw new Error("ErrInvalidLengthTest")
    }
    return this.getBytes(bytesLenI);
  }
  
  readBool(): bool {
    return this.readU64() != 0;
  }
  
  readS64(): i64 {
    var value: u64 = 0;
    for (var shift: u64 = 0;;) {
      if (shift >= 64) {
        throw new Error("ErrIntOverflowTest")
      }
      var b2 = this.getUint8();
      value |= (<u64>b2 & 0x7F) << shift
      if (b2 < 0x80) {
        break
      }
      shift += 7;
    }
    value = (value >> 1) ^ <u64>((<i64>(value&1)<<63)>>63)
    return <i64>value
  }
  
  readS32(): i32 {
    var value: i32 = 0;
    for (var shift: u64 = 0;;) {
      if (shift >= 64) {
        throw new Error("ErrIntOverflowTest")
      }
      var b2 = this.getUint8();
      value |= (<i32>b2 & 0x7F) << <i32>shift
      if (b2 < 0x80) {
        break
      }
      shift += 7;
    }
    value = ((value >> 1) ^ ((value&1)<<31)>>31)
    return <i32>value
  }
  
  readI64(): i64 {
    var value: i64 = 0;
    for (var shift: u64 = 0;;) {
      if (shift >= 64) {
        throw new Error("ErrIntOverflowTest")
      }
      var b2 = this.getUint8();
      value |= <i64>(<u64>b2 & 0x7F) << shift
      if (b2 < 0x80) {
        break
      }
      shift += 7;
    }
    return value
  }
  
  readI32(): i32 {
    var value: i32 = 0;
    for (var shift: u32 = 0;;) {
      if (shift >= 64) {
        throw new Error("ErrIntOverflowTest")
      }
      var b2 = this.getUint8();
      value |= <i32>((<u64>b2 & 0x7F) << shift)
      if (b2 < 0x80) {
        break
      }
      shift += 7;
    }
    return value
  }
  
  readU64(): u64 {
    var value: u64 = 0;
    for (var shift: u64 = 0;;) {
      if (shift >= 64) {
        throw new Error("ErrIntOverflowTest")
      }
      var b2 = this.getUint8();
      value |= (<u64>b2 & 0x7F) << shift
      if (b2 < 0x80) {
        break
      }
      shift += 7;
    }
    return value
  }
  
  readU32(): u32 {
    var value: u32 = 0;
    for (var shift: u64 = 0;;) {
      if (shift >= 64) {
        throw new Error("ErrIntOverflowTest")
      }
      var b2 = this.getUint8();
      value |= <u32>((<u64>b2 & 0x7F) << shift)
      if (b2 < 0x80) {
        break
      }
      shift += 7;
    }
    return value
  }

  ////////

  hasBytes(): boolean {
    return (this.byteOffset < this.byteLength);
  }

  getBytes(length: i32): ArrayBuffer {
    if (this.byteOffset + length > this.byteLength)
      throw new RangeError(E_INDEXOUTOFRANGE);
    const result = this.buffer.slice(this.byteOffset, this.byteOffset + length);
    this.byteOffset += length;
    return result;
  }

  discard(length: i32): void {
    if (this.byteOffset + length > this.byteLength)
      throw new RangeError(E_INDEXOUTOFRANGE);
    this.byteOffset += length;
  }

  peekUint8(): u8 {
    if (this.byteOffset > this.byteLength)
      throw new RangeError(E_INDEXOUTOFRANGE);
    return load<u8>(this.dataStart + this.byteOffset);
  }

  getInt8(): i8 {
    if (this.byteOffset >= this.byteLength)
      throw new RangeError(E_INDEXOUTOFRANGE);
    const result = load<i8>(this.dataStart + this.byteOffset);
    this.byteOffset++;
    return result;
  }

  getUint8(): u8 {
    if (this.byteOffset >= this.byteLength)
      throw new RangeError(E_INDEXOUTOFRANGE);
    const result = load<u8>(this.dataStart + this.byteOffset);
    this.byteOffset++;
    return result;
  }

  getInt16(): i16 {
    if (this.byteOffset + 2 > this.byteLength)
      throw new RangeError(E_INDEXOUTOFRANGE);
    const result = load<i16>(this.dataStart + this.byteOffset);
    this.byteOffset += 2;
    return result;
  }

  getUint16(): u16 {
    if (this.byteOffset + 2 > this.byteLength)
      throw new RangeError(E_INDEXOUTOFRANGE);
    const result = load<u16>(this.dataStart + this.byteOffset);
    this.byteOffset += 2;
    return result;
  }

  getInt32(): i32 {
    if (this.byteOffset + 4 > this.byteLength)
      throw new RangeError(E_INDEXOUTOFRANGE);
    const result = load<i32>(this.dataStart + this.byteOffset);
    this.byteOffset += 4;
    return result;
  }

  getUint32(): u32 {
    if (this.byteOffset + 4 > this.byteLength)
      throw new RangeError(E_INDEXOUTOFRANGE);
    const result = load<u32>(this.dataStart + this.byteOffset);
    this.byteOffset += 4;
    return result;
  }

  getFloat32(): f32 {
    if (this.byteOffset + 4 > this.byteLength)
      throw new RangeError(E_INDEXOUTOFRANGE);
    const result = load<f32>(this.dataStart + this.byteOffset);
    this.byteOffset += 4;
    return result;
  }

  getFloat64(): f64 {
    if (this.byteOffset + 8 > this.byteLength)
      throw new RangeError(E_INDEXOUTOFRANGE);
    const result = load<f64>(this.dataStart + this.byteOffset);
    this.byteOffset += 8;
    return result;
  }

  setInt8(value: i8): void {
    if (this.byteOffset >= this.byteLength)
      throw new RangeError(E_INDEXOUTOFRANGE);
    store<i8>(this.dataStart + this.byteOffset, value);
    this.byteOffset++;
  }

  setUint8(value: u8): void {
    if (this.byteOffset >= this.byteLength)
      throw new RangeError(E_INDEXOUTOFRANGE);
    store<u8>(this.dataStart + this.byteOffset, value);
    this.byteOffset++;
  }

  setInt16(value: i16): void {
    if (this.byteOffset + 2 > this.byteLength)
      throw new RangeError(E_INDEXOUTOFRANGE);
    store<i16>(this.dataStart + this.byteOffset, value);
    this.byteOffset += 2;
  }

  setUint16(value: u16): void {
    if (this.byteOffset + 2 > this.byteLength)
      throw new RangeError(E_INDEXOUTOFRANGE);
    store<i32>(this.dataStart + this.byteOffset, value);
    this.byteOffset += 2;
  }

  setInt32(value: i32): void {
    if (this.byteOffset + 4 > this.byteLength)
      throw new RangeError(E_INDEXOUTOFRANGE);
    store<i32>(this.dataStart + this.byteOffset, value);
    this.byteOffset += 4;
  }

  setUint32(value: u32): void {
    if (this.byteOffset + 4 > this.byteLength)
      throw new RangeError(E_INDEXOUTOFRANGE);
    store<u32>(this.dataStart + this.byteOffset, value);
    this.byteOffset += 4;
  }

  getInt64(): i64 {
    if (this.byteOffset + 8 > this.byteLength)
      throw new RangeError(E_INDEXOUTOFRANGE);
    const result = load<i64>(this.dataStart + this.byteOffset);
    this.byteOffset += 8;
    return result;
  }

  getUint64(): u64 {
    if (this.byteOffset + 8 > this.byteLength)
      throw new RangeError(E_INDEXOUTOFRANGE);
    const result = load<u64>(this.dataStart + this.byteOffset);
    this.byteOffset += 8;
    return result;
  }

  setBytes(buf: ArrayBuffer): void {
    if (this.byteOffset + buf.byteLength > this.byteLength)
      throw new RangeError(E_INDEXOUTOFRANGE);
    memory.copy(
      changetype<i32>(this.dataStart) + this.byteOffset,
      changetype<i32>(buf),
      buf.byteLength
    );
    this.byteOffset += buf.byteLength;
  }

  setInt64(value: i64): void {
    if (this.byteOffset + 8 > this.byteLength)
      throw new RangeError(E_INDEXOUTOFRANGE);
    store<i64>(this.dataStart + this.byteOffset, value);
    this.byteOffset += 8;
  }

  setUint64(value: u64): void {
    if (this.byteOffset + 8 > this.byteLength)
      throw new RangeError(E_INDEXOUTOFRANGE);
    store<u64>(this.dataStart + this.byteOffset, value);
    this.byteOffset += 8;
  }

  setFloat32(value: f32): void {
    if (this.byteOffset + 4 > this.byteLength)
      throw new RangeError(E_INDEXOUTOFRANGE);
    store<u32>(this.dataStart + this.byteOffset, <u32>reinterpret<u32>(value));
    this.byteOffset += 4;
  }

  setFloat64(value: f64): void {
    if (this.byteOffset + 8 > this.byteLength)
      throw new RangeError(E_INDEXOUTOFRANGE);
    store<u64>(this.dataStart + this.byteOffset, <u64>reinterpret<u64>(value));
    this.byteOffset += 8;
  }

  toString(): string {
    return "[object DataReader]";
  }
}
