#!/usr/bin/env node

import inquirer from "inquirer";

class Student {
  private static idCounter = 10000;
  public id: string;
  public courses: string[] = [];
  public balance: number = 0;

  constructor(public name: string) {
    this.id = Student.generateStudentId();
  }

  private static generateStudentId(): string {
    return (this.idCounter++).toString();
  }

  enroll(course: string) {
    this.courses.push(course);
    this.balance += 1000; // Add tuition fee to balance
  }

  viewBalance(): number {
    return this.balance;
  }

  payTuition(amount: number) {
    if (amount <= this.balance) {
      this.balance -= amount;
    } else {
      console.log(`Insufficient balance. Current balance is ${this.balance}.`);
    }
  }

  showStatus() {
    console.log(`\nStudent ID: ${this.id}`);
    console.log(`Name: ${this.name}`);
    console.log(`Courses Enrolled: ${this.courses.join(", ")}`);
    console.log(`Balance: ${this.balance}\n`);
  }
}

const students: Student[] = [];

async function addStudent() {
  const answers = await inquirer.prompt([
    {
      name: "name",
      message: "Enter student name: ",
      type: "input",
    },
  ]);

  const student = new Student(answers.name);
  students.push(student);
  console.log(`Student ${student.name} added with ID ${student.id}`);
}

async function enrollStudent() {
  const studentIdAnswer = await inquirer.prompt([
    {
      name: "id",
      message: "Enter student ID to enroll in a course: ",
      type: "input",
    },
  ]);

  const student = students.find((s) => s.id === studentIdAnswer.id);

  if (!student) {
    console.log("Student not found!");
    return;
  }

  const courseAnswer = await inquirer.prompt([
    {
      name: "course",
      message: "Enter course to enroll: ",
      type: "input",
    },
  ]);

  student.enroll(courseAnswer.course);
  console.log(`Student ${student.name} enrolled in ${courseAnswer.course}. Tuition fee is ${student.balance}.`);
}

async function viewStudentBalance() {
  const studentIdAnswer = await inquirer.prompt([
    {
      name: "id",
      message: "Enter student ID to view balance: ",
      type: "input",
    },
  ]);

  const student = students.find((s) => s.id === studentIdAnswer.id);

  if (!student) {
    console.log("Student not found!");
    return;
  }

  console.log(`Balance for student ${student.name}: ${student.viewBalance()}`);
}

async function payTuition() {
  const studentIdAnswer = await inquirer.prompt([
    {
      name: "id",
      message: "Enter student ID to pay tuition: ",
      type: "input",
    },
  ]);

  const student = students.find((s) => s.id === studentIdAnswer.id);

  if (!student) {
    console.log("Student not found!");
    return;
  }

  const amountAnswer = await inquirer.prompt([
    {
      name: "amount",
      message: "Enter amount to pay: ",
      type: "number",
    },
  ]);

  const amountToPay = amountAnswer.amount;

  if (amountToPay > student.balance) {
    console.log(`Cannot pay ${amountToPay}. The balance is only ${student.balance}.`);
    return;
  }

  student.payTuition(amountToPay);
  console.log(`Student ${student.name} paid ${amountToPay}. New balance is ${student.balance}.`);
}

async function showStudentStatus() {
  const studentIdAnswer = await inquirer.prompt([
    {
      name: "id",
      message: "Enter student ID to show status: ",
      type: "input",
    },
  ]);

  const student = students.find((s) => s.id === studentIdAnswer.id);

  if (!student) {
    console.log("Student not found!");
    return;
  }

  student.showStatus();
}

async function main() {
  let exit = false;

  while (!exit) {
    const actionAnswer = await inquirer.prompt([
      {
        name: "action",
        message: "Choose an action: ",
        type: "list",
        choices: [
          "Add Student",
          "Enroll Student",
          "View Balance",
          "Pay Tuition",
          "Show Status",
          "Exit",
        ],
      },
    ]);

    switch (actionAnswer.action) {
      case "Add Student":
        await addStudent();
        break;
      case "Enroll Student":
        await enrollStudent();
        break;
      case "View Balance":
        await viewStudentBalance();
        break;
      case "Pay Tuition":
        await payTuition();
        break;
      case "Show Status":
        await showStudentStatus();
        break;
      case "Exit":
        exit = true;
        break;
    }
  }
}

main();
