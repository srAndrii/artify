import Provider from "@components/Provider";
import "@styles/globals.css";
import {Toaster} from "react-hot-toast";

export const metadata = {
    title: "Artify",
    description: "Discover and Share Art",
};

const layout = ({children}) => {
    return (
        <html lang='en'>
            <body>
                <Provider>
                    <Toaster position='top-right' reverseOrder={true} />
                    <main>{children}</main>
                </Provider>
            </body>
        </html>
    );
};

export default layout;
