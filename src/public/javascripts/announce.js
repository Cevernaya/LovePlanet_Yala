const toggleBody = (header) => {
    const body = header.nextElementSibling;
    const visible = body.getAttribute("visible");
    if(visible == "false" || !visible) {
        body.setAttribute("visible", "true");
        body.setAttribute("style", "");
    }
    else {
        body.setAttribute("visible", "false");
        body.setAttribute("style", "display: none");
    }

}