import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { forkJoin, from, map, Observable, switchMap } from 'rxjs';
import { Task } from '../models/tasks/tasks';
import { User } from '../models/user/user';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private firestore: AngularFirestore) {}

  createTask(task: Task): Observable<any> {
    return new Observable<any>((observer) => {
      this.firestore
        .collection('tasks')
        .add(task)
        .then(() => {
          observer.next({ message: 'Task Created successfully' });
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  updateTask(taskId: string, task: Task): Observable<void> {
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

  // Delete a task
  deleteTask(taskId: string): Observable<void> {
    return new Observable<void>((observer) => {
      // Fetch all users with role 'user'
      this.firestore
        .collection('users', (ref) => ref.where('role', '==', 'user'))
        .get()
        .toPromise()
        .then((querySnapshot: any) => {
          const batch = this.firestore.firestore.batch();
          querySnapshot.forEach((doc: any) => {
            const userData: any = doc.data();
            const updatedTasks = (userData.tasks || []).filter(
              (task: any) => task.taskId !== taskId
            );
            // Update the user's tasks array if it contains the task
            if (userData.tasks) {
              if (updatedTasks.length !== userData.tasks.length) {
                batch.update(doc.ref, { tasks: updatedTasks });
              }
            }
          });
          // Commit the batch update
          return batch.commit();
        })
        .then(() => {
          // Delete the task from the tasks collection
          return this.firestore.collection('tasks').doc(taskId).delete();
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

  getUserTasks(userId: string): Observable<any[]> {
    return this.firestore
      .collection('users')
      .doc(userId)
      .get()
      .pipe(
        switchMap((userDoc: any) => {
          if (userDoc.exists) {
            const userData: any = userDoc.data();
            const taskIds = userData.tasks.map((task: Task) => task.taskId!)!;
            if (taskIds.length === 0) {
              return from([[]]);
            }
            const tasksObservables = taskIds.map((taskId: string) => {
              return this.firestore
                .collection('tasks')
                .doc(taskId)
                .get()
                .pipe(
                  map((taskDoc) => {
                    if (taskDoc.exists) {

                      return { id: taskDoc.id, ...taskDoc.data()! };
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

  getAllTasks(): Observable<Task[]> {
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
              next: (doc) => {
                if (doc.exists) {
                  const userData: User = doc.data()!;
                  let tasks = userData.tasks || [];

                  if (add) {
                    // Check if the task is already assigned to the user
                    if (tasks.find((task: Task) => task.taskId === taskId)) {
                      subObserver.error('Task already assigned to the user');
                      return;
                    }
                    tasks.push({ taskId, taskTitle: '' }); // Adjust taskTitle as needed
                  } else {
                    // Remove the task from the user's tasks array
                    tasks = tasks.filter(
                      (task: Task) => task.taskId !== taskId
                    );
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

      // Check if the task is already assigned to the same user
      if (currentUserId === newUserId) {
        observer.error('Task already assigned to the user');
        return;
      }

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

  changeTaskStatus(taskId: string, newStatus: string): Observable<any> {
    return new Observable<any>((observer) => {
      this.firestore
        .collection('tasks')
        .doc(taskId)
        .update({ status: newStatus })
        .then(() => {
          
          observer.next({message:"status updated succesfully"});

          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
          
        });
    });
  }
}
