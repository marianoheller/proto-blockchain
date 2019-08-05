const inquirer = require("inquirer");
const chalk = require("chalk");
const R = require("ramda");
const API = require("./api");

const init = () => {
  console.log(chalk.green("Stage 1 client"));
};

const secondQuestion = {
  [API.types.CREATE_USER]: [
    {
      name: "user",
      type: "input",
      message: "username?"
    }
  ],
  [API.types.GET_BALANCE]: [
    {
      name: "user",
      type: "input",
      message: "username?"
    }
  ],
  [API.types.TRANSFER]: [
    {
      name: "from",
      type: "input",
      message: "from username?"
    },
    {
      name: "to",
      type: "input",
      message: "to username?"
    },
    {
      name: "amount",
      type: "input",
      message: "amount?"
    }
  ]
};

const parseActions = R.compose(
  R.values,
  R.mapObjIndexed((t, k) => ({ name: k, value: t }))
);

const askQuestions = async () => {
  const question = [
    {
      type: "list",
      name: "action",
      message: "What to run?",
      choices: parseActions(API.types),
      default: 0
    }
  ];

  const { action } = await inquirer.prompt(question);
  const params = await inquirer.prompt(secondQuestion[action]);
  return {
    action,
    params
  };
};

const continueQuestion = async () => {
  const question = [
    {
      type: "list",
      name: "shouldContinue",
      message: "Should we continue?",
      choices: [{ name: "yes", value: true }, { name: "no", value: false }],
      default: 0
    }
  ];
  return inquirer.prompt(question);
};

const run = async () => {
  init();
  let shouldContinue = true;
  while (shouldContinue) {
    const { action, params } = await askQuestions();
    await API.actions[Number(action)](params);
    const ans = await continueQuestion();
    shouldContinue = ans.shouldContinue;
  }
};

run();
