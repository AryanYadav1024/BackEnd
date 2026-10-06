/* 
    This is the entry point of our project just like in react it was where 
    React.createRoot(doucment.querySelector('#root')).render(
        <App />
    )
    In react main.jsx was our react entry point into our project 
    similarly here it is index.js
*/
console.log("Hello aryan");

// ==================== NPM INIT & PACKAGE.JSON ====================

// npm = Node Package Manager
// It is used to manage packages/dependencies and project configuration.

// `npm init` initializes the current folder as an npm project.
// It creates a `package.json` file containing project metadata/configuration.

// package.json = manifest/configuration file of the project.
// It commonly contains:
// - name        → project/package name
// - version     → current project version
// - description → project description
// - author      → project author
// - scripts     → commands that can be run using npm
// - dependencies → packages required by the application
// - devDependencies → packages needed only during development

// `npm init -y` creates package.json using default values
// without asking the initialization questions.

// IMPORTANT:
// npm is the package manager, while Node.js is the JavaScript runtime.

// After installing a package:
// `npm install express`
// npm adds Express to package.json and installs it in node_modules.

// node_modules → contains the actual installed packages/code.

// package-lock.json → records the exact versions/dependency tree
// installed, making installations more consistent across machines.

// Basic relationship:
//
// package.json
//      ↓
// tells npm what packages the project needs
//      ↓
// npm install
//      ↓
// node_modules
//      ↓
// contains the actual package code

