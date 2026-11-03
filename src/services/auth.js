import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { auth } from '../firebase'

export const signIn = (email, password) =>
  signInWithEmailAndPassword(auth, email.trim(), password)

export const signUp = (email, password) =>
  createUserWithEmailAndPassword(auth, email.trim(), password)

export const resetPassword = (email) => sendPasswordResetEmail(auth, email.trim())

export const signOut = () => firebaseSignOut(auth)

const MESSAGES = {
  'auth/invalid-email': 'That email address doesn’t look right.',
  'auth/missing-email': 'Please enter your email address.',
  'auth/missing-password': 'Please enter your password.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/user-not-found': 'No account found with that email.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
}

export const authErrorMessage = (error) =>
  MESSAGES[error?.code] ?? 'Something went wrong. Please try again.'
