# final-project-video-analyzer

## Installation

```bash
npm install
npm install axios
npm install express
npm install cors dotenv
npm install helmet bcryptjs
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