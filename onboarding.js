const overlayInfo = document.getElementById("overlay-info");
const onboarding = document.getElementById("onboarding");
const overlay = document.getElementById("overlay");
let overlayBack = document.getElementById("overlay-back");
let overlayNext = document.getElementById("overlay-next");

let currentStep = 0;
let steps = [];

export function initSteps(newSteps) {
  steps = newSteps;
}

function frameUpdate() {
  if (overlay.style.display == "block") {
    const target = document.getElementById(steps[currentStep].target);
    if (target) updateInfoWindowPosition(target);
    requestAnimationFrame(frameUpdate);
  }
}

function cleanUpElements() {
  steps.forEach((step) => {
    const target = document.getElementById(step.target);
    target.style.zIndex = step.zindex;
    target.style.backgroundColor = step.backgroundColor;
  });
}

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top - 100 >= 0 &&
    rect.left >= 0 &&
    rect.bottom + 200 <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function infoWindowRender() {
  cleanUpElements();

  const target = document.getElementById(steps[currentStep].target);
  target.style.zIndex = "1000";
  target.style.backgroundColor = "white";
  if (steps[currentStep].raw) {
    overlayInfo.innerHTML = steps[currentStep].content;
  } else {
    overlayInfo.innerHTML = `<p>${steps[currentStep].content}</p>`;
    if (steps[currentStep].showButtons)
      overlayInfo.innerHTML +=
        '<button id="overlay-back">Back</button><button id="overlay-next">Next</button>';
  }
  overlayBack = document.getElementById("overlay-back");
  overlayNext = document.getElementById("overlay-next");
  if (overlayNext) overlayNext.onclick = overlayNextFn;
  if (overlayBack) overlayBack.onclick = overlayBackFn;

  updateInfoWindowPosition(target);
  if (isInViewport(target)) return;
  const targetRect = target.getBoundingClientRect();
  window.scroll({
    top: targetRect.top - 100,
    behavior: "smooth",
  });
}

function updateInfoWindowPosition(target) {
  const targetRect = target.getBoundingClientRect();
  if (
    overlayInfo.style.top == Math.round(targetRect.top + 24) + "px" &&
    overlayInfo.style.left == Math.round(targetRect.left) + "px"
  )
    return;
  console.log("updating");
  overlayInfo.style.top = Math.round(targetRect.top + 24) + "px";
  overlayInfo.style.left = Math.round(targetRect.left) + "px";
}

function closeOverlay() {
  currentStep = 0;
  overlay.style.display = "none";
  cleanUpElements();
}

onboarding.onclick = function () {
  overlay.style.display = "block";
  currentStep = 0;
  requestAnimationFrame(frameUpdate);
  if (overlayNext) overlayNext.innerHTML = "Next";
  if (overlayBack) overlayBack.style.display = "none";
  steps.forEach((step) => {
    const target = document.getElementById(step.target);
    step.zindex = target.style.zIndex;
    step.backgroundColor = target.style.backgroundColor;
  });
  infoWindowRender();
};

overlay.onclick = closeOverlay;

overlayInfo.onclick = function (e) {
  e.stopPropagation();
};

function overlayNextFn() {
  currentStep++;
  overlayBack.style.display = "inline";
  if (currentStep == steps.length - 1 && overlayNext) {
    overlayNext.innerHTML = "Finish";
  }
  if (currentStep >= steps.length) closeOverlay();
  else infoWindowRender();
}

function overlayBackFn() {
  currentStep--;
  if (overlayNext) overlayNext.innerHTML = "Next";
  if (currentStep == 0) {
    overlayBack.style.display = "none";
  }
  if (currentStep < 0) {
    currentStep = 0;
  }
  infoWindowRender();
}
