import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  BehaviorSubject,
  catchError,
  from,
  map,
  Observable,
  switchMap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private firestore: AngularFirestore) {
    // this.loadUserFromLocalStorage();
  }

  // loadUserFromLocalStorage() {
  //   const userUUID = localStorage.getItem('userUUID');
  //   if (userUUID) {
  //     this.firestore
  //       .collection('users')
  //       .doc(userUUID)
  //       .valueChanges()
  //       .subscribe(
  //         (user) => this.userSubject.next(user),
  //         (error) => console.error('Error loading user:', error)
  //       );
  //   }
  // }

  signUp(data: any): Observable<any> {
    const userData = {
      ...data,
      role: 'user',
      managedUsers: [],
    };

    return new Observable<any>((observer) => {
      this.checkIfEmailExists(userData.email)
        .pipe(
          switchMap((emailExists) => {
            if (emailExists) {
              throw new Error('Email already exists');
            } else {
              return from(this.firestore.collection('users').add(userData));
            }
          }),
          switchMap((docRef: any) => {
            const uuid = docRef.id;
            return this.getDocumentData(docRef).pipe(
              map((userData) => ({ uuid, ...userData }))
            );
          })
        )
        .subscribe(
          (userData: any) => {
            observer.next(userData);
            observer.complete();
            // Store the user in local storage and update the user subject

            this.userSubject.next(userData);
          },
          (error) => {
            observer.error(error.message);
          }
        );
    });
  }

  signIn(email: string, password: string): Observable<any> {
    return new Observable<any>((observer) => {
      this.firestore
        .collection('users', (ref) =>
          ref.where('email', '==', email).where('password', '==', password)
        )
        .get()
        .pipe(
          map((snapshot) => {
            if (!snapshot.empty) {
              const doc = snapshot.docs[0];
              const userData: any = doc.data();
              const uuid = doc.id;

              this.userSubject.next({ uuid, ...userData });
              return { uuid, ...userData };
            } else {
              throw new Error('Invalid email or password');
            }
          }),
          catchError((error) => {
            observer.error(error.message);
            throw error;
          })
        )
        .subscribe(
          (userData) => {
            observer.next(userData);
            observer.complete();
          },
          (error) => {
            observer.error(error.message);
          }
        );
    });
  }

  // logout() {
  //   this.removeUserFromLocalStorage();
  //   this.userSubject.next(null);
  // }

  private checkIfEmailExists(email: string): Observable<boolean> {
    return this.firestore
      .collection('users', (ref) => ref.where('email', '==', email))
      .get()
      .pipe(map((snapshot) => !snapshot.empty));
  }

  private getDocumentData(docRef: any): Observable<any> {
    return new Observable<any>((observer) => {
      docRef
        .get()
        .then((doc: any) => {
          if (doc.exists) {
            observer.next(doc.data());
          } else {
            observer.error('Document not found');
          }
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }

  getUserRole(uid: string): Observable<string | undefined> {
    return this.firestore
      .collection('users')
      .doc(uid)
      .valueChanges()
      .pipe(map((user: any) => user.role));
  }

  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(map((user) => !!user));
  }
}
