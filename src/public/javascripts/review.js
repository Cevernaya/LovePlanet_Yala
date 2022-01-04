const popupReviewOn = () => {
    const overlay = document.getElementById('overlayReview');
    overlay.setAttribute("visible", "true");
    overlay.setAttribute("style", "opacity: 1;");
}

const popupReviewOff = () => {
    const overlay = document.getElementById('overlayReview');
    overlay.setAttribute("visible", "false");
    overlay.setAttribute("style", "opacity: 0; display: none;");
}

const writeReview = () => {
    
}