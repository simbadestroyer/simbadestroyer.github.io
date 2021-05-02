let url = "https://embed-ssl.wistia.com/deliveries/";
let defaultPath = "60819ba956c62a0c0e8a9a30";
let req = new XMLHttpRequest();
let index = {};
let data = {};
let isCourseLoaded = false;


window.onload = function () {
  retrieveData(defaultPath, true);
};

retrieveData = (path, isIndex = 0) => {
  req.onreadystatechange = function () {
    if (req.readyState == XMLHttpRequest.DONE) {
      if (isIndex) {
        index = JSON.parse(req.responseText).record;
        displayIndex();
      } else {
        if (isCourseLoaded) {
          document.getElementsByClassName("course")[0].remove();
        }
        data = JSON.parse(req.responseText).record;
        displayCourse();
      }
    }
  };

  req.open(
    "GET",
    `https://api.jsonbin.io/v3/b/${path}/latest`,
    true
  );
  req.setRequestHeader(
    "X-Master-Key",
    "$2b$10$uT/iNsUyVxB4/3EDXIf4gO5rk5lMW5l4EqpxEd.bRb.r936/dzIPO"
  );
  req.send();
};

displayIndex = () => {
  let list = document.createElement("ul");
  list.className = "index";
  displayIndexElement(list);
  document.getElementsByTagName("body")[0].appendChild(list);
}

displayIndexElement = (list) => {
  for (var [key, value] of Object.entries(index)) {
    let element = document.createElement("li");
    element.className = "indexElement";
    element.setAttribute("id", value.id);
    displayElementImage(value, element);
    displayElementTitle(value, element);
    console.log(value);
    element.onclick = getCourseId;
    list.appendChild(element);
  }
}

displayElementImage = (image, element) => {
  let img = document.createElement("img");
  img.src = image.image;
  img.setAttribute("id", image.id);
  img.className = "indexImage";
  element.appendChild(img);
}

displayElementTitle = (title, element) => {
  let courseTitle = document.createElement("h3");
  courseTitle.innerHTML = title.name;
  courseTitle.setAttribute("id", title.id);
  courseTitle.className = "indexTitle";
  element.appendChild(courseTitle);
}

getCourseId = (event) => {
  retrieveData(event.srcElement.id);
}

function displayCourse() {
  let course = document.createElement("div");
  course.className = "course";
  displayTitle(course);
  displayUnits(course);
  document.getElementsByTagName("body")[0].appendChild(course);
  isCourseLoaded = true;

}

displayTitle = (course) => {
  let title = document.createElement("h1");
  title.innerHTML = data.course;
  title.className = "courseTitle";
  course.appendChild(title);
};

displayUnits = (course) => {
  let currentUnit = 1;
  for (var [key, value] of Object.entries(data.units)) {
    let unit = document.createElement("div");
    unit.className = "unit";
    displayUnit(value, currentUnit, unit);
    currentUnit++;
    course.appendChild(unit);
  }
};

displayUnit = (value, currentUnit, unit) => {
  displayUnitName(`Unidad ${currentUnit}. ${value.name}:`, unit);
  displayLessons(value.lessons, unit);
};

displayUnitName = (name, unit) => {
  let unitName = document.createElement("h3");
  unitName.innerHTML = name;
  unitName.className = "unitName";
  unit.appendChild(unitName);
};

displayLessons = (lessons, unit) => {

  for (var [key, value] of Object.entries(lessons)) {
    let lesson = document.createElement("div");
    lesson.className = "lesson";
    displayLesson(value, lesson);
    unit.appendChild(lesson);
  }
};

displayLesson = (value, lesson) => {
  placeholder = value.img ? `${url}${value.img}` : "";
  displayLessonTitle(`${value.title}:`, lesson);
  displayLessonVideo(value.path, lesson, placeholder);
};

displayLessonTitle = (title, lesson) => {
  let lessonTitle = document.createElement("h3");
  lessonTitle.innerHTML = title;
  lessonTitle.className = "title";
  lesson.appendChild(lessonTitle);
};

displayLessonVideo = (path, lesson, placeholder = "") => {
  let video = document.createElement("video");
  video.autoplay = false;
  video.name = "media";
  video.controls = "auto";
  video.poster = placeholder;

  let source = document.createElement("source");
  source.src = `${url}${path}`;
  source.type = "video/mp4";

  video.appendChild(source);
  lesson.appendChild(video);
};
