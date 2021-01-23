const API_URL = "https://opentdb.com/api.php?amount=10";
const startButton = document.getElementById("startbtn");
const titleElement = document.getElementById("title");
const questionElement = document.getElementById("text");
const quizCategory = document.getElementById("category");
const quizDifficult = document.getElementById("difficulty");
const quizList = document.getElementById("quizList");

class Quiz {
  constructor(quizData) {
    this._quizzes = quizData.results;
    this._corrextAnswerNum = 0;
    console.log(this._quizzes[0].correct_answer);
  }
  getQuizCategory(index) {
    return this._quizzes[index - 1].category;
  }
  getQuizDifficulty(index) {
    return this._quizzes[index - 1].difficulty;
  }
  getQuizQuestion(index) {
    return this._quizzes[index - 1].question;
  }
  getNumQuiz() {
    return this._quizzes.length;
  }
  getQuizAnswer(index) {
    return this._quizzes[index - 1].correct_answer;
  }
  getIncorrectAnswer(index) {
    return this._quizzes[index - 1].incorrect_answers;
  }
  getCorrectAnswer(index, answer) {
    const CorrectAnswer = this._quizzes[index - 1].correct_answer;
    if (answer === CorrectAnswer) {
      return this._corrextAnswerNum++;
    }
  }
  GetCorrectAnswerNum() {
    return this._corrextAnswerNum;
  }
}

startButton.addEventListener("click", () => {
  startButton.hidden = true;
  fetchQuizData(1);
});

const fetchQuizData = async (index) => {
  titleElement.textContent = "取得中";
  questionElement.textContent = "少々お待ち下さい";

  const response = await fetch(API_URL);
  const quizData = await response.json();
  const quizInstance = new Quiz(quizData);
  console.log(quizInstance);
  makeQuiz(quizInstance, index);
};

const makeQuiz = (quizInstance, index) => {
  titleElement.textContent = `問題${index}`;
  questionElement.textContent = `【クイズ】${quizInstance.getQuizQuestion(
    index
  )}`;
  quizCategory.textContent = `【ジャンル】${quizInstance.getQuizCategory(
    index
  )}`;
  quizDifficult.textContent = `【難易度】${quizInstance.getQuizDifficulty(
    index
  )}`;

  const answers = [
    quizInstance.getQuizAnswer(index),
    ...quizInstance.getIncorrectAnswer(index),
  ];
  // ShuffleQuiz(answers);

  answers.forEach((answer) => {
    console.log(answer)
    const buttonList = document.createElement("li");
    quizList.appendChild(buttonList);
    const buttonElement = document.createElement("button");
    buttonElement.innerHTML = answer;
    buttonList.appendChild(buttonElement);
    buttonElement.addEventListener("click", () => {
      quizInstance.getCorrectAnswer(index, answer);
      index++;
      quizList.textContent = '';
      setNextQuiz(quizInstance, index)
    });
  });
};

const finishQuiz = (quizInstance) => {
  titleElement.textContent = `あなたの正答数は${quizInstance.GetCorrectAnswerNum()}です!!`;
  questionElement.textContent = '再度チャレンジしたい場合は以下をクリック!!';
  quizCategory.textContent = '';
  quizDifficult.textContent = '';
  const homeButton = document.createElement('button');
  homeButton.textContent = 'ホームに戻る';
  homeButton.addEventListener('click', () => {
    location.reload();
  })

  quizList.appendChild(homeButton);
}

const setNextQuiz = (quizInstance,index) => {
  if (index <= quizInstance.getNumQuiz()) {
    makeQuiz(quizInstance, index);
  } else {
    finishQuiz(quizInstance);
  }
}

const ShuffleQuiz = ([...array]) => {
  for (const i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
