import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();


  constructor(private firestore: AngularFirestore) {
    this.loadUserFromLocalStorage()
  }


  private loadUserFromLocalStorage() {
    const userUUID = localStorage.getItem('userUUID');
    if (userUUID) {
      this.firestore.collection('users').doc(userUUID).valueChanges().subscribe(
        user => this.userSubject.next(user),
        error => console.error('Error loading user:', error)
      );
    }
  }

  signUp(data: any): Observable<any> {
    // Set default values before adding to Firestore
    const userData = {
      ...data,  // Spread existing data
      role: 'user',  // Add default role
      managedUsers: []  // Initialize empty array for managedUsers
    };

    return new Observable<any>(observer => {
      this.firestore.collection('users').add(userData)
        .then(docRef => {
          const uuid=docRef.id
          
          // Fetch the added document data
          this.getDocumentData(docRef).subscribe(
            (userData) => {
              observer.next({ uuid, ...userData }); 
                observer.complete();
            },
            (error) => {
              observer.error(error);
            }
          );
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  private getDocumentData(docRef: any): Observable<any> {
    return new Observable<any>(observer => {
      docRef.get().then((doc:any) => {
        if (doc.exists) {
          observer.next(doc.data());
        } else {
          observer.error('Document not found');
        }
        observer.complete();
      }).catch((error:any) => {
        observer.error(error);
      });
    });
  }

  getUserRole(uid: string): Observable<string | undefined> {
    return this.firestore.collection('users').doc(uid).valueChanges()
      .pipe(
        map((user: any) => user.role)
      );
  }

  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(
      map(user => !!user)
    );
  }


}
