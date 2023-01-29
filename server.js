const mongoose = require("mongoose");
const commander = require("commander");
require("dotenv").config();
const db = require("./config/db");
const accountSchema = require("./schema/accountSchema");

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to Database Successfully");
});

const Account = mongoose.model("banking", accountSchema);
commander
  .command("create <code> <name>")
  .description("Create a new account with zero balance")
  .action((code, name) => {
    const newAccount = new Account({ code, name, balance: 0 });
    newAccount.save((err, account) => {
      if (err) return console.error(err);
      console.log(`Account created: ${account}`);
    });
  });

commander
  .command("deposit <code> <amount>")
  .description("Deposit amount to an existing account")
  .action((code, amount) => {
    Account.findOne({ code }, (err, account) => {
      if (err) return console.error(err);
      if (!account) return console.log(`Account not found: ${code}`);
      account.balance += parseFloat(amount);
      account.save((err, updatedAccount) => {
        if (err) return console.error(err);
        console.log(`Amount deposit: ${amount}`);
        console.log(`New balance: ${updatedAccount.balance}`);
      });
    });
  });

commander
  .command("withdraw <code> <amount>")
  .description("Withdraw amount from an existing account")
  .action((code, amount) => {
    Account.findOne({ code }, (err, account) => {
      if (err) return console.error(err);
      if (!account) return console.log(`Account not found: ${code}`);
      if (account.balance < amount)
        return console.log("Insufficient balance in account");
      account.balance -= parseFloat(amount);
      account.save((err, updatedAccount) => {
        if (err) return console.error(err);
        console.log(`Amount withdraw: ${amount}`);
        console.log(`New balance: ${updatedAccount.balance}`);
      });
    });
  });

commander
  .command("balance <code>")
  .description("Total amount in account")
  .action((code, amount) => {
    Account.findOne({ code }, (err, account) => {
      if (err) {
        return console.log(err);
      } else if (!account) {
        return console.log(`Account not found: ${code}`);
      }
      console.log(`Name : ${account.name}`);
      console.log(`Balance : ${account.balance}`);
    });
  });
commander.parse(process.argv);
