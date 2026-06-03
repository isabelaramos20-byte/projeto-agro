/**
 * COLHEITA DE INOVAÇÃO — script.js
 * Funcionalidades:
 *  1. Navbar responsiva + hamburger menu
 *  2. Navbar scroll effect
 *  3. Rolagem suave (smooth scroll)
 *  4. Reveal on scroll (Intersection Observer)
 *  5. Barras de progresso da sustentabilidade
 *  6. Cards flip das curiosidades
 *  7. Quiz interativo com 5 perguntas
 *  8. Contadores animados
 *  9. Ano atual no rodapé
 */

/* ============================================================
   1. UTILITÁRIOS
   ============================================================ */

/**
 * Seleciona um elemento pelo seletor.
 * @param {string} sel - seletor CSS
 * @param {Element} [ctx=document] - contexto
 * @returns {Element|null}
 */
const $ = (sel, ctx = document) => ctx.querySelector(sel);

/**
 * Seleciona todos os elementos pelo seletor.
 * @param {string} sel - seletor CSS
 * @param {Element} [ctx=document] - contexto
 * @returns {NodeList}
 */
const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);

/* ============================================================
   2. ANO NO RODAPÉ
   ============================================================ */
(function setFooterYear() {
  const el = $('#footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ============================================================
   3. NAVBAR — SCROLL EFFECT
   ============================================================ */
(function navbarScroll() {
  const navbar = $('#navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // aplica no carregamento
})();

/* ============================================================
   4. HAMBURGER MENU
   ============================================================ */
(function hamburgerMenu() {
  const btn   = $('#hamburger');
  const links = $('#nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Fecha ao clicar em qualquer link
  $$('a', links).forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  // Fecha ao clicar fora
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ============================================================
   5. ROLAGEM SUAVE — HERO BUTTON E LINKS DE ÂNCORA
   ============================================================ */
(function smoothScroll() {
  // Captura todos os links âncora internos
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = $(targetId);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ============================================================
   6. REVEAL ON SCROLL (Intersection Observer)
   ============================================================ */
(function revealOnScroll() {
  const items = $$('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Aciona barras de progresso dentro do item
        $$('.sust-bar', entry.target).forEach(bar => animateSustBar(bar));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(item => observer.observe(item));
})();

/* ============================================================
   7. BARRAS DE PROGRESSO — SUSTENTABILIDADE
   ============================================================ */

/**
 * Anima a barra de progresso até o valor definido em data-width.
 * @param {HTMLElement} bar
 */
function animateSustBar(bar) {
  const target = parseInt(bar.dataset.width, 10) || 0;
  let current = 0;
  const step = target / 60; // ~60 frames

  const tick = () => {
    current = Math.min(current + step, target);
    bar.style.width = current + '%';
    if (current < target) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

// Também ativa barras visíveis na seção de sustentabilidade
// (para o caso de já estarem visíveis sem o reveal disparar)
(function checkInitialBars() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $$('.sust-bar', entry.target).forEach(animateSustBar);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  $$('.sust-item').forEach(item => observer.observe(item));
})();

/* ============================================================
   8. CURIOSIDADES — FLIP DE CARDS
   ============================================================ */
(function curiosidadesFlip() {
  $$('.curiosidade-card').forEach(card => {
    // Clique e teclado (Enter/Space)
    card.addEventListener('click', () => card.classList.toggle('flipped'));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });
})();

/* ============================================================
   9. QUIZ INTERATIVO
   ============================================================ */
(function quiz() {

  /* --- Banco de perguntas --- */
  const questions = [
    {
      q: 'Qual tecnologia permite monitorar lavouras e aplicar defensivos com alta precisão, sobrevoando os campos remotamente?',
      options: ['Satélite GPS', 'Drone agrícola', 'Trator autônomo', 'Sensor de solo'],
      correct: 1,
      explanation: 'Os drones agrícolas são aeronaves não tripuladas que sobrevoam as lavouras, capturando imagens e aplicando insumos com precisão milimétrica.'
    },
    {
      q: 'O que é "agricultura de precisão"?',
      options: [
        'Plantar sempre no mesmo local todo ano',
        'Uso de GPS e sensores para otimizar insumos e produção por área específica',
        'Colheita feita exclusivamente à mão',
        'Plantio de apenas uma cultura por fazenda'
      ],
      correct: 1,
      explanation: 'Agricultura de precisão usa tecnologia (GPS, sensores, drones) para aplicar insumos na quantidade certa, no lugar certo, no momento certo.'
    },
    {
      q: 'Qual prática de sustentabilidade preserva a estrutura do solo, mantendo a palhada da cultura anterior e reduzindo a erosão?',
      options: ['Aração profunda', 'Queimada controlada', 'Plantio direto', 'Irrigação por inundação'],
      correct: 2,
      explanation: 'O plantio direto mantém os restos vegetais sobre o solo, protegendo-o da erosão, conservando a umidade e melhorando a biologia do solo.'
    },
    {
      q: 'Sistemas de irrigação por gotejamento podem reduzir o consumo de água em quanto comparado à irrigação convencional por aspersão?',
      options: ['Até 10%', 'Até 30%', 'Até 60%', 'Até 5%'],
      correct: 2,
      explanation: 'A irrigação por gotejamento entrega água diretamente na raiz da planta, podendo reduzir o consumo hídrico em até 60% com maior eficiência produtiva.'
    },
    {
      q: 'O que é "Internet das Coisas" (IoT) no contexto da agricultura inteligente?',
      options: [
        'Uma rede social para agricultores',
        'Equipamentos conectados à internet que coletam e transmitem dados do campo em tempo real',
        'Sistema de compra e venda de produtos agrícolas online',
        'Aplicativo de previsão do tempo para fazendas'
      ],
      correct: 1,
      explanation: 'IoT na agricultura conecta sensores, máquinas e dispositivos à internet, permitindo monitoramento e controle remoto de todo o processo produtivo em tempo real.'
    }
  ];

  /* --- Estado --- */
  let currentQ   = 0;
  let score       = 0;
  let answered    = false;

  /* --- Elementos --- */
  const container   = $('#quiz-container');
  const resultEl    = $('#quiz-result');
  const questionEl  = $('#quiz-question');
  const optionsEl   = $('#quiz-options');
  const nextBtn     = $('#quiz-next-btn');
  const restartBtn  = $('#quiz-restart-btn');
  const counterEl   = $('#quiz-counter');
  const progressBar = $('#quiz-progress-bar');
  const resultIcon  = $('#result-icon');
  const resultTitle = $('#result-title');
  const resultScore = $('#result-score');
  const resultMsg   = $('#result-message');

  if (!container) return; // Segurança

  /* --- Funções --- */

  /** Renderiza a pergunta atual */
  function renderQuestion() {
    answered = false;
    nextBtn.disabled = true;

    const data = questions[currentQ];
    const progress = Math.round((currentQ / questions.length) * 100);

    // Atualiza progresso
    progressBar.style.width = progress + '%';
    progressBar.setAttribute('aria-valuenow', progress);
    counterEl.textContent = `Pergunta ${currentQ + 1} de ${questions.length}`;

    // Exibe pergunta
    questionEl.textContent = data.q;

    // Limpa e cria opções
    optionsEl.innerHTML = '';
    data.options.forEach((opt, idx) => {
      const li  = document.createElement('li');
      li.setAttribute('role', 'listitem');

      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt;
      btn.setAttribute('aria-label', `Opção ${idx + 1}: ${opt}`);
      btn.addEventListener('click', () => selectOption(btn, idx));

      li.appendChild(btn);
      optionsEl.appendChild(li);
    });

    // Animação de entrada
    questionEl.style.opacity = '0';
    questionEl.style.transform = 'translateX(20px)';
    requestAnimationFrame(() => {
      questionEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      questionEl.style.opacity = '1';
      questionEl.style.transform = 'translateX(0)';
    });
  }

  /**
   * Processa a seleção de uma alternativa.
   * @param {HTMLButtonElement} btn - botão clicado
   * @param {number} idx - índice da opção
   */
  function selectOption(btn, idx) {
    if (answered) return;
    answered = true;

    const data    = questions[currentQ];
    const correct = data.correct;
    const isRight = idx === correct;

    if (isRight) score++;

    // Marca visualmente todas as opções
    $$('.quiz-option', optionsEl).forEach((optBtn, i) => {
      optBtn.disabled = true;
      if (i === correct) optBtn.classList.add('correct');
      else if (i === idx && !isRight) optBtn.classList.add('wrong');
    });

    // Habilita próxima
    nextBtn.disabled = false;

    // Atualiza label do botão na última pergunta
    if (currentQ === questions.length - 1) {
      nextBtn.innerHTML = 'Ver resultado <span aria-hidden="true">🏆</span>';
    }
  }

  /** Avança para a próxima pergunta ou exibe resultado */
  function nextQuestion() {
    currentQ++;
    if (currentQ < questions.length) {
      renderQuestion();
    } else {
      showResult();
    }
  }

  /** Exibe a tela de resultado final */
  function showResult() {
    container.style.display = 'none';
    resultEl.classList.remove('hidden');

    progressBar.style.width = '100%';

    // Ícone e mensagem conforme pontuação
    let icon, title, message;

    if (score === 5) {
      icon    = '🏆';
      title   = 'Parabéns, Expert!';
      message = 'Excelente! Você acertou todas as perguntas. Você é um verdadeiro especialista em inovação agrícola e sustentabilidade!';
    } else if (score >= 4) {
      icon    = '🌟';
      title   = 'Muito bem!';
      message = 'Ótimo desempenho! Você tem sólido conhecimento sobre tecnologia e sustentabilidade no campo. Continue aprendendo!';
    } else if (score >= 3) {
      icon    = '🌱';
      title   = 'Bom trabalho!';
      message = 'Você está no caminho certo! Releia as seções sobre tecnologias e sustentabilidade para consolidar seu conhecimento.';
    } else if (score >= 2) {
      icon    = '📚';
      title   = 'Continue estudando!';
      message = 'Ainda há espaço para crescer. Explore as seções de Tecnologias e Inovação deste site para aprender mais!';
    } else {
      icon    = '🌾';
      title   = 'Não desanime!';
      message = 'Todo aprendizado começa com uma semente. Leia o conteúdo do site e tente novamente — você vai se surpreender!';
    }

    resultIcon.textContent  = icon;
    resultTitle.textContent = title;
    resultScore.textContent = `Você acertou ${score} de ${questions.length} perguntas`;
    resultMsg.textContent   = message;
  }

  /** Reinicia o quiz */
  function restartQuiz() {
    currentQ = 0;
    score    = 0;
    answered = false;
    resultEl.classList.add('hidden');
    container.style.display = '';
    nextBtn.innerHTML = 'Próxima <span aria-hidden="true">→</span>';
    renderQuestion();
  }

  /* --- Event Listeners --- */
  nextBtn.addEventListener('click', nextQuestion);
  restartBtn.addEventListener('click', restartQuiz);

  /* --- Inicializa --- */
  renderQuestion();

})();

/* ============================================================
   10. CONTADORES ANIMADOS
   ============================================================ */
(function animatedCounters() {
  const counters = $$('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10) || 0;
      const dur    = 2000; // ms
      const fps    = 60;
      const steps  = dur / (1000 / fps);
      const inc    = target / steps;
      let current  = 0;

      observer.unobserve(el);

      const tick = () => {
        current = Math.min(current + inc, target);
        el.textContent = Math.floor(current).toLocaleString('pt-BR');
        if (current < target) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString('pt-BR');
      };

      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
})();

/* ============================================================
   11. ACTIVE NAV LINK — HIGHLIGHT CONFORME SCROLL
   ============================================================ */
(function activeNavHighlight() {
  const sections = $$('main section[id], header[id]');
  const links    = $$('.nav-links a');
  if (!sections.length || !links.length) return;

  const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;

  function getActiveId() {
    let active = null;
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= navH + 60) active = sec.id;
    });
    return active;
  }

  function highlightLink() {
    const id = getActiveId();
    links.forEach(link => {
      const href = link.getAttribute('href');
      link.style.color = href === `#${id}` ? 'var(--amber)' : '';
    });
  }

  window.addEventListener('scroll', highlightLink, { passive: true });
  highlightLink();
})();

/* ============================================================
   12. EASTER EGG — KONSOLE
   ============================================================ */
console.log(
  '%c🌿 Colheita de Inovação\n%cSite educacional criado com HTML5, CSS3 e JavaScript puro.\nInovação, Tecnologia e Sustentabilidade para um campo melhor.',
  'font-size:18px; font-weight:bold; color:#2e9e6e;',
  'font-size:13px; color:#555;'
);
