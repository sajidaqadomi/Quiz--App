let examName=document.querySelector('.exam .exam-info .name'),
    qCount=document.querySelector('.exam .exam-info .question-count'),
    questionTitle=document.querySelector('.question-area .title .content'),
    questionChoices=document.querySelector('.question-area .choices .content'),
    bulletsTimer=document.querySelector('.bullets-timer'),
    bullitesList=document.querySelector('.bullets-timer .bullets-list'),
    btn=document.querySelector('.btn'),
    mark=document.querySelector('.mark .content'),
    choiceList,
    questions,
    timer=document.querySelector('.bullets-timer .timer span'),
    duration=60,
    step=5,
    sumMark=0,
    countDownInterval,
    indecator=0;


function getQustions(){
    let xHttp=new XMLHttpRequest();
    xHttp.onreadystatechange=function(){
        
        if(this.readyState == 4 && this.status ==200){ 
           questions=JSON.parse(this.responseText)  ;
           questions.length?randomQuestions():null;  
        }
       
    };

    xHttp.open("GET", "qustions.json", true);
    xHttp.send();


}
function addclassActive(indecator=0){
    let bullets=bullitesList.children;
    [...bullets].forEach(item=>{
        item.classList.remove('active');
    })
    bullets[indecator].classList.add('active');

}

function createBullets(num){
    
        for(let i=0;i<num;i++){
            let bullitItem=document.createElement('li');
            bullitItem.classList.add('bullets-item');
            bullitesList.appendChild( bullitItem);
        }
        addclassActive();
       

}

function addQustions(question,n=0){
   // indecator>0?checkCorrect(indecator-1):null;
    console.log(question,indecator);
    questionTitle.innerHTML="";
    questionChoices.innerHTML='';
    let qTitle=document.createElement('h2');
    let qText=document.createTextNode(question.title);
    qTitle.appendChild(qText);
    questionTitle.appendChild(qTitle);
         choiceList=document.createElement('ul');
         questionChoices.appendChild(choiceList);
         choiceList.dataset.number=`${n}`;//n=indecator

    question.choises.forEach((item,index) => {
        let choiceItem=document.createElement('li');
            inpuItem=document.createElement('input'),
            labelItem=document.createElement('label'),
            lableText=document.createTextNode(item);
            labelItem.appendChild(lableText);
            choiceItem.appendChild(inpuItem);
            choiceItem.appendChild(labelItem);
            choiceList.appendChild(choiceItem);
            inpuItem.type='radio';
            inpuItem.id=`ch_${index}`;
            inpuItem.name='choice';
            inpuItem.dataset.answer=`${index}`;
            labelItem.htmlFor=`ch_${index}`;
            

        
        
    });
    
countDownInterval!==null?clearInterval(countDownInterval):null;
countDown(duration);


}
function randomQuestions(){
    
    for(let i=questions.length-1;i>=0;i-=1){
     let randomIndexQ= Math.floor(Math.random()*i+1);//for  Questions
     temp=questions[i];
     questions[i]=questions[randomIndexQ];
     questions[randomIndexQ]=temp;

    }
    viewData();

}
function viewData(){
    qCount.innerHTML=`<p>Questions Count:<span>${questions.length}</span><p>`,
    examName.innerHTML=`<h2>UI/UX EXAM</h2>`
    createBullets(questions.length);
    addQustions(questions[indecator],indecator);
    
 }

function countDown(durtion){
    if(indecator<questions.length){
       let minu,sec;
        countDownInterval= setInterval(()=>{
           minu=parseInt(durtion/60);
           sec=parseInt(durtion%60);
           minu=minu<10?(`0${minu}`):(minu);
           sec=sec<10?(`0${sec}`):(sec);
           timer.textContent=`${minu}:${sec}`;
           durtion-=1;
           if(durtion<0){
               clearInterval(countDownInterval);
               btn.click();
           }

       },1000)
    }
}

function checkCorrect(){
    let objectIndex=choiceList.getAttribute('data-number'),
     correctAnswer=questions[indecator].correct;
    let answers=document.getElementsByName('choice');
    answers.forEach(element => {
        if(element.checked){
            let choiceIndex=element.dataset.answer;
               
           // console.log(questions[objectIndex].choises[ choiceIndex]);
           correctAnswer==questions[indecator].choises[ choiceIndex]?sumMark+=step:null;
        }

        
    });
    
   
    if( indecator<questions.length-1 ){
        addclassActive(++indecator);
        addQustions(questions[indecator],indecator)
    }else{
        questionChoices.remove();
        questionTitle.remove();
        bulletsTimer.remove();
        btn.remove();
        mark.innerHTML=`<h2>your mark is :<span>${sumMark} from ${5*questions.length}</span><h2>`

    }
   



}

window.onload=function(){
   getQustions();
   btn.addEventListener('click',checkCorrect);
}
