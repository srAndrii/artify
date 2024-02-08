import "@styles/Button.scss";
import LoaderButton from "./LoaderButton";

const Button = ({text, loading}) => {
    return (
        <>
            <button className='submit_btn' type='submit'>
                {!loading ? text : <LoaderButton className='spinner' />}
            </button>
        </>
    );
};
export default Button;
