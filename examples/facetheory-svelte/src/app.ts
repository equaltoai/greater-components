import { createFaceApp } from '@theory-cloud/facetheory';
import { homeFace } from './home.face.js';

export const app = createFaceApp({
	faces: [homeFace],
});
