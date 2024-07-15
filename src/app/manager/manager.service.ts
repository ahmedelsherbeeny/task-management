import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import firebase from 'firebase/compat/app'; // Import firebase

@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  constructor(private firestore: AngularFirestore) {}

  getManagers(): Observable<any[]> {
    return this.firestore
      .collection('users', (ref) => ref.where('role', '==', 'manager'))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  addUserToManager(userId: string, managerId: string): Observable<void> {
    console.log(managerId, userId);

    return new Observable<void>((observer) => {
      this.firestore
        .collection('users')
        .doc(managerId)
        .update({
          managedUsers: [{ userId: userId }],
        })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  removeManagerFromUser(managerId: string, userId: string): Observable<void> {
    return new Observable<void>((observer) => {
      this.firestore
        .collection('users')
        .doc(managerId)
        .update({
          managedUsers: firebase.firestore.FieldValue.arrayRemove(userId),
        })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
