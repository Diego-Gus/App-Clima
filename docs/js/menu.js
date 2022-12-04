const d = document;

const menu = (elem, elem2) => {
    d.addEventListener('click', (e) => {
        if(e.target.matches(elem)){
            d.querySelector(elem2).classList.toggle(`${elem2}--hidden`.substring(1));
        }
    });
}

export default menu;