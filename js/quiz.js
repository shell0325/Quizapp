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
  }
  /**
   *クイズのカテゴリーを取得
   * @memberof Quiz
   */
  getQuizCategory(index) {
    return this._quizzes[index - 1].category;
  }

  /**
   *クイズの難易度を取得
   * @memberof Quiz
   */
  getQuizDifficulty(index) {
    return this._quizzes[index - 1].difficulty;
  }
  /**
   *クイズの問題を取得
   * @memberof Quiz
   */
  getQuizQuestion(index) {
    return this._quizzes[index - 1].question;
  }
  /**
   *クイズの数を取得
   * @memberof Quiz
   */
  getNumQuiz() {
    return this._quizzes.length;
  }
  /**
   *クイズの答えを取得
   * @memberof Quiz
   */
  getQuizAnswer(index) {
    return this._quizzes[index - 1].correct_answer;
  }
  /**
   *クイズの間違っている回答を取得
   * @memberof Quiz
   */
  /**
   *正答数を数える
   * @memberof Quiz
   */
  getIncorrectAnswer(index) {
    return this._quizzes[index - 1].incorrect_answers;
  }
  getCorrectAnswer(index, answer) {
    const CorrectAnswer = this._quizzes[index - 1].correct_answer;
    if (answer === CorrectAnswer) {
      return this._corrextAnswerNum++;
    }
  }
  /**
   *正答数を取得
   * @memberof Quiz
   */
  GetCorrectAnswerNum() {
    return this._corrextAnswerNum;
  }
}

startButton.addEventListener("click", () => {
  startButton.hidden = true;
  fetchQuizData(1);
});

/**
 *クイズのデータをURLから取得する処理
 * @param {*} index
 */
const fetchQuizData = async (index) => {
  titleElement.textContent = "取得中";
  questionElement.textContent = "少々お待ち下さい";

  const response = await fetch(API_URL);
  const quizData = await response.json();
  const quizInstance = new Quiz(quizData);
  makeQuiz(quizInstance, index);
  console.log(quizInstance);
};

/**
 *クイズを作成する処理
 * @param {*Quizの結果が入っている変数} quizInstance
 * @param {*} index
 */
const makeQuiz = (quizInstance, index) => {
  titleElement.textContent = `問題${index}`;
  questionElement.innerHTML = `【クイズ】${quizInstance.getQuizQuestion(
    index
  )}`;
  quizCategory.textContent = `【ジャンル】${quizInstance.getQuizCategory(
    index
  )}`;
  quizDifficult.textContent = `【難易度】${quizInstance.getQuizDifficulty(
    index
  )}`;

  const answers = quizAnswer(quizInstance, index);

  answers.forEach((answer) => {
    const buttonList = document.createElement("li");
    quizList.appendChild(buttonList);
    const buttonElement = document.createElement("button");
    buttonElement.innerHTML = answer;
    buttonList.appendChild(buttonElement);

    buttonElement.addEventListener("click", () => {
      quizInstance.getCorrectAnswer(index, answer);
      index++;
      quizList.textContent = "";
      setNextQuiz(quizInstance, index);
    });
  });
};

/**
 *クイズを終了させる処理
 * @param {*} quizInstance
 */
const finishQuiz = (quizInstance) => {
  titleElement.textContent = `あなたの正答数は${quizInstance.GetCorrectAnswerNum()}です!!`;
  questionElement.textContent = "再度チャレンジしたい場合は以下をクリック!!";
  quizCategory.textContent = "";
  quizDifficult.textContent = "";
  const homeButton = document.createElement("button");
  homeButton.textContent = "ホームに戻る";
  homeButton.addEventListener("click", () => {
    location.reload();
  });

  quizList.appendChild(homeButton);
};

/**
 *クイズを終了するか継続するかを判断する処理
 * @param {*} quizInstance
 * @param {*} index
 */
const setNextQuiz = (quizInstance, index) => {
  if (index <= quizInstance.getNumQuiz()) {
    makeQuiz(quizInstance, index);
  } else {
    finishQuiz(quizInstance);
  }
};

/**
 *クイズの回答の選択肢をランダムで表示させる処理
 * @param {*} [...array]
 * @return {*}
 */
const shuffleQuiz = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

/**
 *クイズの回答を一つの配列にまとめる処理
 * @param {*} quizInstance
 * @param {*} index
 */
const quizAnswer = (quizInstance, index) => {
  const answers = [
    quizInstance.getQuizAnswer(index),
    ...quizInstance.getIncorrectAnswer(index),
  ];
  return shuffleQuiz(answers);
};