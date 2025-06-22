const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "clashingfire716@gmail.com", // your Gmail
    pass: "msan mnit vrka jqbu", // app password
  },
});

async function sendTaskAssignedEmail(user, task, team) {
  const mailOptions = {
    from: `"Task Manager" <${process.env.GMAIL_USER}>`,
    to: user.email,
    subject: `New Task Assigned: ${task.title}`,
    text: `
Hi ${user.name},
 
You have been assigned a new task as part of your team: ${task?.team?.name}.

Task Details:
- Title: ${task.title}
- Description: ${task.description || "No description provided"}
- Status: ${task.status}
- Priority: ${task.priority}
- Progress: ${task.progress}%
- Deadline: ${
      task.deadline ? new Date(task.deadline).toDateString() : "Not set"
    }

Team Info:
- Team Name: ${task.team?.name}
- Team Members: ${task.team?.members?.length}
- Team Leader: ${task.team?.leader === user._id.toString() ? "You" : "Another Member"}

Please log in to the portal to view more details and begin working on the task.

Best regards,  
Task Management System
    `.trim(),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(` Email sent to ${user.email}`);
  } catch (err) {
    console.error(` Failed to send email to ${user.email}:`, err);
  }
}

module.exports = {
  sendTaskAssignedEmail,
};
