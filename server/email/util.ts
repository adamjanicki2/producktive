import Nodemailer from "nodemailer";
import stripMarkdown from "remove-markdown";
import dotenv from "dotenv";
import type { Task } from "../task/model";
import type { User } from "../user/model";

dotenv.config();

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

const sendEmail = async (
  recipient: string,
  subject: string,
  html: string
): Promise<boolean> => {
  if (!email || !password) return false;
  const transporter = Nodemailer.createTransport({
    service: "gmail",
    port: 465,
    host: "smtp.gmail.com",
    secure: true,
    auth: { user: email, pass: password },
  });

  const mail = await transporter.sendMail({
    from: `Producktive Duck <${email}>`,
    to: recipient,
    subject,
    html,
  });
  return !!mail;
};

const TEMPLATE = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="author" content="Adam Janicki" />
    <link rel="stylesheet" href="https://unpkg.com/tachyons@4/css/tachyons.min.css">
    <title>Producktive</title>
    <style>
      hr {
        border: 1px solid #3B4B35;
        color: #3B4B35;
        width: 80%;
      }
      .m-auto {
        margin-left: auto;
        margin-right: auto;
      }
      .link {
        border-bottom: 2px solid #A3C585;
        text-decoration: none;
        color: #3B4B35;
      }
      .link:hover {
        background-color: #A3C585;
      }
      .App-logo {
        height: 300px;
        width: 300px;
        pointer-events: none;
      }
      @media (prefers-reduced-motion: no-preference) {
          .App-logo {
            animation: App-logo-spin infinite 36s linear;
          }
      }
      @keyframes App-logo-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
      }
    </style>
  </head>
  <body style="color: #3B4B35; background-color: #DDEAD1; font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'Segoe UI', 'Roboto'">
    <div class="flex flex-column pa3">
    __BODY__
    </div>
  </body>
</html>
`;

const DIFF_TO_COLOR = {
  easy: "green",
  medium: "orange",
  hard: "dark-red",
} as const;

/**
 * Generates the HTML for the email
 *
 * @param user user to send to
 * @param tasks non-empty array of tasks
 * @returns html string and plain text string
 */
export const constructEmail = (user: User, tasks: Task[]): string => {
  let html = `<h1 class="tc f-subheadline ma0 pa0">Quack!</h1> <h2 class="tc f2">Hi ${user.username}, it's time to come see your duck!</h2> `;
  html += "<h2 class='tc f2'>Here are your upcoming tasks:</h2>";
  html += "<ol style='margin-left: auto; margin-right: auto;'>";
  tasks.forEach((task) => {
    const content = stripMarkdown(task.content);
    html += `<li class="f3 fw3 bg-near-white ba pa2 mv2 b--near-black"><a class="link" target="_blank" rel="noreferrer" href="https://producktive.vercel.app/list/${
      task.parent._id
    }">${content}<a> <span>Due by ${task.deadline?.toLocaleDateString()}</span> [<span class="b i ${
      DIFF_TO_COLOR[task.difficulty]
    }">${task.difficulty}</span>]</li>`;
  });
  html += "</ol>";
  html += "<hr />";
  html += `<p class="tc f3">Click <a target="_blank" rel="noreferrer" href="https://producktive.vercel.app">here</a> to go to your duck!</p>`;
  html += `<p class="tc f3">Click <a target="_blank" rel="noreferrer" href="https://producktive.vercel.app/settings">here</a> to change your notification settings!</p>`;
  html +=
    "<img class='App-logo m-auto' src='https://producktive.vercel.app/logo512.png' alt='logo' />";
  return TEMPLATE.replace("__BODY__", html);
};

export default sendEmail;
