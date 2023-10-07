# Developer

Optional 1
1. Rename DEV.npmrc to .npmrc
2. Run Npm i 

** Do not commit .npmrc to SVN

```
If you still unable to build
```
1. Disable soho
2. Del folder node_modules
3. Del file package-lock.json
4. Rename DEV.npmrc to .npmrc
5. npm cache clean --force
6. npm i --force

Optional 2
npm config set registry http://ghq-oss01v-p:8081/repository/npm-public/

If you still unable to build
```
1. Disable soho
2. Del folder node_modules
3. Del file package-lock.json
5. npm cache clean --force
6. npm i --force

````````````````````````````````````

click "Find in Folder" or default key binding: Alt + Shift + F

## Development server

Refer to one of the following:

- `npm run start:shc` for Smart Home Cover

To view multiple components at the same time, you may pass in a different port like this:

```
npm run start:shc -- --port 4201
```
npm run start:npl

## Generating a new application

1. Run this:

   ```
   ng generate application allianz-<name>
   ```

   For example: `ng generate application smart-home-cover`.


2. Open up `package.json` and add in the new scripts so that it's more convenient to run the serve/build command.

3. Update the `README.md` and list out the new script command that was just added in.

4. Done! You may now start development on the new application.

## Local Run
npm run start:shc
npm run start:ms
npm run start:mo
npm run start:tc
npm run start:ps

## Build Angular
-- prod
npm run build:shc:prod
npm run build:ms:prod
npm run build:npl
npm run build:mo:prod

-- dr
npm run build:shc:dr
npm run build:ms:dr
npm run build:mo:dr

-- sit
npm run build:shc:sit
npm run build:ms:sit
npm run build:mo:sit
npm run build:tc:sit
npm run build:ps:sit


-- UAT
npm run build:shc:uat
npm run build:ms:uat
npm run build:mo:uat
npm run build:tc:uat
npm run build:ps:uat

## Build War
mvn clean package
mvn clean package -f pom-shc.xml
mvn clean package -f pom-npl.xml
mvn clean package -f pom-ms.xml
mvn clean package -f pom-mo.xml
mvn clean package -f pom-atc.xml
mvn clean package -f pom-ate.xml
mvn clean package -f pom-scbmy.xml

## NODE version 
The Angular CLI requires a minimum Node.js version of either v18.10.

## NDBX Referance
https://ndbx.azurewebsites.net/NDBXPL/index.html
 
user: ndbx
pass: ndbxtest
 
https://ndbx-extensions.kxlabs.io/viewer/documentation/quote-buy/overview

https://ngx-ndbx.frameworks.allianz.io/documentation

https://github.developer.allianz.io/search?p=2&q=home&type=Repositories

https://ndbx-extensions.kxlabs.io/viewer/welcome


ABS
https://getquote.allianz.com.my/microsite/business-shield/P1P2P3/get-info


## date-field/date-field.module
Add in module
DateFieldModule,
NxMomentDateModule