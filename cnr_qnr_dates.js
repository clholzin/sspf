moment.locale('en');
var startDate = moment();
console.log('StartDate: '+startDate);


var saturday = moment().add(3,'d');
console.log('Saturday: '+saturday.format('MM/DD/YYYY'));
console.log('End of MOnth: '+saturday.endOf('month').format('MM/DD/YYYY'));
console.log('check day of the week:'+moment('30/07/19','DD/MM/YY').day());

var weekendCheck = function(check){
    if(check.day() === 0){
        check.subtract(2,'d');
    }
    if(check.day() === 1){
        check.add(4,'d');
    }
    if(check.day() === 2){
        check.add(3,'d');
    }
    if(check.day() === 3){
        check.add(2,'d');
    }
    if(check.day() === 4){
        check.add(1,'d');
    }
    if(check.day() === 6){
        check.subtract(1,'d');
    }
    return check;
}

weekendCheck(saturday);
var dayoftheweek = saturday.day();
console.log('Should be friday: '+  saturday.format("L"));

var cnrDate = moment(startDate).add(1,'M').format('L');
console.log('CNR DUE DATE: '+cnrDate);

var qcrFirstQ = moment(startDate).startOf('quarter').add(1,'M').subtract(1,"d");
if(qcrFirstQ.day() === 0){
    qcrFirstQ.subtract(2,'d');
}
if(qcrFirstQ.day() === 6){
    qcrFirstQ.subtract(1,'d');
}
console.log(qcrFirstQ.day());
console.log('First Quarter QCR Report Due: '+ qcrFirstQ.endOf('month').format('L'));




for(var i = 0;i<=5;i++){
    var qcrFirstQ = moment(startDate).startOf('quarter').add(i,'y').add(1,'M').subtract(1,"d");
    var qcrSecondQ = moment(qcrFirstQ).add(3,'M');
    var qcrThirdQ = moment(qcrSecondQ).add(3,'M');
    var qcrFourthQ = moment(qcrThirdQ).add(3,'M');
    if(i != 0){
        var quarter = qcrFirstQ.endOf('m').quarter();
        console.log('Current quarter:'+ quarter);
        switch(quarter){
            case 1 :
                weekendCheck(qcrSecondQ);
                console.log('year: '+(1+i)+' Second Quarter QCR Report Submit Date: '+ qcrSecondQ.endOf('m').format('DD/MM/YY')+' day:'+qcrSecondQ.day() );

                weekendCheck(qcrThirdQ);
                console.log('year: '+(1+i)+' Third Quarter QCR Report Submit Date: '+ qcrThirdQ.endOf('m').format('DD/MM/YY')+' day:'+qcrThirdQ.day() );

                weekendCheck(qcrFourthQ);
                console.log('year: '+(1+i)+' Fourth Quarter QCR Report Submit Date: '+ qcrFourthQ.endOf('m').format('DD/MM/YY')+' day:'+qcrFourthQ.day() );
                break;
            case 2 :

                weekendCheck(qcrThirdQ);
                console.log('year: '+(1+i)+' Third Quarter QCR Report Submit Date: '+ qcrThirdQ.endOf('m').format('DD/MM/YY')+' day:'+qcrThirdQ.day() );

                weekendCheck(qcrFourthQ);
                console.log('year: '+(1+i)+' Fourth Quarter QCR Report Submit Date: '+ qcrFourthQ.endOf('m').format('DD/MM/YY')+' day:'+qcrFourthQ.day() );
                break;
            case 3 :

                weekendCheck(qcrFourthQ);
                console.log('year: '+(1+i)+' Fourth Quarter QCR Report Submit Date: '+ qcrFourthQ.endOf('m').format('DD/MM/YY')+' day:'+qcrFourthQ.day() );
                break;
            case 4 :
                weekendCheck(qcrFirstQ);
                console.log('year: '+(1+i)+' First Quarter QCR Report Submit Date: '+ qcrFirstQ.endOf('m').format('DD/MM/YY')+' day:'+qcrFirstQ.day() );
                break;
        }

    }

    weekendCheck(qcrFirstQ);
    console.log('year: '+(1+i)+' First Quarter QCR Report Submit Date: '+ qcrFirstQ.endOf('m').format('DD/MM/YY')+' day:'+qcrFirstQ.day() );

    weekendCheck(qcrSecondQ);
    console.log('year: '+(1+i)+' Second Quarter QCR Report Submit Date: '+ qcrSecondQ.endOf('m').format('DD/MM/YY')+' day:'+qcrSecondQ.day() );


    weekendCheck(qcrThirdQ);
    console.log('year: '+(1+i)+' Third Quarter QCR Report Submit Date: '+ qcrThirdQ.endOf('m').format('DD/MM/YY')+' day:'+qcrThirdQ.day() );


    weekendCheck(qcrFourthQ);
    console.log('year: '+(1+i)+' Fourth Quarter QCR Report Submit Date: '+ qcrFourthQ.endOf('m').format('DD/MM/YY')+' day:'+qcrFourthQ.day() );
}