

// carousal part of js
const track = document.querySelector('.carousel-track'); // holds all cards
const cards = document.querySelectorAll('.card'); // all cards
let leftBtn = document.querySelector('.carousel-prev');
let rightBtn = document.querySelector('.carousel-next');

if (track && cards.length > 0 && leftBtn && rightBtn) { // only run if carousel exists
    let currentIndex = 0;

    leftBtn.addEventListener('click', () => {
        if (currentIndex > 0) { // prevent going before first card
            currentIndex--;
            updateCarousel();
        }
    });

    rightBtn.addEventListener('click', () => {
        if (currentIndex < cards.length - 1) { // prevent going beyond last card
            currentIndex++;
            updateCarousel();
        }
    });

    function updateCarousel() {
        const cardWidth = cards[0].offsetWidth + 20; // card width + gap
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        track.style.transition = 'transform 0.3s ease';

        // Left button
        if (currentIndex === 0) {
        leftBtn.style.visibility = "hidden";
        } else {
        leftBtn.style.visibility = "visible";
       }

// Right button
       if (currentIndex === cards.length - 1) {
       rightBtn.style.visibility = "hidden";
       } else {
       rightBtn.style.visibility = "visible";
       }

    }
}
// till here

// mainpage text typewriter functionality
document.addEventListener('DOMContentLoaded', () => {
    const spans = document.querySelectorAll('.dynamic-text span');//sare spans bula lie
    const spanPlaceholder = document.querySelector('#typewriter');//ek empty laceholder jisme saare spas ke text show honge

    if (!spanPlaceholder || spans.length === 0) return; // <– important safety check

    function wholeProcess(index) {
        const singleText = spans[index].textContent;//pehla text retrieve kara
        let i = 0;
        //below is the code where each char of that specifc text will come one by one using setInterval
        const intervalAddition = setInterval(() => {
            if (i < singleText.length) {//jab tak text ki puri nhi ho jati length 
                spanPlaceholder.textContent += singleText[i];//tab tak placeholder mein aata rhega text
                i++;
            } else {
                clearInterval(intervalAddition);//otherwise if text length is complete interval finish

                setTimeout(() => {//jaise hee pehla text complete hua thode setimeout ke baad it will start going back or delet one char by one
                    let j = singleText.length;
                    const deletion = setInterval(() => {
                        if (j > 0) {
                            spanPlaceholder.textContent = spanPlaceholder.textContent.slice(0, -1);//placeholder mein jo text hain one by one goes 
                            j--;
                        } else {
                            clearInterval(deletion);//jab pura text chala jae
                            let newIndex = index + 1;//we will jump to another text in the spans list
                            if (newIndex >= spans.length){//agar newindex is out of bounds of spans length we come back to 0 again
                                newIndex = 0;//this way cycle continue rhe
                            }
                            wholeProcess(newIndex);
                        }
                    }, 75); //deletion speed
                }, 1500);// waiting speed
            }
        }, 100); //typing speed
    }

    wholeProcess(0); 
});

// streak functionality
const months = document.querySelectorAll('.month');
const daysContainers = document.querySelectorAll('.days');

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
} 

function streak() {
  const year = new Date().getFullYear(); // get current year
  let eachMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // update February if leap year
  if (isLeapYear(year)) {
    eachMonth[1] = 29;
  }

  for (let i = 0; i < months.length; i++) { //months ke through loop chalaenge
    let daysInMonth = eachMonth[i];

    for (let j = 1; j <= daysInMonth; j++) { //days of that month ke through jaenge
//basically har month ke har din mein ek div create liya for day and kept on adding in that month
      const dayDiv = document.createElement("div");
      dayDiv.classList.add("day");//div ko class appoint kari

      daysContainers[i].appendChild(dayDiv);
    }
  }
}
streak();
//in below code streak ko color dena
const moodRate = document.querySelector('.mood');

if( typeof logs !== 'undefined' && logs.length > 0){//logs has been aquired from route hobbies/:id
    for(let i = 0; i < logs.length; i++){  
        let singleLog = logs[i];  // ← now not only last one
        let logDate = new Date(singleLog.createdAt); //uss singlelog ki latest date nikal lee

        let latestDay = logDate.getDate()-1;//latest day ko curr date assign kardi
        let logMonth = logDate.getMonth();//uss day ke month ko find kara

        let day = daysContainers[logMonth].children[latestDay];//dono month and date assign kardiya to day
        if(day){
            day.classList.add(`mood-${singleLog.mood}`);//if day exists karta hain mtlb if log exists then color otherwise no
        }
    }
}


// mood button functionality
let buttons = document.querySelectorAll('.mood-btn');
for(let i = 0; i<buttons.length; i++){
    buttons[i].addEventListener("click" ,(event) => {
         event.preventDefault(); // stop form auto-submit, mtlb mood btn jaise hee click it wont submit on that, it will only submit on clicking submit btn
        document.getElementById("moodInput").value = buttons[i].dataset.rating;
    });
}


//the below code has been copied from bootstrap, this will be used in edit.ejs,new.ejs etc, basically it will help
//validating the form
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})();

//button close of flash functionality
const cross = document.querySelectorAll('.btn-close');
for(let i = 0; i<cross.length; i++){
    cross[i].addEventListener(('click'),()=>{
        cross[i].parentElement.remove();
    })
}

//main page cards functionality
const designerCards = document.querySelectorAll('.feature-card');
window.addEventListener(("scroll"),() =>{
for(let i = 0; i<designerCards.length; i++){
        if(designerCards[i].getBoundingClientRect().top< window.innerHeight - 100){
            designerCards[i].classList.add("show");
        }
        else{
            designerCards[i].classList.remove("show");
        }
    }});

//number of users functionality
let started = false;

async function updateCount() {
    const counterDisplay = document.getElementById('userCount');

    // Fetch real count from DB
    const res = await fetch("/user-count"); //the get route writtn in app.js , so basically db se actual user count milega
    const data = await res.json();
    const target = data.count;

    let count = 0;

    const interval = setInterval(() => {
        count++;
        counterDisplay.textContent = count;

        if (count >= target) {
            clearInterval(interval);
        }
    }, 40);
}

window.addEventListener("scroll", () => {
    const countSection = document.querySelector(".users-track");
    if (!countSection) return;

    if (!started && countSection.getBoundingClientRect().top < window.innerHeight - 100) {
        updateCount();
        started = true;
    }
});

//my streak count functionality
const consistencyTrack = document.querySelector('.streak-summary h6');
let countStreak = 1;

function normalize(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

if (consistencyTrack && logs && logs.length > 0) {

    for (let i = 1; i < logs.length; i++) {
        let current = normalize(new Date(logs[i].createdAt));       // FIXED
        let previous = normalize(new Date(logs[i - 1].createdAt));  // FIXED

        let diff = (current - previous) / (1000 * 60 * 60 * 24);

        if (diff === 1) {
            countStreak++;
        } else {
            break;
        }
    }

    consistencyTrack.textContent = `Consistent Days: ${countStreak}`;
}

//delete btn functionality for mypage
document.addEventListener("DOMContentLoaded", () => {
    const deleteButtons = document.querySelectorAll(".delete-trash"); //saare icons ko bulaya
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn"); //yes btn

    let selectedHobbyId = null;  // variable jisme store karenge konsi hobby id click kari hai user ne
    const deleteModalEl = document.getElementById("deleteModal"); //modal from bootstrap acquired
    let deleteModal = null;

    if (deleteModalEl) { //agar koi bhi error nhi aata hai that model is being shown by bootstrap
        deleteModal = new bootstrap.Modal(deleteModalEl); //then deleteModal variable mein store ho jaega model
    }

    deleteButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            selectedHobbyId = btn.getAttribute("data-id"); //hobby ki id hogi isme, so that we know whic hobby is being removed
            deleteModal.show(); //tab hee pop ho jaega if 
        });
    });

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener("click", async () => { //agar yes click hua and selectedHobby that is hobby id is null then return
            if (!selectedHobbyId) return;

            //if not null then server ko call karo and delete
            let res = await fetch(`/myPage/${selectedHobbyId}`, {
                method: "DELETE"
            });

            if (res.ok) { //if response from server is ok then card ki aprent element ko delete ke through karenge
                // remove that hobby card
                const btn = document.querySelector(`[data-id="${selectedHobbyId}"]`);
                const card = btn.parentElement.parentElement; // go up to the .card

                card.remove();
                deleteModal.hide(); //pop up hide

            } else {
                alert("Failed to delete.");
            }
        });
    } 
});




