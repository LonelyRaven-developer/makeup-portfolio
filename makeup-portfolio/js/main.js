// Ждем полной загрузки DOM перед выполнением скриптов
document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. БУРГЕР-МЕНЮ ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ
       ========================================= */
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;

    // Функция переключения состояния меню
    const toggleMenu = () => {
        burger.classList.toggle('active');
        nav.classList.toggle('active');
        body.classList.toggle('no-scroll'); // Блокируем/разблокируем скролл страницы
    };

    // Открытие/закрытие по клику на иконку
    if (burger) {
        burger.addEventListener('click', toggleMenu);
    }

    // Закрытие меню при клике на любую ссылку в нем
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                toggleMenu();
            }
        });
    });


    /* =========================================
       2. ПЛАВНАЯ ПРОКРУТКА К СЕКЦИЯМ
       ========================================= */
    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Отменяем стандартный резкий переход
            
            const targetId = this.getAttribute('href');
            // Пропускаем ссылки, состоящие только из #
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Вычисляем высоту фиксированной шапки для корректного отступа
                const headerHeight = document.querySelector('.header').offsetHeight;
                
                // Получаем позицию элемента относительно окна браузера
                const elementPosition = targetElement.getBoundingClientRect().top;
                
                // Вычисляем точную позицию для скролла, учитывая текущий скролл и высоту шапки
                const offsetPosition = elementPosition + window.scrollY - headerHeight;

                // Запускаем плавный скролл
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    /* =========================================
       3. ВСПЛЫВАЮЩИЙ ВИДЖЕТ ЗАПИСИ (DIKIDI)
       ========================================= */
    const bookingModal = document.getElementById('booking-modal');
    const bookingTriggers = document.querySelectorAll('.booking-trigger');
    const bookingClose = document.querySelector('.booking-close');

    const openBooking = () => {
        if (bookingModal) {
            bookingModal.classList.add('show');
            body.classList.add('no-scroll');
        }
    };

    const closeBooking = () => {
        if (bookingModal) {
            bookingModal.classList.remove('show');
            body.classList.remove('no-scroll');
        }
    };

    bookingTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openBooking();
        });
    });

    if (bookingClose) {
        bookingClose.addEventListener('click', closeBooking);
    }

    if (bookingModal) {
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) {
                closeBooking();
            }
        });
    }

    // Закрытие по Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && bookingModal && bookingModal.classList.contains('show')) {
            closeBooking();
        }
    });

    /* =========================================
       4. ЛАЙТБОКС (ГАЛЕРЕЯ) ДЛЯ ПОРТФОЛИО
       ========================================= */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const portfolioItems = document.querySelectorAll('.portfolio-img');
    
    let currentIndex = 0;
    // Собираем все src картинок в массив для удобного переключения
    const imagesArray = Array.from(portfolioItems).map(item => item.src);

    // Функция открытия лайтбокса
    const openLightbox = (index) => {
        currentIndex = index;
        lightboxImg.src = imagesArray[currentIndex];
        lightbox.classList.add('show');     
        body.classList.add('no-scroll');    
    };

    // Функция закрытия лайтбокса
    const closeLightbox = () => {
        lightbox.classList.remove('show');
        body.classList.remove('no-scroll');
        setTimeout(() => {
            if(!lightbox.classList.contains('show')) {
                lightboxImg.src = '';
            }
        }, 300);
    };

    // Функции переключения
    const showPrev = () => {
        currentIndex = (currentIndex === 0) ? imagesArray.length - 1 : currentIndex - 1;
        lightboxImg.src = imagesArray[currentIndex];
    };
    
    const showNext = () => {
        currentIndex = (currentIndex === imagesArray.length - 1) ? 0 : currentIndex + 1;
        lightboxImg.src = imagesArray[currentIndex];
    };

    // Вешаем слушатели на все изображения портфолио
    portfolioItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    // Кнопки влево/вправо
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);
    if (lightboxNext) lightboxNext.addEventListener('click', showNext);

    // Закрытие по клику на крестик
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Закрытие по клику на полупрозрачный фон 
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Клавиатура (Esc - закрыть, влево/вправо - листать)
    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('show')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        }
    });

    /* =========================================
       5. ПЕРЕКЛЮЧЕНИЕ ТЕМЫ (ТЕМНАЯ/СВЕТЛАЯ)
       ========================================= */
    const themeToggle = document.querySelector('.theme-toggle');
    const htmlElement = document.documentElement;
    
    // Функция обновления иконки и темы
    const updateThemeIcon = (theme) => {
        if (themeToggle) {
            themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    };

    // При первой загрузке мы уже установили тему в head скрипте,
    // но нам нужно обновить иконку кнопки.
    const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
    updateThemeIcon(currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = htmlElement.getAttribute('data-theme') === 'dark';
            const newTheme = isDark ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    // Слушаем изменение системной темы
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Меняем тему автоматически только если пользователь не выбрал её вручную
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            htmlElement.setAttribute('data-theme', newTheme);
            updateThemeIcon(newTheme);
        }
    });

});
