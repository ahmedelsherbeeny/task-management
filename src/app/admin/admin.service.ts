import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, Observable, switchMap } from 'rxjs';
import { User } from '../shared/models/user/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private firestore: AngularFirestore) { }


  updateUserRole(userId: string, newRole: string): Observable<any> {
    return new Observable<any>((observer) => {
      let updateData: User = { role: newRole };

      // Clear managedUsers array if changing role to 'user'
      if (newRole === 'user') {
        updateData.managedUsers = [];
      } else if (newRole === 'manager') {
        updateData.hasManager = false; // Clear hasManager flag
      }

      this.firestore
        .collection('users')
        .doc(userId)
        .update(updateData)
        .then(() => {
          if (newRole === 'manager') {
            // Remove user from any managedUsers array
            return this.firestore
              .collection('users')
              .ref.where('role', '==', 'manager')
              .get()
              .then((querySnapshot) => {
                const batch = this.firestore.firestore.batch();

                querySnapshot.forEach((doc: any) => {
                  if (doc.exists) {
                    const managedUsers = doc.data().managedUsers || [];
                    const userIndex = managedUsers.indexOf(userId);
                    if (userIndex > -1) {
                      managedUsers.splice(userIndex, 1);
                      batch.update(doc.ref, { managedUsers: managedUsers });
                    }
                  }
                });

                return batch.commit();
              });
          } else {
            return Promise.resolve();
          }
        })
        .then(() => {
          observer.next({ message: 'Role updated successfully' });
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

    // Delete user
    deleteUser(userId: string): Observable<void> {
      return new Observable<void>((observer) => {
        this.firestore
          .doc(`users/${userId}`)
          .delete()
          .then(() => {
            // Fetch all users
            this.firestore
              .collection('users')
              .get()
              .pipe(
                switchMap((snapshot) => {
                  const batch = this.firestore.firestore.batch();
  
                  // Update each user's managedUsers array
                  snapshot.docs.forEach((doc) => {
                    const userData: User = doc.data()!;
                    const managedUsers = userData.managedUsers || [];
  
                    // Remove userId from managedUsers if it exists
                    const index = managedUsers.indexOf(userId);
                    if (index !== -1) {
                      managedUsers.splice(index, 1);
                      batch.update(doc.ref, { managedUsers });
                    }
                  });
  
                  // Commit batch update
                  return from(batch.commit());
                })
              )
              .subscribe(
                () => {
                  observer.next();
                  observer.complete();
                },
                (error) => {
                  observer.error(error);
                }
              );
          })
          .catch((error) => {
            observer.error(error);
          });
      });
    }
}
