import Start from "./Start";

function Menu({ toggleMenu }) {
    return (
        <div>
            <button onClick={toggleMenu}>
                <Start />
            </button>
        </div>
    );
}
export default Menu;
