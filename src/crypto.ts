import { secp256k1 } from '@noble/curves/secp256k1';
import { KeyPair } from './types';

export default class Crypto {
	static generateAuthenticationKeyPair = (): KeyPair => {
		const privateKey = secp256k1.utils.randomPrivateKey();
		const publicKey = secp256k1.getPublicKey(privateKey, true);
		return {
			privateKey: Buffer.from(privateKey).toString('hex'),
			publicKey: Buffer.from(publicKey).toString('hex'),
		};
	};

	static getPublicKeyFromPrivateKey = (privateKey: string): string => {
		const publicKey = secp256k1.getPublicKey(Buffer.from(privateKey, 'hex'), true);
		return Buffer.from(publicKey).toString('hex');
	};
}
