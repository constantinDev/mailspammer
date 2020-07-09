if (!require("./lib/checkmodules")(["argparse", "nodemailer", "chalk"])) return;

let chalk                = require("chalk");
let nodemailer           = require("nodemailer");
let fs                   = require("fs");
const { ArgumentParser } = require("argparse");

let argparse = new ArgumentParser({ addHelp: true, description: "Lets you send mass emails per one account to annother person", version: "1.0.0" })

let auth         = argparse.addArgumentGroup({ description: "Authorizing the API calls",               title: "Authorization" })
let mailsettings = argparse.addArgumentGroup({ description: "Mail settings such as Content and Title", title: "Mail settings" })

auth.addArgument(["-am",  "--authorizator-mail"],     { required: true, help: "The email address of the account to authorize the calls. This will be the mail used to send the emails", dest: "authorizationmail" })
auth.addArgument(["-apw", "--authorizator-password"], { required: true, help: "The password of the address used to authorize the api calls.",                                           dest: "authorizationpass" })

mailsettings.addArgument(["-ti","--title"],      { required: true,  help: "A file to the title of the emails sent",   dest: "mailtitle" })
mailsettings.addArgument(["-c", "--content"],    { required: true,  help: "A file to the content of the emails sent", dest: "mailcontent" })
mailsettings.addArgument(["-d", "--delay"],      { required: false, help: "The delay of emails being sent (In MS)",   dest: "sendingdelay", defaultValue: 1000 })
mailsettings.addArgument(["-i", "--iterations"], { required: false, help: "The amount of emails being sent",          dest: "sendingamount", defaultValue: 10 })
mailsettings.addArgument(["-t", "--target"],     { required: true,  help: "The target's email address",               dest: "targetmail" })

let args = argparse.parseArgs()

if (!Number(args.sendingdelay))       return console.log(chalk`{red [!]} Please provide a valid integer for the delay argument`)
if (!Number(args.sendingamount))      return console.log(chalk`{red [!]} Please provide a valid integer for the iterations argument`)
if (!fs.existsSync(args.mailtitle))   return console.log(chalk`{red [!]} Provided file for the mail title {redBright does not exist}.`)
if (!fs.existsSync(args.mailcontent)) return console.log(chalk`{red [!]} Provided file for the mail content {redBright does not exist}.`)

let title   = fs.readFileSync(args.mailtitle  ,"utf-8")
let content = fs.readFileSync(args.mailcontent,"utf-8")

let service = nodemailer.createTransport({ service: "gmail", auth: { user: args.authorizationmail, pass: args.authorizationpass } })
let i = 0;
console.log(chalk`{magenta [I]} Spamming email {cyanBright ${args.targetmail}} with {cyanBright ${args.sendingamount}} emails. Estimated duration to do so: {cyanBright ${args.sendingdelay*args.sendingamount}ms}`)
setInterval(function () {
    i++;
    if (i > Number(args.sendingamount)) { console.log("[I] Finished sending mails. Exiting script.."); process.exit(0) }
    service.sendMail({ from: "lmao@gmail.com", to: args.targetmail, subject: title, text: content })
}, Number(args.sendingdelay))