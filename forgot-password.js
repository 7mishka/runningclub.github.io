document.getElementById('reset-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const emailInput = document.getElementById('loginEmail');
    const errorSpan = document.getElementById('loginEmailError');
    const button = document.getElementById('resetBtn');
    const btnText = button.querySelector('.btn-text');
    const spinner = button.querySelector('.loading-spinner');

    const email = emailInput.value.trim();

    errorSpan.textContent = '';

    if (email === '') {
        errorSpan.textContent = 'Введите email';
        return;
    }

    button.disabled = true;
    btnText.textContent = 'Отправка...';
    spinner.style.display = 'inline-block';

    auth.sendPasswordResetEmail(email)
        .then(() => {
            alert('Письмо для восстановления пароля отправлено на почту');
            emailInput.value = '';
        })
        .catch((error) => {
            errorSpan.textContent = 'Пользователь с таким email не найден';
        })
        .finally(() => {
            button.disabled = false;
            btnText.textContent = 'Восстановить пароль';
            spinner.style.display = 'none';
        });
});
