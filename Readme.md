# Health and Wellbeing Platform

[Live Demo](https://healthandwellbeing-io.onrender.com/)

## Functionalities

### Basic Functionality
- **Authentication**: Secure login and registration for users.
- **Medication Management**: Users can add medications with options for one-time or recurring reminders.
- **Recurring Medication Reminders**: Daily and weekly reminders for medications.
- **Reports Generation**: Generate reports of medications taken by users.
- **Email Notifications**: Send medication reminders and reports via email.

### Session Management
- **Basic Session Management**: Secure user sessions using JWT (we can also use `express-session`).

### Cron Jobs
- **Medication Reminders**: Schedule reminders for medications using cron jobs.
- **Report Generation**: Generate and send weekly reports using queues.

### Emails
- **Nodemailer**: Send email notifications using Nodemailer and Google App Passwords.

### File Storage
- **Multer**: Use Multer for file uploads on the server.
- **Cloudinary**: Option to use Cloudinary for cloud storage.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Adi1827/healthandwellbeing.io
2. Navigate into the project directory:
   ```sh
   cd healthandwellbeing.io
3. Install the dependencies:
   ```sh
   npm install
4. Create a .env file in the root directory and add your environment variables:
   ```sh
   PORT = port-number
   SECRET_KEY = your-secret-key
   DATABASE = your-database-name
   DATABASE_UNAME = your-database-uname
   DATABASE_PWD = your-db-pwd
   EMAIL_UNAME = your-email
   password = your-password
5. Run the application:
   ```sh
   npm start
