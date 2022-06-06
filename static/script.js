let myData;
let dataC;
let startId;

let alreadyGotDate = false;
let datePickerShown = false;

let storage = window.localStorage;

let allAssignmentNames = JSON.parse(storage.getItem("names")) || [];
let allAssignmentClasses = JSON.parse(storage.getItem("classes")) || [];
let allAssignmentDescs = JSON.parse(storage.getItem("descs")) || [];
let allAssignmentDues = JSON.parse(storage.getItem("dues")) || [];
let allAssignmentIds = JSON.parse(storage.getItem("ids")) || [];
// let allAssignmentDays = JSON.parse(storage.getItem("days")) || [];
let allAssignmentDays;

let assignmentToDel;
let assignmentToEdit;
let assignmentInfo;

let globalColor = "#000000";

let index = 0;

function func() {
  // alert(JSON.stringify(myData));
  // alert(startId);
  let assignment = document.getElementById('template');
  assignment = assignment.cloneNode(true);
  assignment.removeAttribute('id');
  assignment.classList.remove('template');
  for (let i = 0; i < myData.length; i++) {
    // assignment.classList.add('day' + i);
    for (let j = 0; j < myData[i].length; j++) {
      if (allAssignmentIds.includes(myData[i][j].id) == false) {
        let newElement = assignment.cloneNode(true);
        let courseTitle = "Unknown Class";
        if (dataC[i][j].course_title != null) {
          courseTitle = dataC[i][j].course_title;
        } else {
          courseTitle = dataC[i][j].title;
        }
        newElement.firstElementChild.firstElementChild.innerText = myData[i][j].title;
        newElement.firstElementChild.children[2].innerText = courseTitle;
        newElement.classList.add(index);
        let ind = parseInt(newElement.classList[2]);
        allAssignmentNames.push(myData[i][j].title);
        allAssignmentClasses.push(courseTitle);
        allAssignmentDescs.push(myData[i][j].description);
        allAssignmentDues.push(myData[i][j].start);
        allAssignmentIds.push(myData[i][j].id);
        newElement.firstElementChild.firstElementChild.addEventListener("keydown", (e) => {
          if (e.which === 13) e.preventDefault();
        });
        newElement.firstElementChild.lastElementChild.addEventListener("keydown", (e) => {
          if (e.which === 13) e.preventDefault();
        });
        newElement.firstElementChild.firstElementChild.addEventListener("blur", function() {
          if (newElement.firstElementChild.firstElementChild.innerText === "") {
            newElement.firstElementChild.firstElementChild.innerText = "Assignment";
          }
          allAssignmentNames[ind] = newElement.firstElementChild.firstElementChild.innerText;
          storage.setItem("names", JSON.stringify(allAssignmentNames));
          
        });
        newElement.firstElementChild.lastElementChild.addEventListener("blur", function() {
          if (newElement.firstElementChild.lastElementChild.innerText === "") {
            newElement.firstElementChild.lastElementChild.innerText = "Class";
          }
          allAssignmentClasses[ind] = newElement.firstElementChild.lastElementChild.innerText;
          storage.setItem("classes", JSON.stringify(allAssignmentClasses));
        });
        newElement.lastElementChild.lastElementChild.addEventListener("click", event => {
          if (newElement.lastElementChild.lastElementChild.innerHTML === '<i class="fa-solid fa-x fa-2xl"></i>') {
            newElement.lastElementChild.lastElementChild.innerHTML = '<i class="fa-solid fa-trash-can fa-2xl"></i>';
            document.getElementById('confirmdeletebutton').style.display = "none";
          } else {
            document.getElementById('confirmdeletebutton').style.display = "block";
            document.getElementById('confirmdeletebutton').style.top = (newElement.lastElementChild.lastElementChild.offsetTop) + 'px';
            document.getElementById('confirmdeletebutton').style.left = (newElement.lastElementChild.lastElementChild.offsetLeft + document.getElementById('confirmdeletebutton').offsetWidth) + 'px';
            newElement.lastElementChild.lastElementChild.innerHTML = '<i class="fa-solid fa-x fa-2xl"></i>';
          }
          assignmentToDel = newElement;
        });
        newElement.lastElementChild.children[1].addEventListener("click", event => {
          $('#datepicker').datepicker("option", "onSelect", function(date) {
            allAssignmentDues[ind] = date.substring(0, date.length - 5);
            storage.setItem("dues", JSON.stringify(allAssignmentDues));
            setDate(date.substring(0, date.length - 5), ind, newElement);
          });
          if (allAssignmentDays[ind] == 0) {
            $('#datepicker').datepicker("option", "minDate", allAssignmentDues[ind] + " 2022");
          } else {
            $('#datepicker').datepicker("option", "minDate", weekDatesMonth[1] + " 2022");
          }
          $('#datepicker').datepicker("setDate", allAssignmentDues[ind] + " 2022");
          if (datePickerShown == false) {
            $('#datepicker').show();
            datePickerShown = true;
          } else {
            $('#datepicker').hide();
            datePickerShown = false;
          }
          document.getElementById('datepicker').style.top = (newElement.lastElementChild.children[1].offsetTop + newElement.lastElementChild.children[1].offsetHeight) + "px";
          document.getElementById('datepicker').style.left = (newElement.lastElementChild.children[1].offsetLeft - document.getElementById('datepicker').offsetWidth) + "px";
          assignmentToEdit = newElement;
        });
        newElement.lastElementChild.firstElementChild.addEventListener("click", event => {
          document.getElementById('assignmentinfo').style.display = "block";
          assignmentInfo = newElement;
          assignInfo();
        });
        newElement.classList.add('day' + (i + 1));
        document.getElementById('day0').firstElementChild.appendChild(newElement);
        storage.setItem("names", JSON.stringify(allAssignmentNames));
        storage.setItem("classes", JSON.stringify(allAssignmentClasses));
        storage.setItem("descs", JSON.stringify(allAssignmentDescs));
        storage.setItem("dues", JSON.stringify(allAssignmentDues));
        storage.setItem("ids", JSON.stringify(allAssignmentIds));
        index++;
      }
    }
  }
}

function loadAssignments() {
  let assignment = document.getElementById('template');
  assignment = assignment.cloneNode(true);
  assignment.removeAttribute('id');
  assignment.classList.remove('template');
  for (let i = 0; i < allAssignmentNames.length; i++) {
    if (allAssignmentDays[i] > -1) {
      let newElement = assignment.cloneNode(true);
      newElement.firstElementChild.firstElementChild.innerText = allAssignmentNames[i];
      newElement.firstElementChild.children[2].innerText = allAssignmentClasses[i];
      newElement.classList.add(index);
      newElement.firstElementChild.firstElementChild.addEventListener("keydown", (e) => {
        if (e.which === 13) e.preventDefault();
      });
      newElement.firstElementChild.lastElementChild.addEventListener("keydown", (e) => {
        if (e.which === 13) e.preventDefault();
      });
      newElement.firstElementChild.firstElementChild.addEventListener("blur", function() {
        if (newElement.firstElementChild.firstElementChild.innerText === "") {
          newElement.firstElementChild.firstElementChild.innerText = "Assignment";
        }
        allAssignmentNames[i] = newElement.firstElementChild.firstElementChild.innerText;
        storage.setItem("names", JSON.stringify(allAssignmentNames));
        
      });
      newElement.firstElementChild.lastElementChild.addEventListener("blur", function() {
        if (newElement.firstElementChild.lastElementChild.innerText === "") {
          newElement.firstElementChild.lastElementChild.innerText = "Class";
        }
        allAssignmentClasses[i] = newElement.firstElementChild.lastElementChild.innerText;
        storage.setItem("classes", JSON.stringify(allAssignmentClasses));
      });
      newElement.lastElementChild.lastElementChild.addEventListener("click", event => {
        if (newElement.lastElementChild.lastElementChild.innerHTML === '<i class="fa-solid fa-x fa-2xl"></i>') {
          newElement.lastElementChild.lastElementChild.innerHTML = '<i class="fa-solid fa-trash-can fa-2xl"></i>';
          document.getElementById('confirmdeletebutton').style.display = "none";
        } else {
          document.getElementById('confirmdeletebutton').style.display = "block";
          document.getElementById('confirmdeletebutton').style.top = (newElement.lastElementChild.lastElementChild.offsetTop) + 'px';
          document.getElementById('confirmdeletebutton').style.left = (newElement.lastElementChild.lastElementChild.offsetLeft + document.getElementById('confirmdeletebutton').offsetWidth) + 'px';
          newElement.lastElementChild.lastElementChild.innerHTML = '<i class="fa-solid fa-x fa-2xl"></i>';
        }
        assignmentToDel = newElement;
      });
      newElement.lastElementChild.children[1].addEventListener("click", event => {
        $('#datepicker').datepicker("option", "onSelect", function(date) {
          allAssignmentDues[i] = date.substring(0, date.length - 5);
          storage.setItem("dues", JSON.stringify(allAssignmentDues));
          setDate(date.substring(0, date.length - 5), i, newElement);
        });
        if (allAssignmentDays[i] == 0) {
          $('#datepicker').datepicker("option", "minDate", allAssignmentDues[i] + " 2022");
        } else {
          $('#datepicker').datepicker("option", "minDate", weekDatesMonth[1] + " 2022");
        }
        $('#datepicker').datepicker("setDate", allAssignmentDues[i] + " 2022");
        if (datePickerShown == false) {
          $('#datepicker').show();
          datePickerShown = true;
        } else {
          $('#datepicker').hide();
          datePickerShown = false;
        }
        document.getElementById('datepicker').style.top = (newElement.lastElementChild.children[1].offsetTop + newElement.lastElementChild.children[1].offsetHeight) + "px";
        document.getElementById('datepicker').style.left = (newElement.lastElementChild.children[1].offsetLeft - document.getElementById('datepicker').offsetWidth) + "px";
        assignmentToEdit = newElement;
      });
      newElement.lastElementChild.firstElementChild.addEventListener("click", event => {
        document.getElementById('assignmentinfo').style.display = "block";
        document.getElementById('assignmentinfo').style.top = (newElement.lastElementChild.children[0].offsetTop + newElement.lastElementChild.children[0].offsetHeight) + "px";
        document.getElementById('assignmentinfo').style.left = (newElement.lastElementChild.children[0].offsetLeft - document.getElementById('assignmentinfo').offsetWidth / 4) + "px";
        assignmentInfo = newElement;
        assignInfo();
      });
      newElement.classList.add('day' + allAssignmentDays[i]);
      document.getElementById('day0').firstElementChild.appendChild(newElement);
    }
    index++;
  }
}

let oldButton = document.getElementById('old');
let monButton = document.getElementById('mon');
let tueButton = document.getElementById('tue');
let wedButton = document.getElementById('wed');
let thuButton = document.getElementById('thu');
let friButton = document.getElementById('fri');
let satButton = document.getElementById('sat');
let sunButton = document.getElementById('sun');
let moreButton = document.getElementById('more');

let currentId = 'mon';
let currentIdNum = 1;

function getData() {
  document.getElementById('loading').style.display = 'block';
  let dataSend = storage.getItem("key") + " " + storage.getItem("secret");
  
  // xml.send(dataSend);
  $.ajax({
    url: "/data",
    type: 'POST',
    data: JSON.stringify(dataSend),
    success: function(response) {
      // alert(response);
      let dataReply = JSON.parse(response);
      myData = dataReply[0];
      dataC = dataReply[1];
      func();
      autoButton();
      document.getElementById('loading').style.display = 'none';
    },
    error: function(error) {
      console.log(error);
      console.log("uhhh ohh");
      document.getElementById('loading').style.display = 'none';
    }
  })
}

function getDates() {
  document.getElementById('loading').style.display = 'block';
  $.ajax({
    url: "/dates",
    type: 'POST',
    data: JSON.stringify(allAssignmentDues),
    success: function(response) {
      // alert(allAssignmentDues);
      // alert(response);
      let dataReply = JSON.parse(response);
      // alert(dataReply);
      allAssignmentDays = dataReply;
      loadAssignments();
      dayButtonPicked(startId);
      document.getElementById('loading').style.display = 'none';
    },
    error: function(error) {
      console.log(error);
      console.log("uh oh");
      document.getElementById('loading').style.display = 'none';
    }
  })
}

function setDate(date, i, element) {
  // document.getElementById('loading').style.display = 'block';
  $.ajax({
    url: "/dates",
    type: 'POST',
    data: JSON.stringify([date]),
    success: function(response) {
      let dataReply = JSON.parse(response);
      // document.getElementById('loading').style.display = 'none';
      element.classList.remove('day' + allAssignmentDays[i]);
      element.classList.add('day' + dataReply[0]);
      allAssignmentDays[i] = dataReply[0];
      dayButtonPicked(currentIdNum);
    },
    error: function(error) {
      console.log(error);
      console.log("uh oh2");
      // document.getElementById('loading').style.display = 'none';
    }
  })
}

function onLoad() {
  if (storage.getItem("connected") === "true") {
    document.getElementById('connectbutton').style.display = 'none';
    document.getElementById('disconnectbutton').style.display = 'block';
  }

  if (storage.getItem("color") != null) {
    changeColor(storage.getItem("color"));
    $('#colorinput').val(storage.getItem("color"));
  }
  
  startId = currentWeekday;
  document.getElementById('monthtitle').innerText = weekMonths[1];
  getDates();

  $('#datepicker').datepicker({
    dateFormat: "MM dd yy",
    minDate: weekDatesMonth[1] + " 2022"
  });
  $('#datepicker').hide();
  document.addEventListener("click", function() {
    // alert(event.target.classList);
    if (event.target.closest(".editbutton") || event.target.closest("#datepicker") || event.target.closest(".ui-datepicker-header")) {
      // nothing
    }
    else {
      $('#datepicker').hide();
      datePickerShown = false;
    }
    if (!event.target.closest('.fa-align-justify') && !event.target.closest('.importantbutton')) {
      document.getElementById('assignmentinfo').style.display = "none";
    }
    if (!event.target.closest('.fa-trash-can') && !event.target.closest('.deletebutton')) {
      assignmentToDel.lastElementChild.lastElementChild.innerHTML = '<i class="fa-solid fa-trash-can fa-2xl"></i>';
      document.getElementById('confirmdeletebutton').style.display = "none";
    }
    
  });
  
  // alert(JSON.stringify(myData));
  if (storage.getItem("key") != null) {
    getData();
  } else {
    autoButton();
  }
}

function autoButton() {
  // document.getElementById('loading').style.display = 'block';
  const buttons = [...document.querySelectorAll('.daybutton')];
  buttons.forEach(function(currentBtn, i){
    if (alreadyGotDate == false) {
      currentBtn.innerHTML += '<br>';
      if (i == 0) {
        currentBtn.innerHTML += '<i id="right" class="fa-solid fa-angles-left fa-xs"></i>';
      }
      currentBtn.innerHTML += '<span class="date">' + weekDates[i] + '</span>';
      if (i == 8) {
        currentBtn.innerHTML += '<i id="right" class="fa-solid fa-angles-right fa-xs"></i>';
      }
    }
    currentBtn.addEventListener('click', event => {
      currentId = event.target.id;
      dayButtonPicked(i);
    });
  });
  alreadyGotDate = true;
  // alert(buttons.length);
  currentId = buttons[startId].id;
  document.getElementById('loading').style.display = 'none';
  dayButtonPicked(startId);
}

function myFunc(vars) {
  return vars;
}

function dayButtonPicked(id) {
  document.getElementById(currentId).classList.add('selected');
  document.getElementById(currentId).style.color = globalColor;
  const buttons = [...document.querySelectorAll('.daybutton')];
  buttons.forEach(function(currentBtn){
    if (currentBtn.id !== currentId) {
      document.getElementById(currentBtn.id).classList.remove('selected');
      document.getElementById(currentBtn.id).style.color = "";
    }
  });
  const assignments = document.querySelectorAll('.assignment');
  assignments.forEach(function(assignment) {
    if (assignment.classList.contains('notselected') == false) {
      assignment.classList.add('notselected');
    }
  });
  assignments.forEach(function(assignment) {
    if (assignment.classList.contains('day' + id)) {
      assignment.classList.remove('notselected');
    }
  });
  currentIdNum = id;
  document.getElementById('monthtitle').innerText = weekMonths[id];
}

function doDelete() {
  document.getElementById('confirmdeletebutton').style.display = "none";
  let i = assignmentToDel.classList[1];
  assignmentToDel.addEventListener("transitionend", function() {
    // newElement.style.display = "none";
    // alert("test");
    assignmentToDel.remove();
  });
  allAssignmentNames.splice(i, 1);
  allAssignmentClasses.splice(i, 1);
  allAssignmentDescs.splice(i, 1);
  allAssignmentDues.splice(i, 1);
  allAssignmentDays.splice(i, 1);
  storage.setItem("names", JSON.stringify(allAssignmentNames));
  storage.setItem("classes", JSON.stringify(allAssignmentClasses));
  storage.setItem("descs", JSON.stringify(allAssignmentDescs));
  storage.setItem("dues", JSON.stringify(allAssignmentDues));
  storage.setItem("days", JSON.stringify(allAssignmentDays));
  assignmentToDel.classList.add('animateout');
}

function doCancel() {
  document.getElementById('confirmdelete').style.display = "none";
}

function addAssign() {
  let assignment = document.getElementById('template');
  assignment = assignment.cloneNode(true);
  assignment.removeAttribute('id');
  assignment.classList.remove('template');
  assignment.classList.remove('notselected');
  assignment.firstElementChild.firstElementChild.innerText = "New Assignment";
  assignment.firstElementChild.children[2].innerText = "Your Class";
  assignment.classList.add(index);
  let i = parseInt(assignment.classList[1]);
  allAssignmentNames.push("New Assignment");
  allAssignmentClasses.push("Your Class");
  allAssignmentDescs.push("");
  allAssignmentDues.push(weekDatesMonth[currentIdNum]);
  allAssignmentDays.push(currentIdNum);
  // alert(weekDatesMonth[currentIdNum]);
  assignment.firstElementChild.firstElementChild.addEventListener("keydown", (e) => {
    if (e.which === 13) e.preventDefault();
  });
  assignment.firstElementChild.lastElementChild.addEventListener("keydown", (e) => {
    if (e.which === 13) e.preventDefault();
  });
  assignment.firstElementChild.firstElementChild.addEventListener("blur", function() {
    if (assignment.firstElementChild.firstElementChild.innerText === "") {
      assignment.firstElementChild.firstElementChild.innerText = "Assignment";
    }
    allAssignmentNames[i] = assignment.firstElementChild.firstElementChild.innerText;
    storage.setItem("names", JSON.stringify(allAssignmentNames));
  });
  assignment.firstElementChild.lastElementChild.addEventListener("blur", function() {
    if (assignment.firstElementChild.lastElementChild.innerText === "") {
      assignment.firstElementChild.lastElementChild.innerText = "Class";
    }
    allAssignmentClasses[i] = assignment.firstElementChild.lastElementChild.innerText;
    storage.setItem("classes", JSON.stringify(allAssignmentClasses));
  });
  assignment.lastElementChild.lastElementChild.addEventListener("click", event => {
    if (assignment.lastElementChild.lastElementChild.innerHTML === '<i class="fa-solid fa-x fa-2xl"></i>') {
      assignment.lastElementChild.lastElementChild.innerHTML = '<i class="fa-solid fa-trash-can fa-2xl"></i>';
      document.getElementById('confirmdeletebutton').style.display = "none";
    } else {
      document.getElementById('confirmdeletebutton').style.display = "block";
      document.getElementById('confirmdeletebutton').style.top = (assignment.lastElementChild.lastElementChild.offsetTop) + 'px';
      document.getElementById('confirmdeletebutton').style.left = (assignment.lastElementChild.lastElementChild.offsetLeft + document.getElementById('confirmdeletebutton').offsetWidth) + 'px';
      assignment.lastElementChild.lastElementChild.innerHTML = '<i class="fa-solid fa-x fa-2xl"></i>';
    }
    assignmentToDel = assignment;
  });
  assignment.lastElementChild.children[1].addEventListener("click", event => {
    $('#datepicker').datepicker("option", "onSelect", function(date) {
      allAssignmentDues[i] = date.substring(0, date.length - 5);
      storage.setItem("dues", JSON.stringify(allAssignmentDues));
      setDate(date.substring(0, date.length - 5), i, assignment);
      // dayButtonPicked(currentIdNum);
    });
    if (allAssignmentDays[i] == 0) {
      $('#datepicker').datepicker("option", "minDate", allAssignmentDues[i] + " 2022");
    } else {
      $('#datepicker').datepicker("option", "minDate", weekDatesMonth[1] + " 2022");
    }
    $('#datepicker').datepicker("setDate", allAssignmentDues[i] + " 2022");
    // alert(allAssignmentDues[i] + " 2022");
    if (datePickerShown == false) {
      $('#datepicker').show();
      datePickerShown = true;
    } else {
      $('#datepicker').hide();
      datePickerShown = false;
    }
    document.getElementById('datepicker').style.top = (assignment.lastElementChild.children[1].offsetTop + assignment.lastElementChild.children[1].offsetHeight) + "px";
    document.getElementById('datepicker').style.left = (assignment.lastElementChild.children[1].offsetLeft - document.getElementById('datepicker').offsetWidth) + "px";
    assignmentToEdit = assignment;
  });
  assignment.lastElementChild.firstElementChild.addEventListener("click", event => {
    document.getElementById('assignmentinfo').style.display = "block";
    assignmentInfo = assignment;
    assignInfo();
  });
  assignment.classList.add('day' + currentIdNum);
  document.getElementById('day0').firstElementChild.appendChild(assignment);
  // allAssignmentDays.push(currentIdNum);
  storage.setItem("names", JSON.stringify(allAssignmentNames));
  storage.setItem("classes", JSON.stringify(allAssignmentClasses));
  storage.setItem("descs", JSON.stringify(allAssignmentDescs));
  storage.setItem("dues", JSON.stringify(allAssignmentDues));
  // storage.setItem("days", JSON.stringify(allAssignmentDays));
  index++;
}

function confirmEdit() {
  let i = assignmentToEdit.classList[1];
  let newName = document.getElementById('an').value;
  let newClass = document.getElementById('ac').value;
  let newDue = document.getElementById('ad').value;
  if (newName === "") {
    let an = assignmentToEdit.firstElementChild.innerText;
    newName = an.substring(0, an.indexOf('-') - 1);
  }
  if (newClass === "") {
    let ac = assignmentToEdit.firstElementChild.innerText;
    newClass = ac.substring(ac.indexOf('-') + 2);
  }
  if (newDue === "") {
    let ad = allAssignmentDues[i];
    newDue = ad;
  }
  assignmentToEdit.firstElementChild.innerText = newName + " - " + newClass;
  allAssignmentNames[i] = newName;
  allAssignmentClasses[i] = newClass;
  allAssignmentDues[i] = newDue;
  storage.setItem("names", JSON.stringify(allAssignmentNames));
  storage.setItem("classes", JSON.stringify(allAssignmentClasses));
  storage.setItem("dues", JSON.stringify(allAssignmentDues));
  document.getElementById('editassignment').style.display = "none";
}

function exitInfo() {
  document.getElementById('assignmentinfo').style.display = "none";
}

function assignInfo() {
  let i = assignmentInfo.classList[1];
  document.getElementById('descriptiontext').innerText = allAssignmentDescs[i];
  // document.getElementById('assignmentclass').innerText = allAssignmentClasses[i];
  // document.getElementById('assignmentdesc').innerText = allAssignmentDescs[i];
  // document.getElementById('assignmentdue').innerText = "Due: " + allAssignmentDues[i];
  if (allAssignmentDescs[i] === "") {
    document.getElementById('descriptiontext').innerText = "This assignment does not have a description";
  }
}

function doConnect() {
  storage.setItem("key", document.getElementById('key').value);
  storage.setItem("secret", document.getElementById('secret').value);
  storage.setItem("connected", "true");
  getData();
  doNotConnect();
  document.getElementById('connectbutton').style.display = 'none';
  document.getElementById('disconnectbutton').style.display = 'block';
}

function doNotConnect() {
  document.getElementById('connect').style.display = 'none';
}

function openConnect() {
  document.getElementById('connect').style.display = 'block';
}

function openDisconnect() {
  document.getElementById('disconnect').style.display = 'block';
}

function closeDisconnect() {
  document.getElementById('disconnect').style.display = 'none';
}

function doDisconnect() {
  storage.setItem("key", null);
  storage.setItem("secret", null);
  storage.setItem("connected", "false");
  closeDisconnect();
  document.getElementById('connectbutton').style.display = 'block';
  document.getElementById('disconnectbutton').style.display = 'none';
}

function changeColor(colorRaw) {
  let color;
  let colorTiny;
  let isLight;
  if (colorRaw == null) {
    colorRaw = document.getElementById('colorinput').value;
    color = "#" + colorRaw.substring(1) + "59";
    colorTiny = tinycolor(color);
    isLight = colorTiny.isLight();
    storage.setItem("color", colorRaw);
  } else {
    color = "#" + colorRaw.substring(1) + "59";
    colorTiny = tinycolor(color);
    isLight = colorTiny.isLight();
  }
  
  // let colors = colorTiny.setAlpha(1).analogous();
  // let theColor = tinycolor.mostReadable(colors[0], [colors[1], colors[2]], {includeFallbackColors:false}).toHexString();
  document.getElementById("colorbutton").style.backgroundColor = colorTiny.toHexString();
  document.body.style.backgroundColor = color;
  if (!isLight) {
    const buttons = [...document.querySelectorAll(".daybutton")];
    buttons.forEach(function(button) {
      button.classList.remove("daybuttonlight");
      // button.style.color = "#d1d1d1";
      button.classList.add("daybuttondark");
      document.getElementById(currentId).style.color = globalColor;
      globalColor = "#ffffff";
    });
  }
  else {
    const buttons = [...document.querySelectorAll(".daybutton")];
    buttons.forEach(function(button) {
      button.classList.add("daybuttonlight");
      // button.style.color = "#d1d1d1";
      button.classList.remove("daybuttondark");
      document.getElementById(currentId).style.color = globalColor;
      globalColor = "#000000";
    });
  }
}

function reset() {
  storage.clear();
}