$(function(){
    function getGlobalId(){
        let localId = localStorage.getItem('id');
        if(localId == '' || localId == null){
            setGlobalId(1);
            return getGlobalId();
        }else{
            return localId;
        }
    }
    function setGlobalId(id){
        return localStorage.setItem('id', id);
    }
    //removing answer
    $('.remove-answer').on('click',function(){
        $(this).parents('.option').remove();;
    });

    //appending text after input
    function appendAfterInput(input, msg, event){
        input.after(msg);
        return event.preventDefault();
    }

    //get quizes from localStorage
    function getQuizes(){
        let quizes = [];
        for(i = 1; i < localStorage.length; i++){
            let quiz = localStorage.getItem(`quiz${i}`);
            quizes.push(JSON.parse(quiz));
        }
        return quizes;
    }

    $('main .questions form').on('submit',function(e){
        const rightAnswer = $('input[name=answer]:checked'),
         id = getGlobalId();
         options = $('input.answer');
        let question = $(this).find('input[type=text]').eq(0);
        let answers = [];
        //validate question
        if(question.val() == '' || question.val() == null){
            appendAfterInput(question, '<p class="text-danger">please, insert a question</p>', e);
        }

        //validate right answer
        if(rightAnswer.length < 1){
            appendAfterInput(question, '<p class="text-danger">Please, Select an answer</p>', e);
        }

        //validate options
        options.each(function(){
            if($(this).val() == '' || $(this).val() == null){
                appendAfterInput($(this), '<p class="text-danger">Please, Insert an answer</p>', e);
            }else{
                answers.push($(this).val());
            }
        });
        
        //creating object
        let quiz = {
            "id": id,
            "question": question.val(),
            "answers": answers,
            "rightAnswer": rightAnswer.parents('.col-md-10').find('input[type=text]').val()
        };

        //storing the object in local storage
        localStorage.setItem(`quiz${id}`, JSON.stringify(quiz));
        setGlobalId(parseInt(id) + 1);
    });

    //retrieve data from local storage & start test
    $('.start-test').on('click', function(){
        $('.start-test').remove();
        let quizes = getQuizes();
        if(quizes < 1){
            return $('.test').append('<h3 class="text-center text-danger">No Questions Found.</h3>');
        }else{
            for(let quiz of quizes){
                //append question
                $('.test form').append(`<div class="quiz"><p class="quiz__question${quiz.id}">Q${quiz.id}: ${quiz.question}</p></div>`);
                for(let option of quiz.answers){
                    //append options
                    $(`.quiz__question${quiz.id}`).after(
                        `<div class="form-check">
                                <input class="form-check-input" type="radio" name="quiz${quiz.id}" id="radio${option}" value="${option}">
                                <label class="form-check-label" for="radio${option}">
                                ${option}
                                </label>
                            </div>`);
                }
            }
            $('.test form').append('<button type="button" class="btn btn-primary d-block mx-auto test__submit">Submit Test</button>');
        }
    });

        //submitting test
        $('.test form').on('click', 'button[type=button]',function(e){
            const quizes = getQuizes();
            e.preventDefault();
            const testQuizes = $('.test form .quiz');
            testQuizes.each(function(){
                const quizId = $(this).children('p').attr('class').slice(-1);
                const rightAns = $(this).children('p').siblings('div').children('input[type=radio]:checked').val();
                for(let quiz of quizes){
                    if(quiz.id == quizId){
                        if(quiz.rightAnswer == rightAns){
                            $(this).children('p').before('<p class="text-success">1/1 Good Job</p>');
                        }else{
                            $(this).children('p').before('<p class="text-danger">0/1 Try harder next time</p>');
                        }
                    }
                }
            });
        });

    /* table */
    let columns = 2, rows = 2;
    //add remove row button
    function addRemoveRowBtn(){
        $('.forms table tbody tr').each(function(){
            if($(this).find('button').length > 0){
                $(this).find('button').remove();
            }
            $(this).children('td:last').append('<button class="remove-row float-right btn btn-danger"><i class="fas fa-minus"></i></button>');
        });
    }
    addRemoveRowBtn();

    //add remove column button
    function addRemoveColBtn(){
        $('.forms table thead tr').children('th').not(':first').each(function(){
            if($(this).children('button').length < 1){
                $(this).append('<button class="remove-col float-right btn btn-danger"><i class="fas fa-minus"></i></button>');
            }
        });
    }
    addRemoveColBtn();
    

    /* table events */
    //adding row on clicking add row button
    $('.forms .p-relative').on('click', '.add-row',function(){
        const tds = $('.forms table tbody tr:first').children('td').length;
        let tr = document.createElement('tr');
        for(let i = 0; i < tds; i++){
            if(i == 0){
                rows++;
                $(tr).append(`<td>${rows}</td>`);
            }else{
                $(tr).append('<td></td>');
            }
            
        }
        $('.forms table tbody').append(tr);
        addRemoveRowBtn();
    });

    //remove row on click delete row button
    $('.forms table').on('click', '.remove-row',function(){
        $(this).parents('tr').remove();
    });

    //add column on clicking add column button
    $('.forms .p-relative').on('click', '.add-col', function(){
        const trs = $('.forms table tbody tr');
        columns++;
        $('.forms table thead tr').append(`<th>${columns}</th>`);
        for(let tr of trs){
            $(tr).append('<td></td>');
        }
        addRemoveColBtn();
        addRemoveRowBtn();
    });

    //remove column on clicking remove column button
    $('.forms table').on('click','.remove-col', function(){
        const index = $('.forms table thead th').index($(this).parents('th'));
        $(this).parents('th').remove();
        $('.forms table tbody tr').each(function(){
            $(this).children('td').eq(index).remove();
        });
    });
 });
