<h1 align="center">final-project-video-analyzer</h1>
Video Analyzer is a  application designed to offer users a platform for managing video content. Built using React for the frontend, Node.js for the backend, and MongoDB for database management, this application ensures a efficient user experience.
![App Image](https://github.com/agiledev-students-spring2024/4-final-project-video-analyzer/raw/master/images/appImage.png)


## Live Application

Access the live deployment of our video analyzer application. It is hosted on DigitalOcean. Here you can test all the features of the application in real-time.

[Visit Video Analyzer App](https://octopus-app-vrerg.ondigitalocean.app/)

## Installation

```bash
npm install
```
```bash
npm install axios
```
```bash
npm install express
```
```bash
npm install cors dotenv
```
```bash
npm install helmet bcryptjs
```
```bash
npm install jsonwebtoken
```

## Environment Setup

To run this project locally, you will need to set up a few environment variables which are crucial for the application's security and functionality. These variables include sensitive information that should not be hard-coded into the application code or pushed to version control.

### Creating the `.env` File

1. In the root directory of the backend part of this project, create a file named `.env`.
2. Open this file in a text editor of your choice.

### Configuring `JWT_SECRET`

The `JWT_SECRET` is a secret key used for signing and verifying the JWT tokens used in authentication processes. It's important that this key is complex and known only to the server for security reasons. Follow these steps to set it up:

1. Generate a secret key. You can use a tool like openssl or any online string generator to create a secure key. Here's an example command using openssl:
   ```bash
   openssl rand -base64 32
   ```
2. In your .env file, set the `JWT_SECRET`  variable with the key you generated:
   ```bash
   JWT_SECRET=your_generated_secret_here
   ```
   
