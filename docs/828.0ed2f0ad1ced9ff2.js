"use strict";(self.webpackChunktask_managment=self.webpackChunktask_managment||[]).push([[828],{6828:(A,C,d)=>{d.d(C,{J:()=>l});var t=d(5879),D=d(5790),h=d(3354),f=d(6814),g=d(6697);function x(n,c){if(1&n&&(t.TgZ(0,"p",7)(1,"span"),t._uU(2,"Assigned To:"),t.qZA(),t._uU(3),t.qZA()),2&n){const e=t.oxw();t.xp6(3),t.hij(" ",e.task.assignedTo," ")}}function E(n,c){if(1&n&&(t.TgZ(0,"p",7)(1,"span"),t._uU(2,"Created By:"),t.qZA(),t._uU(3),t.qZA()),2&n){const e=t.oxw();t.xp6(3),t.hij(" ",e.task.createdBy,"")}}function Z(n,c){if(1&n){const e=t.EpF();t.TgZ(0,"a",19),t.NdJ("click",function(){t.CHM(e);const s=t.oxw();return t.KtG(s.editTask(s.task))}),t._UZ(1,"i",15),t._uU(2," Edit "),t.qZA()}}function p(n,c){if(1&n){const e=t.EpF();t.TgZ(0,"li")(1,"button",21),t.NdJ("click",function(){const _=t.CHM(e).$implicit,m=t.oxw(2);return t.KtG(m.assignTask(m.task,_))}),t._uU(2),t.qZA()()}if(2&n){const e=c.$implicit;t.xp6(2),t.hij(" ",e.userName," ")}}function w(n,c){if(1&n&&(t.TgZ(0,"li")(1,"a",14),t._UZ(2,"i",15),t._uU(3," Asign To \xa0 \xa0 \xbb"),t.qZA(),t.TgZ(4,"ul",16),t.YNc(5,p,3,1,"li",20),t.qZA()()),2&n){const e=t.oxw();t.xp6(5),t.Q6J("ngForOf",e.users)}}function i(n,c){if(1&n){const e=t.EpF();t.TgZ(0,"a",22),t.NdJ("click",function(){t.CHM(e);const s=t.oxw();return t.KtG(s.changeTaskStatus(s.task,"To Do"))}),t._uU(1," To Do "),t.qZA()}}function o(n,c){if(1&n){const e=t.EpF();t.TgZ(0,"a",22),t.NdJ("click",function(){t.CHM(e);const s=t.oxw();return t.KtG(s.changeTaskStatus(s.task,"In Progress"))}),t._uU(1," In Progress "),t.qZA()}}function a(n,c){if(1&n){const e=t.EpF();t.TgZ(0,"a",22),t.NdJ("click",function(){t.CHM(e);const s=t.oxw();return t.KtG(s.changeTaskStatus(s.task,"Done"))}),t._uU(1," Done "),t.qZA()}}function u(n,c){if(1&n){const e=t.EpF();t.TgZ(0,"a",23),t.NdJ("click",function(){t.CHM(e);const s=t.oxw();return t.KtG(s.deleteTask(s.task))}),t._UZ(1,"i",15),t._uU(2," Delete "),t.qZA()}}let l=(()=>{class n{constructor(e,r){this.taskService=e,this.message=r,this.userRole=null,this.emitTaskData=new t.vpe}ngOnInit(){this.userRole=localStorage.getItem("userRole")}assignTask(e,r){this.taskService.assignTask(e.id,r.id,r.userName,e.assignedToId).subscribe({next:()=>{this.message.toast("Task Assigned Successfully","success")},error:s=>{this.message.toast(s,"error")}})}editTask(e){this.emitTaskData.emit({taskData:e})}changeTaskStatus(e,r){this.taskService.changeTaskStatus(e.id,r).subscribe({next:()=>{e.status=r,this.message.toast(`Task status updated to ${r} Successfully`,"success")},error:s=>{this.message.toast(s,"error")}})}deleteTask(e){this.message.confirm("Delete!","Are you sure you want to delete it?","primary","question").then(r=>{r.isConfirmed&&this.taskService.deleteTask(e.id).subscribe({next:()=>{this.message.toast(`Task ${e.title} deleted Successfully`,"success")},error:s=>{this.message.toast(s,"error")}})})}static#t=this.\u0275fac=function(r){return new(r||n)(t.Y36(D.M),t.Y36(h.e))};static#e=this.\u0275cmp=t.Xpm({type:n,selectors:[["app-task-card"]],inputs:{task:"task",users:"users"},outputs:{emitTaskData:"emitTaskData"},decls:33,vars:11,consts:[[1,"card","mb-3","d-flex","flex-column","justify-content-start",2,"width","19rem","height","20rem"],[1,"card-body"],[1,"d-flex","justify-content-between"],[1,"details"],[1,"card-title","pe-2"],[1,"card-text","d-block"],["class","card-text",4,"ngIf"],[1,"card-text"],["ngbDropdown","",1,"d-inline-block"],["type","button","id","actionDropdown","ngbDropdownToggle","",1,"btn","btn-sm","rounded-pill"],[1,"ri-more-2-fill"],["ngbDropdownMenu","","aria-labelledby","actionDropdown",1,"dropdown-menu"],["type","button","ngbDropdownItem","","class","btn btn-sm dropdown-item",3,"click",4,"ngIf"],[4,"ngIf"],[1,"btn","btn-sm","dropdown-item"],[1,"ri-chat-forward-line","align-bottom","me-2","text-muted"],[1,"dropdown-menu","dropdown-submenu"],["class","dropdown-item","role","button",3,"click",4,"ngIf"],["role","button","ngbDropdownItem","","class","btn btn-sm dropdown-item",3,"click",4,"ngIf"],["type","button","ngbDropdownItem","",1,"btn","btn-sm","dropdown-item",3,"click"],[4,"ngFor","ngForOf"],[1,"btn","btn-sm","dropdown-item",3,"click"],["role","button",1,"dropdown-item",3,"click"],["role","button","ngbDropdownItem","",1,"btn","btn-sm","dropdown-item",3,"click"]],template:function(r,s){1&r&&(t.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3)(4,"h5",4),t._uU(5),t.qZA(),t.TgZ(6,"p",5),t._uU(7),t.qZA(),t.YNc(8,x,4,1,"p",6),t.YNc(9,E,4,1,"p",6),t.TgZ(10,"p",7)(11,"span"),t._uU(12,"Status:"),t.qZA(),t._uU(13),t.qZA()(),t.TgZ(14,"div",8)(15,"button",9),t._uU(16," Actions "),t._UZ(17,"i",10),t.qZA(),t.TgZ(18,"div",11)(19,"li"),t.YNc(20,Z,3,0,"a",12),t.qZA(),t.YNc(21,w,6,1,"li",13),t.TgZ(22,"li")(23,"a",14),t._UZ(24,"i",15),t._uU(25," Change Status To \xa0 \xa0 \xbb"),t.qZA(),t.TgZ(26,"ul",16)(27,"li"),t.YNc(28,i,2,0,"a",17),t.YNc(29,o,2,0,"a",17),t.YNc(30,a,2,0,"a",17),t.qZA()()(),t.TgZ(31,"li"),t.YNc(32,u,3,0,"a",18),t.qZA()()()()()()),2&r&&(t.xp6(5),t.Oqu(s.task.title),t.xp6(2),t.Oqu(s.task.description),t.xp6(1),t.Q6J("ngIf","manager"===s.userRole||"admin"===s.userRole),t.xp6(1),t.Q6J("ngIf","manager"===s.userRole||"admin"===s.userRole),t.xp6(4),t.hij(" ",s.task.status,""),t.xp6(7),t.Q6J("ngIf","Done"!==s.task.status&&"manager"===s.userRole),t.xp6(1),t.Q6J("ngIf","user"!=s.userRole),t.xp6(7),t.Q6J("ngIf","To Do"!==s.task.status),t.xp6(1),t.Q6J("ngIf","In Progress"!==s.task.status),t.xp6(1),t.Q6J("ngIf","Done"!==s.task.status),t.xp6(2),t.Q6J("ngIf","admin"===s.userRole))},dependencies:[f.sg,f.O5,g.jt,g.iD,g.Vi,g.TH],styles:[".dropdown-menu li{position:relative}.dropdown-menu .dropdown-submenu{display:none;position:absolute;left:9%;top:29px}.dropdown-menu .dropdown-submenu-left{right:100%;left:auto}.dropdown-menu>li:hover>.dropdown-submenu{display:block}.rounded-pill{background-color:#f3f7f7!important;border:1px solid gray}.rounded-pill:hover{border:1px solid gray}.card{overflow-y:auto;overflow-x:auto;background-color:#fafbfb;box-shadow:0 4px 8px #0000001a;border-radius:8px}.card-text{color:#555151;padding:10px 0;line-height:1.5;font-size:15px;font-weight:400;margin-bottom:0}.card-text span{font-weight:700;font-size:14px;color:#3a3636}\n"],encapsulation:2})}return n})()},5790:(A,C,d)=>{d.d(C,{M:()=>Z});var t=d(5592),D=d(4664),h=d(2459),f=d(7398),g=d(9315),x=d(5879),E=d(891);let Z=(()=>{class p{constructor(i){this.firestore=i}createTask(i){return new t.y(o=>{this.firestore.collection("tasks").add(i).then(()=>{o.next({message:"Task Created successfully"}),o.complete()}).catch(a=>{o.error(a)})})}updateTask(i,o){return new t.y(a=>{this.firestore.collection("tasks").doc(i).update(o).then(()=>{a.next(),a.complete()}).catch(u=>{a.error(u)})})}getTask(i){return new t.y(o=>{this.firestore.collection("tasks").doc(i).get().subscribe({next:a=>{a.exists?o.next(a.data()):o.error("Task not found"),o.complete()},error:a=>{o.error(a)}})})}deleteTask(i){return new t.y(o=>{this.firestore.collection("users",a=>a.where("role","==","user")).get().toPromise().then(a=>{const u=this.firestore.firestore.batch();return a.forEach(l=>{const n=l.data(),c=(n.tasks||[]).filter(e=>e.taskId!==i);n.tasks&&c.length!==n.tasks.length&&u.update(l.ref,{tasks:c})}),u.commit()}).then(()=>this.firestore.collection("tasks").doc(i).delete()).then(()=>{o.next(),o.complete()}).catch(a=>{o.error(a)})})}getUserTasks(i){return this.firestore.collection("users").doc(i).get().pipe((0,D.w)(o=>{if(o.exists){const u=o.data().tasks.map(n=>n.taskId);if(0===u.length)return(0,h.D)([[]]);const l=u.map(n=>this.firestore.collection("tasks").doc(n).get().pipe((0,f.U)(c=>c.exists?(console.log(c.data()),{id:c.id,...c.data()}):null)));return(0,g.D)(l)}return(0,h.D)([[]])}))}getAllTasks(){return this.firestore.collection("tasks").snapshotChanges().pipe((0,f.U)(i=>i.map(o=>{const a=o.payload.doc.data();return{id:o.payload.doc.id,...a}})))}assignTask(i,o,a,u){return new t.y(l=>{const n=(e,r,s)=>new t.y(_=>{this.firestore.collection("users").doc(e).get().subscribe({next:m=>{if(m.exists){let T=m.data().tasks||[];if(s){if(T.find(k=>k.taskId===r))return void _.error("Task already assigned to the user");T.push({taskId:r,taskTitle:""})}else T=T.filter(k=>k.taskId!==r);this.firestore.collection("users").doc(e).update({tasks:T}).then(()=>{_.next(),_.complete()}).catch(k=>{_.error(k)})}else _.error("User not found")},error:m=>{_.error(m)}})}),c=(e,r,s)=>this.firestore.collection("tasks").doc(e).update({assignedTo:s,assignedToId:r});u!==o?u?n(u,i,!1).subscribe({next:()=>{n(o,i,!0).subscribe({next:()=>{c(i,o,a).then(()=>{l.next(),l.complete()}).catch(e=>{l.error(e)})},error:e=>{l.error(e)}})},error:e=>{l.error(e)}}):n(o,i,!0).subscribe({next:()=>{c(i,o,a).then(()=>{l.next(),l.complete()}).catch(e=>{l.error(e)})},error:e=>{l.error(e)}}):l.error("Task already assigned to the user")})}changeTaskStatus(i,o){return new t.y(a=>{this.firestore.collection("tasks").doc(i).update({status:o}).then(()=>{a.next(),a.complete()}).catch(u=>{a.error(u)})})}static#t=this.\u0275fac=function(o){return new(o||p)(x.LFG(E.ST))};static#e=this.\u0275prov=x.Yz7({token:p,factory:p.\u0275fac,providedIn:"root"})}return p})()}}]);