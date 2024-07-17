
# Task Management Application

 This project is an Angular-based Task Management application designed to streamline task assignment and tracking within an organization. It provides role-based access control and features to manage tasks efficiently.

## Business Overview
 The Task Management application serves as a centralized platform for managing tasks across different roles within an organization. It allows users to create, assign, update, and track tasks through an intuitive user interface. The application supports the following roles:

## Roles and Responsibilities
 1. Admin:

 - Responsibilities:
   - Manages users and their roles and can delete them.
   - Assign users to managers.
   - Assigns tasks to users.
   - Can delete any task.
   - Can change task status.

 2. Manager:

 - Responsibilities:
   - Manages tasks assigned to their team members.
   - Can assign tasks to his supervised users.
   - Monitors and updates task statuses and can update the task unless its status is done.


3. User:

 - Responsibilities:

   - Receives tasks assigned by Managers or Admins.
   - Updates task progress and status.

   
## Features
 User Authentication: Users can sign up and log in with their email credentials. Authentication ensures secure access to the application based on predefined roles.



## Task Management:

 Create, view, edit, and delete tasks based on user roles and permissions.
 Assign tasks to specific users or teams.
 Update task statuses (e.g., To Do, In Progress, Done) to track progress.
 Role-based Access Control (RBAC): Ensures that each user has appropriate permissions and access levels based on their role (Admin, Manager, User).

 Real-time Updates: Using Firebase Firestore, the application provides real-time updates to tasks and user assignments, ensuring immediate visibility and collaboration.


 ##### live demo for the system 
    
    https://ahmedelsherbeeny.github.io/task-management/auth/login


    sign up as ordinary user.

    sign in with admin:

        email:admin@mail.com
        password:admin

    then edit the users role to manager role or user role 
    then sign in with the manager email and create tasks and assign them to users






This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
