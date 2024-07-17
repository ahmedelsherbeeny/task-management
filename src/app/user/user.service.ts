import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { User } from '../shared/models/user/user';

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

  updateUserRole(userId: string, newRole: string): Observable<any> {
    return new Observable<any>((observer) => {
      let updateData:User= { role: newRole };
  
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
            return this.firestore.collection('users').ref.where('role', '==', 'manager').get()
              .then((querySnapshot) => {
                const batch = this.firestore.firestore.batch();
  
                querySnapshot.forEach((doc:any) => {
                  if (doc.exists) {
                    const managedUsers= doc.data().managedUsers || [];
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
  deleteUser(userId: string): Promise<void> {
    return this.firestore.collection('users').doc(userId).delete();
  }
}
