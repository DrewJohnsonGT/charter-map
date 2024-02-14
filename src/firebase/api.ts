import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from 'firebase/firestore';
import { firebaseApp } from '~/firebase/config';
import { Feature } from '~/types';

const FEATURE_COLLECTION = 'features';
const db = getFirestore(firebaseApp);

export const getAllFeatures = async () => {
  const features: Feature[] = [];
  const featuresRef = collection(db, FEATURE_COLLECTION);
  const querySnapshot = await getDocs(featuresRef);
  querySnapshot.forEach((doc) => {
    const featureData = doc.data() as { feature: string; name: string };
    const parsedFeature = JSON.parse(featureData.feature);
    features.push({
      ...parsedFeature,
      id: doc.id,
      name: featureData.name,
    });
  });
  return features;
};

export const setFeature = async ({ id, name = '', ...newFeature }: Feature) => {
  const featureRef = doc(db, FEATURE_COLLECTION, String(id));
  const serializedFeature = JSON.stringify(newFeature);
  try {
    await setDoc(
      featureRef,
      { feature: serializedFeature, name },
      { merge: true },
    );
  } catch (error) {
    console.error('Error updating feature: ', error);
  }
};

export const deleteFeature = async (id: Feature['id']) => {
  const featureRef = doc(db, FEATURE_COLLECTION, String(id));
  try {
    await deleteDoc(featureRef);
  } catch (error) {
    console.error('Error deleting feature: ', error);
  }
};
