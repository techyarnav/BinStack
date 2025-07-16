import CryptoJS from 'crypto-js';

export class SecureStorage {
  // 32-byte (256-bit) random key, returned as HEX string
  static generateKey() {
    return CryptoJS.lib.WordArray.random(32).toString();   // 32 bytes = 256 bit
  }

  // --- CBC encryption -------------------------------------------------------
  static encrypt(plainText, hexKey) {
    const keyWA = CryptoJS.enc.Hex.parse(hexKey);          // WordArray key
    const ivWA  = CryptoJS.lib.WordArray.random(16);       // 16-byte IV
    const cipher = CryptoJS.AES.encrypt(plainText, keyWA, {
      iv: ivWA,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return {
      ciphertext: cipher.ciphertext.toString(CryptoJS.enc.Base64),
      iv: ivWA.toString(CryptoJS.enc.Hex)                  // store IV as hex
    };
  }

  // --- CBC decryption -------------------------------------------------------
  static decrypt(encObj, hexKey) {
    const keyWA = CryptoJS.enc.Hex.parse(hexKey);
    const ivWA  = CryptoJS.enc.Hex.parse(encObj.iv);
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: CryptoJS.enc.Base64.parse(encObj.ciphertext) },
      keyWA,
      { iv: ivWA, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  // -------------------------------------------------------------------------
  static generateSecureShareLink(shareId, key) {
    return `pastebin:${shareId}#${key}`;
  }
  static parseSecureShareLink(link) {
    const [, rest] = link.split(':');
    const [shareId, key] = rest.split('#');
    return { shareId, key };
  }
}
