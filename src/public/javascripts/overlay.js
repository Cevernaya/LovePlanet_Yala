const overlayAllOff = () => {
    const overlays = document.getElementsByClassName('overlay');
    overlays.map(overlay => {
        overlay.setAttribute("visible", "false");
        overlay.setAttribute("style", "opacity: 0; display: none;");
    })
}

const overlayOn = (index) => {
    const overlay = document.getElementsByClassName('overlay')[index];
    overlay.setAttribute("visible", "true");
    overlay.setAttribute("style", "opacity: 1;");
}

const overlayOff = (index) => {
    const overlay = document.getElementsByClassName('overlay')[index];
    overlay.setAttribute("visible", "false");
    overlay.setAttribute("style", "opacity: 0; display: none;");
}

const overlayTextColor = (index) => {
    const textArea = document.getElementsByClassName('overlay')[index].getElementsByClassName('review_textarea')[0];
    console.log(textArea)
    textArea.setAttribute("style", "background-color: rgb(255, 255, 255);");

    const buttons = document.getElementsByClassName('overlay')[index].getElementsByClassName('popup_button');
    buttons[0].innerHTML = '취소'
    buttons[1].innerHTML = '저장'
    buttons[2].innerHTML = '닫기'

}

const overlayReturnColor = (index) => {
    const textArea = document.getElementsByClassName('overlay')[index].getElementsByClassName('review_textarea')[0];
    textArea.setAttribute("style", "background-color: rgb(255, 255, 255, 0.5);");

    const buttons = document.getElementsByClassName('overlay')[index].getElementsByClassName('popup_button');
    buttons[0].innerHTML = '수정'
    buttons[1].innerHTML = '삭제'
    buttons[2].innerHTML = '닫기'

}