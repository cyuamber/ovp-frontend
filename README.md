# ovp-frontend

This project is the frontend part of OVP project. 



## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run start
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### [Change log](./CHANGELOG.md)

### Git commit message rules

PLEASE obey [AngularJS Git Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#) when write the commit messages. One commit message should include three parts: `Header`, `Body` and `Footer`. The `Header` part is necessary, and the other two parts are optional. The `Header` part follows the rule as: `<type>(<scope>): <subject>`. `type` and `subject` are necessary, `scope` is optional. Only 7 tokens are allowed for `type`:
   * feat: new features（feature）
   * fix: fix bugs
   * docs: documentation
   * style: style
   * refactor：reconstruction 
   * test：add test
   * chore：change for construction and assistant tools

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
