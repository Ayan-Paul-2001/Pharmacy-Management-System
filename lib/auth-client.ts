'use client'

import { initializeApp, getApps } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { load } from '@fingerprintjs/fingerprintjs'
import { startAuthentication, startRegistration } from '@simplewebauthn/browser'

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const firebaseConfig = { apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID }

function firebaseAuth() { if (!firebaseConfig.apiKey || !firebaseConfig.projectId) throw new Error('Firebase client is not configured') ; const app = getApps()[0] ?? initializeApp(firebaseConfig); return getAuth(app) }
async function exchangeFirebaseToken(idToken: string) { const response = await fetch(`${apiUrl}/auth/firebase/exchange`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken }) }); if (!response.ok) throw new Error('Firebase account is not provisioned in Mediflow'); return response.json() }

export async function signInWithFirebase(email: string, password: string) { const result = await signInWithEmailAndPassword(firebaseAuth(), email, password); return exchangeFirebaseToken(await result.user.getIdToken(true)) }
export async function getFingerprint() { const agent = await load(); const result = await agent.get(); return { visitorId: result.visitorId, confidence: result.confidence.score } }
export async function getWebAuthnOptions(email: string) { const response = await fetch(`${apiUrl}/auth/webauthn/login/options`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) }); if (!response.ok) throw new Error('Unable to create passkey challenge'); return response.json() }
export async function signInWithPasskey(email: string) { const options = await getWebAuthnOptions(email); const response = await startAuthentication({ optionsJSON: options }); const verification = await fetch(`${apiUrl}/auth/webauthn/login/verify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, response, challenge: options.challenge }) }); if (!verification.ok) throw new Error('Passkey verification failed'); return verification.json() }
export async function registerPasskey(accessToken: string) { const optionsResponse = await fetch(`${apiUrl}/auth/webauthn/register/options`, { headers: { Authorization: `Bearer ${accessToken}` } }); const options = await optionsResponse.json(); const response = await startRegistration({ optionsJSON: options }); const verification = await fetch(`${apiUrl}/auth/webauthn/register/verify`, { method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ response, challenge: options.challenge }) }); return verification.json() }
