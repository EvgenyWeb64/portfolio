/* Кнопка скролла наверх страницы */

// Находим кнопку по id
const scrollButton = document.querySelector('#scrollToTopBtn');

if (scrollButton) {
    // Отменяем стандартное поведение ссылки
    scrollButton.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    });

    // Слушаем событие скролла
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > window.innerHeight) {
            scrollButton.classList.add('top-link--visible');
        } else {
            scrollButton.classList.remove('top-link--visible');
        }
    });
}
