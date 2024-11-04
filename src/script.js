class Holiday {
    constructor() {
        this.holidays = {};
    }

    async fetchHolidays() {
        try{
            const response = await fetch('https://holidays-jp.github.io/api/v1/date.json');
            const json = await response.json();
            this.holidays = json;
        } catch (error) {
            console.error(error);
        }
    }

    isHoliday(date) {
        const tempDate = new Date(date);
        if(tempDate.getDay() == 0 || tempDate.getDay() == 6) {
            return true;
        }
        const dateString = tempDate.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
        return dateString in this.holidays;
    }

    isHolidayTime(date) {
        const tempDate = new Date(date);
        if(tempDate.getHours() >= 17) {
            tempDate.setDate(tempDate.getDate() + 1);
        } else if(tempDate.getHours() < 6) {
            tempDate.setDate(tempDate.getDate() - 1);
        }
        if(tempDate.getDay() == 0 || tempDate.getDay() == 6) {
            return true;
        }
        const dateString = tempDate.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
        return dateString in this.holidays;
    }
    
    getNextHoliday() {
        let nextDate = new Date();

        for(let i = 0; i < 14; i++) {
            if(this.isHoliday(nextDate)) {
                break;
            }
            nextDate.setDate(nextDate.getDate() + 1);
        }
        nextDate.setHours(17);
        nextDate.setMinutes(0);
        nextDate.setSeconds(0);
        nextDate.setMilliseconds(0);
        return nextDate;
    }
    
    getNextBusinessday() {
        let nextDate = new Date();
        for(let i = 0; i < 14; i++) {
            if(!this.isHoliday(nextDate)) {
                break;
            }
            nextDate.setDate(nextDate.getDate() + 1);
        }
        
        nextDate.setHours(6);
        nextDate.setMinutes(0);
        nextDate.setSeconds(0);
        nextDate.setMilliseconds(0);
        return nextDate;
    }
}

window.onload = function() {
    const holiday = new Holiday();
    holiday.fetchHolidays();
    const timerElement = document.getElementById('timer');

    const interval = setInterval(() => {
        if(holiday.holidays.length === 0) {
            return;
        }
        let targetDate;
        if (holiday.isHolidayTime(new Date())) {
            targetDate = holiday.getNextBusinessday();
        } else {
            targetDate = holiday.getNextHoliday();
        }
        const diffDate = Math.abs(targetDate - new Date());

        const days = Math.floor(diffDate / (1000 * 60 * 60 * 24));
        const hrs = Math.floor((diffDate / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diffDate / (1000 * 60)) % 60);
        const secs = Math.floor((diffDate / 1000) % 60);

        if (holiday.isHolidayTime(new Date())) {
            document.getElementById('timer-decralation').textContent = '出勤まで残り:';
        } else {
            document.getElementById('timer-decralation').textContent = '休みまで残り:';
        }

        timerElement.textContent = 
            `${String(days).padStart(2, '0')}:${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }, 1000);


}

