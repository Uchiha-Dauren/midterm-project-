// jQuery supports two practical features: an FAQ accordion and form feedback.
$(function () {
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180;

    $('.faq-question').on('click', function () {
        const question = $(this);
        const item = question.closest('.faq-item');
        const answer = question.parent().next('.faq-answer');
        const wasOpen = question.attr('aria-expanded') === 'true';

        item.siblings('.faq-item').find('.faq-question').attr('aria-expanded', 'false');
        item.siblings('.faq-item').find('.faq-answer').stop(true, true).slideUp(duration);
        question.attr('aria-expanded', String(!wasOpen));
        if (wasOpen) answer.stop(true, true).slideUp(duration);
        else answer.stop(true, true).slideDown(duration);
    });

    $('#feedback-message').on('input', function () {
        const length = $(this).val().length;
        $('#message-count').text(`${length} / 500`);
        $(this).closest('.form-field').find('.character-count').toggleClass('count-warning', length > 500);
    });

    $(document).on('feedbackValid', function () {
        $('#feedback-success').stop(true, true).fadeIn(duration, function () {
            this.focus();
        });
    });

    $(document).on('feedbackChanged', function () {
        $('#feedback-success').stop(true, true).fadeOut(duration);
    });
});
