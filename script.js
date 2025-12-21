document.addEventListener('DOMContentLoaded', () => {
    const welcome = document.getElementById('userWelcome');
    const welcomeText = document.getElementById('welcomeText');
    const logoutBtn = document.getElementById('logoutBtn');
    const signIn = document.getElementById('sign_in');
    const signUp = document.getElementById('sign_up');

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            signIn.style.display = 'none';
            signUp.style.display = 'none';
            welcome.style.display = 'block';

            const userRef = db.collection('users').doc(user.uid);

userRef.onSnapshot((doc) => {
    if (doc.exists) {
        const data = doc.data();
        if (data.username) {
            welcomeText.textContent = `Привет, ${data.username}!`;
            return;
        }
    }

    if (user.email) {
        welcomeText.textContent = `Привет, ${data.username}!`;
    } else {
        welcomeText.textContent = 'Привет!';
    }
});



        } else {
            welcome.style.display = 'none';
            signIn.style.display = 'inline-block';
            signUp.style.display = 'inline-block';
        }
    });

    logoutBtn.addEventListener('click', () => {
        auth.signOut();
    });

    signIn.addEventListener('click', () => {
        window.location.href = 'login.html';
    });

    signUp.addEventListener('click', () => {
        window.location.href = 'registr.html';
    });
});


document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.joining-button').forEach(btn => {
        btn.addEventListener('click', async () => {

            const user = auth.currentUser;
            if (!user) {
                alert('Сначала войдите в аккаунт');
                window.location.href = 'login.html';
                return;
            }

            const trainingId = btn.id;

            const userRef = db.collection('users').doc(user.uid);
            const userDoc = await userRef.get();

            let userName = 'Пользователь';

                if (userDoc.exists) {
                const data = userDoc.data();
                userName = data.username || 'Пользователь';
                }


            const trainingRef = db.collection('trainingRegistrations').doc(trainingId);
            const trainingDoc = await trainingRef.get();

            let users = [];

            if (trainingDoc.exists) {
                users = trainingDoc.data().users || [];
            }

            const alreadyRegistered = users.some(u => u.uid === user.uid);

            if (alreadyRegistered) {
                users = users.filter(u => u.uid !== user.uid);
                await trainingRef.set({ users });
                alert('Вы отменили запись');
            } else {
                users.push({ uid: user.uid, name: userName });
                await trainingRef.set({ users });
                alert('Вы записались на тренировку');
            }

            updateTrainingDisplay(trainingId);
        });
    });
});

async function updateTrainingDisplay(trainingId) {
    const btn = document.getElementById(trainingId);
    const infoBlock = getInfoBlock(btn);

    const user = auth.currentUser;
    const doc = await db.collection('trainingRegistrations').doc(trainingId).get();

    if (!doc.exists) {
        btn.innerHTML = '<h3>Записаться</h3>';
        infoBlock.innerHTML = '';
        return;
    }

    const users = doc.data().users || [];
    const isRegistered = user && users.some(u => u.uid === user.uid);

    btn.innerHTML = isRegistered ? '<h3>Отменить</h3>' : '<h3>Записаться</h3>';

    if (users.length > 0) {
        const names = users.map(u =>
            user && u.uid === user.uid ? `<strong>${u.name} (вы)</strong>` : u.name
        ).join(', ');

        infoBlock.innerHTML = `
            <div>Записалось: ${users.length}</div>
            <div>${names}</div>
        `;
    } else {
        infoBlock.innerHTML = '';
    }
}

function getInfoBlock(btn) {
    let info = btn.parentNode.querySelector('.registration-info');
    if (!info) {
        info = document.createElement('div');
        info.className = 'registration-info';
        btn.parentNode.appendChild(info);
    }
    return info;
}


document.addEventListener('DOMContentLoaded', () => {
    const months = ['Января','Февраля','Марта','Апреля','Мая','Июня',
                   'Июля','Августа','Сентября','Октября','Ноября','Декабря'];
    const weekDays = ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота']; 
    const schedule = {
        0: ['Sunday','Sunday1'], 1: ['Monday','Monday1'],
        2: ['Tuesday'], 3: ['Wednesday'],
        4: ['Thursday'], 5: ['Friday'], 6: ['Saturday']
    };
    
    let currentDate = new Date();
    const today = new Date();
    const monthYear = document.getElementById('currentMonthYear');
    const calendarDays = document.getElementById('calendarDays');
    
    function render() {
        calendarDays.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        monthYear.textContent = `${months[month]} ${year}`;
        
        const firstDay = new Date(year, month, 1).getDay();
        const start = firstDay === 0 ? 6 : firstDay - 1;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        
        for (let i = start; i > 0; i--) {
            const day = document.createElement('div');
            day.className = 'calendar-day inactive';
            day.textContent = daysInPrevMonth - i + 1;
            calendarDays.appendChild(day);
        }
        
        for (let d = 1; d <= daysInMonth; d++) {
            const day = document.createElement('div');
            day.className = 'calendar-day';
            day.textContent = d;
            
            if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                day.classList.add('today');
            }
            
            day.onclick = () => {
                const dayOfWeek = new Date(year, month, d).getDay();
                filter(dayOfWeek);
                alert(`${d} ${months[month]} ${year}, ${weekDays[dayOfWeek]}`);
            };
            
            calendarDays.appendChild(day);
        }
        
        const total = start + daysInMonth;
        const remainingDays = total % 7 === 0 ? 0 : 7 - (total % 7);
        
        for (let i = 1; i <= remainingDays; i++) {
            const day = document.createElement('div');
            day.className = 'calendar-day inactive';
            day.textContent = i;
            calendarDays.appendChild(day);
        }
    }
    
    function filter(dayOfWeek) {
        document.querySelectorAll('.joining-button').forEach(btn => {
            btn.style.display = (schedule[dayOfWeek] || []).includes(btn.id) ? 'inline-block' : 'none';
        });
    }
    
    function showAll() {
        document.querySelectorAll('.joining-button').forEach(btn => btn.style.display = 'inline-block');
    }
    
    document.getElementById('prevMonthBtn').onclick = () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        render();
        showAll();
    };
    
    document.getElementById('nextMonthBtn').onclick = () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        render();
        showAll();
    };


    
    const showAllBtn = document.createElement('button');
    showAllBtn.textContent = 'Все тренировки';
    showAllBtn.style.cssText = 'display:block;margin:10px auto;padding:10px;background:#4CAF50;color:white;border:none;border-radius:5px;';
    showAllBtn.onclick = showAll;
    document.getElementById('calendar-container').appendChild(showAllBtn);
    
    render();
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.joining-button').forEach(btn => {
        updateTrainingDisplay(btn.id);
    });
});
