import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, from, map, Observable, switchMap } from 'rxjs';
import { User } from '../shared/models/user/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private firestore: AngularFirestore) { }




  updateUserRole(userId: string, newRole: string): Observable<any> {
    let updateData: Partial<User> = { role: newRole };

    // Adjust updateData based on new role
    if (newRole === 'user') {
      updateData.managedUsers = [];
    } else if (newRole === 'manager') {
      updateData.hasManager = false;
    }

    return from(this.firestore.collection('users').doc(userId).update(updateData)).pipe(
      switchMap(() => {
        if (newRole === 'manager') {
          // Remove user from any manager's managedUsers array
          return this.firestore.collection('users', ref => ref.where('role', '==', 'manager')).get().pipe(
            switchMap(snapshot => {
              const batch = this.firestore.firestore.batch();
              snapshot.forEach((doc:any) => {
                const managedUsers = doc.data().managedUsers || [];
                const userIndex = managedUsers.indexOf(userId);
                if (userIndex > -1) {
                  managedUsers.splice(userIndex, 1);
                  batch.update(doc.ref, { managedUsers });
                }
              });
              return from(batch.commit());
            }),
            map(() => ({ message: 'Role updated successfully' })),
            catchError(error => {
              throw error;
            })
          );
        } else {
          return from(Promise.resolve({ message: 'Role updated successfully' }));
        }
      })
    );
  }
    // Delete user
    deleteUser(userId: string): Observable<void> {
      return from(this.firestore.doc(`users/${userId}`).delete()).pipe(
        switchMap(() => 
          this.firestore.collection('users').get().pipe(
            switchMap(snapshot => {
              const batch = this.firestore.firestore.batch();
              snapshot.docs.forEach((doc:any) => {
                const managedUsers = doc.data().managedUsers || [];
                const index = managedUsers.indexOf(userId);
                if (index !== -1) {
                  managedUsers.splice(index, 1);
                  batch.update(doc.ref, { managedUsers });
                }
              });
              return from(batch.commit());
            })
          )
        ),
        map(() => {}),
        catchError(error => {
          throw error;
        })
      );
    }
  
}
