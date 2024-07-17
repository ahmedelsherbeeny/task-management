import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, combineLatest, from, map, of, switchMap } from 'rxjs';
import firebase from 'firebase/compat/app'; // Import firebase
import { User } from '../shared/models/user/user';

@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  constructor(private firestore: AngularFirestore) {}

  getManagers(): Observable<User[]> {
    return this.firestore
      .collection('users', (ref) => ref.where('role', '==', 'manager'))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as User;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  getCurrentManager(managerId: string): Observable<any> {
    return this.firestore.collection('users').doc(managerId).valueChanges();
  }

  addUserToManager(
    userId: string,
    managerId: string
  ): Observable<{ message: string }> {
    return new Observable<{ message: string }>((observer) => {
      this.firestore
        .collection('users')
        .doc(managerId)
        .get()
        .subscribe({
          next: (doc) => {
            if (doc.exists) {
              const managerData:User = doc.data()!;
              const managedUsers = managerData.managedUsers || [];

              // Add the new userId to the managedUsers array
              if (!managedUsers.includes(userId)) {
                managedUsers.push(userId);
              }

              // Update the manager's managedUsers array
              this.firestore
                .collection('users')
                .doc(managerId)
                .update({ managedUsers: managedUsers })
                .then(() => {
                  // After updating the manager's managedUsers array, update the user's hasManager property
                  return this.firestore.collection('users').doc(userId).update({
                    hasManager: true,
                  });
                })
                .then(() => {
                  observer.next({
                    message: 'User successfully assigned to manager',
                  });
                  observer.complete();
                })
                .catch((error) => {
                  observer.error(error);
                });
            } else {
              observer.error('Manager not found');
            }
          },
          error: (error) => {
            observer.error(error);
          },
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

  fetchManagedUsers(managerId: string): Observable<User[]> {
    return this.firestore
      .collection('users')
      .doc(managerId)
      .get()
      .pipe(
        switchMap((doc) => {
          if (doc.exists) {
            const managerData:User = doc.data()!;
            const managedUserIds: string[] = managerData.managedUsers || []!;
            if (managedUserIds.length === 0) {
              return of([]); // Use 'of' instead of 'from' for an empty array
            }
            const userObservables: Observable<User>[] = managedUserIds.map(
              (userId: string) =>
                this.firestore
                  .collection('users')
                  .doc(userId)
                  .get()
                  .pipe(
                    map((userDoc) => ({
                      id: userDoc.id,
                      ...userDoc.data()!,
                    }))
                  )
            );
            return combineLatest(userObservables); // Combine all the observables into one
          } else {
            return of([]); // Use 'of' instead of 'from' for an empty array
          }
        })
      );
  }
}
