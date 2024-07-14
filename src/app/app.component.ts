import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  DocumentReference,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'task-managment';

  constructor(private fs: AngularFirestore) {}
  ngOnInit(): void {
    this.fs
      .collection('tasks')
      .valueChanges()
      .subscribe((data) => {
        console.log(data);
      });
  }
}
