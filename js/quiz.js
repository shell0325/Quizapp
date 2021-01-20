const API_URL = "https://opentdb.com/api.php?amount=10";

class Quiz {
  constructor(quizData) {
    this._quizzes = quizData.results;
    this._correctAnswersNum = 0;
    console.log(quizData);
  }
}

const startButton = document.getElementById("startbtn");
const titleElement = document.getElementById("title");
const questionElement = document.getElementById("text");
const quiztype = document.getElementById("quiztype");

startButton.addEventListener("click", (quizInstance, index, quiz) => {
  startButton.hidden = true;
  fetchQuizData();
  const quizgenere = document.createElement("p");
  const quizdifficult = document.createElement("p");
  // quizgenere.textContent = `${quizData[1]}`;
  quizdifficult.textContent = "bbbbbb";
  quiztype.appendChild(quizgenere);
  quiztype.appendChild(quizdifficult);
});

const fetchQuizData = async (index) => {
  titleElement.textContent = "取得中";
  questionElement.textContent = "少々お待ち下さい";

  const response = await fetch(API_URL);
  const Data = await response.json();
  const quizData = Data.results;
  const quizInstance = new Quiz(Data);
  console.log(quizInstance);
  const quizlist = document.getElementById("quizList");

  quizData.forEach((quiz, index) => {
    const quizNumber = document.createElement("li");
    quizNumber.textContent = `${index + 1}番目のクイズ`;
    quizlist.appendChild(quizNumber);

    const quizContents = (quiz) => {
      const quizContainer = document.createElement("ul");
      for (const prop in quiz) {
        const item = document.createElement("li");
        item.innerHTML = `${prop} : ${quiz[prop]}`;
        quizContainer.appendChild(item);
        titleElement.textContent = `問題${index + 1}`;
        questionElement.textContent = "成功";
      }
      return quizContainer;
    };

    const quizDatalist = quizContents(quiz);
    quizNumber.appendChild(quizDatalist);
  });
};
