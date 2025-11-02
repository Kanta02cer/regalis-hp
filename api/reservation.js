document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('reservation-form');
    const thankYouMessage = document.getElementById('thank-you-message');
    const submitButton = form.querySelector('button[type="submit"]');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(form);
            const originalButtonText = submitButton.innerHTML;

            // Disable button and show submitting state
            submitButton.disabled = true;
            submitButton.innerHTML = '送信中...';

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    // Success
                    form.style.display = 'none';
                    thankYouMessage.classList.remove('hidden');
                } else {
                    // Error
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            alert(data["errors"].map(error => error["message"]).join(", "));
                        } else {
                            alert('フォームの送信に失敗しました。もう一度お試しください。');
                        }
                        // Restore button
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalButtonText;
                    })
                }
            }).catch(error => {
                // Network error
                alert('フォームの送信に失敗しました。ネットワーク接続を確認してください。');
                // Restore button
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            });
        });
    }
});