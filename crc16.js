const pr = (val, r) => {
    console.log(val.toString(r))
}

const crc16 = (buf) => {
    let crc = 0xFFFF

    for (let i = 0; i < buf.length; i++) {
        crc ^= buf[i]

        for (let j = 0; j < 8; j++) {
            odd = crc & 0x0001
            crc >>= 1

            if (odd) {
                crc ^= 0xA001
            }
        }
    }

    return crc
}

console.log(crc16(Uint8Array.from([01, 03, 00, 00, 00, 01])).toString(16))

