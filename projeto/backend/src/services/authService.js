const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

let googleKeys = null;
let googleKeysExpireAt = 0;

const getGoogleKeys = async () => {
    if (googleKeys && Date.now() < googleKeysExpireAt) return googleKeys;
    const response = await fetch('https://www.googleapis.com/oauth2/v3/certs');
    if (!response.ok) throw new Error('Não foi possível validar a assinatura Google.');
    const data = await response.json();
    const cacheControl = response.headers.get('cache-control') || '';
    const maxAge = Number(cacheControl.match(/max-age=(\d+)/)?.[1] || 3600);
    googleKeys = data.keys || [];
    googleKeysExpireAt = Date.now() + maxAge * 1000;
    return googleKeys;
};

const verifyGoogleCredential = async (credential) => {
    const parts = credential.split('.');
    if (parts.length !== 3) throw new Error('CREDENCIAL_GOOGLE_INVALIDA');

    const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    if (header.alg !== 'RS256' || !header.kid) throw new Error('CREDENCIAL_GOOGLE_INVALIDA');

    const keys = await getGoogleKeys();
    const jwk = keys.find((key) => key.kid === header.kid && key.use === 'sig');
    if (!jwk) throw new Error('ASSINATURA_GOOGLE_INVALIDA');

    const publicKey = crypto.createPublicKey({ key: jwk, format: 'jwk' });
    const signedContent = `${parts[0]}.${parts[1]}`;
    const signature = Buffer.from(parts[2], 'base64url');
    const validSignature = crypto.verify('RSA-SHA256', Buffer.from(signedContent), publicKey, signature);
    const now = Math.floor(Date.now() / 1000);
    const validIssuer = ['accounts.google.com', 'https://accounts.google.com'].includes(payload.iss);

    if (!validSignature || !validIssuer || payload.aud !== process.env.GOOGLE_CLIENT_ID || payload.exp <= now || payload.iat > now + 60 || payload.email_verified !== true) {
        throw new Error('CREDENCIAL_GOOGLE_INVALIDA');
    }

    return payload;
};

const loginWithGoogle = async (credential) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.JWT_SECRET) {
        const error = new Error('GOOGLE_CLIENT_ID ou JWT_SECRET não configurado.');
        error.status = 500;
        throw error;
    }

    const payload = await verifyGoogleCredential(credential);
    if (!payload?.sub || !payload.email || !payload.email_verified) {
        const error = new Error('CONTA_GOOGLE_INVALIDA');
        error.status = 401;
        throw error;
    }

    let usuario = await Usuario.findOne({ where: { googleId: payload.sub } });

    if (!usuario) {
        usuario = await Usuario.findOne({ where: { email: payload.email } });
        if (usuario) {
            await usuario.update({ googleId: payload.sub, foto: payload.picture || usuario.foto, nome: payload.name || usuario.nome });
        } else {
            usuario = await Usuario.create({
                nome: payload.name || payload.email,
                email: payload.email,
                googleId: payload.sub,
                foto: payload.picture || null
            });
        }
    }

    const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    return {
        token,
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            foto: usuario.foto
        }
    };
};

module.exports = { loginWithGoogle };
