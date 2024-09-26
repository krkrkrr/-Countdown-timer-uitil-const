window.onload = function() {
    const targetDate = new Date('2024-10-01T00:00:00');
    const timerElement = document.getElementById('timer');

    const interval = setInterval(() => {
        const diffDate = targetDate - new Date();
        if (diffDate <= 0) {
            clearInterval(interval);
            timerElement.textContent = "00:00:00:00";
            alert("無職卒業おめでとう！！");
            return;
        }

        const days = Math.floor(diffDate / (1000 * 60 * 60 * 24));
        const hrs = Math.floor((diffDate / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diffDate / (1000 * 60)) % 60);
        const secs = Math.floor((diffDate / 1000) % 60);

        timerElement.textContent = 
            `${String(days).padStart(2, '0')}:${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }, 1000);


}
