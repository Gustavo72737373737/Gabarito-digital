(() => {
  "use strict";

 const input = document.getElementById("input-questions");

  const CONFIG = {
    totalQuestions: 0,
    alternatives: ["A", "B", "C", "D", "E"],
    endpoint: "/api/answers" // Simulacao de endpoint para futura API Java (Spring Boot, por exemplo).
  };

  const elements = {
    answerSheet: document.getElementById("answer-sheet"),
    finalizeButton: document.getElementById("finalize-btn"),
    clearButton: document.getElementById("clear-btn"),
    resultJson: document.getElementById("result-json"),
    statusMessage: document.getElementById("status-message")
  };



  input.addEventListener("change", () => {
    CONFIG.totalQuestions = Number(input.value);

    elements.answerSheet.innerHTML = "";
    renderQuestionGrid();
  });


  const buildOption = (questionNumber, alternative) => {
    const label = document.createElement("label");
    label.className = "option-label";

    const input = document.createElement("input");
    input.className = "option-input";
    input.type = "radio";
    input.name = `question-${questionNumber}`;
    input.value = alternative;

    const span = document.createElement("span");
    span.className = "option-text";
    span.textContent = alternative;

    label.appendChild(input);
    label.appendChild(span);
    return label;
  };

  const buildQuestionCard = (questionNumber) => {
    const card = document.createElement("article");
    card.className = "question-card";

    const title = document.createElement("h3");
    title.className = "question-title";
    title.textContent = `Questao ${questionNumber}`;

    const alternativesContainer = document.createElement("div");
    alternativesContainer.className = "alternatives";

    CONFIG.alternatives.forEach((alternative) => {
      alternativesContainer.appendChild(buildOption(questionNumber, alternative));
    });

    card.appendChild(title);
    card.appendChild(alternativesContainer);

    return card;
  };

  const renderQuestionGrid = () => {
    const fragment = document.createDocumentFragment();

    for (let i = 1; i <= CONFIG.totalQuestions; i += 1) {
      fragment.appendChild(buildQuestionCard(i));
    }

    elements.answerSheet.appendChild(fragment);
  };

  const collectAnswers = () => {
    const answers = {};
    const unanswered = [];

    for (let i = 1; i <= CONFIG.totalQuestions; i += 1) {
      const selected = document.querySelector(`input[name="question-${i}"]:checked`);

      if (!selected) {
        unanswered.push(i);
        continue;
      }

      answers[String(i)] = selected.value;
    }

    return { answers, unanswered };
  };

  const setStatus = (message, type = "info") => {
    elements.statusMessage.textContent = message;
    elements.statusMessage.className = `status-message ${type}`;
  };

  const displayAnswersJson = (answers) => {
    elements.resultJson.textContent = JSON.stringify(answers, null, 2);
  };

  const clearAllAnswers = () => {
    const selectedInputs = document.querySelectorAll('.option-input:checked');
    selectedInputs.forEach((input) => {
      input.checked = false;
    });

    displayAnswersJson({});
    setStatus("Respostas limpas. Voce pode marcar novamente antes de finalizar.", "info");
  };

  const preparePayload = (answers) => {
    return {
      examId: "simulado-001",
      submittedAt: new Date().toISOString(),
      answers
    };
  };

  const sendAnswersToApi = async (payload) => {
    // Funcao pronta para futura integracao com backend Java.
    // Exemplo de implementacao:
    // const response = await fetch(CONFIG.endpoint, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload)
    // });
    // if (!response.ok) throw new Error("Falha ao enviar respostas");
    // return response.json();
    console.info("Simulacao de envio para API:", payload);
    return Promise.resolve({ status: "simulado", endpoint: CONFIG.endpoint });
  };

  const handleFinalize = async () => {
    const { answers, unanswered } = collectAnswers();

    if (unanswered.length > 0) {
      const list = unanswered.join(", ");
      setStatus(`Existem questoes sem resposta: ${list}. Complete antes de finalizar.`, "warning");
      displayAnswersJson(answers);
      return;
    }

    const payload = preparePayload(answers);

    try {
      await sendAnswersToApi(payload);
      displayAnswersJson(answers);
      console.log("Respostas finais:", answers);
      setStatus("Gabarito finalizado com sucesso. Respostas exibidas em JSON.", "success");
    } catch (error) {
      console.error("Erro no envio:", error);
      setStatus("Erro ao enviar respostas para a API futura.", "warning");
    }
  };

  const bindEvents = () => {
    elements.finalizeButton.addEventListener("click", handleFinalize);
    elements.clearButton.addEventListener("click", clearAllAnswers);
  };

  const init = () => {
    renderQuestionGrid();
    bindEvents();
    setStatus("Preencha todas as questoes e clique em Finalizar.", "info");
  };

  init();
})();
