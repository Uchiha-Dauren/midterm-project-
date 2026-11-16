// The form is a local demonstration: validation never sends or stores personal data.
const feedbackForm = document.getElementById('feedback-form');

function validateFeedbackField(field) {
    const value = field.value.trim();
    if (field.id === 'feedback-name') {
        if (value.length < 2) return t('Атыңыз кемінде 2 таңбадан тұрсын.', 'Enter a name with at least 2 characters.');
        if (value.length > 60) return t('Атыңыз 60 таңбадан аспасын.', 'Use no more than 60 characters for your name.');
    }
    if (field.id === 'feedback-email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return t('Дұрыс email жазыңыз: name@example.com.', 'Enter a valid email, such as name@example.com.');
    }
    if (field.id === 'feedback-movie' && !movies.some(movie => movie.id === value)) {
        return t('Тізімнен фильм таңдаңыз.', 'Choose a film from the list.');
    }
    if (field.id === 'feedback-rating') {
        const rating = Number(value);
        if (!value || !Number.isInteger(rating) || rating < 1 || rating > 10) {
            return t('1 мен 10 аралығындағы бүтін санды енгізіңіз.', 'Enter a whole number between 1 and 10.');
        }
    }
    if (field.id === 'feedback-message') {
        if (value.length < 20) return t('Пікіріңіз кемінде 20 таңбадан тұрсын.', 'Write at least 20 characters in your review.');
        if (value.length > 500) return t('Пікіріңіз 500 таңбадан аспасын.', 'Keep your review within 500 characters.');
    }
    if (field.id === 'feedback-consent' && !field.checked) {
        return t('Бұл оқу формасы екенін растаңыз.', 'Confirm that you understand this is a demo form.');
    }
    return '';
}

function showFieldError(field) {
    const message = validateFeedbackField(field);
    document.getElementById(`${field.id}-error`).textContent = message;
    field.setAttribute('aria-invalid', String(Boolean(message)));
    field.classList.toggle('field-invalid', Boolean(message));
    return message === '';
}

if (feedbackForm) {
    const movieSelect = document.getElementById('feedback-movie');
    movies.forEach(movie => {
        const option = document.createElement('option');
        option.value = movie.id;
        option.textContent = movie.title[isEnglish ? 'en' : 'kk'];
        movieSelect.append(option);
    });

    const fields = [...feedbackForm.querySelectorAll('[data-validate]')];
    let submitted = false;

    feedbackForm.addEventListener('submit', event => {
        event.preventDefault();
        submitted = true;
        let firstInvalid = null;
        // Check every field, so a single submit displays all useful corrections.
        for (const field of fields) {
            if (!showFieldError(field) && !firstInvalid) firstInvalid = field;
        }
        if (firstInvalid) {
            firstInvalid.focus();
            document.dispatchEvent(new CustomEvent('feedbackChanged'));
            return;
        }
        document.dispatchEvent(new CustomEvent('feedbackValid'));
    });

    for (const field of fields) {
        const eventType = field.tagName === 'SELECT' || field.type === 'checkbox' ? 'change' : 'input';
        field.addEventListener(eventType, () => {
            if (submitted) showFieldError(field);
            document.dispatchEvent(new CustomEvent('feedbackChanged'));
        });
    }
}
