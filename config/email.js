const mailer = require("nodemailer");

const transporter = mailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.PASSWORD,
  }
});


exports.sendLoginMail = function (userAvailable) {
  transporter.verify((err, success) => {
    if (err) console.log(err);
    else if(success) {
      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: userAvailable.email,
        subject: "Testing",
        html: `<h1>You just logged</h1><br><a href="https://healthandwellbeing-io.onrender.com/landing">If not you click here!</a>`,
        text: "You just logged in!"
      };

      transporter.sendMail(mailOptions, (err, mssg) => {
        if (err) console.log(err);
        else console.log(mssg);
      });
    }
  });
};

exports.sendRegistrationMail = function(name ,email ,token){
  transporter.verify((err,success)=>{
    if(err) console.log(err);
    else if(success){
      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: "Verification of Email ",
        html: `
        <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv='refresh' content='5; URL=/login'>
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f4f4;
            margin: 0;
        }
        .container {
            text-align: center;
            background: white;
            padding: 50px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }
        h1 {
            margin-bottom: 20px;
            color: #333;
        }
        p {
            margin-bottom: 30px;
            color: #666;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: white;
            background-color: #007bff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
        }
        .btn:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Email Verification</h1>
        <p>Hello ${name},</p>
        <p>We Recently found you registered at Health Wellbeing</p>
        <p>Thank you for registering with us. Please click the button below to verify your email address.</p>
        <a href="https://healthandwellbeing-io.onrender.com/verify/${token}" class="btn">Verify Email</a>
    </div>
</body>
        </html>`
      }

    transporter.sendMail(mailOptions, (err, mssg) => {
      if (err) console.log(err);
      else console.log(mssg);
    });
  }
  })
}

exports.sendMedMail = function(userEmail,medName,medDesc){
  transporter.verify((err,success)=>{
    if(err){
      console.log(err);
    }
    else{
      const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: userEmail,
      subject: `Medicine Remainder`,
      html: `<h1>Medicine Remainder</h1><br><p>Medicine Name : ${medName}<br>Medicine description : ${medDesc}</p>`
      };

      transporter.sendMail(mailOptions,(err,mssg)=>{
        if(err) console.log(err);
        else console.log(mssg);
      })
    }
  })
}

exports.sendReport = function(userId,userName){
  transporter.verify((err,success)=>{
    if(err){
    console.log(err);
  }
  else{
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: process.env.EMAIL_USERNAME,
      subject: `Weekly Report`,
      html: `<h1>Weekly Report</h1><br><p>Report for user
      ${userName}</p>`,
      attachments : [
        {
          filename : `${userId}-${userName}.csv`,
          path : `./dev-data/${userId}-${userName}.csv`
        }
      ]
    };

    transporter.sendMail(mailOptions,(err,mssg)=>{
      if(err) console.log(err);
      else console.log(mssg);
    })
  }
}
)
}