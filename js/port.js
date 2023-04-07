// код JavaScript можно использовать для добавления интерактивности на ваш сайт портфолио
// например, валидация формы и отправка сообщения на сервер
// но здесь приведу только пример для анимации скролла
// при клике на ссылку в навигации

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(e.target.hash);
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
  