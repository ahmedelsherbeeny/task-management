import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { forkJoin, from, map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private firestore: AngularFirestore) {}

  createTask(task: any): Observable<any> {
    return new Observable<any>((observer) => {
      this.firestore
        .collection('tasks')
        .add(task)
        .then(() => {
          observer.next({ message: 'Role updated successfully' });
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  updateTask(taskId: string, task: any): Observable<void> {
    return new Observable<void>((observer) => {
      this.firestore
        .collection('tasks')
        .doc(taskId)
        .update(task)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  getTask(taskId: string): Observable<any> {
    return new Observable<any>((observer) => {
      this.firestore
        .collection('tasks')
        .doc(taskId)
        .get()
        .subscribe({
          next: (doc) => {
            if (doc.exists) {
              observer.next(doc.data() as any);
            } else {
              observer.error('Task not found');
            }
            observer.complete();
          },
          error: (error) => {
            observer.error(error);
          },
        });
    });
  }

  deleteTask(taskId: string): Observable<void> {
    return new Observable<void>((observer) => {
      this.firestore
        .collection('tasks')
        .doc(taskId)
        .delete()
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  getUserTasks(userId: string): Observable<any[]> {
    return this.firestore
      .collection('users')
      .doc(userId)
      .get()
      .pipe(
        switchMap((userDoc: any) => {
          if (userDoc.exists) {
            const userData = userDoc.data();
            const taskIds = userData.tasks.map((task: any) => task.taskId);
            if (taskIds.length === 0) {
              return from([[]]);
            }
            const tasksObservables = taskIds.map((taskId: string) => {
              return this.firestore
                .collection('tasks')
                .doc(taskId)
                .get()
                .pipe(
                  map((taskDoc: any) => {
                    if (taskDoc.exists) {
                      return { id: taskDoc.id, ...taskDoc.data() };
                    }
                    return null;
                  })
                );
            });
            return forkJoin(tasksObservables) as Observable<any[]>;
          }
          return from([[]]);
        })
      );
  }

  getAllTasks(): Observable<any[]> {
    return this.firestore
      .collection<any>('tasks')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data() as any;

            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  assignTask(
    taskId: string,
    newUserId: string,
    newUserName: string,
    currentUserId?: string
  ): Observable<void> {
    return new Observable<void>((observer) => {
      const updateUserTasks = (
        userId: string,
        taskId: string,
        add: boolean
      ) => {
        return new Observable<void>((subObserver) => {
          this.firestore
            .collection('users')
            .doc(userId)
            .get()
            .subscribe({
              next: (doc: any) => {
                if (doc.exists) {
                  const userData = doc.data();
                  let tasks = userData.tasks || [];

                  if (add) {
                    // Check if the task is already assigned to the user
                    if (tasks.find((task: any) => task.taskId === taskId)) {
                      subObserver.error('Task already assigned to the user');
                      return;
                    }
                    tasks.push({ taskId, taskTitle: '' }); // Adjust taskTitle as needed
                  } else {
                    // Remove the task from the user's tasks array
                    tasks = tasks.filter((task: any) => task.taskId !== taskId);
                  }

                  // Update the user's tasks array in Firestore
                  this.firestore
                    .collection('users')
                    .doc(userId)
                    .update({ tasks })
                    .then(() => {
                      subObserver.next();
                      subObserver.complete();
                    })
                    .catch((error) => {
                      subObserver.error(error);
                    });
                } else {
                  subObserver.error('User not found');
                }
              },
              error: (error) => {
                subObserver.error(error);
              },
            });
        });
      };

      const updateTask = (
        taskId: string,
        newUserId: string,
        newUserName: string
      ) => {
        return this.firestore.collection('tasks').doc(taskId).update({
          assignedTo: newUserName,
          assignedToId: newUserId,
        });
      };

      // If there is a current user, remove the task from the current user first
      if (currentUserId) {
        updateUserTasks(currentUserId, taskId, false).subscribe({
          next: () => {
            // Assign the task to the new user
            updateUserTasks(newUserId, taskId, true).subscribe({
              next: () => {
                // Update the task with the new assigned user
                updateTask(taskId, newUserId, newUserName)
                  .then(() => {
                    observer.next();
                    observer.complete();
                  })
                  .catch((error) => {
                    observer.error(error);
                  });
              },
              error: (error) => {
                observer.error(error);
              },
            });
          },
          error: (error) => {
            observer.error(error);
          },
        });
      } else {
        // Assign the task to the new user directly
        updateUserTasks(newUserId, taskId, true).subscribe({
          next: () => {
            // Update the task with the new assigned user
            updateTask(taskId, newUserId, newUserName)
              .then(() => {
                observer.next();
                observer.complete();
              })
              .catch((error) => {
                observer.error(error);
              });
          },
          error: (error) => {
            observer.error(error);
          },
        });
      }
    });
  }

  changeTaskStatus(taskId: string, newStatus: string): Observable<void> {
    return new Observable<void>((observer) => {
      this.firestore
        .collection('tasks')
        .doc(taskId)
        .update({ status: newStatus })
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
