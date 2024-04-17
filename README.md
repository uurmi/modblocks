# Fuse - Admin template and Starter project for Angular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli)

## About the Application

You can save & load ranges or formats on the Excel worksheet to/from the database from the "My Collection" page,
available once logged in. Login can be done either by creating an account with a valid e-mail or through Google
Authentication.

## Development server

Run `npm start` for a dev server. Sideload the application inside and Excel project (as an add-in). The app will
automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also
use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out
the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Turning the fuse application into an add-in

First create a new Excel add-in using Yeoman Generator, using the "yo office" command. Copy the newly generated manifest
file from the add-in project, and paste it into your project (the fuse one). You will then need to add some dependencies
into your package.json file, using npm. The dependencies are the following : "@types/office-js", "office-toolbox" and "
browser-sync". Add "office-js" in your tsconfig.app.json file, under the "types" array. Add two necessary office-js
scripts from Microsoft into your index.html file :
"<script type="text/javascript" src="https://appsforoffice.microsoft.com/lib/1.1/hosted/office.js"></script>"
"<script src="https://static2.sharepointonline.com/files/fabric/office-ui-fabric-js/1.4.0/js/fabric.min.js"></script>".
Bootstrap the application through office-js, so you can run it as an add-in. This is done in the main.ts file:
"Office.initialize = reason =>{ platformBrowserDynamic().bootstrapModule(AppModule)
.catch(err => console.error(err)); };". Add a hashing strategy for routing into your app module by adding the following
entry into the providers array:
"{provide: LocationStrategy, useClass: HashLocationStrategy}". You can now run your application with ng serve, you must
however enable ssl and change the server port to 3000.
"ng serve --port 3000 --ssl true --ssl-key ./node_modules/browser-sync/certs/server.key --ssl-cert
./node_modules/browser-sync/certs/server.crt". You can also change the "npm start" script to the command mentioned above
in the package.json file.

