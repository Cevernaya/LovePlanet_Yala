const lovecoin_chart = document.getElementById('lovecoin_chart');
const lovecoin_chart_sizer = () => {
    var parentRect = lovecoin_chart.parentNode.getBoundingClientRect();
    lovecoin_chart.width = parentRect.width;
    lovecoin_chart.height = parentRect.height;
};
lovecoin_chart_sizer();

const toggleSelf = (self) => {
    const visible = self.getAttribute("visible");
    if (visible == "false" || !visible) {
        self.setAttribute("visible", "true");
        self.setAttribute("style", "opacity: 1;");
    }
    else {
        self.setAttribute("visible", "false");
        self.setAttribute("style", "opacity: 0; display: none");
    }

}

const overlayOn = () => {
    const overlay = document.getElementById('overlay');
    overlay.setAttribute("visible", "true");
    overlay.setAttribute("style", "opacity: 1;");
}

const overlayOff = () => {
    const overlay = document.getElementById('overlay');
    overlay.setAttribute("visible", "false");
    overlay.setAttribute("style", "opacity: 0; display: none;");
}

const overlayTextColor = () => {
    const textArea = document.getElementById('reveiw_textarea');
    textArea.setAttribute("style", "background-color: rgb(255, 255, 255);");

    const buttons = document.getElementsByClassName('popup_button');
    buttons[0].innerHTML = '취소'
    buttons[1].innerHTML = '저장'
    buttons[2].innerHTML = '닫기'

}

const overlayReturnColor = () => {
    const textArea = document.getElementById('reveiw_textarea');
    textArea.setAttribute("style", "background-color: rgb(255, 255, 255, 0.5);");

    const buttons = document.getElementsByClassName('popup_button');
    buttons[0].innerHTML = '수정'
    buttons[1].innerHTML = '삭제'
    buttons[2].innerHTML = '닫기'

}

const buttonMyPage = () => {
    location.href = "/userShow"
}

const buttonLogout = () => {
    fetch("/data/logout")
        .then(res => res.json())
        .then(res => {
            if(res.success) {
                location.href = "/"
            }
        })
}