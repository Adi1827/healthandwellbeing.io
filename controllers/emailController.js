const jwt = require("jsonwebtoken");
const schedule = require("node-schedule");
const csv = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");
const Email = require("../config/email");
const Database = require("../models/userModels");

//      S - Seconds, M - Minutes, D - Day of month, M- Month
//     ------------------------------- |  |  |  |  |  |
//     ------------------------------- v  v  v  v  v  v
//     ------------------------------- S  M  H  D  M  Which day of the week (0 - 7) 0 or 7 is Sun
exports.oneTimeJob = async function (req, res) {
  const { medName, medDesc, date, time } = req.body;
  const slicedDate = date.split("-");
  const slicedTime = time.split(":");
  const user = jwt.verify(req.cookies.jwt, process.env.SECRET_KEY);
  const userEmail = await Database.findOne({
    where: {
      userName: user.uname,
    },
    attributes: ["id", "email"],
  });

  const scheduledDate = new Date(
    parseInt(slicedDate[0]),
    parseInt(slicedDate[1]) - 1,
    parseInt(slicedDate[2]),
    parseInt(slicedTime[0]),
    parseInt(slicedTime[1])
  );

  const job = schedule.scheduleJob(
    `${userEmail.id}:${medName}:${user.uname}-${new Date().getTime()}`,
    scheduledDate,
    function () {
      const fileExists = fs.existsSync(
        `./dev-data/${userEmail.id}-${user.uname}.csv`
      );

      const records = [
        { Med: medName, Dosage: "One Time", Date: new Date(scheduledDate) },
      ];

      const csvWriter = csv({
        path: `./dev-data/${userEmail.id}-${user.uname}.csv`,
        header: [
          { id: "Med", title: "Med Name" },
          { id: "Dosage", title: "Dosage" },
          { id: "Date", title: "Date" },
        ],
        append: fileExists,
      });

      Email.sendMedMail(userEmail.email, medName, medDesc);
      csvWriter.writeRecords(records).then(() => {
        console.log("CSV File written");
      });
    }
  );

  const emailReportWeeklyJob = schedule.scheduleJob(
    `${userEmail.id}:${medName}:${user.uname}-${new Date().getTime()}-Report`,
    `${slicedTime[1]} ${slicedTime[0]} * * 6`,
    function () {
      let endTime = scheduledDate;
      endTime.setDate(scheduledDate.getDate() + 7);
      let today = new Date();
      if (today <= endTime) {
        const fileExists = fs.existsSync(
          `./dev-data/${userEmail.id}-${user.uname}.csv`
        );
        console.log(fileExists);
        if (fileExists) {
          Email.sendReport(userEmail.id, user.uname);
        }
      } else if (today >= endTime) {
        emailReportWeeklyJob.cancel();
      }
    }
  );

  res.status(200).send("Done");
};

exports.recurringJob = async function (req, res) {
  if (req.cookies.jwt) {
    const { medFreq } = req.body;
    const user = jwt.verify(req.cookies.jwt, process.env.SECRET_KEY);
    const userEmail = await Database.findOne({
      where: {
        userName: user.uname,
      },
      attributes: ["id", "email"],
    });

    // Daily Med Remainder
    if (medFreq == "daily") {
      const { medName, medDesc, startDate, endDate, time } = req.body;

      const slicedStartDate = startDate.split("-");
      const slicedEndDate = endDate.split("-");
      const slicedTime = time.split(":");

      const startTime = new Date(
        parseInt(slicedStartDate[0]),
        parseInt(slicedStartDate[1]) - 1,
        parseInt(slicedStartDate[2])
      );

      const endTime = new Date(
        parseInt(slicedEndDate[0]),
        parseInt(slicedEndDate[1]) - 1,
        parseInt(slicedEndDate[2])
      );

      const Job = schedule.scheduleJob(
        `${userEmail.id}:${medName}:${user.uname}-${new Date().getTime()}`,
        `${slicedTime[1]} ${slicedTime[0]} * * *`,
        function () {
          let today = new Date();
          if (today >= startTime && today <= endTime) {
            const fileExists = fs.existsSync(
              `./dev-data/${userEmail.id}-${user.uname}.csv`
            );

            const records = [
              {
                Med: medName,
                Dosage: medFreq,
                Date: today,
              },
            ];

            const csvWriter = csv({
              path: `./dev-data/${userEmail.id}-${user.uname}.csv`,
              header: [
                { id: "Med", title: "Med Name" },
                { id: "Dosage", title: "Dosage" },
                { id: "Date", title: "Date" },
              ],
              append: fileExists,
            });

            csvWriter.writeRecords(records).then(() => {
              console.log("CSV written");
            });
            Email.sendMedMail(userEmail.email, medName, medDesc);
            console.log("Email sent");
            console.log(
              "Next Email wii be sent ",
              new Date(Job.nextInvocation())
            );
          } else {
            Job.cancel();
          }
        }
      );

      const emailReportWeeklyJob = schedule.scheduleJob(
        `${userEmail.id}:${medName}:${user.uname
        }-Report`,
        `0 0 0 * 6`,
        function () {
          let today = new Date();
          if (today >= startTime && today <= endTime) {
            const fileExists = fs.existsSync(
              `./dev-data/${userEmail.id}-${user.uname}.csv`
            );
            if (fileExists) {
              Email.sendReport(userEmail.id, user.uname);
            } else if (today >= endTime) {
              emailReportWeeklyJob.cancel();
            }
          }
        }
      );

      res.status(200).send("Done");
    }
    // Weekly Remainder
    else {
      const { medName, medDesc, startDate, endDate, time, day } = req.body;

      const slicedStartDate = startDate.split("-");
      const slicedEndDate = endDate.split("-");
      const slicedTime = time.split(":");
      const startTime = new Date(
        parseInt(slicedStartDate[0]),
        parseInt(slicedStartDate[1]) - 1,
        parseInt(slicedStartDate[2])
      );
      const endTime = new Date(
        parseInt(slicedEndDate[0]),
        parseInt(slicedEndDate[1]) - 1,
        parseInt(slicedEndDate[2])
      );

      const Job = schedule.scheduleJob(
        `${userEmail.id}:${medName}:${user.uname}-${new Date().getTime()}`,
        `${slicedTime[1]} ${slicedTime[0]} * * ${day}`,
        function () {
          let today = new Date();
          if (today >= startTime && today <= endTime) {
            const fileExists = fs.existsSync(`./dev-data/${userEmail.id}-${user.uname}.csv`);

            const records = [
              {
                Med: medName,
                Dosage: medFreq,
                Date: today,
              },
            ];

            const csvWriter = csv({
              path: `./dev-data/${userEmail.id}-${user.uname}.csv`,
              header: [
                { id: "Med", title: "Med Name" },
                { id: "Dosage", title: "Dosage" },
                { id: "Date", title: "Date" },
              ],
              append: fileExists,
            });

            csvWriter.writeRecords(records).then(() => {
              console.log("CSV written");
            });
            Email.sendMedMail(userEmail.email, medName, medDesc);
            console.log("Email sent");
            console.log(
              "Next Email will be sent on ",
              new Date(Job.nextInvocation())
            );
          } else {
            Job.cancel();
          }
        }
      );
      const jobs = Object.keys(schedule.scheduledJobs);

      const emailReportWeeklyJob = schedule.scheduleJob(
        `${userEmail.id}:${medName}:${user.uname
        }-Report`,
        `0 0 0 * 6`,
        function () {
          let today = new Date();
          if (today >= startTime && today <= endTime) {
            const fileExists = fs.existsSync(
              `./dev-data/${userEmail.id}-${user.uname}.csv`
            );
            if (fileExists) {
              Email.sendReport(userEmail.id, user.uname);
            } else if (today >= endTime) {
              emailReportWeeklyJob.cancel();
            }
          }
        }
      );

      res.status(200).send(jobs);
    }
  } else {
    res.redirect("/login");
  }
};
