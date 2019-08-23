# ovp-frontend

This project is the frontend part of OVP project. 

### Project structure

```
├── public
│   ├── index.css                           
│   ├── index.html                          
│   ├── favicon.ico                     
├── src
│   ├── App.vue                           
│   ├── main.js                           
│   ├── assets                            # static assets
│   │   ├── logo.png                    
│   │   ├── image                         
│   │   └── ... ...       
│   ├── components                        
│   │   ├── charts                 
│   │   ├── Loading                   
│   │   ├── ... ...
│   │   └── layout                        # layout for the whole project
│   ├── const                            
│   │   ├── apis.js                       # all the apis 
│   │   ├── constant.js                   
│   │   ├── menu.js                       # menu items
│   │   └── ... ...                    
│   ├── mock                              # test data config  
│   │   ├── json                          # specific mock data
│   │   │   ├── address.json                          
│   │   │   └── ... ...    
│   │   ├── mock.js                       # configuration of interface intercepting 
│   │   └── post-to-get.js                # middleware of requesting mock data
│   ├── pages
│   │   ├── TestPage.vue                  # test module
│   │   ├── Home.vue                      # home module
│   │   └── ... ...                       # other functional modules
│   ├── router                            
│   │   └── router.js      
│   ├── store                             # store for vuex
│   │   ├── index.js    
│   │   ├── modules
│   │   │   ├── login.js               
│   │   │   ├── router.js             
│   │   │   └── ... ...                 
│   ├── utils                             # general functions
│   │   ├── http.js
│   │   ├── utils.js
│   │   └── ... ...
├── .eslintrc.js 
├── .vcmrc                                # config for git message validation
├── babel.config.js    
├── CHANGELOG.md                             
├── package.json   
├── postcss.config.js   
├── READEME.md     
└── vue.config.js                         # config for vue project    
```


### Project setup
```
npm install
```

#### Compiles and hot-reloads for development
```
npm run start
```
#### Compiles and develop with mock data
```
npm run mock
```

#### Compiles and minifies for production
```
npm run build
```

### Mock data

This project allows developers to develop in mock data, which means FEers can develop independently in the beginning of the project developing period. Developers can set mock data in `mock/mock.js`, where supports two methods of creating mock data. The remote method relies on [faker.js](https://github.com/marak/Faker.js/).


### Code rules

Recommend to switch on eslint. The css part obeys the [BEM](http://getbem.com/) methodology.


### Git commit message rules

PLEASE obey [AngularJS Git Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#) when write the commit messages. One commit message should include three parts: `Header`, `Body` and `Footer`. The `Header` part is necessary, and the other two parts are optional. The `Header` part follows the rule as: `<type>(<scope>): <subject>`. `type` and `subject` are necessary, `scope` is optional. Only 7 tokens are allowed for `type`:
   * feat: new features（feature）
   * fix: fix bugs
   * docs: documentation
   * style: style
   * refactor：reconstruction 
   * test：add test
   * chore：change for construction and assistant tools

For an esaier way to commit codes, PLEASE run `git cz ` instead of `git commit -m 'xxxxx'` when you commit the codes. Invalid commit will be rejected by the project.

For example:

```bash
feat(directive): ng:disabled, ng:checked, ng:multiple, ng:readonly, ng:selected
----------------------------------------------------- 
docs(guide): updated fixed docs from Google Docs

Couple of typos fixed:
- indentation
- batchLogbatchLog -> batchLog
- start periodic checking
- missing brace
```


When there is breaking changes in the project, please write the commit message in `Footer`. For example:

```bash 
    BREAKING CHANGE: isolate scope bindings definition has changed.

    To migrate the code follow the example below:

    Before:

    scope: {
      myAttr: 'attribute',
    }

    After:

    scope: {
      myAttr: '@',
    }

    The removed `inject` wasn't generaly useful for directives so there should be no code using it.
```
Also, run the script `npm run changelog` can generate all the `feat` and `fix` commits. Click [CHANGELOG.md](./CHANGELOG.md) shows all these commit histories. 


### Change log

[See the milestones of the project](./CHANGELOG.md)


### Contributor

Copyright 2019 CMCC Corporation.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
