import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: AngularFirestore) {}

  getUsers(): Observable<any[]> {
    return this.firestore
      .collection('users')
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

  updateUserRole(
    userUUID: string,
    newRole: string
  ): Observable<{ uuid: string; newRole: string; message: string }> {
    return new Observable<{ uuid: string; newRole: string; message: string }>(
      (observer) => {
        this.firestore
          .collection('users')
          .doc(userUUID)
          .update({ role: newRole })
          .then(() => {
            observer.next({
              uuid: userUUID,
              newRole: newRole,
              message: 'Role updated successfully',
            });
            observer.complete();
          })
          .catch((error) => {
            observer.error(error);
          });
      }
    );
  }

  // Delete user
  deleteUser(userId: string): Promise<void> {
    return this.firestore.collection('users').doc(userId).delete();
  }
}
