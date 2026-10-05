import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  limit,
} from 'firebase/firestore';
import { Job, JobMatch, SearchRun, JobApplication } from '../../src/types';
import firebaseConfigJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
  firestoreDatabaseId: firebaseConfigJson.firestoreDatabaseId,
};

let firestoreInstance: any = null;

export function getFirestoreDB() {
  if (!firestoreInstance) {
    try {
      const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      firestoreInstance = firebaseConfig.firestoreDatabaseId
        ? initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId)
        : getFirestore(app);
      console.log('[Firestore] Connected to database:', firebaseConfig.firestoreDatabaseId || '(default)');
    } catch (err: any) {
      console.error('[Firestore Init Error]:', err.message);
    }
  }
  return firestoreInstance;
}

export class FirestoreService {
  /**
   * Persist a list of jobs with their matching data into Firestore
   */
  public static async saveJobs(jobs: Job[]): Promise<void> {
    const db = getFirestoreDB();
    if (!db) return;

    try {
      for (const job of jobs) {
        // Sanitize object for Firestore (strip undefined)
        const jobData = JSON.parse(JSON.stringify(job));
        const jobRef = doc(db, 'jobs', job.jobId);
        await setDoc(jobRef, jobData, { merge: true });

        if (job.match) {
          const matchData = JSON.parse(JSON.stringify(job.match));
          const matchRef = doc(db, 'job_matches', `${job.match.userId}_${job.jobId}`);
          await setDoc(matchRef, matchData, { merge: true });
        }
      }
      console.log(`[Firestore] Successfully persisted ${jobs.length} jobs and matches`);
    } catch (err: any) {
      console.error('[Firestore saveJobs Error]:', err.message);
    }
  }

  /**
   * Persist a single job match result
   */
  public static async saveJobMatch(match: JobMatch): Promise<void> {
    const db = getFirestoreDB();
    if (!db) return;

    try {
      const matchData = JSON.parse(JSON.stringify(match));
      const matchRef = doc(db, 'job_matches', `${match.userId}_${match.jobId}`);
      await setDoc(matchRef, matchData, { merge: true });
    } catch (err: any) {
      console.error('[Firestore saveJobMatch Error]:', err.message);
    }
  }

  /**
   * Persist a search run record with provenance and queries
   */
  public static async saveSearchRun(run: SearchRun): Promise<void> {
    const db = getFirestoreDB();
    if (!db) return;

    try {
      const runData = JSON.parse(JSON.stringify(run));
      const runRef = doc(db, 'search_runs', run.searchRunId);
      await setDoc(runRef, runData, { merge: true });
      console.log(`[Firestore] Persisted SearchRun ${run.searchRunId}`);
    } catch (err: any) {
      console.error('[Firestore saveSearchRun Error]:', err.message);
    }
  }

  /**
   * Persist application tracker record
   */
  public static async saveApplication(application: JobApplication): Promise<void> {
    const db = getFirestoreDB();
    if (!db) return;

    try {
      const appData = JSON.parse(JSON.stringify(application));
      const appRef = doc(db, 'applications', application.applicationId);
      await setDoc(appRef, appData, { merge: true });
      console.log(`[Firestore] Persisted Application ${application.applicationId}`);
    } catch (err: any) {
      console.error('[Firestore saveApplication Error]:', err.message);
    }
  }

  /**
   * Save or fetch company culture insight
   */
  public static async saveCompanyCulture(companyName: string, cultureData: any): Promise<void> {
    const db = getFirestoreDB();
    if (!db) return;

    try {
      const safeId = companyName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const docRef = doc(db, 'company_culture', safeId);
      await setDoc(docRef, JSON.parse(JSON.stringify(cultureData)), { merge: true });
      console.log(`[Firestore] Persisted culture insight for ${companyName}`);
    } catch (err: any) {
      console.error('[Firestore saveCompanyCulture Error]:', err.message);
    }
  }

  public static async getCompanyCulture(companyName: string): Promise<any | null> {
    const db = getFirestoreDB();
    if (!db) return null;

    try {
      const safeId = companyName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const docRef = doc(db, 'company_culture', safeId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data();
      }
    } catch (err: any) {
      console.error('[Firestore getCompanyCulture Error]:', err.message);
    }
    return null;
  }
}
