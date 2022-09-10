export class Question {
  static create(question) {
    // обращаемся к нашей бд и добавляем к пути /questions.json
    return fetch(
      "https://podcast-6bcba-default-rtdb.firebaseio.com/questions.json",
      {
        method: "POST",
        body: JSON.stringify(question),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        question.id = response.name;
        return question;
      })
      .then(addToLocalStorage)
      .then(Question.renderList);
  }

  static fetch(token) {
    if (!token) {
      return Promise.resolve(`<p class="error">у вас нет токена</p>`);
    }
    return fetch(
      `https://podcast-6bcba-default-rtdb.firebaseio.com/questions.json?auth=${token}`
    )
      .then((response) => response.json())
      .then((response) => {
        if (response && response.error) {
          return `<p class="error"${response.error}</p>`;
        }
        return response
          ? Object.keys(response).map((key) => ({
              ...response[key],
              id: key,
            }))
          : [];
      });
  }

  static renderList() {
    let questions = getQuestionsFromLocalStorage();

    let html = questions.length
      ? questions.map(toCard).join("")
      : `<div class="mui--text-headline">Вы пока ничего не спрашивали</div>`;

    let list = document.getElementById("list");
    list.innerHTML = html;
  }

  static listToHTML(questions) {
    return questions.length
      ? `<ol>${questions.map((q) => `<li>${q.text}</li>`).join("")}</ol>`
      : "<p>Вопросов пока нет</p>";
  }
}

function addToLocalStorage(question) {
  let all = getQuestionsFromLocalStorage();
  all.push(question);
  localStorage.setItem("questions", JSON.stringify(all));
}

function getQuestionsFromLocalStorage() {
  return JSON.parse(localStorage.getItem("questions") || "[]");
}

function toCard(question) {
  return ` <div class="mui--text-black-54">
 ${new Date(question.date).toLocaleDateString()}
 ${new Date(question.date).toLocaleTimeString()}
</div>
<div>
 ${question.text}
</div>`;
}
